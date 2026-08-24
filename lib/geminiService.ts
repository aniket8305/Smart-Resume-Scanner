import { GoogleGenerativeAI } from "@google/generative-ai";
import { CandidateResume, CandidateScore, JobDescription, ScoringWeights } from "@/types";
import { scoreCandidate } from "./scoring";

export interface GeminiEvaluationResult {
  overallScore: number;
  technicalScore: number;
  experienceScore: number;
  educationScore: number;
  keywordScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  keyStrengths: string[];
  gapAnalysis: string[];
  tailoredInterviewQuestions: string[];
  executiveSummary: string;
}

/**
 * Uses Google Gemini Generative AI to perform deep qualitative evaluation
 */
export async function evaluateCandidateWithGemini(
  candidate: CandidateResume,
  job: JobDescription,
  apiKey: string
): Promise<GeminiEvaluationResult> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `You are a Principal Technical Recruiter and Senior Engineering Hiring Manager.
Evaluate the following candidate resume against the given job description.

JOB DESCRIPTION:
Title: ${job.title}
Department: ${job.department}
Target Experience: ${job.minYearsExperience}+ years
Required Skills: ${job.requiredSkills.join(", ")}
Preferred Skills: ${job.preferredSkills.join(", ")}
Job Details:
${job.rawText}

CANDIDATE RESUME:
Name: ${candidate.candidateName}
Resume Content:
${candidate.rawText}

Please analyze thoroughly and return ONLY a valid JSON object matching this structure (no markdown fences, no extra text):
{
  "overallScore": number (0 to 100),
  "technicalScore": number (0 to 100),
  "experienceScore": number (0 to 100),
  "educationScore": number (0 to 100),
  "keywordScore": number (0 to 100),
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["missingSkill1", "missingSkill2"],
  "keyStrengths": ["Detailed bullet 1", "Detailed bullet 2", "Detailed bullet 3"],
  "gapAnalysis": ["Specific gap 1", "Specific gap 2"],
  "tailoredInterviewQuestions": [
    "Specific technical question 1 based on their project/experience",
    "Specific technical question 2 probing depth or missing areas",
    "Specific behavioral/architecture question 3"
  ],
  "executiveSummary": "2-3 concise sentences summarizing candidate fit, seniority, and recommendation."
}`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Clean JSON response (strip ```json fences if model returned them)
  const cleanedJson = responseText
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleanedJson);

  return {
    overallScore: Math.min(100, Math.max(0, Math.round(parsed.overallScore || 70))),
    technicalScore: Math.min(100, Math.max(0, Math.round(parsed.technicalScore || 70))),
    experienceScore: Math.min(100, Math.max(0, Math.round(parsed.experienceScore || 70))),
    educationScore: Math.min(100, Math.max(0, Math.round(parsed.educationScore || 70))),
    keywordScore: Math.min(100, Math.max(0, Math.round(parsed.keywordScore || 70))),
    matchedSkills: parsed.matchedSkills || [],
    missingSkills: parsed.missingSkills || [],
    keyStrengths: parsed.keyStrengths || [],
    gapAnalysis: parsed.gapAnalysis || [],
    tailoredInterviewQuestions: parsed.tailoredInterviewQuestions || [],
    executiveSummary: parsed.executiveSummary || "",
  };
}

/**
 * Screens candidate with Gemini AI, gracefully falling back to local NLP engine on error
 */
export async function screenCandidateHybrid(
  candidate: CandidateResume,
  job: JobDescription,
  weights?: ScoringWeights,
  apiKey?: string
): Promise<CandidateScore> {
  const localScore = scoreCandidate(candidate, job, weights);

  if (!apiKey || apiKey.trim() === "") {
    return localScore;
  }

  try {
    const aiResult = await evaluateCandidateWithGemini(candidate, job, apiKey);
    
    // Merge AI insights with structured scores
    return {
      candidateId: candidate.id,
      overallScore: aiResult.overallScore,
      technicalScore: aiResult.technicalScore,
      experienceScore: aiResult.experienceScore,
      educationScore: aiResult.educationScore,
      keywordScore: aiResult.keywordScore,
      matchedSkills: aiResult.matchedSkills.length > 0 ? aiResult.matchedSkills : localScore.matchedSkills,
      missingSkills: aiResult.missingSkills.length > 0 ? aiResult.missingSkills : localScore.missingSkills,
      bonusSkills: localScore.bonusSkills,
      status: aiResult.overallScore >= 80 ? "shortlisted" : aiResult.overallScore >= 65 ? "reviewed" : "pending",
      keyStrengths: aiResult.keyStrengths.length > 0 ? aiResult.keyStrengths : localScore.keyStrengths,
      gapAnalysis: aiResult.gapAnalysis.length > 0 ? aiResult.gapAnalysis : localScore.gapAnalysis,
      tailoredInterviewQuestions:
        aiResult.tailoredInterviewQuestions.length > 0
          ? aiResult.tailoredInterviewQuestions
          : localScore.tailoredInterviewQuestions,
      executiveSummary: aiResult.executiveSummary || localScore.executiveSummary,
    };
  } catch (error) {
    console.warn("Gemini evaluation error, using local NLP engine fallback:", error);
    return localScore;
  }
}
