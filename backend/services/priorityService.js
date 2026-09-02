const path = require("path");
const { spawnSync } = require("child_process");

function calculatePriority(request) {

  const javaDirectory = path.resolve(
    __dirname,
    "..",
    "..",
    "java"
  );

  const documentType = String(
    request.documentType || ""
  );

  const year = String(
    request.student?.year || ""
  );

  const createdAt = request.createdAt
    ? new Date(request.createdAt)
    : new Date();

  const daysWaiting = Math.max(
    0,
    Math.floor(
      (Date.now() - createdAt.getTime()) /
      (1000 * 60 * 60 * 24)
    )
  );

  const formData = request.formData || {};

  const purpose = String(
    formData.purpose ||
    formData.reason ||
    formData.description ||
    formData.additionalInfo ||
    ""
  );

  const result = spawnSync(
    "java",
    [
      "-cp",
      javaDirectory,
      "SmartRequestPrioritizer",
      documentType,
      year,
      String(daysWaiting),
      purpose
    ],
    {
      encoding: "utf8",
      windowsHide: true
    }
  );

  if (result.error || result.status !== 0) {

    console.error(
      "Smart Request Prioritizer error:",
      result.error?.message || result.stderr
    );

    return {
      score: 0,
      level: "LOW"
    };
  }

  const output = String(
    result.stdout || ""
  ).trim();

  const parts = output.split("|");

  return {
    score: Number(parts[0]) || 0,
    level: parts[1] || "LOW"
  };
}

module.exports = {
  calculatePriority
};