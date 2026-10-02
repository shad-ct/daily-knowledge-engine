function testGemini() {

  const prompt = `
You are testing a personal Daily Knowledge Engine.

Reply with exactly this structure:

TEST SUCCESSFUL

Gemini connection:
WORKING

Message:
Write one interesting sentence about something in science.

Do not add anything else.
`;

  const result = callGemini(prompt);

  Logger.log(result);

  // Write the result into the existing Concept of the Day document.
  const folderId =
    PropertiesService
      .getScriptProperties()
      .getProperty("DAILY_LOG_FOLDER_ID");

  if (!folderId) {
    throw new Error(
      "DAILY_LOG_FOLDER_ID is missing from Script Properties."
    );
  }

  const folder = DriveApp.getFolderById(folderId);

  const files = folder.getFilesByName("Concept of the Day");

  if (!files.hasNext()) {
    throw new Error(
      'Could not find "Concept of the Day" in Daily Learning Log.'
    );
  }

  const file = files.next();

  const doc = DocumentApp.openById(file.getId());

  const body = doc.getBody();

  body.appendParagraph("");
  body.appendParagraph("===== AUTOMATION CONNECTION TEST =====");
  body.appendParagraph(new Date().toString());
  body.appendParagraph("");
  body.appendParagraph(result);
  body.appendParagraph("===== END TEST =====");

  doc.saveAndClose();

  Logger.log(
    "Successfully wrote test result to: " +
    file.getName()
  );
}