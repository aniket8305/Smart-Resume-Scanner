"use client";

import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/Navbar";
import { HeroStats } from "@/components/HeroStats";
import { JobDescriptionCard } from "@/components/JobDescriptionCard";
import { ResumeUploader } from "@/components/ResumeUploader";
import { WeightingControls } from "@/components/WeightingControls";
import { CandidateTable } from "@/components/CandidateTable";
import { CandidateDetailModal } from "@/components/CandidateDetailModal";
import { CompareModal } from "@/components/CompareModal";
import { ApiKeyModal } from "@/components/ApiKeyModal";
import { SAMPLE_JOBS } from "@/data/sampleJobs";
import { SAMPLE_RESUMES } from "@/data/sampleResumes";
import {
  CandidateResume,
  CandidateScore,
  JobDescription,
  ScoringWeights,
  ScreeningResult,
} from "@/types";
import { DEFAULT_WEIGHTS, screenCandidatesBatch } from "@/lib/scoring";

export default function Home() {
  // App States
  const [job, setJob] = useState<JobDescription>(SAMPLE_JOBS[0]);
  const [candidates, setCandidates] = useState<CandidateResume[]>(SAMPLE_RESUMES);
  const [weights, setWeights] = useState<ScoringWeights>(DEFAULT_WEIGHTS);
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<ScreeningResult | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [screeningProgress, setScreeningProgress] = useState<number | null>(null);
  const [screeningStepMessage, setScreeningStepMessage] = useState<string>("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load API key from localStorage
  useEffect(() => {
    const storedKey = localStorage.getItem("talentscan_gemini_api_key");
    if (storedKey) {
      setApiKey(storedKey);
    }
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    if (key) {
      localStorage.setItem("talentscan_gemini_api_key", key);
    } else {
      localStorage.removeItem("talentscan_gemini_api_key");
    }
  };

  // Screening Execution Function
  const runScreening = useCallback(
    async (
      currentCandidates: CandidateResume[],
      currentJob: JobDescription,
      currentWeights: ScoringWeights,
      currentApiKey: string,
      isManualClick: boolean = false
    ) => {
      if (currentCandidates.length === 0) {
        setResults([]);
        return;
      }

      setIsProcessing(true);

      if (isManualClick) {
        // Step 1
        setScreeningProgress(20);
        setScreeningStepMessage(`Parsing ${currentCandidates.length} candidate resumes & extracting metadata...`);
        await new Promise((r) => setTimeout(r, 250));

        // Step 2
        setScreeningProgress(55);
        setScreeningStepMessage(`Matching against ${currentJob.requiredSkills.length} required skills & taxonomy...`);
        await new Promise((r) => setTimeout(r, 250));

        // Step 3
        setScreeningProgress(85);
        setScreeningStepMessage("Computing TF-IDF semantic relevance & experience weights...");
        await new Promise((r) => setTimeout(r, 200));
      }

      let finalResults: ScreeningResult[] = [];

      // If user provided an API key, we call the backend API route with Gemini AI
      if (currentApiKey && currentApiKey.trim() !== "") {
        try {
          const response = await fetch("/api/screen", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              candidates: currentCandidates,
              job: currentJob,
              weights: currentWeights,
              apiKey: currentApiKey,
            }),
          });

          if (response.ok) {
            const data = await response.json();
            finalResults = data.results || [];
          }
        } catch (error) {
          console.warn("AI screening failed, falling back to local NLP engine", error);
        }
      }

      // Fast local NLP screening engine fallback or default
      if (finalResults.length === 0) {
        finalResults = screenCandidatesBatch(
          currentCandidates,
          currentJob,
          currentWeights
        );
      }

      if (isManualClick) {
        setScreeningProgress(100);
        setScreeningStepMessage("Screening complete! Ranking candidate leaderboard...");
        await new Promise((r) => setTimeout(r, 200));
      }

      setResults(finalResults);
      setIsProcessing(false);
      setScreeningProgress(null);

      // Celebrate top matches and notify user
      if (isManualClick) {
        setToastMessage(`✨ Successfully screened & ranked ${finalResults.length} candidates!`);
        setTimeout(() => setToastMessage(null), 4000);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // Ignore
        }

        // Scroll to Leaderboard
        const el = document.getElementById("leaderboard-section");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      } else if (finalResults.length > 0 && finalResults[0].score.overallScore >= 90) {
        try {
          confetti({
            particleCount: 40,
            spread: 50,
            origin: { y: 0.7 },
          });
        } catch (e) {
          // Ignore
        }
      }
    },
    []
  );

  // Auto-screen on mount or when candidates/job/weights change (in background)
  useEffect(() => {
    runScreening(candidates, job, weights, apiKey, false);
  }, [candidates, job, weights, apiKey, runScreening]);

  // Handle Candidate Status Change
  const handleStatusChange = (
    candidateId: string,
    newStatus: CandidateScore["status"]
  ) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.candidate.id === candidateId) {
          const updated = {
            ...item,
            score: { ...item.score, status: newStatus },
          };
          if (selectedCandidate?.candidate.id === candidateId) {
            setSelectedCandidate(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Handle Recruiter Notes Save
  const handleSaveNotes = (candidateId: string, notes: string) => {
    setResults((prev) =>
      prev.map((item) => {
        if (item.candidate.id === candidateId) {
          const updated = {
            ...item,
            score: { ...item.score, recruiterNotes: notes },
          };
          if (selectedCandidate?.candidate.id === candidateId) {
            setSelectedCandidate(updated);
          }
          return updated;
        }
        return item;
      })
    );
  };

  // Toggle Compare Selection
  const handleToggleCompare = (candidateId: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(candidateId)) {
        return prev.filter((id) => id !== candidateId);
      }
      if (prev.length >= 3) {
        return prev;
      }
      return [...prev, candidateId];
    });
  };

  // Reset to default sample setup
  const handleResetAll = () => {
    setJob(SAMPLE_JOBS[0]);
    setCandidates([...SAMPLE_RESUMES]);
    setWeights({ ...DEFAULT_WEIGHTS });
    setSelectedForCompare([]);
    setSelectedCandidate(null);
  };

  const compareCandidatesList = results.filter((r) =>
    selectedForCompare.includes(r.candidate.id)
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Navigation Header */}
      <Navbar
        hasApiKey={Boolean(apiKey)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onResetAll={handleResetAll}
        isAiLoading={isProcessing}
      />

      {/* Main Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* KPI Hero Stats */}
        <HeroStats results={results} />

        {/* Scoring Weights Matrix Controls */}
        <WeightingControls weights={weights} onWeightsChange={setWeights} />

        {/* 2-Column Core Workbench */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Target Job Specification */}
          <JobDescriptionCard job={job} onJobChange={setJob} />

          {/* Resume Upload & Pipeline Pipeline */}
          <ResumeUploader
            candidates={candidates}
            onCandidatesChange={setCandidates}
            isProcessing={isProcessing}
            onScreenNow={() => runScreening(candidates, job, weights, apiKey, true)}
          />
        </div>

        {/* Candidate Leaderboard & Results Table */}
        <div id="leaderboard-section" className="scroll-mt-20">
          <CandidateTable
            results={results}
            jobTitle={job.title}
            onSelectCandidate={setSelectedCandidate}
            onStatusChange={handleStatusChange}
            selectedForCompare={selectedForCompare}
            onToggleCompare={handleToggleCompare}
            onOpenCompareModal={() => setIsCompareModalOpen(true)}
          />
        </div>
      </main>

      {/* Interactive Screening Progress Modal */}
      {screeningProgress !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <div className="relative flex items-center justify-center">
                <span className="text-xl font-extrabold">{screeningProgress}%</span>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                AI Screening in Progress
              </h3>
              <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
                {screeningStepMessage}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${screeningProgress}%` }}
              />
            </div>

            <p className="text-[11px] text-slate-400">
              Evaluating skill taxonomies, experience seniority, and semantic alignment...
            </p>
          </div>
        </div>
      )}

      {/* Floating Success Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 rounded-2xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-2xl border border-slate-800 animate-bounce">
          <div className="rounded-full bg-emerald-500/20 p-1 text-emerald-400">
            ✓
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Candidate Profile Deep Dive Modal */}
      <CandidateDetailModal
        candidateResult={selectedCandidate}
        job={job}
        onClose={() => setSelectedCandidate(null)}
        onStatusChange={handleStatusChange}
        onSaveNotes={handleSaveNotes}
      />

      {/* Side-by-Side Comparison Modal */}
      {isCompareModalOpen && (
        <CompareModal
          candidates={compareCandidatesList}
          onClose={() => setIsCompareModalOpen(false)}
        />
      )}

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 dark:border-slate-800 dark:bg-slate-900 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>© {new Date().getFullYear()} TalentScan AI — Smart Resume Screener & Evaluation Platform.</p>
          <div className="flex items-center space-x-4">
            <span>Hybrid NLP & Gemini AI Engine</span>
            <span>•</span>
            <span>Production Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
