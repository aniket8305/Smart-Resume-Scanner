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
      currentApiKey: string
    ) => {
      if (currentCandidates.length === 0) {
        setResults([]);
        return;
      }

      setIsProcessing(true);

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
            setResults(data.results || []);
            setIsProcessing(false);
            return;
          }
        } catch (error) {
          console.warn("AI screening failed, falling back to local NLP engine", error);
        }
      }

      // Fast local NLP screening engine
      const scoredResults = screenCandidatesBatch(
        currentCandidates,
        currentJob,
        currentWeights
      );
      setResults(scoredResults);
      setIsProcessing(false);

      // Celebrate top matches
      if (scoredResults.length > 0 && scoredResults[0].score.overallScore >= 90) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
          });
        } catch (e) {
          // Ignore if canvas isn't available
        }
      }
    },
    []
  );

  // Auto-screen when candidates, job, or weights change
  useEffect(() => {
    runScreening(candidates, job, weights, apiKey);
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
            onScreenNow={() => runScreening(candidates, job, weights, apiKey)}
          />
        </div>

        {/* Candidate Leaderboard & Results Table */}
        <CandidateTable
          results={results}
          jobTitle={job.title}
          onSelectCandidate={setSelectedCandidate}
          onStatusChange={handleStatusChange}
          selectedForCompare={selectedForCompare}
          onToggleCompare={handleToggleCompare}
          onOpenCompareModal={() => setIsCompareModalOpen(true)}
        />
      </main>

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
