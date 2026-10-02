function testSourceFiltering() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "SOURCE FILTER TEST"
  );

  Logger.log(
    "======================================"
  );


  const testSources = [

    {
      title: "NASA",
      url: "https://www.nasa.gov/example"
    },

    {
      title: "Nature",
      url: "https://www.nature.com/articles/example"
    },

    {
      title: "Stanford",
      url: "https://www.stanford.edu/example"
    },

    {
      title: "ScienceDaily",
      url: "https://www.sciencedaily.com/example"
    },

    {
      title: "Facebook",
      url: "https://www.facebook.com/example"
    },

    {
      title: "Random Blog",
      url: "https://randomblog.example/example"
    }

  ];


  const filtered =
    filterResearchSources(
      testSources
    );


  Logger.log("");

  filtered.forEach(
    source => {

      Logger.log(
        source.domain +
        " → score " +
        source.score
      );

    }
  );


  Logger.log("");

  Logger.log(
    "======================================"
  );

  Logger.log(
    "FILTER TEST COMPLETE"
  );

  Logger.log(
    "Accepted sources: " +
    filtered.length
  );

  Logger.log(
    "======================================"
  );
}