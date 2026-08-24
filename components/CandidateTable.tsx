"use client";

import React, { useState } from "react";
import {
  Search,
  Download,
  Eye,
  Briefcase,
  FileSpreadsheet,
  Layers,
  Linkedin,
  Github,
  X,
} from "lucide-react";
import { CandidateScore, ScreeningResult } from "@/types";
import { exportToCSV, exportToJSON } from "@/lib/exportUtils";

interface CandidateTableProps {
  results: ScreeningResult[];
  jobTitle: string;
  onSelectCandidate: (candidateResult: ScreeningResult) => void;
  onStatusChange: (candidateId: string, newStatus: CandidateScore["status"]) => void;
  selectedForCompare: string[];
  onToggleCompare: (candidateId: string) => void;
  onOpenCompareModal: () => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  results,
  jobTitle,
  onSelectCandidate,
  onStatusChange,
  selectedForCompare,
  onToggleCompare,
  onOpenCompareModal,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter candidates
  const filtered = results.filter((r) => {
    const nameMatch = r.candidate.candidateName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const skillMatch = r.candidate.extractedSkills.some((s) =>
      s.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const textMatch = nameMatch || skillMatch;

    const statusMatch =
      statusFilter === "all" || r.score.status === statusFilter;

    return textMatch && statusMatch;
  });

  const getScoreBadge = (score: number) => {
    if (score >= 80) {
      return "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    }
    if (score >= 65) {
      return "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800";
    }
    return "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
  };

  const getScoreProgressBar = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 65) return "bg-blue-500";
    return "bg-amber-500";
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 overflow-hidden transition-all">
      {/* Table Toolbar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Candidate Leaderboard ({filtered.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Candidates are ranked using the configured scoring weights.
            </p>
          </div>

          {/* Export & Compare Actions */}
          <div className="flex flex-wrap items-center gap-2">
            {selectedForCompare.length >= 2 && (
              <button
                onClick={onOpenCompareModal}
                className="inline-flex items-center space-x-1.5 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 transition-all"
              >
                <Layers className="h-3.5 w-3.5" />
                <span>Compare Selected ({selectedForCompare.length})</span>
              </button>
            )}

            <button
              onClick={() => exportToCSV(results, jobTitle)}
              disabled={results.length === 0}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportToJSON(results, jobTitle)}
              disabled={results.length === 0}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, skill (e.g. React)..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-8 pr-8 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1 w-full sm:w-auto">
            {["all", "shortlisted", "interview", "reviewed", "pending"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                  statusFilter === status
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              <th className="py-3 px-4 w-12 text-center">Compare</th>
              <th className="py-3 px-3 w-12 text-center">Rank</th>
              <th className="py-3 px-4">Candidate</th>
              <th className="py-3 px-4 w-48">Score Breakdown</th>
              <th className="py-3 px-4">Skill Match</th>
              <th className="py-3 px-3">Experience</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Briefcase className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-medium">No candidates to display.</p>
                    <p className="text-xs text-slate-400">
                      Upload resumes or load the demo dataset to begin screening.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => {
                const { candidate, score } = item;
                const isSelectedForCompare = selectedForCompare.includes(candidate.id);

                return (
                  <tr
                    key={candidate.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => onSelectCandidate(item)}
                  >
                    {/* Compare Checkbox */}
                    <td
                      className="py-3 px-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelectedForCompare}
                        onChange={() => onToggleCompare(candidate.id)}
                        disabled={!isSelectedForCompare && selectedForCompare.length >= 3}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 cursor-pointer"
                        title="Select up to 3 candidates to compare"
                      />
                    </td>

                    {/* Rank */}
                    <td className="py-3 px-3 text-center font-bold text-slate-500 dark:text-slate-400">
                      #{index + 1}
                    </td>

                    {/* Candidate Name */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-sm">
                        {candidate.candidateName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>{candidate.fileName}</span>
                        {candidate.linkedin && (
                          <a
                            href={candidate.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-400"
                          >
                            <Linkedin className="h-3 w-3" />
                          </a>
                        )}
                        {candidate.github && (
                          <a
                            href={candidate.github}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-slate-600 hover:text-slate-900 dark:text-slate-400"
                          >
                            <Github className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Score Breakdown Progress Bar */}
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${getScoreBadge(
                            score.overallScore
                          )}`}
                        >
                          {score.overallScore}% Overall Fit
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${getScoreProgressBar(
                            score.overallScore
                          )}`}
                          style={{ width: `${score.overallScore}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 flex justify-between">
                        <span>Skills: {score.technicalScore}%</span>
                        <span>Exp: {score.experienceScore}%</span>
                        <span>Text: {score.keywordScore}%</span>
                      </div>
                    </td>

                    {/* Key Matched Skills */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {score.matchedSkills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                          >
                            {skill}
                          </span>
                        ))}
                        {score.matchedSkills.length > 3 && (
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                            +{score.matchedSkills.length - 3}
                          </span>
                        )}
                        {score.missingSkills.length > 0 && (
                          <span className="text-[10px] text-rose-500 font-medium ml-1">
                            ({score.missingSkills.length} missing)
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Experience */}
                    <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      ~{candidate.extractedExperienceYears} yrs
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={score.status}
                        onChange={(e) =>
                          onStatusChange(
                            candidate.id,
                            e.target.value as CandidateScore["status"]
                          )
                        }
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold capitalize text-slate-700 shadow-sm focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectCandidate(item);
                        }}
                        className="inline-flex items-center space-x-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
