# 🎯 TalentScan — Resume Screening & Candidate Ranking

A resume screening application that helps compare candidates against a target job description using **skill matching, experience evaluation, education matching, and TF-IDF text similarity**, with optional LLM-assisted candidate analysis.

Built with **Next.js, TypeScript, and Tailwind CSS**, TalentScan focuses on making candidate evaluation **configurable, explainable, and practical**.

---

## 🔍 How It Works

TalentScan follows a multi-stage screening pipeline:

```text
                    ┌─────────────────────┐
                    │   Job Description   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Requirement         │
                    │ Extraction          │
                    └──────────┬──────────┘
                               │
                               │
┌───────────────┐              │
│ Resume Upload │              │
└───────┬───────┘              │
        │                      │
        ▼                      ▼
┌──────────────────────────────────────┐
│          Resume Processing            │
│                                      │
│  PDF / DOCX / TXT → Extracted Text  │
└───────────────────┬──────────────────┘
                    │
                    ▼
          ┌─────────────────────┐
          │ Candidate Extraction│
          │                     │
          │ Skills              │
          │ Experience          │
          │ Education           │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Local Matching      │
          │                     │
          │ Skill Matching      │
          │ TF-IDF Similarity   │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │ Weighted Scoring    │
          │                     │
          │ Skills      40%     │
          │ Experience  25%     │
          │ Education   15%     │
          │ Text Match  20%     │
          └──────────┬──────────┘
                     │
                     ├─────────────────────┐
                     │                     │
                     ▼                     ▼
          ┌──────────────────┐   ┌──────────────────┐
          │ Candidate Ranking│   │ Gemini Analysis  │
          │                  │   │   (Optional)     │
          └────────┬─────────┘   └────────┬─────────┘
                   │                      │
                   └──────────┬───────────┘
                              ▼
                   ┌─────────────────────┐
                   │ Candidate Results   │
                   │                     │
                   │ Score               │
                   │ Matched Skills      │
                   │ Missing Skills      │
                   │ AI Summary          │
                   └─────────────────────┘
```

---

# 🏗️ Architecture

TalentScan is structured into separate layers so that resume processing, scoring, and AI analysis are not tightly coupled.

```text
┌──────────────────────────────────────────────────────┐
│                    Next.js Frontend                   │
│                                                      │
│  Job Setup │ Resume Upload │ Results │ Comparison   │
└──────────────────────────┬───────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────┐
│                    API Layer                          │
│                                                      │
│  /api/parse                 /api/screen              │
│  Resume processing          Candidate screening      │
└───────────────┬──────────────────────────┬───────────┘
                │                          │
                ▼                          ▼
┌─────────────────────────┐    ┌───────────────────────┐
│   Resume Processing     │    │   Scoring Pipeline    │
│                         │    │                       │
│ PDF / DOCX / TXT        │    │ Skill matching        │
│ Text extraction         │    │ Experience scoring    │
│ Metadata extraction     │    │ Education scoring     │
└────────────┬────────────┘    │ TF-IDF similarity     │
             │                 └───────────┬───────────┘
             │                             │
             └──────────────┬──────────────┘
                            ▼
                  ┌─────────────────────┐
                  │ Candidate Results   │
                  └──────────┬──────────┘
                             │
                             ▼
                  ┌─────────────────────┐
                  │ Optional Gemini API │
                  │                     │
                  │ Summary             │
                  │ Strengths           │
                  │ Weaknesses          │
                  │ Contextual analysis │
                  └─────────────────────┘
```

---

## 🧩 Architecture Components

### Frontend

The frontend is responsible for:

* Job description configuration
* Resume uploads
* Scoring weight controls
* Candidate leaderboard
* Search and filtering
* Candidate details
* Candidate comparison
* Export controls

Built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Recharts

---

### Resume Processing

Uploaded resumes are processed server-side.

```text
PDF ───────┐
           │
DOCX ──────┼──→ Text Extraction ──→ Normalized Resume Text
           │
TXT ───────┘
```

The extracted text is then used to identify relevant candidate information such as:

* Name
* Email
* Phone
* LinkedIn
* GitHub
* Skills
* Experience
* Education

---

### Local Matching Engine

The core screening functionality does **not depend on an external LLM**.

Skill matching uses a local skill taxonomy and normalized text matching.

For text similarity, TalentScan uses:

```text
Resume Text
     +
Job Description
     ↓
Tokenization
     ↓
TF-IDF Vectorization
     ↓
Cosine Similarity
     ↓
Text Match Score
```

This keeps the core ranking:

* Fast
* Deterministic
* Explainable
* Independent of API availability

---

# ⚖️ Candidate Scoring

The final candidate score is calculated using configurable weights.

```text
Final Score =
    (Skills Score × Skills Weight)
  + (Experience Score × Experience Weight)
  + (Education Score × Education Weight)
  + (Text Match Score × Text Match Weight)
```

Default configuration:

| Factor            | Weight |
| ----------------- | -----: |
| Technical Skills  |    40% |
| Experience        |    25% |
| Education         |    15% |
| TF-IDF Text Match |    20% |

The weights can be changed from the UI.

The ranking is recalculated using the updated weights, allowing the recruiter to control which factors matter most for a particular role.

---

# 🤖 LLM Integration

Gemini is treated as an **optional analysis layer**, rather than the source of truth for the candidate's numerical score.

This distinction is intentional.

### Deterministic Layer

The local system handles:

* Skill matching
* Experience scoring
* Education scoring
* TF-IDF similarity
* Final numerical score
* Candidate ranking

### LLM Layer

Gemini handles tasks where contextual language understanding is useful:

* Candidate summaries
* Strength identification
* Weakness identification
* Contextual candidate/job comparison
* Interview question generation

