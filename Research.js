const RESEARCH_MODEL = "gemini-2.5-flash";


function callGeminiWithSearch(prompt) {
  const keys = getGeminiKeys();

  if (keys.length === 0) {
    throw new Error(
      "No Gemini API keys found in Script Properties."
    );
  }

  let lastError = null;

  for (const apiKey of keys) {
    try {

      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/" +
        RESEARCH_MODEL +
        ":generateContent";

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],

        tools: [
          {
            google_search: {}
          }
        ]
      };

      const response =
        UrlFetchApp.fetch(url, {
          method: "post",
          headers: {
            "x-goog-api-key": apiKey
          },
          contentType: "application/json",
          payload: JSON.stringify(payload),
          muteHttpExceptions: true
        });

      const status =
        response.getResponseCode();

      const body =
        response.getContentText();

      if (status >= 200 && status < 300) {

        const data =
          JSON.parse(body);

        const text =
          data.candidates?.[0]?.content?.parts
            ?.map(part => part.text || "")
            .join("") || "";

        return {
          text: text,
          raw: data
        };
      }

      lastError =
        new Error(
          "Gemini Search API " +
          status +
          ": " +
          body
        );

    } catch (error) {

      lastError = error;
    }
  }

  throw (
    lastError ||
    new Error(
      "Gemini Search request failed."
    )
  );
}


/**
 * Extract the actual web sources returned
 * by Google's grounding system.
 */
function extractGroundingSources(result) {

  const sources = [];

  const metadata =
    result.raw
      ?.candidates?.[0]
      ?.groundingMetadata;

  if (!metadata) {
    return sources;
  }

  const chunks =
    metadata.groundingChunks || [];

  chunks.forEach(chunk => {

    if (!chunk.web) {
      return;
    }

    const url =
      chunk.web.uri || "";

    const title =
      chunk.web.title || "";

    if (!url) {
      return;
    }

    sources.push({
      title: title,
      url: url
    });
  });


  // Remove duplicate URLs.
  const unique = [];

  const seen = {};

  sources.forEach(source => {

    if (!seen[source.url]) {

      seen[source.url] = true;

      unique.push(source);
    }
  });

  return unique;
}


/**
 * Search the web and return both:
 *
 * 1. Gemini's research text
 * 2. Actual grounded web sources
 */
function researchWeb(prompt) {

  const result =
    callGeminiWithSearch(prompt);

  const sources =
    extractGroundingSources(result);

  return {
    text: result.text,
    sources: sources,
    raw: result.raw
  };
}