# 🎯 TalentScan — Resume Screening & Candidate Ranking

A resume screening application that helps compare candidates against a target job description using **skill matching, experience evaluation, education matching, and TF-IDF text similarity**.

Built with Next.js, TypeScript, and Tailwind CSS, TalentScan focuses on making candidate rankings **simple, configurable, and explainable**.

---

## 🔍 How It Works

TalentScan follows a straightforward screening pipeline:

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
```

### 1. Upload Resumes

Upload multiple resumes in:

* PDF
* DOCX
* TXT

Resume text and relevant candidate information are extracted automatically.

### 2. Extract Candidate Information

The application identifies:

* Technical skills
* Years of experience
* Education / qualifications
* Relevant resume text

Skills are matched against a built-in technology and domain skill taxonomy.

### 3. Compare Against the Job

Candidates are evaluated against the selected job description and its required skills.

You can also customize the target role and add required skills manually.

### 4. Calculate the Score

Each candidate receives a weighted score based on four factors:

| Factor           | Weight | Description                                                 |
| ---------------- | -----: | ----------------------------------------------------------- |
| Technical Skills |    40% | Required skill match                                        |
| Experience       |    25% | Candidate experience vs. job requirement                    |
| Education        |    15% | Qualification match                                         |
| Text Match       |    20% | TF-IDF cosine similarity between resume and job description |

The weights can be adjusted through the scoring controls.

### 5. Rank Candidates

Candidates are ranked based on their final score, with the evaluation broken down into individual factors so the result is easier to understand.

---

## ✨ Features

### 📄 Resume Processing

* Batch upload multiple resumes
* PDF, DOCX, and TXT support
* Automatic resume text extraction
* Candidate information extraction
* Built-in skill matching

### 🎯 Job Matching

* Predefined role presets
* Custom job descriptions
* Required skill extraction
* Manual skill addition
* Minimum experience requirement

### ⚖️ Customizable Scoring

Adjust the importance of:

* Technical Skills
* Experience
* Education
* Text Similarity

The candidate ranking updates according to the configured weights.

### 📊 Explainable Candidate Scores

Candidate results include:

* Overall score
* Individual scoring components
* Matched skills
* Missing skills
* Experience information
* Candidate status

This makes it possible to see **why a candidate received their ranking** instead of relying on a single unexplained score.

### 👥 Candidate Management

* Search candidates
* Filter by screening status
* Shortlist candidates
* Track review/interview status
* Compare up to 3 candidates side-by-side

### 📥 Export

Export screening results as:

* CSV
* JSON

### 🧪 Demo Dataset

A built-in demo dataset allows the screening pipeline to be tested without uploading resumes manually.

---

## 🛠️ Technology Stack

### Frontend

* **Next.js 14** — App Router
* **React 18**
* **TypeScript**
* **Tailwind CSS**

### Resume Processing

* **pdfjs-dist** — PDF text extraction
* **mammoth** — DOCX text extraction

### Matching & Scoring

* Custom skill extraction
* 500+ skill taxonomy
* TF-IDF vectorization
* Cosine similarity
* Weighted candidate scoring

### Visualization

* **Recharts** — candidate score visualization and comparison

### Optional AI

* **Google Gemini API**

Gemini can be used for additional qualitative candidate analysis, while the core screening and scoring pipeline can operate locally.

### Deployment

* **Vercel**

---

## 🚀 Getting Started

### Prerequisites

* Node.js 18+
* npm

### 1. Clone the Repository

```bash
git clone https://github.com/aniket8305/Smart-Resume-Scanner.git
cd Smart-Resume-Scanner
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

If using the optional Gemini functionality, create a `.env.local` file and add your API key:

```env
GEMINI_API_KEY=your_api_key_here
```

The core resume screening pipeline does not depend on Gemini.

### 4. Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### 5. Create a Production Build

```bash
npm run build
npm run start
```

---

## 📁 Project Structure

```text
Smart-Resume-Scanner/
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

## 🧠 Scoring Approach

The screening score is calculated using a weighted combination of four factors:

```text
Final Score =
    Skills Score × Skills Weight
  + Experience Score × Experience Weight
  + Education Score × Education Weight
  + Text Similarity × Text Match Weight
```

### Technical Skills — 40%

Measures how many of the required job skills are present in the candidate's resume.

### Experience — 25%

Compares the candidate's extracted experience against the minimum experience specified for the role.

### Education — 15%

Evaluates the candidate's qualification against the role requirements.

### TF-IDF Text Match — 20%

The resume and job description are converted into TF-IDF vectors and compared using cosine similarity.

This provides a local text-similarity signal without requiring an external AI service.

---

## 🤖 Optional Gemini Analysis

Gemini is used as an optional enhancement rather than as the core scoring mechanism.

The deterministic scoring pipeline handles:

* Skill matching
* Experience scoring
* Education scoring
* TF-IDF similarity
* Candidate ranking

Gemini can provide additional contextual analysis where useful.

If the AI service is unavailable, the core screening functionality can still operate using the local evaluation pipeline.

---

## ⚠️ Error Handling & UX

The application includes basic handling for common screening issues, including:

* Invalid file types
* Resume parsing failures
* Empty inputs
* API failures
* Loading states during resume processing and screening

The goal is to keep the screening workflow usable even when an individual resume or optional AI request fails.

---

## 🌐 Deployment

The application can be deployed directly to Vercel.

### Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure `GEMINI_API_KEY` if optional Gemini functionality is required.
4. Deploy.

Build command:

```bash
npm run build
```

---

## 📌 Project Goals

TalentScan was built to explore how a practical resume screening workflow can combine:

* Traditional text processing
* Skill extraction
* TF-IDF similarity
* Weighted scoring
* Optional generative AI

The main focus is **transparent candidate evaluation rather than treating AI as a black box**.

---

## 📄 License

MIT License © 2026 TalentScan
