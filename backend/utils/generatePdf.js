const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const { generateQrDataUrl } = require('./generateQr');

const LABELS = {
  BONAFIDE: 'BONAFIDE CERTIFICATE',
  TRANSCRIPT: 'ACADEMIC TRANSCRIPT',
  RECOMMENDATION: 'RECOMMENDATION LETTER',
};

async function generateDocumentPdf({ documentId, requestDoc, student, user, verificationToken }) {
  const outDir = path.join(__dirname, '..', 'generated');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const filePath = path.join(outDir, `${documentId}.pdf`);

  const baseUrl = process.env.STUDENT_PORTAL_URL || 'http://localhost:3000';
  const verifyUrl = `${baseUrl}/verify/${verificationToken}`;
  const qrDataUrl = await generateQrDataUrl(verifyUrl);
  const qrBuffer = Buffer.from(qrDataUrl.split(',')[1], 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    doc.fontSize(18).font('Helvetica-Bold').text('EASWARI ENGINEERING COLLEGE', { align: 'center' });
    doc.fontSize(11).font('Helvetica').text('Department of ' + (student.department || ''), { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(16).font('Helvetica-Bold').text(LABELS[requestDoc.documentType] || 'DOCUMENT', { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(11).font('Helvetica');
    if (requestDoc.documentType === 'RECOMMENDATION' && requestDoc.aiRecommendationDraft) {
      doc.text(requestDoc.aiRecommendationDraft, { align: 'left', lineGap: 4 });
    } else {
      doc.text(
        `This is to certify that ${user.name}, bearing Register Number ${student.registerNumber}, ` +
          `is a bonafide student of the Department of ${student.department} at Easwari Engineering College. ` +
          `Purpose: ${requestDoc.formData?.purpose || 'N/A'}.`,
        { align: 'left', lineGap: 4 }
      );
    }

    doc.moveDown(3);
    doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`);
    doc.moveDown(2);
    doc.text('Authorized Signature: ___________________________');

    doc.moveDown(2);
    doc.fontSize(9).text(`Document ID: ${documentId}`);

    doc.image(qrBuffer, doc.page.width - 150, doc.page.height - 200, { width: 100 });
    doc.fontSize(8).text('Scan to verify', doc.page.width - 150, doc.page.height - 95, { width: 100, align: 'center' });

    doc.end();
    stream.on('finish', () => resolve(filePath));
    stream.on('error', reject);
  });
}

module.exports = { generateDocumentPdf };
