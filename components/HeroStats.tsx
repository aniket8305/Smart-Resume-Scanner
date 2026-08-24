"use client";

import React from "react";
import { Users, Award, TrendingUp, UserCheck } from "lucide-react";
import { ScreeningResult } from "@/types";

interface HeroStatsProps {
  results: ScreeningResult[];
}

export const HeroStats: React.FC<HeroStatsProps> = ({ results }) => {
  const total = results.length;
  const topScore = total > 0 ? Math.max(...results.map((r) => r.score.overallScore)) : 0;
  const avgScore =
    total > 0
      ? Math.round(results.reduce((acc, r) => acc + r.score.overallScore, 0) / total)
      : 0;
  const shortlisted = results.filter(
    (r) => r.score.status === "shortlisted" || r.score.status === "interview"
  ).length;

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:gap-4 mb-6">
      {/* Stat 1: Total Screened */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Total Candidates
          </span>
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <Users className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {total}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            resumes
          </span>
        </div>
      </div>

      {/* Stat 2: Top Match */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Top Match
          </span>
          <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {topScore > 0 ? `${topScore}%` : "—"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            peak score
          </span>
        </div>
      </div>

      {/* Stat 3: Average Match */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Average Score
          </span>
          <div className="rounded-lg bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-slate-900 dark:text-white">
            {avgScore > 0 ? `${avgScore}%` : "—"}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            pipeline fit
          </span>
        </div>
      </div>

      {/* Stat 4: Shortlisted */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Shortlisted / Active
          </span>
          <div className="rounded-lg bg-purple-50 p-2 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <UserCheck className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline space-x-2">
          <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {shortlisted}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            candidates
          </span>
        </div>
      </div>
    </div>
  );
};
