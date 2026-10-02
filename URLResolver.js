function resolveGroundingUrl(url) {
  if (!url) {
    return "";
  }

  // Already a normal URL.
  if (
    !url.includes("vertexaisearch.cloud.google.com")
  ) {
    return url;
  }

  let currentUrl = url;

  for (let i = 0; i < 5; i++) {

    try {

      const response =
        UrlFetchApp.fetch(currentUrl, {
          method: "get",
          followRedirects: false,
          muteHttpExceptions: true
        });

      const status =
        response.getResponseCode();

      const headers =
        response.getHeaders();

      const location =
        headers["Location"] ||
        headers["location"];

      Logger.log(
        "Redirect step " +
        (i + 1) +
        ": " +
        status
      );

      if (location) {
        currentUrl = location;

        if (
          !currentUrl.includes(
            "vertexaisearch.cloud.google.com"
          )
        ) {
          return currentUrl;
        }

        continue;
      }

      // No further redirect.
      return currentUrl;

    } catch (error) {

      Logger.log(
        "URL resolution error: " +
        error.message
      );

      return currentUrl;
    }
  }

  return currentUrl;
}


function resolveGroundingSources(sources) {

  return sources.map(source => {

    const resolvedUrl =
      resolveGroundingUrl(
        source.url
      );

    return {
      title: source.title,
      groundingUrl: source.url,
      url: resolvedUrl
    };

  });

}