const axios = require('axios');
const Request = require('../models/Request');
const Student = require('../models/Student');

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

async function callGemini(promptText) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw Object.assign(new Error('GEMINI_API_KEY not configured on server'), { status: 500 });

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;
  const { data } = await axios.post(url, {
    contents: [{ parts: [{ text: promptText }] }],
  });

  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('\n') || '';
  return text;
}

// AI-assisted validation: compares submitted form data against student DB record.
// This never auto-rejects; it only returns findings for human review.
exports.validateRequest = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findOne({ requestId }).populate({
      path: 'student',
      populate: { path: 'user' },
    });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const student = request.student;
    const prompt = `You are assisting a college admin office with document request validation.
Compare the submitted form data to the student's official record and report findings as JSON only,
with keys: matches (array of field names that match), mismatches (array of {field, submitted, onRecord}),
confidence (0-100 integer), notes (short string). Do not include any text outside the JSON object.

Student record:
name: ${student.user.name}
registerNumber: ${student.registerNumber}
department: ${student.department}

Submitted form data:
${JSON.stringify(request.formData)}`;

    const raw = await callGemini(prompt);
    let parsed;
    try {
      const cleaned = raw.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = { matches: [], mismatches: [], confidence: null, notes: raw };
    }

    request.aiValidation = parsed;
    await request.save();

    res.json({ requestId, validation: parsed });
  } catch (err) {
    next(err);
  }
};

// AI recommendation letter draft generation. Faculty reviews/edits before it becomes final.
exports.generateRecommendation = async (req, res, next) => {
  try {
    const { requestId } = req.body;
    const request = await Request.findOne({ requestId }).populate({
      path: 'student',
      populate: { path: 'user' },
    });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    const fd = request.formData || {};
    const student = request.student;

    const prompt = `Write a professional, formal recommendation letter for a college student.
Use the following details. Keep it concise (250-350 words), addressed "To Whom It May Concern",
and do not fabricate details not provided.

Name: ${student.user.name}
Department: ${student.department}
CGPA: ${fd.cgpa || 'N/A'}
Skills: ${fd.skills || 'N/A'}
Projects: ${fd.projects || 'N/A'}
Achievements: ${fd.achievements || 'N/A'}
Internships: ${fd.internships || 'N/A'}
Purpose: ${fd.purpose || 'N/A'}
Target organization: ${fd.organization || 'N/A'}`;

    const draft = await callGemini(prompt);

    request.aiRecommendationDraft = draft;
    await request.save();

    res.json({ requestId, draft });
  } catch (err) {
    next(err);
  }
};

// Faculty edits/approves the draft before it's locked in for PDF generation.
exports.saveRecommendationDraft = async (req, res, next) => {
  try {
    const { requestId, draft } = req.body;
    const request = await Request.findOne({ requestId });
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.aiRecommendationDraft = draft;
    await request.save();

    res.json(request);
  } catch (err) {
    next(err);
  }
};
