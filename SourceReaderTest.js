function testSourceReader() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "URL CONTEXT SOURCE READER TEST"
  );

  Logger.log(
    "======================================"
  );


  const urls = [
    "https://www.nasa.gov/news-release/"
  ];


  const prompt = `
You are testing the source-reading component
of a personal knowledge engine.

Use URL Context to read the supplied webpage.

Return exactly this structure:

SOURCE:
...

WHAT THIS PAGE IS:
...

KEY FACTS:
- ...
- ...
- ...

SOURCE LIMITATION:
...

IMPORTANT:

Only report information actually supported
by the supplied webpage.

Do not use your general knowledge to fill gaps.

If the page cannot be read or does not contain
a specific scientific story, explicitly say so.
`;


  Logger.log(
    "Reading source..."
  );


  const result =
    callGeminiWithUrlContext(
      prompt,
      urls
    );


  Logger.log("");

  Logger.log(
    "======================================"
  );

  Logger.log(
    "SOURCE READER RESULT"
  );

  Logger.log(
    "======================================"
  );


  if (!result.text) {

    Logger.log(
      "WARNING: EMPTY RESPONSE"
    );

    Logger.log(
      JSON.stringify(
        result.raw,
        null,
        2
      )
    );

  } else {

    Logger.log(
      result.text
    );
  }


  Logger.log("");

  Logger.log(
    "======================================"
  );

  Logger.log(
    "URL CONTEXT TEST COMPLETE"
  );

  Logger.log(
    "======================================"
  );
}