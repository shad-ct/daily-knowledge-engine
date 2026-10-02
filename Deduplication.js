function getHistoryTopics(limit) {

  const history =
    getRecentHistory(
      limit || 100
    );

  return history.map(
    row => ({
      date: row[1],
      job: row[2],
      topic: row[3],
      category: row[4],
      source: row[5],
      url: row[6],
      summary: row[7]
    })
  );
}


function findPotentialDuplicates(
  candidates,
  history
) {

  if (
    !candidates ||
    candidates.length === 0
  ) {
    return [];
  }

  if (
    !history ||
    history.length === 0
  ) {
    return [];
  }


  const candidateText =
    candidates
      .map(
        (candidate, index) =>
          `CANDIDATE ${index + 1}
Title: ${candidate.title}
Source: ${candidate.source || candidate.domain || ""}
Summary: ${candidate.summary || ""}
URL: ${candidate.url || ""}`
      )
      .join("\n\n");


  const historyText =
    history
      .map(
        (item, index) =>
          `HISTORY ${index + 1}
Date: ${item.date}
Job: ${item.job}
Topic: ${item.topic}
Category: ${item.category}
Summary: ${item.summary}`
      )
      .join("\n\n");


  const prompt = `
You are the semantic deduplication component
of a personal knowledge system.

Determine whether any new research candidate
covers substantially the same underlying event,
discovery, idea, or story as something already
present in the user's learning history.

IMPORTANT:

Two items do NOT need identical wording to be
duplicates.

Treat them as duplicates when they describe
essentially the same underlying subject or event.

However, do NOT mark them as duplicates merely
because they belong to the same broad field.

For example:

"JWST discovers carbon in an early galaxy"

and

"JWST discovers oxygen in a different early galaxy"

may be related but are not necessarily duplicates.

Return ONLY valid JSON.

Format:

{
  "duplicates": [
    {
      "candidateIndex": 1,
      "historyIndex": 3,
      "reason": "brief explanation",
      "confidence": 0.95
    }
  ]
}

NEW CANDIDATES:

${candidateText}

EXISTING HISTORY:

${historyText}
`;


  const result =
    callGemini(prompt);


  try {

    const cleaned =
      result
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

    return JSON.parse(
      cleaned
    ).duplicates || [];

  } catch (error) {

    Logger.log(
      "Deduplication JSON parsing failed."
    );

    Logger.log(result);

    return [];
  }
}


function removeDuplicateCandidates(
  candidates,
  history
) {

  const duplicates =
    findPotentialDuplicates(
      candidates,
      history
    );

  const duplicateIndexes =
    duplicates
      .filter(
        item =>
          item.confidence >= 0.80
      )
      .map(
        item =>
          item.candidateIndex - 1
      );

  return candidates.filter(
    (candidate, index) =>
      !duplicateIndexes.includes(index)
  );
}