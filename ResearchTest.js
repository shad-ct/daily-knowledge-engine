function testScienceResearch() {

  Logger.log(
    "======================================"
  );

  Logger.log(
    "SCIENCE RESEARCH TEST"
  );

  Logger.log(
    "======================================"
  );


  const prompt = `
You are the research component of a personal Daily Knowledge Engine.

Today's date is October 2, 2026.

Search the web for CURRENT science or astronomy developments
that are genuinely interesting and suitable for a daily learning
digest.

Look particularly for developments involving:

- astronomy
- astrophysics
- space missions
- planets
- black holes
- cosmology
- fundamental physics
- Earth science
- biology
- neuroscience
- major scientific discoveries

Do NOT simply give famous historical facts.

Prefer developments reported recently by reputable sources.

Search broadly, then identify 5 interesting candidate stories.

For each candidate return EXACTLY this structure:

CANDIDATE 1

Headline:
...

What happened:
...

Why it is interesting:
...

Source:
...

URL:
...

Date of source:
...

CANDIDATE 2

Headline:
...

What happened:
...

Why it is interesting:
...

Source:
...

URL:
...

Date of source:
...

Continue through CANDIDATE 5.

Important:

- Do not invent URLs.
- Only provide URLs that actually appeared in your search results.
- Prefer primary sources or reputable scientific publications.
- If a claim is uncertain or the source is weak, say so.
- Avoid duplicate stories describing the same underlying event.
- Do not write the final Science Signal article yet.
- This is ONLY a research candidate collection.
`;

  Logger.log(
    "Searching the web..."
  );

  const result =
    callGeminiWithSearch(prompt);

  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "SEARCH RESULT"
  );

  Logger.log(
    "======================================"
  );

  Logger.log(result.text);

  Logger.log("");
  Logger.log(
    "======================================"
  );

  Logger.log(
    "SCIENCE RESEARCH TEST COMPLETE"
  );

  Logger.log(
    "======================================"
  );
}