"use client";

import React, { useState } from "react";
import { Briefcase, Plus, X, Sparkles } from "lucide-react";
import { JobDescription } from "@/types";
import { SAMPLE_JOBS } from "@/data/sampleJobs";
import { extractSkillsFromText } from "@/lib/nlpEngine";

interface JobDescriptionCardProps {
  job: JobDescription;
  onJobChange: (updated: JobDescription) => void;
}

export const JobDescriptionCard: React.FC<JobDescriptionCardProps> = ({
  job,
  onJobChange,
}) => {
  const [newSkill, setNewSkill] = useState("");

  const handleSelectPreset = (presetId: string) => {
    const found = SAMPLE_JOBS.find((j) => j.id === presetId);
    if (found) {
      onJobChange({ ...found });
    }
  };

  const handleAddRequiredSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    if (!job.requiredSkills.includes(newSkill.trim())) {
      onJobChange({
        ...job,
        requiredSkills: [...job.requiredSkills, newSkill.trim()],
      });
    }
    setNewSkill("");
  };

  const handleRemoveRequiredSkill = (skillToRemove: string) => {
    onJobChange({
      ...job,
      requiredSkills: job.requiredSkills.filter((s) => s !== skillToRemove),
    });
  };

  const handleAutoExtractSkills = () => {
    const extracted = extractSkillsFromText(job.rawText);
    if (extracted.length > 0) {
      const combined = Array.from(new Set([...job.requiredSkills, ...extracted]));
      onJobChange({
        ...job,
        requiredSkills: combined,
      });
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <Briefcase className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Target Job Specification
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a sample role or customize requirements
            </p>
          </div>
        </div>

        {/* Role Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          {SAMPLE_JOBS.map((preset) => {
            const isSelected = job.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset.id)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-slate-900 text-white shadow-sm dark:bg-indigo-600"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                }`}
              >
                {preset.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Inputs Form */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Title */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={job.title}
            onChange={(e) => onJobChange({ ...job, title: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="e.g. Full Stack Developer"
          />
        </div>

        {/* Department */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Department
          </label>
          <input
            type="text"
            value={job.department}
            onChange={(e) => onJobChange({ ...job, department: e.target.value })}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            placeholder="e.g. Engineering"
          />
        </div>

        {/* Min Experience */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
            Min. Experience (Years)
          </label>
          <input
            type="number"
            min="0"
            max="25"
            value={job.minYearsExperience}
            onChange={(e) =>
              onJobChange({
                ...job,
                minYearsExperience: Math.max(0, parseInt(e.target.value, 10) || 0),
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Required Skills Chips */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Required Skills ({job.requiredSkills.length})
            </label>
            <span className="text-[10px] text-slate-400 block">
              Extracted from job requirements or added manually
            </span>
          </div>
          <button
            onClick={handleAutoExtractSkills}
            className="inline-flex items-center space-x-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            title="Matches text against 500+ skill dictionary"
          >
            <Sparkles className="h-3 w-3" />
            <span>Extract from text</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {job.requiredSkills.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center space-x-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
            >
              <span>{skill}</span>
              <button
                type="button"
                onClick={() => handleRemoveRequiredSkill(skill)}
                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        {/* Add Skill input */}
        <form onSubmit={handleAddRequiredSkill} className="flex gap-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill (e.g. Docker, PostgreSQL, React)..."
            className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
          <button
            type="submit"
            className="inline-flex items-center space-x-1 rounded-xl bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add</span>
          </button>
        </form>
      </div>

      {/* Raw JD Text */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
            Full Job Description
          </label>
          <span className="text-[10px] text-slate-400">
            Used for text similarity and keyword matching
          </span>
        </div>
        <textarea
          rows={3}
          value={job.rawText}
          onChange={(e) => onJobChange({ ...job, rawText: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs text-slate-800 font-mono focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          placeholder="Enter job description text..."
        />
      </div>
    </div>
  );
};
