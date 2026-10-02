function setupKnowledgeEngine() {
  const props = PropertiesService.getScriptProperties();

  // --------------------------------------------------
  // 1. Find Daily Learning Log
  // --------------------------------------------------

  const dailyLogFolderId = props.getProperty("DAILY_LOG_FOLDER_ID");

  if (!dailyLogFolderId) {
    throw new Error(
      "DAILY_LOG_FOLDER_ID is missing from Script Properties."
    );
  }

  const dailyLogFolder = DriveApp.getFolderById(dailyLogFolderId);

  Logger.log(
    "Daily Learning Log found: " +
    dailyLogFolder.getName()
  );

  // --------------------------------------------------
  // 2. Find or create Daily Knowledge Engine folder
  // --------------------------------------------------

  let engineFolder;

  const engineFolders =
    dailyLogFolder.getFoldersByName("Daily Knowledge Engine");

  if (engineFolders.hasNext()) {
    engineFolder = engineFolders.next();

    Logger.log(
      "Existing backend folder found: " +
      engineFolder.getId()
    );

  } else {
    engineFolder =
      dailyLogFolder.createFolder("Daily Knowledge Engine");

    Logger.log(
      "Created backend folder: " +
      engineFolder.getId()
    );
  }

  // --------------------------------------------------
  // 3. Find or create Engine Database
  // --------------------------------------------------

  let spreadsheetFile;

  const spreadsheetFiles =
    engineFolder.getFilesByName("Engine Database");

  if (spreadsheetFiles.hasNext()) {

    spreadsheetFile = spreadsheetFiles.next();

    Logger.log(
      "Existing Engine Database found: " +
      spreadsheetFile.getId()
    );

  } else {

    const spreadsheet =
      SpreadsheetApp.create("Engine Database");

    spreadsheetFile =
      DriveApp.getFileById(spreadsheet.getId());

    // Move newly-created spreadsheet into backend folder.
    spreadsheetFile.moveTo(engineFolder);

    Logger.log(
      "Created Engine Database: " +
      spreadsheetFile.getId()
    );
  }

  // --------------------------------------------------
  // 4. Store Engine Database ID automatically
  // --------------------------------------------------

  props.setProperty(
    "ENGINE_DB_ID",
    spreadsheetFile.getId()
  );

  // --------------------------------------------------
  // 5. Open spreadsheet
  // --------------------------------------------------

  const spreadsheet =
    SpreadsheetApp.openById(spreadsheetFile.getId());

  // --------------------------------------------------
  // 6. Create / prepare History sheet
  // --------------------------------------------------

  let historySheet =
    spreadsheet.getSheetByName("History");

  if (!historySheet) {
    historySheet =
      spreadsheet.insertSheet("History");

    Logger.log("Created History sheet.");
  }

  // --------------------------------------------------
  // 7. Add headers
  // --------------------------------------------------

  const headers = [
    "ID",
    "Date",
    "Job",
    "Topic",
    "Category",
    "Source",
    "URL",
    "Summary",
    "Status"
  ];

  const existingHeaders =
    historySheet
      .getRange(1, 1, 1, headers.length)
      .getValues()[0];

  const headersAlreadyExist =
    headers.every(
      (header, index) =>
        existingHeaders[index] === header
    );

  if (!headersAlreadyExist) {

    historySheet
      .getRange(1, 1, 1, headers.length)
      .setValues([headers]);

    Logger.log("History headers created.");
  } else {
    Logger.log("History headers already exist.");
  }

  // --------------------------------------------------
  // 8. Basic formatting
  // --------------------------------------------------

  historySheet
    .getRange(1, 1, 1, headers.length)
    .setFontWeight("bold");

  historySheet.setFrozenRows(1);

  // Resize columns reasonably.
  for (let i = 1; i <= headers.length; i++) {
    historySheet.autoResizeColumn(i);
  }

  // --------------------------------------------------
  // 9. Final verification
  // --------------------------------------------------

  Logger.log("");
  Logger.log("======================================");
  Logger.log("KNOWLEDGE ENGINE SETUP COMPLETE");
  Logger.log("======================================");

  Logger.log(
    "Daily Learning Log ID: " +
    dailyLogFolder.getId()
  );

  Logger.log(
    "Daily Knowledge Engine ID: " +
    engineFolder.getId()
  );

  Logger.log(
    "Engine Database ID: " +
    spreadsheetFile.getId()
  );

  Logger.log(
    "History sheet: " +
    historySheet.getName()
  );

  Logger.log(
    "ENGINE_DB_ID saved to Script Properties."
  );

  Logger.log("======================================");
}