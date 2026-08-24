import {
  CandidateResume,
  CandidateScore,
  JobDescription,
  ScoringWeights,
  ScreeningResult,
} from "@/types";
import { computeCosineSimilarity, extractSkillsFromText } from "./nlpEngine";

export const DEFAULT_WEIGHTS: ScoringWeights = {
  technicalSkills: 40,
  experience: 25,
  education: 15,
  keywordMatch: 20,
};

/**
 * Evaluates and scores a candidate against a job description
 */
export function scoreCandidate(
  candidate: CandidateResume,
  job: JobDescription,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): CandidateScore {
  // Normalize job skills if not present
  const requiredSkills = job.requiredSkills || [];
  const preferredSkills = job.preferredSkills || [];
  const candidateSkills = new Set(
    (candidate.extractedSkills || []).map((s) => s.toLowerCase())
  );

  // 1. Technical Skills Match
  const matchedRequired: string[] = [];
  const missingRequired: string[] = [];
  const matchedPreferred: string[] = [];

  requiredSkills.forEach((skill) => {
    if (candidateSkills.has(skill.toLowerCase())) {
      matchedRequired.push(skill);
    } else {
      missingRequired.push(skill);
    }
  });

  preferredSkills.forEach((skill) => {
    if (candidateSkills.has(skill.toLowerCase())) {
      matchedPreferred.push(skill);
    }
  });

  // Calculate technical score: Required skills count for 80%, Preferred count for 20%
  let reqRatio = requiredSkills.length > 0
    ? matchedRequired.length / requiredSkills.length
    : 1;
  let prefRatio = preferredSkills.length > 0
    ? matchedPreferred.length / preferredSkills.length
    : 0.5;

  const technicalScore = Math.round(
    Math.min(100, (reqRatio * 80 + prefRatio * 20))
  );

  // 2. Experience Match
  const minYears = job.minYearsExperience || 0;
  const candYears = candidate.extractedExperienceYears || 0;
  let experienceScore = 100;

  if (minYears > 0) {
    if (candYears >= minYears) {
      // Full marks, plus bonus if slightly more experienced up to cap
      experienceScore = 100;
    } else {
      // Proportional reduction
      const ratio = candYears / minYears;
      experienceScore = Math.max(25, Math.round(ratio * 90));
    }
  }

  // 3. Education Match
  let educationScore = 85; // Baseline reasonable score
  const candEducation = (candidate.extractedEducation || []).join(" ").toLowerCase();
  if (candEducation.includes("ph.d") || candEducation.includes("doctorate")) {
    educationScore = 100;
  } else if (candEducation.includes("master") || candEducation.includes("m.s") || candEducation.includes("m.tech")) {
    educationScore = 95;
  } else if (candEducation.includes("bachelor") || candEducation.includes("b.s") || candEducation.includes("b.tech") || candEducation.includes("b.e")) {
    educationScore = 90;
  } else if (candEducation.includes("bootcamp") || candEducation.includes("certificate")) {
    educationScore = 75;
  }

  // 4. Keyword / Semantic Context Score
  const rawSimilarity = computeCosineSimilarity(candidate.rawText, job.rawText);
  // Scale similarity: cosine on resumes typically ranges from 0.15 to 0.75
  const keywordScore = Math.min(100, Math.max(30, Math.round((rawSimilarity / 0.65) * 100)));

  // Weighted Overall Score
  const totalWeight =
    weights.technicalSkills +
    weights.experience +
    weights.education +
    weights.keywordMatch;

  const overallScore = Math.round(
    (technicalScore * weights.technicalSkills +
      experienceScore * weights.experience +
      educationScore * weights.education +
      keywordScore * weights.keywordMatch) /
      (totalWeight || 100)
  );

  // Determine initial status based on overall score
  let status: 'shortlisted' | 'reviewed' | 'interview' | 'rejected' | 'pending' = 'pending';
  if (overallScore >= 80) {
    status = 'shortlisted';
  } else if (overallScore >= 65) {
    status = 'reviewed';
  } else {
    status = 'pending';
  }

  // Generate Key Strengths
  const keyStrengths: string[] = [];
  if (matchedRequired.length >= Math.ceil(requiredSkills.length * 0.75)) {
    keyStrengths.push(
      `Strong alignment with core requirements, covering ${matchedRequired.length}/${requiredSkills.length} required skills.`
    );
  }
  if (candYears >= minYears) {
    keyStrengths.push(
      `Meets or exceeds experience requirement (${candYears} yrs vs. ${minYears} yrs required).`
    );
  }
  if (matchedPreferred.length > 0) {
    keyStrengths.push(
      `Brings bonus expertise in preferred tools: ${matchedPreferred.slice(0, 3).join(", ")}.`
    );
  }
  if (candidate.github) {
    keyStrengths.push("Active portfolio / GitHub presence available for code review.");
  }
  if (keyStrengths.length === 0) {
    keyStrengths.push("Demonstrates foundational domain familiarity and enthusiasm for the stack.");
  }

  // Generate Gap Analysis
  const gapAnalysis: string[] = [];
  if (missingRequired.length > 0) {
    gapAnalysis.push(
      `Missing explicit mention of required skills: ${missingRequired.slice(0, 4).join(", ")}.`
    );
  }
  if (candYears < minYears) {
    gapAnalysis.push(
      `Experience gap: Candidate has ~${candYears} years against the target ${minYears} years.`
    );
  }
  if (gapAnalysis.length === 0) {
    gapAnalysis.push("No significant technical gaps identified for this role.");
  }

  // Generate Tailored Interview Questions
  const tailoredInterviewQuestions: string[] = [];
  if (matchedRequired.length > 0) {
    const topSkill = matchedRequired[0];
    tailoredInterviewQuestions.push(
      `Can you discuss a complex challenge you encountered when working with ${topSkill} and how you architected the solution?`
    );
  }
  if (matchedRequired.length > 1) {
    const secondSkill = matchedRequired[1];
    tailoredInterviewQuestions.push(
      `How do you optimize performance and state management when scaling applications with ${secondSkill}?`
    );
  }
  if (missingRequired.length > 0) {
    const missingSkill = missingRequired[0];
    tailoredInterviewQuestions.push(
      `The role requires ${missingSkill}. Have you worked with ${missingSkill} or an equivalent tool in prior projects?`
    );
  }
  tailoredInterviewQuestions.push(
    "Walk us through your workflow for testing, CI/CD, and delivering production-ready code under tight deadlines."
  );

  // Executive Summary
  const executiveSummary = `${candidate.candidateName} achieved an overall match of ${overallScore}%. With ~${candYears} years of experience and strong competence in ${matchedRequired.slice(0, 4).join(", ") || "the fundamentals"}, this candidate is a ${
    overallScore >= 80 ? "high-priority recommendation" : overallScore >= 65 ? "competitive candidate worthy of review" : "moderate match requiring further skill evaluation"
  }.`;

  return {
    candidateId: candidate.id,
    overallScore,
    technicalScore,
    experienceScore,
    educationScore,
    keywordScore,
    matchedSkills: [...matchedRequired, ...matchedPreferred],
    missingSkills: missingRequired,
    bonusSkills: matchedPreferred,
    status,
    keyStrengths,
    gapAnalysis,
    tailoredInterviewQuestions,
    executiveSummary,
  };
}

/**
 * Screens a batch of candidates against a job description and ranks them
 */
export function screenCandidatesBatch(
  candidates: CandidateResume[],
  job: JobDescription,
  weights: ScoringWeights = DEFAULT_WEIGHTS
): ScreeningResult[] {
  const results: ScreeningResult[] = candidates.map((cand) => ({
    candidate: cand,
    score: scoreCandidate(cand, job, weights),
  }));

  // Sort descending by overallScore
  return results.sort((a, b) => b.score.overallScore - a.score.overallScore);
}
