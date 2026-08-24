"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Trash2,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { CandidateResume } from "@/types";
import { SAMPLE_RESUMES } from "@/data/sampleResumes";
import { extractTextFromFile, parseResumeText } from "@/lib/resumeParser";

interface ResumeUploaderProps {
  candidates: CandidateResume[];
  onCandidatesChange: (updated: CandidateResume[]) => void;
  isProcessing: boolean;
  onScreenNow: () => void;
}

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  candidates,
  onCandidatesChange,
  isProcessing,
  onScreenNow,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = async (files: FileList | File[]) => {
    setUploadError(null);
    setUploadStatus("Processing and parsing files...");
    const parsedList: CandidateResume[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setUploadStatus(`Extracting text from ${file.name} (${i + 1}/${files.length})...`);
        const text = await extractTextFromFile(file);
        const parsed = parseResumeText(text, file.name);
        parsedList.push(parsed);
      }

      // Append new candidates
      onCandidatesChange([...candidates, ...parsedList]);
      setUploadStatus(`Successfully parsed ${parsedList.length} resume(s)!`);
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || "Failed to parse one or more files.");
      setUploadStatus(null);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleLoadSampleResumes = () => {
    onCandidatesChange([...SAMPLE_RESUMES]);
    setUploadStatus("Loaded 5 realistic candidate resumes!");
    setTimeout(() => setUploadStatus(null), 3000);
  };

  const handleClearAll = () => {
    onCandidatesChange([]);
  };

  const handleRemoveOne = (id: string) => {
    onCandidatesChange(candidates.filter((c) => c.id !== id));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-3">
        <div className="flex items-center space-x-2.5">
          <div className="rounded-xl bg-purple-50 p-2.5 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Candidate Resume Pipeline ({candidates.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Batch upload PDF, DOCX, or TXT resumes for screening
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleLoadSampleResumes}
            className="inline-flex items-center space-x-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800 transition-all"
          >
            <Users className="h-3.5 w-3.5" />
            <span>Load 5 Test Candidates</span>
          </button>

          {candidates.length > 0 && (
            <button
              onClick={handleClearAll}
              className="inline-flex items-center space-x-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 transition-colors"
              title="Clear candidate list"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mt-4 relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-indigo-500 bg-indigo-50/50 dark:border-indigo-400 dark:bg-indigo-950/30 scale-[0.99]"
            : "border-slate-300 bg-slate-50/50 hover:border-slate-400 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="rounded-2xl bg-white p-3 shadow-sm border border-slate-100 dark:bg-slate-800 dark:border-slate-700 mb-3">
          <UploadCloud className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
        </div>

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          Click to browse or drag and drop resumes here
        </p>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Supports PDF, Word (.docx), TXT files (Batch multi-file upload enabled)
        </p>
      </div>

      {/* Status or Error alerts */}
      {uploadStatus && (
        <div className="mt-3 flex items-center space-x-2 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {uploadError && (
        <div className="mt-3 flex items-center space-x-2 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Candidate Badges List */}
      {candidates.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Loaded Resumes Ready for Screening
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
            {candidates.map((cand) => (
              <div
                key={cand.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-800 transition-colors"
              >
                <div className="flex items-center space-x-2 truncate">
                  <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="font-semibold text-slate-900 dark:text-white truncate">
                      {cand.candidateName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {cand.extractedSkills.length} skills • ~{cand.extractedExperienceYears} yrs exp
                    </p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveOne(cand.id);
                  }}
                  className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 ml-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Trigger Screen Now Button */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button
              onClick={onScreenNow}
              disabled={isProcessing || candidates.length === 0}
              className="inline-flex items-center space-x-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 disabled:opacity-50 transition-all cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Evaluating Pipeline...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Run Smart Screening & Rank Candidates</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
