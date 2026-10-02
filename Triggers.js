/**
 * Remove all existing project triggers.
 *
 * This is deliberately separate from installation so we don't
 * accidentally destroy an existing schedule during testing.
 */
function listEngineTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  Logger.log("Project triggers: " + triggers.length);

  triggers.forEach(function(trigger) {
    Logger.log(
      trigger.getHandlerFunction() +
      " | " +
      trigger.getEventType()
    );
  });

  return triggers;
}


/**
 * Remove triggers created by this engine.
 */
function removeEngineTriggers() {
  const triggers = ScriptApp.getProjectTriggers();

  triggers.forEach(function(trigger) {
    const handler = trigger.getHandlerFunction();

    if (
      handler === "runScienceSignal" ||
      handler === "runStartupSignal" ||
      handler === "runDevSignal" ||
      handler === "runConceptOfTheDay" ||
      handler === "runFactsAndQuote" ||
      handler === "runMathPractice" ||
      handler === "runMindSignal" ||
      handler === "runOnThisDay" ||
      handler === "runWeeklyCodingChallenge"
    ) {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  Logger.log("Engine triggers removed.");
}


/**
 * Trigger installation will be added only after the jobs are
 * verified in preview mode.
 */
function installKnowledgeEngineTriggers() {
  throw new Error(
    "Triggers are intentionally disabled until the production jobs " +
    "have passed preview tests."
  );
}
