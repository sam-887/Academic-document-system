const Request = require('../models/Request');
const Document = require('../models/Document');

async function nextRequestId() {
  const year = new Date().getFullYear();
  const count = await Request.countDocuments({
    requestId: { $regex: `^REQ-${year}-` },
  });
  const seq = String(count + 1).padStart(5, '0');
  return `REQ-${year}-${seq}`;
}

async function nextDocumentId() {
  const year = new Date().getFullYear();
  const count = await Document.countDocuments({
    documentId: { $regex: `^DOC-${year}-` },
  });
  const seq = String(count + 1).padStart(5, '0');
  return `DOC-${year}-${seq}`;
}

module.exports = { nextRequestId, nextDocumentId };
