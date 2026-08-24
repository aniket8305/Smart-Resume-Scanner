# 🎯 TalentScan — Resume Screening & Candidate Ranking

> **Live Demo:** https://smart-resume-scanner-ten.vercel.app/

A resume screening application that helps compare candidates against a target job description using **skill matching, experience evaluation, education matching, and TF-IDF text similarity**, with optional LLM-assisted candidate analysis.

Built with **Next.js, TypeScript, and Tailwind CSS**, TalentScan focuses on making candidate evaluation **configurable, explainable, and practical**.

---

## 🚀 Try the Live Application

**Live Demo:**
https://smart-resume-scanner-ten.vercel.app/

The deployed application lets you:

* Upload multiple resumes
* Configure a target job description
* Adjust scoring weights
* Screen and rank candidates
* View matched and missing skills
* Compare candidates
* Export screening results
* Use optional Gemini-powered analysis

> For a quick demonstration, use the built-in demo dataset instead of uploading resumes manually.

---

## 🔍 How It Works

TalentScan follows a multi-stage screening pipeline:

```text
Resume Upload
      ↓
Resume Parsing
      ↓
Skill & Experience Extraction
      ↓
Job Requirement Matching
      ↓
Weighted Scoring
      ↓
Candidate Ranking
      ↓
Optional Gemini Analysis
```

---

## 🏗️ Architecture

TalentScan separates deterministic candidate scoring from optional LLM analysis.

```text
┌──────────────────────────────────────────┐
│              Next.js Frontend            │
│                                          │
│ Job Setup │ Upload │ Results │ Compare  │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│                 API Layer                │
│                                          │
│ /api/parse             /api/screen      │
└──────────────┬─────────────────┬─────────┘
               │                 │
               ▼                 ▼
┌──────────────────────┐  ┌─────────────────────┐
│ Resume Processing    │  │ Local Scoring       │
│                      │  │                     │
│ PDF / DOCX / TXT     │  │ Skill Matching      │
│ Text Extraction      │  │ Experience          │
│ Metadata Extraction  │  │ Education           │
└──────────┬───────────┘  │ TF-IDF Similarity  │
           │              └──────────┬──────────┘
           └───────────────┬─────────┘
                           ▼
                ┌─────────────────────┐
                │ Candidate Ranking   │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Optional Gemini     │
                │ Analysis            │
                └─────────────────────┘
```

---

## ⚖️ Candidate Scoring

The final score is calculated using configurable weights:

| Factor            | Default Weight |
| ----------------- | -------------: |
| Technical Skills  |            40% |
| Experience        |            25% |
| Education         |            15% |
| TF-IDF Text Match |            20% |

```text
Final Score =
    Skills Score × Skills Weight
  + Experience Score × Experience Weight
  + Education Score × Education Weight
  + Text Match Score × Text Match Weight
```

The core score is deterministic and does not depend on Gemini.

---

## 🤖 LLM Integration

Gemini is used as an **optional analysis layer**.

The local scoring system handles:

* Skill matching
* Experience scoring
* Education scoring
* TF-IDF similarity
* Candidate ranking

Gemini can provide:

* Candidate summaries
* Strengths and weaknesses
* Contextual candidate analysis
* Targeted interview questions

This separation keeps the core screening workflow functional even when the LLM service is unavailable.

### Example Prompt

```text
You are a recruitment assistant helping evaluate a candidate against a job description.

JOB DESCRIPTION:
{jobDescription}

CANDIDATE RESUME:
{resumeText}

REQUIRED SKILLS:
{requiredSkills}

Provide a concise evaluation containing:

1. Candidate summary
2. Relevant strengths
3. Relevant weaknesses or gaps
4. Important matched skills
5. Important missing skills
6. Overall suitability for the role

Use only information provided in the input.
Do not invent experience, skills, qualifications, or achievements.
```

---

## ✨ Features

