"use client";

import React, { useState } from "react";
import { Sliders, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import { ScoringWeights } from "@/types";
import { DEFAULT_WEIGHTS } from "@/lib/scoring";

interface WeightingControlsProps {
  weights: ScoringWeights;
  onWeightsChange: (weights: ScoringWeights) => void;
}

export const WeightingControls: React.FC<WeightingControlsProps> = ({
  weights,
  onWeightsChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSliderChange = (key: keyof ScoringWeights, value: number) => {
    onWeightsChange({
      ...weights,
      [key]: value,
    });
  };

  const handleReset = () => {
    onWeightsChange({ ...DEFAULT_WEIGHTS });
  };

  const totalWeight =
    weights.technicalSkills +
    weights.experience +
    weights.education +
    weights.keywordMatch;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all mb-6">
      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2.5">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Scoring Weights
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Adjust how each factor contributes to the final score ({totalWeight}% total)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Tech {weights.technicalSkills}% • Exp {weights.experience}% • Edu {weights.education}% • Text Match {weights.keywordMatch}%
          </span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Sliders Body */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Tech Skills Weight */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Technical Skills
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {weights.technicalSkills}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.technicalSkills}
              onChange={(e) =>
                handleSliderChange("technicalSkills", parseInt(e.target.value, 10))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
              Required/important skill match
            </span>
          </div>

          {/* Experience Weight */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Experience
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {weights.experience}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.experience}
              onChange={(e) =>
                handleSliderChange("experience", parseInt(e.target.value, 10))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
              Years and experience relevance
            </span>
          </div>

          {/* Education Weight */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Education
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {weights.education}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.education}
              onChange={(e) =>
                handleSliderChange("education", parseInt(e.target.value, 10))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
              Degree/qualification match
            </span>
          </div>

          {/* Text Similarity Weight */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                TF-IDF Text Match
              </span>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">
                {weights.keywordMatch}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={weights.keywordMatch}
              onChange={(e) =>
                handleSliderChange("keywordMatch", parseInt(e.target.value, 10))
              }
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 dark:bg-slate-700"
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1">
              Job description/resume text similarity
            </span>
          </div>

          <div className="sm:col-span-2 lg:col-span-4 flex justify-end pt-1">
            <button
              onClick={handleReset}
              className="inline-flex items-center space-x-1 text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset to Defaults (40/25/15/20)</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
