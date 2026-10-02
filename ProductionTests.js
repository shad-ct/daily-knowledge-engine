/**
 * Basic local/infrastructure tests.
 */
function testProductionInfrastructure() {
  Logger.log("==========================================");
  Logger.log("PRODUCTION INFRASTRUCTURE TEST");
  Logger.log("==========================================");

  Logger.log("1. Gemini keys...");
  const keys = getGeminiKeys();
  if (!keys.length) {
    throw new Error("No Gemini keys configured.");
  }
  Logger.log("PASS: Gemini keys available: " + keys.length);

  Logger.log("2. Document registry...");
  const registry = getDocumentRegistry();
  const documentCount = Object.keys(registry).length;

  if (!documentCount) {
    throw new Error("Document registry is empty.");
  }

  Logger.log("PASS: Documents registered: " + documentCount);

  Logger.log("3. Database...");
  const headers = getHistoryHeaders();

  if (headers.length !== 9) {
    throw new Error(
      "Unexpected History column count: " + headers.length
    );
  }

  Logger.log("PASS: History database available.");

  Logger.log("4. Job registry...");
  const jobs = Object.keys(KNOWLEDGE_JOBS);

  if (jobs.length !== 9) {
    throw new Error(
      "Expected 9 jobs, found " + jobs.length
    );
  }

  jobs.forEach(function(job) {
    Logger.log("PASS: " + job);
  });

  Logger.log("==========================================");
  Logger.log("INFRASTRUCTURE TEST PASSED");
  Logger.log("==========================================");

  return {
    geminiKeys: keys.length,
    documents: documentCount,
    historyColumns: headers.length,
    jobs: jobs.length
  };
}


/**
 * Test the Gemini generation layer without web research.
 */
function testGeminiGeneration() {
  const result = generateJobContent(
    "Weekly Coding Challenge",
    "",
    buildJobHistoryContext(20)
  );

  if (!result.topic || !result.content) {
    throw new Error("Gemini generation returned incomplete content.");
  }

  Logger.log("Topic: " + result.topic);
  Logger.log("Content:");
  Logger.log(result.content);

  return result;
}


/**
 * Run the non-destructive tests.
 */
function runSafeTests() {
  testProductionInfrastructure();
  testGeminiGeneration();

  Logger.log("==========================================");
  Logger.log("ALL SAFE TESTS PASSED");
  Logger.log("==========================================");
}
