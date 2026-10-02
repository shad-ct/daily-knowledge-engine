function getEngineDatabase() {
  const databaseId =
    PropertiesService
      .getScriptProperties()
      .getProperty("ENGINE_DB_ID");

  if (!databaseId) {
    throw new Error(
      "ENGINE_DB_ID is missing from Script Properties."
    );
  }

  return SpreadsheetApp.openById(databaseId);
}


function getHistorySheet() {
  const spreadsheet = getEngineDatabase();

  const sheet =
    spreadsheet.getSheetByName("History");

  if (!sheet) {
    throw new Error(
      'History sheet does not exist.'
    );
  }

  return sheet;
}


function getHistoryHeaders() {
  const sheet = getHistorySheet();

  return sheet
    .getRange(
      1,
      1,
      1,
      9
    )
    .getValues()[0];
}


function addHistoryRecord(record) {
  const sheet = getHistorySheet();

  const row = [
    record.id || Utilities.getUuid(),
    record.date || new Date(),
    record.job || "",
    record.topic || "",
    record.category || "",
    record.source || "",
    record.url || "",
    record.summary || "",
    record.status || "complete"
  ];

  sheet.appendRow(row);

  return row[0];
}


function getRecentHistory(limit) {
  const sheet = getHistorySheet();

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const numberOfRows =
    Math.min(
      limit || 20,
      lastRow - 1
    );

  const startRow =
    lastRow - numberOfRows + 1;

  return sheet
    .getRange(
      startRow,
      1,
      numberOfRows,
      9
    )
    .getValues();
}


function topicExists(topic) {
  const sheet = getHistorySheet();

  const lastRow =
    sheet.getLastRow();

  if (lastRow <= 1) {
    return false;
  }

  const topics =
    sheet
      .getRange(
        2,
        4,
        lastRow - 1,
        1
      )
      .getValues()
      .flat();

  const target =
    String(topic)
      .trim()
      .toLowerCase();

  return topics.some(
    existing =>
      String(existing)
        .trim()
        .toLowerCase() === target
  );
}