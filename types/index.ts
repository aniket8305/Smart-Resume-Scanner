export interface JobDescription {
  id: string;
  title: string;
  department: string;
  experienceLevel: 'Entry-level' | 'Mid-level' | 'Senior' | 'Lead' | 'Executive';
  minYearsExperience: number;
  requiredSkills: string[];
  preferredSkills: string[];
  education: string[];
  responsibilities: string[];
  rawText: string;
}

export interface CandidateResume {
  id: string;
  fileName: string;
  candidateName: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  extractedSkills: string[];
  extractedExperienceYears: number;
  extractedEducation: string[];
  extractedRoles: string[];
  summary: string;
  rawText: string;
}

export interface ScoringWeights {
  technicalSkills: number; // e.g. 40%
  experience: number;      // e.g. 25%
  education: number;       // e.g. 15%
  keywordMatch: number;    // e.g. 20%
}

export interface CandidateScore {
  candidateId: string;
  overallScore: number;       // 0 - 100
  technicalScore: number;     // 0 - 100
  experienceScore: number;    // 0 - 100
  educationScore: number;     // 0 - 100
  keywordScore: number;       // 0 - 100
  
  matchedSkills: string[];
  missingSkills: string[];
  bonusSkills: string[];
  
  status: 'shortlisted' | 'reviewed' | 'interview' | 'rejected' | 'pending';
  recruiterNotes?: string;
  
  // Qualitative AI / Engine Breakdown
  keyStrengths: string[];
  gapAnalysis: string[];
  tailoredInterviewQuestions: string[];
  executiveSummary: string;
}

export interface ScreeningResult {
  candidate: CandidateResume;
  score: CandidateScore;
}

export interface BatchScreeningResponse {
  jobTitle: string;
  totalScreened: number;
  averageScore: number;
  topScore: number;
  results: ScreeningResult[];
}
