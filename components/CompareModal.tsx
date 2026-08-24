"use client";

import React from "react";
import { X, Layers, CheckCircle2, AlertTriangle, Award } from "lucide-react";
import { ScreeningResult } from "@/types";

interface CompareModalProps {
  candidates: ScreeningResult[];
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  candidates,
  onClose,
}) => {
  if (!candidates || candidates.length < 2) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 my-8 overflow-hidden transition-all">
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-400 border border-indigo-500/30">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Side-by-Side Candidate Comparison</h2>
              <p className="text-xs text-slate-400">
                Direct benchmark across {candidates.length} selected candidates
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          <div className={`grid grid-cols-1 sm:grid-cols-${candidates.length} gap-4`}>
            {candidates.map(({ candidate, score }, index) => {
              return (
                <div
                  key={candidate.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-800/40 flex flex-col justify-between space-y-4"
                >
                  {/* Candidate Header */}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Candidate #{index + 1}
                      </span>
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 capitalize">
                        {score.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {candidate.candidateName}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {candidate.fileName}
                    </p>
                  </div>

                  {/* Overall Match Score */}
                  <div className="rounded-xl bg-white p-4 text-center border border-slate-200 dark:bg-slate-900 dark:border-slate-700 shadow-sm">
                    <span className="text-xs text-slate-500 uppercase font-semibold">
                      Overall Match
                    </span>
                    <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1">
                      {score.overallScore}%
                    </div>
                  </div>

                  {/* Metrics List */}
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Technical Skills:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {score.technicalScore}%
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Experience Score:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {score.experienceScore}% (~{candidate.extractedExperienceYears} yrs)
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">Education Score:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {score.educationScore}%
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-slate-500">TF-IDF Fit:</span>
                      <span className="font-bold text-slate-900 dark:text-white">
                        {score.keywordScore}%
                      </span>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Matched Skills ({score.matchedSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {score.matchedSkills.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800"
                        >
                          {s}
                        </span>
                      ))}
                      {score.matchedSkills.length > 6 && (
                        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                          +{score.matchedSkills.length - 6} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                      Missing Skills ({score.missingSkills.length})
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {score.missingSkills.length > 0 ? (
                        score.missingSkills.map((s) => (
                          <span
                            key={s}
                            className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800"
                          >
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-[11px] text-emerald-600 font-medium">
                          None missing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/60">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  );
};
