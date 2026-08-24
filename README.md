# TalentScan — Resume Screening & Candidate Ranking

A clean, explainable resume screening system built with Next.js, TypeScript, and Tailwind CSS that matches candidate resumes against job descriptions using TF-IDF text similarity, skill extraction, and customizable scoring weights.

---

## 🔍 How Screening Works

1. **Upload Resumes**: Parses PDF (`pdfjs-dist`), Word (`mammoth`), or plain text files.
2. **Extract Information**: Matches terms against a 500+ skill taxonomy dictionary and extracts experience years and qualifications.
3. **Compare Against Job**: Evaluates candidate profile against target job requirements.
4. **Calculate Score**: Computes a weighted score based on configured priorities:
   - **Technical Skills (40%)**: Required skill match ratio.
   - **Experience (25%)**: Candidate years vs minimum requirement.
   - **Education (15%)**: Qualification level.
   - **TF-IDF Text Match (20%)**: Word vector cosine similarity.
5. **Rank Candidates**: Sorts candidates with clear breakdowns of matched and missing skills.

---

## 🛠️ Built With

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Document Parsing**: `pdfjs-dist` (PDF), `mammoth` (DOCX)
- **Text Matching**: TF-IDF vectorizer + Cosine Similarity + Skill Taxonomy Dictionary
- **Visualization**: Recharts (Radar charts & score bars)
- **AI (Optional)**: Google Gemini API (if user supplies an API key)
- **Deployment**: Vercel

---

## 🚀 Local Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Features

- **Document Parsing**: Direct upload for PDF, Word (.docx), and TXT files.
- **Demo Dataset**: 1-click loading of sample resumes to test the pipeline.
- **Scoring Customization**: Live sliders to adjust weighting factors.
- **Detailed Breakdowns**: Transparent scores showing why each candidate received their rating.
- **Candidate Comparison**: Side-by-side comparison for up to 3 candidates.
- **Exporting**: Download results as CSV or JSON.

---

## 📄 License
MIT License © 2026 TalentScan
