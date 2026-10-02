const KNOWLEDGE_JOBS = {
  "Science Signal": {
    search: true,
    description: `
Find 2-3 notable recent developments in science, astronomy, physics,
space, biology, neuroscience, Earth science, or engineering.

Prioritize primary or highly authoritative sources:
NASA, ESA, Nature, Science, arXiv, CERN, NOAA, NIH, NSF,
JPL, Caltech, MIT, Stanford, Harvard, Oxford, Cambridge,
Quanta Magazine, Scientific American, Phys.org, Space.com,
SpaceNews and reputable science reporting.

Avoid celebrity/news fluff.

For each candidate provide:
- Headline
- What happened
- Why it matters
- Surprising or counterintuitive detail
- Useful analogy
- Source name
`
  },

  "Startup Signal": {
    search: true,
    description: `
Find notable recent startup/product developments.

Prioritize:
YC, Launch YC, Product Hunt, Indie Hackers, TechCrunch,
The Information, Sifted, TLDR Founders, Hacker News,
reputable funding databases and founder discussions.

Look especially for ideas relevant to:
MERN, Flutter, Dart, ESP32, IoT, developer tools,
education, productivity, AI and consumer software.

For each candidate provide:
- Startup/product
- Problem
- What they are doing
- Why people are paying attention
- Business/model signal
- Relevance to the user's technical interests
- Source
`
  },

  "Dev Signal": {
    search: true,
    description: `
Find recent important developments in software development.

Prioritize:
Hacker News, Reddit programming communities, official project blogs,
GitHub, React, Node.js, MongoDB, PostgreSQL, Flutter, Dart,
Espressif, Arduino, npm, pub.dev, Stack Overflow,
Lobsters and reputable engineering publications.

Look for:
new tools, breaking changes, important releases, security issues,
developer workflow improvements, useful libraries and emerging
technical patterns.

For the selected item provide:
- Headline
- What happened
- Why developers care
- Practical implication
- Useful tool/library
- Source
`
  },

  "Concept of the Day": {
    search: true,
    description: `
Choose one educational concept.

Rotate between:
mathematics, physics, computer science, biology and related fields.

Teach it for an intelligent beginner.

Structure:
- Concept
- Simple analogy
- Explanation
- Formal terminology
- Why it matters
- Small example
- Source
- Further reading

Keep it under approximately 250 words.
`
  },

  "FACTS & QUOTE": {
    search: true,
    description: `
Create today's Facts & Quote entry.

Provide:
5 genuinely interesting facts from different domains.

Then provide:
5 quotations from different types of thinkers/creators.

For every quote:
- exact quote
- attribution
- context if useful

Finish with:
1-2 introspective questions.

Do not fabricate quotes.
Prefer sources that allow attribution to be verified.
`
  },

  "Math Practice": {
    search: true,
    description: `
Create today's mathematics practice.

Rotate between:
algebra, calculus, statistics, discrete mathematics,
linear algebra, probability and number theory.

Include:
- Topic
- Intuitive explanation
- Real-world application
- 5 worked examples
- 1-2 unsolved practice problems
- Answers to the practice problems separately
- Source

The mathematics must be internally consistent.
`
  },

  "Mind Signal": {
    search: true,
    description: `
Choose one useful topic from psychology, philosophy,
cognitive science, behavioral science or a thought experiment.

Teach it to an intelligent beginner.

Include:
- Idea
- Analogy
- Explanation
- Important terminology
- Practical relevance
- Whether the idea is debated/contested
- Source

Do not present controversial psychological claims as established
facts without qualification.
Keep it under approximately 250 words.
`
  },

  "On This Day": {
    search: true,
    description: `
Find one significant event that happened on today's calendar date.

Prefer:
science, technology, computing, engineering, medicine,
space or other intellectually significant events.

Include:
- What happened
- Why it mattered then
- Why it still matters
- Source

Keep it under approximately 200 words.
`
  },

  "Weekly Coding Challenge": {
    search: false,
    description: `
Create a beginner/intermediate programming challenge.

The challenge should teach a useful programming concept.

Include:
- Problem
- Input
- Output
- Example
- Constraints
- Hints
- Full solution
- Explanation
- Difficulty

Avoid requiring obscure libraries.
`
  }
};


/**
 * Returns a compact representation of the existing engine history.
 */
