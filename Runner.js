/**
 * Run a single job in preview mode.
 *
 * Example:
 * previewScienceSignal()
 */
function previewScienceSignal() {
  return previewJob("Science Signal");
}

function previewStartupSignal() {
  return previewJob("Startup Signal");
}

function previewDevSignal() {
  return previewJob("Dev Signal");
}

function previewConceptOfTheDay() {
  return previewJob("Concept of the Day");
}

function previewFactsAndQuote() {
  return previewJob("FACTS & QUOTE");
}

function previewMathPractice() {
  return previewJob("Math Practice");
}

function previewMindSignal() {
  return previewJob("Mind Signal");
}

function previewOnThisDay() {
  return previewJob("On This Day");
}

function previewWeeklyCodingChallenge() {
  return previewJob("Weekly Coding Challenge");
}


/**
 * Master preview.
 */
function testAllJobs() {
  return previewAllJobs();
}


/**
 * Health check for the whole engine.
 */
function fullEngineHealthCheck() {
  Logger.log("==========================================");
  Logger.log("FULL ENGINE HEALTH CHECK");
  Logger.log("==========================================");

  engineHealthCheck();

  const requiredJobs = Object.keys(KNOWLEDGE_JOBS);

  requiredJobs.forEach(function(jobName) {
    if (!KNOWLEDGE_JOBS[jobName]) {
      throw new Error("Missing job definition: " + jobName);
    }

    Logger.log("OK: " + jobName);
  });

  Logger.log("==========================================");
  Logger.log("HEALTH CHECK PASSED");
  Logger.log("Jobs registered: " + requiredJobs.length);
  Logger.log("==========================================");
}
