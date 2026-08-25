const QRCode = require('qrcode');

async function generateQrDataUrl(url) {
  return QRCode.toDataURL(url, { margin: 1, width: 300 });
}

module.exports = { generateQrDataUrl };
