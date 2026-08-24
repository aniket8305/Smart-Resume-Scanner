import { ScreeningResult } from "@/types";

/**
 * Generates and triggers download of a CSV report of screened candidates
 */
export function exportToCSV(results: ScreeningResult[], jobTitle: string) {
  if (!results || results.length === 0) return;

  const headers = [
    "Rank",
    "Candidate Name",
    "Overall Score (%)",
    "Technical Match (%)",
    "Experience Match (%)",
    "Education Match (%)",
    "Keyword Match (%)",
    "Status",
    "Years Experience",
    "Matched Skills",
    "Missing Skills",
    "Email",
    "Phone",
    "LinkedIn",
    "GitHub",
    "Summary",
  ];

  const rows = results.map((item, index) => {
    const { candidate, score } = item;
    return [
      `"${index + 1}"`,
      `"${candidate.candidateName.replace(/"/g, '""')}"`,
      `"${score.overallScore}%"`,
      `"${score.technicalScore}%"`,
      `"${score.experienceScore}%"`,
      `"${score.educationScore}%"`,
      `"${score.keywordScore}%"`,
      `"${score.status.toUpperCase()}"`,
      `"${candidate.extractedExperienceYears}"`,
      `"${score.matchedSkills.join(", ").replace(/"/g, '""')}"`,
      `"${score.missingSkills.join(", ").replace(/"/g, '""')}"`,
      `"${candidate.email || "N/A"}"`,
      `"${candidate.phone || "N/A"}"`,
      `"${candidate.linkedin || "N/A"}"`,
      `"${candidate.github || "N/A"}"`,
      `"${score.executiveSummary.replace(/"/g, '""')}"`,
    ].join(",");
  });

  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const safeJobName = (jobTitle || "Job").toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.setAttribute("download", `Screening_Report_${safeJobName}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads candidate screening data as structured JSON
 */
export function exportToJSON(results: ScreeningResult[], jobTitle: string) {
  const jsonString = JSON.stringify(
    {
      jobTitle,
      exportDate: new Date().toISOString(),
      candidatesCount: results.length,
      screenedCandidates: results,
    },
    null,
    2
  );

  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  const safeJobName = (jobTitle || "Job").toLowerCase().replace(/[^a-z0-9]/g, "_");
  link.setAttribute("download", `Screening_Data_${safeJobName}_${Date.now()}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
