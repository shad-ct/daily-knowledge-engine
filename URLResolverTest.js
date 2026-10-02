function testURLResolver() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "GROUNDING URL RESOLVER TEST"
  );

  Logger.log(
    "======================================"
  );


  const prompt = `
Search the web for one very recent
interesting science or astronomy story.

Prefer a reputable source such as:

NASA
ESA
Nature
Science
a university
a research institution
or a reputable science publication.

Give me a brief explanation of the story.
Do not invent sources.
`;


  Logger.log(
    "Searching..."
  );


  const result =
    researchWeb(prompt);


  Logger.log("");
  Logger.log(
    "FOUND " +
    result.sources.length +
    " GROUNDING SOURCES"
  );


  result.sources
    .slice(0, 5)
    .forEach((source, index) => {

      Logger.log("");
      Logger.log(
        "SOURCE " +
        (index + 1)
      );

      Logger.log(
        "Title: " +
        source.title
      );

      Logger.log(
        "Grounding URL:"
      );

      Logger.log(
        source.url
      );


      const resolved =
        resolveGroundingUrl(
          source.url
        );

      Logger.log(
        "Resolved URL:"
      );

      Logger.log(
        resolved
      );
    });


  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "URL RESOLVER TEST COMPLETE"
  );

  Logger.log(
    "======================================"
  );
}