function buildJobHistoryContext(limit) {
  const history = getHistoryTopics(limit || 80);

  if (!history.length) {
    return "No previous engine history is available.";
  }

  return history.map((item, index) => {
    return [
      "HISTORY " + (index + 1),
      "Job: " + item.job,
      "Topic: " + item.topic,
      "Category: " + item.category,
      "Source: " + item.source,
      "Summary: " + item.summary
    ].join("\n");
  }).join("\n\n");
}


/**
 * Ask Gemini for structured output.
 */
function generateJobContent(jobName, researchText, historyText) {
  const job = KNOWLEDGE_JOBS[jobName];

  const prompt = `
You are the content generation component of a personal daily knowledge
engine.

JOB:
${jobName}

JOB REQUIREMENTS:
${job.description}

DATE:
${new Date().toDateString()}

ANTI-REPETITION REQUIREMENT:
Do not repeat or closely repackage an item already present in the history.

EXISTING HISTORY:
${historyText}

RESEARCH MATERIAL:
${researchText || "No external research material was supplied."}

Return ONLY valid JSON.

Use this structure:

{
  "topic": "short unique topic title",
  "category": "category",
  "source": "source name",
  "url": "",
  "summary": "short summary",
  "content": "complete human-facing entry",
  "confidence": 0.0
}

Rules:
- Do not invent sources.
- Do not invent URLs.
- If an exact source URL is unavailable, leave url empty.
- Distinguish established facts from speculation.
- Do not mention this prompt or the engine.
- Make the final content useful without requiring the reader to inspect
  the research material.
`;

  const result = callGemini(prompt);

  const cleaned = String(result)
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    throw new Error(
      "Could not parse Gemini JSON for " +
      jobName +
      ". Response:\n" +
      result
    );
  }
}


/**
 * Researches a job when the job requires current information.
 */
function researchJob(jobName) {
  const job = KNOWLEDGE_JOBS[jobName];

  if (!job.search) {
    return {
      text: "",
      sources: []
    };
  }

  const history = buildJobHistoryContext(80);

  const prompt = `
You are the research component of a personal knowledge engine.

JOB:
${jobName}

REQUIREMENTS:
${job.description}

TODAY:
${new Date().toDateString()}

Previously used material:
${history}

Search the web for CURRENT information.

Return 5-10 candidate items.

For each candidate include:
- title
- what happened
- why it matters
- source hint

Prefer primary sources and reputable reporting.

Do not simply repeat the history.

Return useful factual research, not generic explanations.
`;

  return researchWeb(prompt);
}


/**
 * Runs one job in preview mode.
 *
 * Preview mode NEVER writes to Docs or the database.
 */
function previewJob(jobName) {
  if (!KNOWLEDGE_JOBS[jobName]) {
    throw new Error("Unknown job: " + jobName);
  }

  Logger.log("==========================================");
  Logger.log("JOB: " + jobName);
  Logger.log("==========================================");

  const research = researchJob(jobName);

  Logger.log(
    "Research sources found: " +
    (research.sources ? research.sources.length : 0)
  );

  const history = buildJobHistoryContext(80);

  const content = generateJobContent(
    jobName,
    research.text,
    history
  );

  Logger.log("TOPIC: " + content.topic);
  Logger.log("CATEGORY: " + content.category);
  Logger.log("SOURCE: " + content.source);
  Logger.log("URL: " + content.url);
  Logger.log("CONFIDENCE: " + content.confidence);
  Logger.log("CONTENT:");
  Logger.log(content.content);

  return {
    job: jobName,
    topic: content.topic,
    category: content.category,
    source: content.source,
    url: content.url,
    summary: content.summary,
    content: content.content,
    confidence: content.confidence,
    researchSources: research.sources || []
  };
}


/**
 * Preview every job.
 *
 * This is intentionally sequential so logs remain understandable and
 * so API failures identify exactly which job failed.
 */
function previewAllJobs() {
  const results = [];
  const names = Object.keys(KNOWLEDGE_JOBS);

  Logger.log("==========================================");
  Logger.log("PREVIEWING " + names.length + " JOBS");
  Logger.log("NO DOCUMENT/DATABASE WRITES");
  Logger.log("==========================================");

  names.forEach(function(jobName) {
    try {
      results.push(previewJob(jobName));
    } catch (error) {
      Logger.log("FAILED: " + jobName);
      Logger.log(error.stack || error.message || error);
      results.push({
        job: jobName,
        error: String(error.message || error)
      });
    }
  });

  Logger.log("==========================================");
  Logger.log("PREVIEW COMPLETE");
  Logger.log("Successful: " + results.filter(r => !r.error).length);
  Logger.log("Failed: " + results.filter(r => r.error).length);
  Logger.log("==========================================");

  return results;
}
