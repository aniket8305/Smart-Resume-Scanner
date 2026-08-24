"use client";

import React from "react";
import { FileText, Key, Github, RefreshCw } from "lucide-react";

interface NavbarProps {
  hasApiKey: boolean;
  onOpenApiKeyModal: () => void;
  onResetAll: () => void;
  isProcessing?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  hasApiKey,
  onOpenApiKeyModal,
  onResetAll,
  isProcessing,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 shadow-sm transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white dark:bg-indigo-600 shadow-sm">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                TalentScan
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              Resume Screening & Candidate Ranking
            </p>
          </div>
        </div>

        {/* Actions & Configuration */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mode Indicator */}
          <button
            onClick={onOpenApiKeyModal}
            className={`inline-flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              hasApiKey
                ? "bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
            }`}
            title="Configure optional Gemini API Key"
          >
            <Key className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">
              {hasApiKey ? "Gemini Enabled" : "Local Matching (No Key Needed)"}
            </span>
            <span className="sm:hidden">{hasApiKey ? "Gemini" : "Local"}</span>
          </button>

          {/* Reset Workspace */}
          <button
            onClick={onResetAll}
            className="inline-flex items-center space-x-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            title="Reset to default dataset"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isProcessing ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center space-x-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white shadow-sm transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
