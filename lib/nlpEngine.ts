import { SKILL_LOOKUP_MAP, SKILLS_TAXONOMY } from "@/data/skillsTaxonomy";

// Standard English Stopwords
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing",
  "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't",
  "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is",
  "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no",
  "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves",
  "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
  "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there",
  "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to",
  "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were",
  "weren't", "what", "what's", "when", "when's", "where", "where's", "which", "while", "who", "who's", "whom",
  "why", "why's", "with", "won't", "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your",
  "yours", "yourself", "yourselves", "will", "shall", "may", "might", "must", "can"
]);

/**
 * Tokenizes and cleans text into normalized words, omitting stopwords
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s\+\#\.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned.split(" ");
  return words.filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Extracts N-grams (1, 2, 3-word combinations) from text to capture multi-word skills
 */
export function extractNgrams(text: string, maxN: number = 3): string[] {
  const tokens = tokenizeText(text);
  const ngrams: string[] = [];

  for (let n = 1; n <= maxN; n++) {
    for (let i = 0; i <= tokens.length - n; i++) {
      ngrams.push(tokens.slice(i, i + n).join(" "));
    }
  }
  return ngrams;
}

/**
 * Computes TF-IDF vectors for two documents and returns their Cosine Similarity (0 to 1)
 */
export function computeCosineSimilarity(docA: string, docB: string): number {
  const tokensA = tokenizeText(docA);
  const tokensB = tokenizeText(docB);

  if (tokensA.length === 0 || tokensB.length === 0) return 0;

  // Build vocabulary
  const vocab = new Set<string>([...tokensA, ...tokensB]);
  const vocabArr = Array.from(vocab);

  // Term frequencies
  const tfA: { [key: string]: number } = {};
  const tfB: { [key: string]: number } = {};

  tokensA.forEach((w) => (tfA[w] = (tfA[w] || 0) + 1));
  tokensB.forEach((w) => (tfB[w] = (tfB[w] || 0) + 1));

  // Compute vectors with IDF weight (2 docs corpus)
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  vocabArr.forEach((word) => {
    const countA = tfA[word] || 0;
    const countB = tfB[word] || 0;

    // Document frequency (in how many docs does the word appear)
    const df = (countA > 0 ? 1 : 0) + (countB > 0 ? 1 : 0);
    const idf = Math.log(1 + 2 / df);

    const vA = (countA / tokensA.length) * idf;
    const vB = (countB / tokensB.length) * idf;

    dotProduct += vA * vB;
    normA += vA * vA;
    normB += vB * vB;
  });

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return Math.min(1, Math.max(0, dotProduct / denominator));
}

/**
 * Extracts known skills from any text using the skill taxonomy
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matchedCanonicalSkills = new Set<string>();

  // Check all known skills and their aliases against text
  SKILLS_TAXONOMY.forEach((category) => {
    category.skills.forEach((skill) => {
      // Check canonical
      const canonicalRegex = new RegExp(`\\b${escapeRegExp(skill.canonical.toLowerCase())}\\b`, "i");
      if (canonicalRegex.test(lower)) {
        matchedCanonicalSkills.add(skill.canonical);
        return;
      }
      // Check aliases
      for (const alias of skill.aliases) {
        const aliasRegex = new RegExp(`\\b${escapeRegExp(alias.toLowerCase())}\\b`, "i");
        if (aliasRegex.test(lower)) {
          matchedCanonicalSkills.add(skill.canonical);
          break;
        }
      }
    });
  });

  return Array.from(matchedCanonicalSkills);
}

/**
 * Helper to escape special characters for regex
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Extracts candidate contact information (email, phone, LinkedIn, GitHub)
 */
export function extractContactInfo(text: string): {
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
} {
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
    github: githubMatch ? githubMatch[0] : undefined,
  };
}

/**
 * Estimates total years of experience from resume text
 */
export function extractExperienceYears(text: string): number {
  if (!text) return 0;

  // 1. Direct pattern match: "X+ years", "X years of experience", "X yrs"
  const directRegex = /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience|\s+industry|\s+professional|\s+hands-on)?/gi;
  let maxFoundYears = 0;
  let match;
  while ((match = directRegex.exec(text)) !== null) {
    const yrs = parseInt(match[1], 10);
    if (yrs > 0 && yrs < 35 && yrs > maxFoundYears) {
      maxFoundYears = yrs;
    }
  }

  // 2. Year ranges like "2019 - Present" or "2018 - 2023"
  const yearRangeRegex = /(20\d{2}|19\d{2})\s*(?:-|–|to)\s*(present|current|now|20\d{2})/gi;
  let accumulatedYears = 0;
  const currentYear = new Date().getFullYear();

  while ((match = yearRangeRegex.exec(text)) !== null) {
    const startYear = parseInt(match[1], 10);
    const endYearStr = match[2].toLowerCase();
    const endYear = ["present", "current", "now"].includes(endYearStr)
      ? currentYear
      : parseInt(endYearStr, 10);

    const diff = endYear - startYear;
    if (diff > 0 && diff < 30) {
      accumulatedYears += diff;
    }
  }

  // Choose the best realistic estimate
  const bestEstimate = Math.max(maxFoundYears, Math.min(accumulatedYears, 25));
  return bestEstimate > 0 ? bestEstimate : 2; // Default reasonable minimum if text is present
}

/**
 * Extracts educational degrees mentioned in the text
 */
export function extractEducation(text: string): string[] {
  const degrees: string[] = [];
  const lower = text.toLowerCase();

  const degreePatterns = [
    { name: "Ph.D. / Doctorate", regex: /\b(ph\.?d|doctorate|doctor of philosophy)\b/i },
    { name: "Master's Degree (M.S. / M.Tech / MBA)", regex: /\b(master'?s|m\.s\.|m\.tech|mba|m\.a\.|msc)\b/i },
    { name: "Bachelor's Degree (B.S. / B.Tech / B.A.)", regex: /\b(bachelor'?s|b\.s\.|b\.tech|b\.e\.|b\.a\.|bsc|b\.eng)\b/i },
    { name: "Bootcamp / Professional Certificate", regex: /\b(bootcamp|certification|certified|nanodegree)\b/i },
    { name: "Associate Degree", regex: /\b(associate'?s|associate degree)\b/i },
  ];

  degreePatterns.forEach(({ name, regex }) => {
    if (regex.test(lower)) {
      degrees.push(name);
    }
  });

  return degrees;
}
