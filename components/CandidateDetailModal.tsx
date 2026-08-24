"use client";

import React, { useState } from "react";
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Github,
  Copy,
  Check,
  Sparkles,
  UserCheck,
  XCircle,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { CandidateScore, JobDescription, ScreeningResult } from "@/types";

interface CandidateDetailModalProps {
  candidateResult: ScreeningResult | null;
  job: JobDescription;
  onClose: () => void;
  onStatusChange: (candidateId: string, newStatus: CandidateScore["status"]) => void;
  onSaveNotes: (candidateId: string, notes: string) => void;
}

export const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidateResult,
  job,
  onClose,
  onStatusChange,
  onSaveNotes,
}) => {
  if (!candidateResult) return null;

  const { candidate, score } = candidateResult;
  const [activeTab, setActiveTab] = useState<"analysis" | "questions" | "resume">("analysis");
  const [notes, setNotes] = useState(score.recruiterNotes || "");
  const [copiedQuestionIndex, setCopiedQuestionIndex] = useState<number | null>(null);

  const radarData = [
    { metric: "Technical", value: score.technicalScore, fullMark: 100 },
    { metric: "Experience", value: score.experienceScore, fullMark: 100 },
    { metric: "Education", value: score.educationScore, fullMark: 100 },
    { metric: "Semantic Fit", value: score.keywordScore, fullMark: 100 },
    { metric: "Role Match", value: score.overallScore, fullMark: 100 },
  ];

  const handleCopyQuestion = (question: string, index: number) => {
    navigator.clipboard.writeText(question);
    setCopiedQuestionIndex(index);
    setTimeout(() => setCopiedQuestionIndex(null), 2000);
  };

  const handleNotesBlur = () => {
    onSaveNotes(candidate.id, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 my-8 overflow-hidden transition-all">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h2 className="text-2xl font-bold">{candidate.candidateName}</h2>
                <span className="rounded-full bg-white/20 px-3 py-0.5 text-xs font-semibold text-indigo-100 border border-white/30 capitalize">
                  {score.status}
                </span>
              </div>
              <p className="text-sm text-indigo-200 mt-1">{candidate.fileName}</p>

              {/* Contact meta */}
              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-indigo-100/90">
                {candidate.email && (
                  <span className="flex items-center space-x-1">
                    <Mail className="h-3.5 w-3.5 text-indigo-300" />
                    <span>{candidate.email}</span>
                  </span>
                )}
                {candidate.phone && (
                  <span className="flex items-center space-x-1">
                    <Phone className="h-3.5 w-3.5 text-indigo-300" />
                    <span>{candidate.phone}</span>
                  </span>
                )}
                {candidate.location && (
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5 text-indigo-300" />
                    <span>{candidate.location}</span>
                  </span>
                )}
                {candidate.linkedin && (
                  <a
                    href={candidate.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-white hover:underline"
                  >
                    <Linkedin className="h-3.5 w-3.5 text-indigo-300" />
                    <span>LinkedIn</span>
                  </a>
                )}
                {candidate.github && (
                  <a
                    href={candidate.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center space-x-1 text-white hover:underline"
                  >
                    <Github className="h-3.5 w-3.5 text-indigo-300" />
                    <span>GitHub</span>
                  </a>
                )}
              </div>
            </div>

            {/* Overall Score Circle Badge */}
            <div className="flex items-center space-x-3 bg-white/10 rounded-2xl p-3 border border-white/20 backdrop-blur-md">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-extrabold text-white">
                  {score.overallScore}%
                </span>
                <span className="text-[10px] uppercase font-semibold text-indigo-200 tracking-wider">
                  Target Fit
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
          <button
            onClick={() => setActiveTab("analysis")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "analysis"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            Match Breakdown & Radar
          </button>
          <button
            onClick={() => setActiveTab("questions")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "questions"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            AI Interview Questions ({score.tailoredInterviewQuestions.length})
          </button>
          <button
            onClick={() => setActiveTab("resume")}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
              activeTab === "resume"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400"
            }`}
          >
            Extracted Resume Text
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">
          {activeTab === "analysis" && (
            <>
              {/* Executive Summary */}
              <div className="rounded-2xl bg-indigo-50/70 p-4 border border-indigo-100 dark:bg-indigo-950/40 dark:border-indigo-900/60">
                <div className="flex items-center space-x-2 text-indigo-800 dark:text-indigo-300 font-bold text-xs mb-1">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <span>Executive Assessment</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {score.executiveSummary}
                </p>
              </div>

              {/* Subscores Grid & Radar Chart */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* 4 Metric Sub-Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Technical Skills
                    </span>
                    <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                      {score.technicalScore}%
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {score.matchedSkills.length} of {job.requiredSkills.length} matched
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Experience
                    </span>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                      {score.experienceScore}%
                    </p>
                    <span className="text-[10px] text-slate-400">
                      ~{candidate.extractedExperienceYears} yrs vs {job.minYearsExperience} req
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Education
                    </span>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                      {score.educationScore}%
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {candidate.extractedEducation[0] || "Standard Degree"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/50">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase">
                      Context Similarity
                    </span>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                      {score.keywordScore}%
                    </p>
                    <span className="text-[10px] text-slate-400">TF-IDF Vector Cosine</span>
                  </div>
                </div>

                {/* Recharts Radar Chart */}
                <div className="h-56 w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                      <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                      <PolarAngleAxis
                        dataKey="metric"
                        tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
                      />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                      <Radar
                        name="Fit"
                        dataKey="value"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.45}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Skills Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Matched Skills */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-900/60 dark:bg-emerald-950/20">
                  <div className="flex items-center space-x-1.5 text-emerald-800 dark:text-emerald-300 font-bold text-xs mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Matched Skills ({score.matchedSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {score.matchedSkills.length > 0 ? (
                      score.matchedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-emerald-100/80 px-2 py-1 text-xs font-semibold text-emerald-800 border border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700"
                        >
                          ✓ {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400">No direct skills matched</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
                  <div className="flex items-center space-x-1.5 text-rose-800 dark:text-rose-300 font-bold text-xs mb-2">
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                    <span>Missing Target Skills ({score.missingSkills.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {score.missingSkills.length > 0 ? (
                      score.missingSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg bg-rose-100/80 px-2 py-1 text-xs font-semibold text-rose-800 border border-rose-300 dark:bg-rose-900/50 dark:text-rose-200 dark:border-rose-700"
                        >
                          ✕ {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">
                        All mandatory requirements satisfied!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Strengths and Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Strengths */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                    Key Highlights & Strengths
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {score.keyStrengths.map((str, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gap Analysis */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-800/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-2">
                    Gaps & Areas to Probe
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                    {score.gapAnalysis.map((gap, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Recruiter Evaluation Notes & Decision */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Recruiter Evaluation Notes
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onStatusChange(candidate.id, "shortlisted")}
                      className="inline-flex items-center space-x-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500 transition-colors"
                    >
                      <UserCheck className="h-3 w-3" />
                      <span>Shortlist</span>
                    </button>
                    <button
                      onClick={() => onStatusChange(candidate.id, "interview")}
                      className="inline-flex items-center space-x-1 rounded-lg bg-indigo-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
                    >
                      <span>Schedule Interview</span>
                    </button>
                    <button
                      onClick={() => onStatusChange(candidate.id, "rejected")}
                      className="inline-flex items-center space-x-1 rounded-lg bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-rose-100 hover:text-rose-700 dark:bg-slate-700 dark:text-slate-200 transition-colors"
                    >
                      <XCircle className="h-3 w-3" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={handleNotesBlur}
                  placeholder="Type internal candidate feedback, screening notes, or interview observations here..."
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                />
              </div>
            </>
          )}

          {activeTab === "questions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Tailored Interview Questions for {candidate.candidateName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Generated dynamically based on candidate's exact resume claims and target job requirements
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {score.tailoredInterviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start justify-between rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
                        {q}
                      </p>
                    </div>

                    <button
                      onClick={() => handleCopyQuestion(q, idx)}
                      className="inline-flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 ml-3 flex-shrink-0"
                    >
                      {copiedQuestionIndex === idx ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "resume" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">
                  Raw Parsed Content ({candidate.rawText.length} characters)
                </span>
              </div>
              <pre className="w-full rounded-2xl border border-slate-200 bg-slate-900 text-slate-100 p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                {candidate.rawText}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Candidate ID: {candidate.id}
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
