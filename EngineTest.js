function testEngineStorage() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "TESTING ENGINE STORAGE"
  );

  Logger.log(
    "======================================"
  );


  // --------------------------------------
  // 1. Test database
  // --------------------------------------

  Logger.log("");
  Logger.log(
    "Testing database..."
  );

  const testTopic =
    "ENGINE STORAGE TEST — " +
    new Date().toISOString();

  const recordId =
    addHistoryRecord({
      job: "Engine Test",
      topic: testTopic,
      category: "System",
      source: "Internal Test",
      url: "",
      summary:
        "Test record created by the Daily Knowledge Engine.",
      status: "test"
    });

  Logger.log(
    "✓ Database write successful"
  );

  Logger.log(
    "Record ID: " +
    recordId
  );


  // --------------------------------------
  // 2. Test database read
  // --------------------------------------

  const recent =
    getRecentHistory(5);

  Logger.log(
    "✓ Database read successful"
  );

  Logger.log(
    "Recent records: " +
    recent.length
  );


  // --------------------------------------
  // 3. Test topic detection
  // --------------------------------------

  const exists =
    topicExists(testTopic);

  if (!exists) {
    throw new Error(
      "Topic existence check failed."
    );
  }

  Logger.log(
    "✓ Topic detection successful"
  );


  // --------------------------------------
  // 4. Test Google Doc
  // --------------------------------------

  Logger.log("");
  Logger.log(
    "Testing Google Document..."
  );

  appendStructuredEntry(
    "Science Signal",

    "===== ENGINE STORAGE TEST =====",

    [
      {
        heading: "Status",
        content:
          "Document storage is working correctly."
      },

      {
        heading: "Database Record",
        content:
          recordId
      },

      {
        heading: "Timestamp",
        content:
          new Date().toString()
      }
    ]
  );

  Logger.log(
    "✓ Google Doc write successful"
  );


  // --------------------------------------
  // 5. Final result
  // --------------------------------------

  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "ENGINE STORAGE TEST PASSED"
  );

  Logger.log(
    "======================================"
  );

  Logger.log(
    "Database: ✓"
  );

  Logger.log(
    "Database read: ✓"
  );

  Logger.log(
    "Topic detection: ✓"
  );

  Logger.log(
    "Google Docs: ✓"
  );

  Logger.log(
    "======================================"
  );
}