import { CandidateResume } from "@/types";
import {
  extractContactInfo,
  extractEducation,
  extractExperienceYears,
  extractSkillsFromText,
} from "./nlpEngine";

/**
 * Extracts candidate name from text lines (usually first non-empty line)
 */
export function extractCandidateName(text: string, defaultName: string = "Candidate"): string {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !l.toLowerCase().includes("curriculum") && !l.toLowerCase().includes("resume"));

  if (lines.length > 0) {
    const firstLine = lines[0].replace(/[^a-zA-Z\s\.]/g, "").trim();
    if (firstLine.length > 2 && firstLine.length < 35 && firstLine.split(" ").length <= 4) {
      return firstLine;
    }
  }

  return defaultName;
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

  // Generate a brief auto-summary
  const summary = `${candidateName} is an experienced professional with ~${extractedExperienceYears} years of experience specializing in ${
    extractedSkills.slice(0, 4).join(", ") || "software engineering and technology"
  }.`;

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
    extractedRoles: [],
    summary,
    rawText,
  };
}

/**
 * Extracts plain text from client-side file uploads (TXT, MD) or prepares data
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase();

  if (extension === "txt" || extension === "md" || extension === "json") {
    return await file.text();
  }

  // For PDF or DOCX, upload to the server parsing API
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/parse", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Failed to parse ${file.name}`);
  }

  const data = await res.json();
  return data.text || "";
}
