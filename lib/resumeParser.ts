import { CandidateResume } from "@/types";
import {
  extractContactInfo,
  extractEducation,
  extractExperienceYears,
  extractSkillsFromText,
} from "./nlpEngine";

const COMMON_ROLES = [
  "Senior Software Engineer",
  "Software Engineer",
  "Full Stack Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Frontend Developer",
  "Backend Engineer",
  "Backend Developer",
  "DevOps Engineer",
  "Site Reliability Engineer",
  "Cloud Architect",
  "Data Scientist",
  "Machine Learning Engineer",
  "AI Engineer",
  "Data Engineer",
  "Engineering Manager",
  "Technical Lead",
  "Product Manager",
  "Mobile Developer",
  "iOS Developer",
  "Android Developer",
  "QA Engineer",
  "Security Engineer",
  "Solutions Architect",
];

/**
 * Validates whether the extracted string resembles real readable resume text
 */
export function isValidResumeText(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();
  if (trimmed.length < 60) return false;
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 10) return false;

  const pdfBinaryMarkers = [
    "%pdf-",
    "/filter",
    "/flatedecode",
    "/type /catalog",
    "/type /pages",
    "endobj",
    "xref",
    "trailer",
    "/font",
  ];
  const lower = trimmed.toLowerCase();
  let binaryMarkerCount = 0;
  for (const marker of pdfBinaryMarkers) {
    if (lower.includes(marker)) binaryMarkerCount++;
  }
  if (lower.startsWith("%pdf-") || binaryMarkerCount >= 3) return false;

  const alphaNumericMatches = trimmed.match(/[a-zA-Z0-9]/g);
  const alphaNumericCount = alphaNumericMatches ? alphaNumericMatches.length : 0;
  if (alphaNumericCount / trimmed.length < 0.45) return false;

  return true;
}

/**
 * Extracts candidate name from text lines (scanning top lines for a clean human name)
 */
export function extractCandidateName(text: string, defaultName: string = "Candidate"): string {
  if (!text) return defaultName;

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const ignoredKeywords = [
    "curriculum",
    "vitae",
    "resume",
    "page",
    "contact",
    "email",
    "phone",
    "address",
    "linkedin",
    "github",
    "http",
    "www",
    "summary",
    "objective",
    "profile",
    "experience",
    "skills",
    "education",
  ];

  // Search through the first 8 lines
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();

    // Skip if line has ignored keyword, email, or URL
    if (ignoredKeywords.some((k) => lower.includes(k))) continue;
    if (line.includes("@") || line.includes("http") || line.includes("www.") || line.includes(".com")) continue;

    // Clean out non-name punctuation
    const cleanLine = line.replace(/[^a-zA-Z\s\.\-']/g, "").trim();
    const words = cleanLine.split(/\s+/).filter((w) => w.length > 1);

    if (
      cleanLine.length >= 3 &&
      cleanLine.length <= 36 &&
      words.length >= 2 &&
      words.length <= 4 &&
      !COMMON_ROLES.some((r) => r.toLowerCase() === cleanLine.toLowerCase())
    ) {
      // Capitalize proper words
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
    }
  }

  // Fallback: Clean up filename
  const cleanFallback = defaultName
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]/g, " ")
    .replace(/\b(resume|cv|latest|updated|final)\b/gi, "")
    .trim();

  if (cleanFallback.length > 2) {
    return cleanFallback
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");
  }

  return "Candidate";
}

/**
 * Extracts candidate job titles / past roles from resume text
 */
export function extractCandidateRoles(text: string): string[] {
  const matchedRoles = new Set<string>();
  const lower = text.toLowerCase();

  for (const role of COMMON_ROLES) {
    const regex = new RegExp(`\\b${role.toLowerCase()}\\b`, "i");
    if (regex.test(lower)) {
      matchedRoles.add(role);
    }
  }

  return Array.from(matchedRoles);
}

/**
 * Parses raw text into a structured CandidateResume
 */
export function parseResumeText(
  rawText: string,
  fileName: string = "uploaded_resume.txt",
  customId?: string
): CandidateResume {
  const cleanFileName = fileName.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
  const candidateName = extractCandidateName(rawText, cleanFileName);
  const contacts = extractContactInfo(rawText);
  const extractedSkills = extractSkillsFromText(rawText);
  const extractedExperienceYears = extractExperienceYears(rawText);
  const extractedEducation = extractEducation(rawText);
  const extractedRoles = extractCandidateRoles(rawText);

  // Generate a concise executive auto-summary
  const topSkillsStr =
    extractedSkills.length > 0
      ? extractedSkills.slice(0, 5).join(", ")
      : "Full Stack Development & Software Engineering";

  const summary = `${candidateName} is an experienced professional with ~${extractedExperienceYears} years of experience specializing in ${topSkillsStr}.`;

  return {
    id: customId || `cand-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    fileName,
    candidateName,
    email: contacts.email,
    phone: contacts.phone,
    linkedin: contacts.linkedin,
    github: contacts.github,
    extractedSkills,
    extractedExperienceYears,
    extractedEducation:
      extractedEducation.length > 0
        ? extractedEducation
        : ["Higher Education / Practical Industry Experience"],
    extractedRoles,
    summary,
    rawText,
  };
}

/**
 * Extracts plain text from client-side file uploads (PDF, DOCX, TXT, MD, Images)
 * Seamlessly routes to /api/parse with automatic OCR fallback
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  // For pure text/markdown, read directly on client
  if (extension === "txt" || extension === "md" || extension === "json") {
    return await file.text();
  }

  // Retrieve Gemini API key from browser localStorage if available
  let apiKey = "";
  if (typeof window !== "undefined" && window.localStorage) {
    apiKey = localStorage.getItem("talentscan_gemini_api_key") || "";
  }

  // Upload to the server parsing API
  const formData = new FormData();
  formData.append("file", file);
  if (apiKey) {
    formData.append("apiKey", apiKey);
  }

  const res = await fetch("/api/parse", {
    method: "POST",
    headers: apiKey ? { "x-gemini-api-key": apiKey } : undefined,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to parse ${file.name}. Please ensure the file is readable and not password-protected.`);
  }

  const data = await res.json();
  return data.text || "";
}

