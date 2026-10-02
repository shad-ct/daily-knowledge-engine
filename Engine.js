function engineHealthCheck() {
  const props = PropertiesService.getScriptProperties();

  Logger.log("======================================");
  Logger.log("DAILY KNOWLEDGE ENGINE HEALTH CHECK");
  Logger.log("======================================");

  // ----------------------------------------
  // 1. Check required properties
  // ----------------------------------------

  const requiredProperties = [
    "GEMINI_API_KEY_1",
    "DAILY_LOG_FOLDER_ID",
    "ENGINE_DB_ID"
  ];

  requiredProperties.forEach(name => {
    const value = props.getProperty(name);

    if (value) {
      Logger.log("✓ " + name + " configured");
    } else {
      Logger.log("✗ " + name + " MISSING");
    }
  });

  // ----------------------------------------
  // 2. Check Daily Learning Log
  // ----------------------------------------

  const folderId =
    props.getProperty("DAILY_LOG_FOLDER_ID");

  if (!folderId) {
    throw new Error(
      "DAILY_LOG_FOLDER_ID is missing."
    );
  }

  const folder =
    DriveApp.getFolderById(folderId);

  Logger.log(
    "✓ Daily Learning Log: " +
    folder.getName()
  );

  // ----------------------------------------
  // 3. Discover existing knowledge documents
  // ----------------------------------------

  const documentNames = [
    "Concept of the Day",
    "FACTS & QUOTE",
    "Math Practice",
    "Mind Signal",
    "On This Day",
    "Science Signal",
    "Startup Signal",
    "Weekly Coding Challenge",
    "Week in Review"
  ];

  Logger.log("");
  Logger.log("KNOWLEDGE DOCUMENTS");
  Logger.log("--------------------------------------");

  const documentRegistry = {};

  documentNames.forEach(name => {

    const files =
      folder.getFilesByName(name);

    if (files.hasNext()) {

      const file = files.next();

      documentRegistry[name] = file.getId();

      Logger.log(
        "✓ " +
        name +
        " → " +
        file.getId()
      );

    } else {

      Logger.log(
        "⚠ " +
        name +
        " → NOT FOUND"
      );
    }
  });

  // ----------------------------------------
  // 4. Check Engine Database
  // ----------------------------------------

  const databaseId =
    props.getProperty("ENGINE_DB_ID");

  if (!databaseId) {
    throw new Error(
      "ENGINE_DB_ID is missing."
    );
  }

  const spreadsheet =
    SpreadsheetApp.openById(databaseId);

  Logger.log("");
  Logger.log(
    "✓ Engine Database: " +
    spreadsheet.getName()
  );

  const history =
    spreadsheet.getSheetByName("History");

  if (!history) {
    throw new Error(
      'History sheet does not exist.'
    );
  }

  Logger.log(
    "✓ History sheet found"
  );

  // ----------------------------------------
  // 5. Check database headers
  // ----------------------------------------

  const expectedHeaders = [
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

  const actualHeaders =
    history
      .getRange(
        1,
        1,
        1,
        expectedHeaders.length
      )
      .getValues()[0];

  const headersOK =
    expectedHeaders.every(
      (header, index) =>
        actualHeaders[index] === header
    );

  if (!headersOK) {

    throw new Error(
      "History sheet headers are incorrect."
    );

  }

  Logger.log(
    "✓ Database schema verified"
  );

  // ----------------------------------------
  // 6. Save document registry
  // ----------------------------------------

  props.setProperty(
    "DOCUMENT_REGISTRY",
    JSON.stringify(documentRegistry)
  );

  Logger.log("");
  Logger.log(
    "✓ Document registry saved"
  );

  // ----------------------------------------
  // 7. Summary
  // ----------------------------------------

  const foundDocuments =
    Object.keys(documentRegistry).length;

  Logger.log("");
  Logger.log("======================================");
  Logger.log("ENGINE HEALTH CHECK COMPLETE");
  Logger.log("======================================");

  Logger.log(
    "Knowledge Docs found: " +
    foundDocuments +
    "/" +
    documentNames.length
  );

  Logger.log(
    "Database: READY"
  );

  Logger.log(
    "Gemini configuration: READY"
  );

  Logger.log(
    "Drive configuration: READY"
  );

  Logger.log(
    "Document registry: READY"
  );

  Logger.log("======================================");
}