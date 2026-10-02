function testDeduplication() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "SEMANTIC DEDUPLICATION TEST"
  );

  Logger.log(
    "======================================"
  );


  // --------------------------------------
  // Simulated existing history
  // --------------------------------------

  const history = [

    {
      date: "2026-10-01",
      job: "Science Signal",
      topic:
        "JWST finds heavy elements in the early universe",
      category: "Astronomy",
      summary:
        "James Webb Space Telescope observations found carbon and oxygen in very early galaxies."
    },

    {
      date: "2026-09-30",
      job: "Science Signal",
      topic:
        "Evidence for water beneath Europa's surface",
      category: "Planetary Science",
      summary:
        "Researchers studied evidence for a subsurface ocean on Jupiter's moon Europa."
    }

  ];


  // --------------------------------------
  // New candidates
  // --------------------------------------

  const candidates = [

    {
      title:
        "James Webb Telescope detects oxygen in a distant young galaxy",

      source:
        "Nature",

      domain:
        "nature.com",

      summary:
        "New JWST observations provide evidence of oxygen in an extremely early galaxy.",

      url:
        "https://www.nature.com/example"
    },


    {
      title:
        "New evidence reveals possible microbial activity on Mars",

      source:
        "NASA",

      domain:
        "nasa.gov",

      summary:
        "Researchers report a new observation relevant to possible ancient life on Mars.",

      url:
        "https://www.nasa.gov/example"
    },


    {
      title:
        "A new technique improves detection of gravitational waves",

      source:
        "Science",

      domain:
        "science.org",

      summary:
        "Researchers developed a new method for improving gravitational-wave measurements.",

      url:
        "https://www.science.org/example"
    }

  ];


  Logger.log(
    "Candidates before deduplication: " +
    candidates.length
  );


  const duplicates =
    findPotentialDuplicates(
      candidates,
      history
    );


  Logger.log("");

  Logger.log(
    "POTENTIAL DUPLICATES"
  );


  duplicates.forEach(
    item => {

      Logger.log(
        "Candidate " +
        item.candidateIndex +
        " ↔ History " +
        item.historyIndex
      );

      Logger.log(
        "Confidence: " +
        item.confidence
      );

      Logger.log(
        "Reason: " +
        item.reason
      );

    }
  );


  const remaining =
    removeDuplicateCandidates(
      candidates,
      history
    );


  Logger.log("");

  Logger.log(
    "Candidates after deduplication: " +
    remaining.length
  );


  remaining.forEach(
    candidate => {

      Logger.log(
        "REMAINING: " +
        candidate.title
      );

    }
  );


  Logger.log("");

  Logger.log(
    "======================================"
  );

  Logger.log(
    "DEDUPLICATION TEST COMPLETE"
  );

  Logger.log(
    "======================================"
  );
}