* 📄 Batch resume upload
* 📑 PDF, DOCX, and TXT parsing
* 🎯 Job description and role presets
* 🧩 Required skill matching
* ⚖️ Configurable scoring weights
* 📊 Candidate ranking
* 🔎 Candidate search and filtering
* 🟢 Candidate status tracking
* 🧠 Matched and missing skill analysis
* ⚔️ Side-by-side candidate comparison
* 📥 CSV and JSON export
* 🤖 Optional Gemini analysis
* 🧪 Built-in demo dataset
* ⚡ Loading and error states

---

## 🛠️ Technology Stack

### Frontend

* Next.js 14+
* React 18
* TypeScript
* Tailwind CSS

### Resume Processing

* `pdfjs-dist`
* `mammoth`

### Matching & Scoring

* Custom skill extraction
* Skill taxonomy
* TF-IDF
* Cosine similarity
* Weighted scoring

### Visualization

* Recharts

### AI

* Google Gemini API

### Deployment

* Vercel

---

## 🚀 Run Locally

### Prerequisites

* Node.js 18+
* npm

### Clone the Repository

```bash
git clone https://github.com/aniket8305/Smart-Resume-Scanner.git
cd Smart-Resume-Scanner
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Gemini analysis is optional.

Create `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

The core screening and ranking pipeline can operate without the Gemini API.

### Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Production Build

```bash
npm run build
npm run start
```

---

## 🌐 Deployment

The project is already deployed and available at:

**https://smart-resume-scanner-ten.vercel.app/**

### Deploy Your Own Instance

If you want to deploy your own copy:

1. Fork or clone the repository.
2. Import the repository into Vercel.
3. Set the required environment variables.
4. Deploy.

Vercel automatically builds the Next.js application using:

```bash
npm run build
```

If Gemini functionality is enabled, add:

```text
GEMINI_API_KEY
```

to the Vercel project's environment variables.

---

## 📁 Project Structure

```text
Smart-Resume-Scanner/
│
├── app/
│   ├── api/
│   │   ├── parse/
│   │   │   └── route.ts
│   │   └── screen/
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/
│   ├── CandidateDetailModal.tsx
│   ├── CandidateTable.tsx
│   ├── CompareModal.tsx
│   ├── HeroStats.tsx
│   ├── JobDescriptionCard.tsx
│   ├── Navbar.tsx
│   ├── ResumeUploader.tsx
│   └── WeightingControls.tsx
│
├── data/
│   ├── sampleJobs.ts
│   ├── sampleResumes.ts
│   └── skillsTaxonomy.ts
│
├── lib/
│   ├── exportUtils.ts
│   ├── geminiService.ts
│   ├── nlpEngine.ts
│   ├── resumeParser.ts
│   └── scoring.ts
│
├── types/
│   └── index.ts
│
├── APPROACH.md
├── README.md
└── package.json
```

---

## 🧪 Demo Flow

For a quick demonstration:

```text
1. Open the Live Demo
2. Select a job role
3. Review the required skills
4. Load the demo dataset
5. Run screening
6. Review candidate rankings
7. Inspect individual candidate scores
8. Compare candidates
9. Export the results
10. Optionally generate Gemini analysis
```

---

## 📌 Design Decisions

### Why local scoring?

The core ranking needs to be:

* Fast
* Reproducible
* Explainable
* Available without an external API

TF-IDF, skill matching, and deterministic scoring provide these properties.

### Why use an LLM?

LLMs are useful for contextual language tasks such as candidate summaries and interview-question generation.

The LLM therefore complements the scoring engine rather than replacing it.

### Why separate scoring and AI analysis?

Separating the two makes the system easier to understand and debug.

The numerical score comes from known calculations, while the LLM provides additional qualitative context.

---

## 📄 Evaluation Requirements

The project focuses on:

* Clean and modular code
* Working deployed application
* Basic error handling
* Loading states
* Responsive UI
* Clear documentation
* Reproducible candidate scoring
* Optional AI integration

---

## 📜 License

MIT License © 2026 TalentScan
