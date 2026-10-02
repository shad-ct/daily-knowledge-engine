const SOURCE_READER_MODEL = "gemini-2.5-flash";


function callGeminiWithUrlContext(prompt, urls) {

  const keys = getGeminiKeys();

  if (keys.length === 0) {
    throw new Error(
      "No Gemini API keys found in Script Properties."
    );
  }

  if (!urls || urls.length === 0) {
    throw new Error(
      "No URLs supplied to URL Context."
    );
  }

  let lastError = null;

  for (const apiKey of keys) {

    try {

      const url =
        "https://generativelanguage.googleapis.com/v1beta/models/" +
        SOURCE_READER_MODEL +
        ":generateContent";

      /*
       * URL Context URLs are supplied as tool inputs.
       */

      const parts = [
        {
          text:
            prompt +
            "\n\nThe following URLs are the sources you must read:\n" +
            urls
              .map(
                (item, index) =>
                  `${index + 1}. ${item}`
              )
              .join("\n")
        }
      ];

      /*
       * Add URL context tool.
       */

      const payload = {
        contents: [
          {
            parts: parts
          }
        ],

        tools: [
          {
            url_context: {}
          }
        ]
      };


      const response =
        UrlFetchApp.fetch(
          url,
          {
            method: "post",

            headers: {
              "x-goog-api-key": apiKey
            },

            contentType:
              "application/json",

            payload:
              JSON.stringify(payload),

            muteHttpExceptions: true
          }
        );


      const status =
        response.getResponseCode();

      const body =
        response.getContentText();


      Logger.log(
        "URL Context HTTP status: " +
        status
      );


      if (
        status >= 200 &&
        status < 300
      ) {

        const data =
          JSON.parse(body);


        Logger.log(
          "Gemini response received."
        );


        const candidates =
          data.candidates || [];


        if (candidates.length === 0) {

          Logger.log(
            "WARNING: Gemini returned no candidates."
          );

          Logger.log(
            body
          );

          return {
            text: "",
            raw: data
          };
        }


        const text =
          candidates[0]
            ?.content
            ?.parts
            ?.map(
              part =>
                part.text || ""
            )
            .join("") || "";


        return {
          text: text,
          raw: data
        };
      }


      lastError =
        new Error(
          "Gemini URL Context API " +
          status +
          ": " +
          body
        );


      Logger.log(
        lastError.message
      );

    } catch (error) {

      lastError = error;

      Logger.log(
        "URL Context error: " +
        error.message
      );
    }
  }


  throw (
    lastError ||
    new Error(
      "Gemini URL Context request failed."
    )
  );
}