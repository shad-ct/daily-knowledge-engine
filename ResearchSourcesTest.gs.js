function testGroundingSources() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "GROUNDING SOURCE TEST"
  );

  Logger.log(
    "======================================"
  );


  const prompt = `
You are researching current science and astronomy news.

Search the web broadly for interesting scientific
developments published very recently.

Prioritize:

- NASA
- ESA
- universities
- research institutions
- Nature
- Science
- scientific journals
- reputable science publications

Avoid social media and low-quality aggregators.

Find several genuinely interesting developments.

For each development, briefly explain:

1. What happened
2. Why it matters

Do NOT invent sources.

This is a research test only.
`;


  Logger.log(
    "Searching..."
  );


  const result =
    researchWeb(prompt);


  // ----------------------------------------
  // Gemini research text
  // ----------------------------------------

  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "GEMINI RESEARCH"
  );

  Logger.log(
    "======================================"
  );

  Logger.log(
    result.text
  );


  // ----------------------------------------
  // Actual grounding sources
  // ----------------------------------------

  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "ACTUAL GROUNDING SOURCES"
  );

  Logger.log(
    "======================================"
  );


  if (result.sources.length === 0) {

    Logger.log(
      "⚠ NO GROUNDING SOURCES FOUND"
    );

  } else {

    result.sources.forEach(
      (source, index) => {

        Logger.log(
          ""
        );

        Logger.log(
          "SOURCE " +
          (index + 1)
        );

        Logger.log(
          "Title: " +
          source.title
        );

        Logger.log(
          "URL: " +
          source.url
        );
      }
    );
  }


  // ----------------------------------------
  // Summary
  // ----------------------------------------

  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "GROUNDING TEST COMPLETE"
  );

  Logger.log(
    "Actual sources found: " +
    result.sources.length
  );

  Logger.log(
    "======================================"
  );
}