This means the application can still perform its core screening workflow if the Gemini API is unavailable.

---

# 🧠 LLM Prompt Design

The LLM prompts are designed to provide **structured analysis rather than allowing the model to control the core ranking algorithm**.

The application provides the model with the relevant job requirements and candidate information and asks for concise, evidence-based output.

---

## 1. Candidate Analysis Prompt

The candidate's resume and target job are provided as context.

```text
You are a recruitment assistant helping evaluate a candidate against a job description.

Analyze the candidate using ONLY the information provided.

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

Do not invent experience, skills, qualifications, or achievements that
are not present in the provided information.

Keep the response concise and factual.
```

---

## 2. Candidate Summary Prompt

Used when a short recruiter-friendly summary is needed.

```text
Summarize this candidate for a recruiter.

JOB:
{jobDescription}

CANDIDATE:
{resumeText}

Write a short summary covering:

- Relevant experience
- Most important matching skills
- Major gaps
- Overall relevance to the role

Use only information present in the candidate data.

Do not mention information that cannot be verified from the input.
Keep the summary under 100 words.
```

---

## 3. Interview Question Prompt

Interview questions can be generated from the candidate's background and the job requirements.

```text
Generate technical interview questions for the following candidate.

JOB DESCRIPTION:
{jobDescription}

CANDIDATE RESUME:
{resumeText}

RELEVANT SKILLS:
{matchedSkills}

MISSING OR WEAKER SKILLS:
{missingSkills}

Generate 5 questions that help evaluate whether the candidate
actually has the experience represented in the resume.

Prioritize:
- Practical experience
- Role-specific technical knowledge
- Technologies listed in the resume
- Areas where the candidate may have skill gaps

Do not ask questions about technologies or experience that are not
relevant to the provided job or resume.
```

---

# 🔐 LLM Safety & Reliability

The LLM is not trusted with the core numerical ranking.

For example:

```text
                Candidate
                    │
                    ▼
          ┌──────────────────┐
          │ Local Scoring    │
          │ Engine           │
          └────────┬─────────┘
                   │
                   ▼
             Final Score
                   │
                   │
          ┌────────▼─────────┐
          │ Optional Gemini  │
          │ Analysis         │
          └──────────────────┘
```

This prevents an LLM response from unexpectedly changing the deterministic candidate ranking.

Prompts also instruct the model to:

* Use only supplied information
* Avoid inventing qualifications
* Avoid inventing experience
* Keep responses concise
* Focus on evidence from the resume

If the Gemini service fails, the local screening results remain available.

---

# 📊 Explainable Results

Instead of presenting only one AI-generated score, TalentScan exposes the components behind the ranking.

Example:

```text
Overall Score: 87%

Technical Skills     92%
Experience            85%
Education             80%
Text Match            88%

Matched Skills
✓ React
✓ TypeScript
✓ Node.js
✓ PostgreSQL

Missing Skills
× Kubernetes
× GraphQL
```

This allows the recruiter to understand **why** a candidate ranked highly or poorly.

---

# 📄 Supported Resume Formats

TalentScan currently supports:

* `.pdf`
* `.docx`
* `.txt`

The application validates uploaded files and handles parsing failures without stopping the rest of the screening workflow.

---

# ✨ Main Features

* Batch resume upload
* PDF, DOCX, and TXT parsing
* Job description input
* Role presets
* Required skill matching
* Skill gap analysis
* Configurable scoring weights
* TF-IDF text similarity
* Candidate ranking
* Candidate search and filtering
* Candidate status tracking
* Side-by-side candidate comparison
* CSV export
* JSON export
* Optional Gemini-powered candidate analysis
* Demo dataset for testing
* Loading and error states

---

# 🛠️ Technology Stack

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

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* npm

## Installation

```bash
git clone https://github.com/aniket8305/Smart-Resume-Scanner.git
cd Smart-Resume-Scanner
npm install
```

## Environment Variables

Gemini analysis is optional.

Create `.env.local`:

```env
GEMINI_API_KEY=your_api_key_here
```

The core screening pipeline can operate without the Gemini API.

## Development

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

---

# 📁 Project Structure

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

# 🌐 Deployment

TalentScan can be deployed using Vercel.

1. Push the repository to GitHub.
2. Import the repository into Vercel.
3. Add `GEMINI_API_KEY` as an environment variable if Gemini analysis is enabled.
4. Deploy.

Build command:

```bash
npm run build
```

---

# 🧪 Testing the Application

The application includes a demo dataset so the screening pipeline can be tested without manually uploading resumes.

Recommended demo flow:

```text
1. Select a job role
2. Review/edit required skills
3. Load the demo dataset
4. Run screening
5. Review candidate rankings
6. Inspect score breakdowns
7. Compare candidates
8. Export results
9. Optionally generate AI analysis
```

---

# 📌 Design Decisions

### Why local scoring?

The core ranking needs to be:

* Fast
* Reproducible
* Explainable
* Available without an API dependency

TF-IDF and deterministic scoring provide these properties.

### Why use an LLM?

LLMs are useful for contextual language tasks that are harder to express through fixed rules, such as summarizing a candidate or generating targeted interview questions.

The LLM therefore complements the scoring engine rather than replacing it.

### Why separate scoring and AI analysis?

Separating the two makes the system easier to debug and explain.

The numerical score comes from known calculations, while the LLM provides additional qualitative context.

---

# 📄 Evaluation Requirements

The project focuses on the core requirements expected from a practical screening application:

* Clean and modular code
* Working deployed application
* Basic error handling
* Loading states
* Responsive user experience
* Clear documentation
* Reproducible candidate scoring
* Optional AI integration

---
