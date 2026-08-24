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
 * Robust regex match that handles special programming symbols like C++, C#, .NET, CI/CD
 */
function matchesSkillInText(text: string, skillStr: string): boolean {
  if (!text || !skillStr) return false;
  const escaped = escapeRegExp(skillStr.toLowerCase());

  // For very short words (e.g. "go", "r", "c", "js"), require strict boundaries
  if (skillStr.length <= 2) {
    const strictRegex = new RegExp(`(?:^|[\\s,;()\\[\\]{}|/:•·\\-\\n])(${escaped})(?:$|[\\s,;()\\[\\]{}|/:•·\\-\\n])`, "i");
    return strictRegex.test(text);
  }

  // For symbols like C++, C#, .NET
  if (skillStr.includes("+") || skillStr.includes("#") || skillStr.startsWith(".") || skillStr.includes("/")) {
    const symbolRegex = new RegExp(`(?:^|[\\s,;()\\[\\]{}|•·\\-\\n])(${escaped})(?:$|[\\s,;()\\[\\]{}|•·\\-\\n])`, "i");
    return symbolRegex.test(text);
  }

  // Standard word boundary
  const wordRegex = new RegExp(`\\b${escaped}\\b`, "i");
  return wordRegex.test(text);
}

/**
 * Extracts dynamically listed skills from dedicated "Skills / Technologies" resume sections
 */
function extractDynamicSectionSkills(text: string): string[] {
  const dynamicSkills = new Set<string>();
  const lines = text.split("\n");

  let inSkillsSection = false;
  const sectionHeaderRegex = /^(?:technical\s+)?(?:skills|technologies|tech\s+stack|core\s+competencies|tools\s*(?:&|and)\s*technologies|proficiencies|areas\s+of\s+expertise|languages\s*(?:&|and)\s*frameworks)[:\s]*$/i;
  const stopSectionRegex = /^(?:experience|work\s+history|employment|education|projects|certifications|awards|publications|summary|profile|interests|languages)[:\s]*$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Check if entering a skills section
    if (sectionHeaderRegex.test(line)) {
      inSkillsSection = true;
      continue;
    }

    // Check if leaving skills section
    if (inSkillsSection && stopSectionRegex.test(line) && line.length < 35) {
      inSkillsSection = false;
      break;
    }

    if (inSkillsSection) {
      // Lines might be like: "Languages: Python, TypeScript, C++" or "• React, Next.js, Redux, Node.js"
      const cleanLine = line.replace(/^[•\-\*·\s]+/, "").replace(/^[a-zA-Z\s]+:\s*/, "");
      const tokens = cleanLine.split(/[,|;•·\t/]+/).map((t) => t.trim()).filter((t) => t.length >= 2 && t.length <= 30);

      for (const token of tokens) {
        // Strip parenthetical notes like "Python (Proficient)" -> "Python"
        const cleanToken = token.replace(/\s*\([^)]*\)/g, "").trim();
        if (cleanToken.length >= 2 && cleanToken.length <= 30 && !STOP_WORDS.has(cleanToken.toLowerCase())) {
          // Check if it matches known skill lookup
          const lower = cleanToken.toLowerCase();
          if (SKILL_LOOKUP_MAP.has(lower)) {
            dynamicSkills.add(SKILL_LOOKUP_MAP.get(lower)!);
          } else if (/^[A-Za-z0-9+#.\s-]+$/.test(cleanToken)) {
            // Capitalize appropriately
            const formatted = cleanToken
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ");
            dynamicSkills.add(formatted);
          }
        }
      }
    }
  }

  return Array.from(dynamicSkills);
}

/**
 * Extracts known skills from any text using the skill taxonomy + dynamic section parser
 */
export function extractSkillsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const matchedCanonicalSkills = new Set<string>();

  // 1. Check all known taxonomy skills and their aliases against text
  SKILLS_TAXONOMY.forEach((category) => {
    category.skills.forEach((skill) => {
      // Check canonical
      if (matchesSkillInText(lower, skill.canonical)) {
        matchedCanonicalSkills.add(skill.canonical);
        return;
      }
      // Check aliases
      for (const alias of skill.aliases) {
        if (matchesSkillInText(lower, alias)) {
          matchedCanonicalSkills.add(skill.canonical);
          break;
        }
      }
    });
  });

  // 2. Extract dynamic section skills
  const sectionSkills = extractDynamicSectionSkills(text);
  sectionSkills.forEach((s) => matchedCanonicalSkills.add(s));

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
  const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{1,4}[-.\s]?\d{6,12}/;
  const linkedinRegex = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i;
  const githubRegex = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;

  const emailMatch = text.match(emailRegex);
  const phoneMatch = text.match(phoneRegex);
  const linkedinMatch = text.match(linkedinRegex);
  const githubMatch = text.match(githubRegex);

  return {
    email: emailMatch ? emailMatch[0] : undefined,
    phone: phoneMatch ? phoneMatch[0] : undefined,
    linkedin: linkedinMatch ? (linkedinMatch[0].startsWith("http") ? linkedinMatch[0] : `https://${linkedinMatch[0]}`) : undefined,
    github: githubMatch ? (githubMatch[0].startsWith("http") ? githubMatch[0] : `https://${githubMatch[0]}`) : undefined,
  };
}

