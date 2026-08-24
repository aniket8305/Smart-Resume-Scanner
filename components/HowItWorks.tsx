"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, Code2, Calculator, Layers, FileSearch } from "lucide-react";

export const HowItWorks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all mb-6">
      {/* Header Accordion Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2.5">
          <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <HelpCircle className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              How the Screening Pipeline Works
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Transparent breakdown of parsing, scoring formula, and technology stack
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400">
            {isOpen ? "Hide Details" : "View Pipeline & Formula"}
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-6">
          {/* Step-by-Step Pipeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3 flex items-center space-x-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-500" />
              <span>5-Step Evaluation Pipeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">1. Upload Resumes</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Extract raw text from PDF (pdfjs-dist), DOCX (mammoth), or TXT documents.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">2. Extract Information</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Detect skills via a 500+ term taxonomy dictionary, experience years, and degree levels.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">3. Compare Against Job</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Cross-reference candidate profile against required skills and minimum experience.
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">4. Calculate Score</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Apply weighted formula across Tech (40%), Exp (25%), Edu (15%), and TF-IDF Text Match (20%).
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">5. Rank Candidates</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Sort candidates by final fit score with matched vs. missing skill gap analysis.
                </p>
              </div>
            </div>
          </div>

          {/* Transparent Scoring Formula Card & Built With */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Formula Explanation */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-1.5">
                <Calculator className="h-3.5 w-3.5 text-indigo-500" />
                <span>Scoring Calculation Formula</span>
              </h4>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <p className="font-mono text-[11px] bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  Final Score = (Tech × 0.40) + (Experience × 0.25) + (Education × 0.15) + (Text Match × 0.20)
                </p>
                <ul className="space-y-1 text-[11px]">
                  <li>• <strong>Technical Skills (40%)</strong>: Ratio of mandatory required skills matched from the taxonomy.</li>
                  <li>• <strong>Experience (25%)</strong>: Extracted years compared against the job minimum threshold.</li>
                  <li>• <strong>Education (15%)</strong>: Degree level (Doctorate, Master&apos;s, Bachelor&apos;s, Bootcamp).</li>
                  <li>• <strong>TF-IDF Text Match (20%)</strong>: Cosine similarity between job text and resume word vectors.</li>
                </ul>
              </div>
            </div>

            {/* Built With */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-800/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center space-x-1.5">
                <Code2 className="h-3.5 w-3.5 text-indigo-500" />
                <span>Built With</span>
              </h4>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-300">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-900 dark:text-white block">Frontend</span>
                  <span>React / Next.js / TypeScript / Tailwind CSS</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-900 dark:text-white block">Document Parsing</span>
                  <span>pdfjs-dist (PDF) & mammoth (DOCX)</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-900 dark:text-white block">Text Matching</span>
                  <span>TF-IDF + Cosine Similarity + Skill Dictionary</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-semibold text-slate-900 dark:text-white block">Optional AI</span>
                  <span>Google Gemini 1.5 Flash API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
