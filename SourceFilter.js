const TRUSTED_SOURCE_DOMAINS = [
  "nasa.gov",
  "esa.int",
  "nature.com",
  "science.org",
  "sciencedirect.com",
  "arxiv.org",
  "aps.org",
  "cern.ch",
  "noaa.gov",
  "nih.gov",
  "ncbi.nlm.nih.gov",
  "nsf.gov",
  "jpl.nasa.gov",
  "caltech.edu",
  "mit.edu",
  "stanford.edu",
  "harvard.edu",
  "ox.ac.uk",
  "cam.ac.uk",
  "berkeley.edu",
  "princeton.edu",
  "phys.org",
  "scientificamerican.com",
  "quantamagazine.org",
  "space.com",
  "spacenews.com",
  "sciencedaily.com"
];


const BLOCKED_SOURCE_DOMAINS = [
  "facebook.com",
  "instagram.com",
  "tiktok.com",
  "x.com",
  "twitter.com",
  "youtube.com",
  "linkedin.com"
];


function getDomain(url) {

  if (!url) {
    return "";
  }

  try {

    let domain =
      String(url)
        .trim()
        .toLowerCase();

    // Remove protocol.
    domain =
      domain.replace(
        /^https?:\/\//,
        ""
      );

    // Remove www.
    domain =
      domain.replace(
        /^www\./,
        ""
      );

    // Keep only hostname.
    domain =
      domain.split("/")[0];

    // Remove port.
    domain =
      domain.split(":")[0];

    return domain;

  } catch (error) {

    return "";
  }
}


function domainMatches(
  domain,
  target
) {

  return (
    domain === target ||
    domain.endsWith("." + target)
  );
}


function isTrustedSource(url) {

  const domain =
    getDomain(url);

  if (!domain) {
    return false;
  }

  return TRUSTED_SOURCE_DOMAINS.some(
    trusted =>
      domainMatches(
        domain,
        trusted
      )
  );
}


function isBlockedSource(url) {

  const domain =
    getDomain(url);

  if (!domain) {
    return true;
  }

  return BLOCKED_SOURCE_DOMAINS.some(
    blocked =>
      domainMatches(
        domain,
        blocked
      )
  );
}


function scoreSource(url) {

  if (!url) {
    return 0;
  }

  if (isBlockedSource(url)) {
    return 0;
  }

  if (isTrustedSource(url)) {
    return 100;
  }

  const domain =
    getDomain(url);

  // Government domains.
  if (
    domain.endsWith(".gov") ||
    domain.endsWith(".gov.uk")
  ) {
    return 95;
  }

  // Academic institutions.
  if (
    domain.endsWith(".edu") ||
    domain.endsWith(".ac.uk")
  ) {
    return 90;
  }

  // Other organizations.
  if (
    domain.endsWith(".org")
  ) {
    return 60;
  }

  // Unknown commercial/general domains.
  return 30;
}


function filterResearchSources(
  sources
) {

  return sources

    .map(source => {

      const score =
        scoreSource(
          source.url
        );

      return {
        title:
          source.title,

        url:
          source.url,

        domain:
          getDomain(
            source.url
          ),

        score:
          score
      };

    })

    .filter(
      source =>
        source.score > 0
    )

    .sort(
      (a, b) =>
        b.score - a.score
    );
}