const MONTH_MAP: { [key: string]: number } = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9,
  oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function parseMonthYear(str: string): { year: number; month: number } | null {
  const clean = str.trim().toLowerCase();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  if (["present", "current", "now", "ongoing"].includes(clean)) {
    return { year: currentYear, month: currentMonth };
  }

  // e.g. "Jan 2021", "03/2021", "2021"
  const monthYearMatch = clean.match(/([a-z]+|\d{1,2})[\s/.-]+(\d{4})/);
  if (monthYearMatch) {
    const mStr = monthYearMatch[1];
    const y = parseInt(monthYearMatch[2], 10);
    const m = MONTH_MAP[mStr] || parseInt(mStr, 10) || 6;
    if (y >= 1970 && y <= currentYear + 1) {
      return { year: y, month: Math.min(12, Math.max(1, m)) };
    }
  }

  const yearOnlyMatch = clean.match(/(\d{4})/);
  if (yearOnlyMatch) {
    const y = parseInt(yearOnlyMatch[1], 10);
    if (y >= 1970 && y <= currentYear + 1) {
      return { year: y, month: 6 };
    }
  }

  return null;
}

/**
 * Estimates total years of experience from resume text using date ranges and stated tenure
 */
export function extractExperienceYears(text: string): number {
  if (!text) return 0;

  // 1. Direct statement match: "X+ years of experience", "X yrs exp"
  const directRegex = /(\d{1,2}(?:\.\d+)?)\+?\s*(?:years?|yrs?)(?:\s+of)?(?:\s+experience|\s+industry|\s+professional|\s+hands-on)?/gi;
  let maxFoundYears = 0;
  let match;
  while ((match = directRegex.exec(text)) !== null) {
    const yrs = parseFloat(match[1]);
    if (yrs > 0 && yrs < 40 && yrs > maxFoundYears) {
      maxFoundYears = Math.round(yrs);
    }
  }

  // 2. Date ranges (e.g., "Jan 2020 - Mar 2023", "2019 – Present", "06/2018 to 12/2022")
  const dateRangeRegex = /((?:[a-zA-Z]{3,9}\.?\s+)?\d{4}|\d{1,2}\/\d{4})\s*(?:-|–|—|to)\s*((?:[a-zA-Z]{3,9}\.?\s+)?\d{4}|\d{1,2}\/\d{4}|present|current|now|ongoing)/gi;

  const intervals: { start: number; end: number }[] = [];

  while ((match = dateRangeRegex.exec(text)) !== null) {
    const startObj = parseMonthYear(match[1]);
    const endObj = parseMonthYear(match[2]);

    if (startObj && endObj) {
      const startMonths = startObj.year * 12 + startObj.month;
      const endMonths = endObj.year * 12 + endObj.month;

      if (endMonths >= startMonths && endMonths - startMonths <= 40 * 12) {
        intervals.push({ start: startMonths, end: endMonths });
      }
    }
  }

  // Merge overlapping intervals to get true non-overlapping tenure
  let totalMonths = 0;
  if (intervals.length > 0) {
    intervals.sort((a, b) => a.start - b.start);
    const merged: { start: number; end: number }[] = [];
    let current = intervals[0];

    for (let i = 1; i < intervals.length; i++) {
      const next = intervals[i];
      if (next.start <= current.end) {
        current.end = Math.max(current.end, next.end);
      } else {
        merged.push(current);
        current = next;
      }
    }
    merged.push(current);

    totalMonths = merged.reduce((acc, curr) => acc + (curr.end - curr.start), 0);
  }

  const calculatedYears = Math.round(totalMonths / 12);
  const bestEstimate = Math.max(maxFoundYears, calculatedYears);

  // Return realistic estimate (defaulting to 2 years if some natural text exists)
  return bestEstimate > 0 ? Math.min(bestEstimate, 35) : 2;
}

/**
 * Extracts educational degrees mentioned in the text
 */
export function extractEducation(text: string): string[] {
  const degrees: string[] = [];
  const lower = text.toLowerCase();

  const degreePatterns = [
    { name: "Ph.D. / Doctorate", regex: /\b(ph\.?d|doctorate|doctor of philosophy|d\.phil)\b/i },
    { name: "Master's Degree (M.S. / M.Tech / MBA / MCA)", regex: /\b(master'?s|m\.s\.|m\.tech|mba|m\.a\.|msc|mca|m\.e\.)\b/i },
    { name: "Bachelor's Degree (B.S. / B.Tech / B.E. / B.A.)", regex: /\b(bachelor'?s|b\.s\.|b\.tech|b\.e\.|b\.a\.|bsc|bca|b\.eng)\b/i },
    { name: "Bootcamp / Professional Certificate", regex: /\b(bootcamp|certification|certified|nanodegree|specialization)\b/i },
    { name: "Associate Degree", regex: /\b(associate'?s|associate degree|a\.s\.|a\.a\.)\b/i },
  ];

  degreePatterns.forEach(({ name, regex }) => {
    if (regex.test(lower)) {
      degrees.push(name);
    }
  });

  return degrees;
}

