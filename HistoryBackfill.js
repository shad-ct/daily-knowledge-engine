/**
 * Extract structured historical topics from one existing knowledge
 * document.
 *
 * This is intentionally preview-only.
 */
function previewHistoryBackfill(documentName) {
  const doc = getKnowledgeDocument(documentName);
  const text = doc.getBody().getText();

  if (!text.trim()) {
    Logger.log("Document is empty: " + documentName);
    return [];
  }

  const prompt = `
Extract historical knowledge entries from the following Google Doc.

DOCUMENT:
${documentName}

Return ONLY valid JSON:

{
  "entries": [
    {
      "topic": "",
      "category": "",
      "source": "",
      "url": "",
      "summary": ""
    }
  ]
}

Rules:
- One object per distinct knowledge entry.
- Do not invent missing information.
- If a URL is not present, leave it empty.
- Keep summaries short.
- Ignore headers, boilerplate and instructions.

DOCUMENT CONTENT:
${text.substring(0, 30000)}
`;

  const result = callGemini(prompt);

  const cleaned = String(result)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const parsed = JSON.parse(cleaned);

  Logger.log(
    "Historical entries extracted from " +
    documentName +
    ": " +
    parsed.entries.length
  );

  parsed.entries.forEach(function(entry, index) {
    Logger.log(
      (index + 1) +
      ". " +
      entry.topic +
      " | " +
      entry.source
    );
  });

  return parsed.entries;
}


/**
 * Preview all existing documents that participate in the engine.
 */
function previewAllHistoryBackfill() {
  const registry = getDocumentRegistry();
  const names = Object.keys(registry);

  const output = {};

  names.forEach(function(name) {
    try {
      output[name] = previewHistoryBackfill(name);
    } catch (error) {
      Logger.log(
        "Backfill failed for " +
        name +
        ": " +
        (error.message || error)
      );

      output[name] = {
        error: String(error.message || error)
      };
    }
  });

  return output;
}
