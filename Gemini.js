const GEMINI_MODEL = "gemini-2.5-flash";

function getGeminiKeys() {
  const props = PropertiesService.getScriptProperties();

  return [
    props.getProperty("GEMINI_API_KEY_1"),
    props.getProperty("GEMINI_API_KEY_2")
  ].filter(Boolean);
}

function callGemini(prompt) {
  const keys = getGeminiKeys();

  if (keys.length === 0) {
    throw new Error("No Gemini API keys found in Script Properties.");
  }

  let lastError = null;

  for (const apiKey of keys) {
    try {
      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/" +
        GEMINI_MODEL +
        ":generateContent?key=" +
        encodeURIComponent(apiKey);

      const payload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      };

      const response = UrlFetchApp.fetch(url, {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      });

      const status = response.getResponseCode();
      const body = response.getContentText();

      if (status >= 200 && status < 300) {
        const data = JSON.parse(body);

        return data.candidates?.[0]?.content?.parts
          ?.map(part => part.text || "")
          .join("") || "";
      }

      lastError = new Error(
        `Gemini API ${status}: ${body}`
      );

    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Gemini request failed.");
}