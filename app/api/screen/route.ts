import { NextRequest, NextResponse } from "next/server";
import { CandidateResume, JobDescription, ScoringWeights } from "@/types";
import { screenCandidateHybrid } from "@/lib/geminiService";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { candidates, job, weights, apiKey } = body as {
      candidates: CandidateResume[];
      job: JobDescription;
      weights?: ScoringWeights;
      apiKey?: string;
    };

    if (!candidates || !Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json(
        { error: "No candidate resumes provided for screening" },
        { status: 400 }
      );
    }

    if (!job || !job.rawText) {
      return NextResponse.json(
        { error: "Job description is missing or invalid" },
        { status: 400 }
      );
    }

    // Process all candidates concurrently
    const screeningPromises = candidates.map(async (candidate) => {
      const score = await screenCandidateHybrid(
        candidate,
        job,
        weights,
        apiKey || process.env.GEMINI_API_KEY
      );
      return {
        candidate,
        score,
      };
    });

    const results = await Promise.all(screeningPromises);

    // Sort descending by overall score
    results.sort((a, b) => b.score.overallScore - a.score.overallScore);

    const totalScreened = results.length;
    const averageScore = Math.round(
      results.reduce((acc, r) => acc + r.score.overallScore, 0) / (totalScreened || 1)
    );
    const topScore = results.length > 0 ? results[0].score.overallScore : 0;

    return NextResponse.json({
      jobTitle: job.title,
      totalScreened,
      averageScore,
      topScore,
      results,
    });
  } catch (error: any) {
    console.error("Screen API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to screen candidates" },
      { status: 500 }
    );
  }
}
