# Approach & Technical Architecture

### Problem & Solution
Screening hundreds of resumes manually is repetitive and prone to inconsistent evaluation criteria. **TalentScan** automates this by providing a structured, explainable resume screening pipeline that matches candidates against specific job requirements using deterministic text processing and transparent scoring weights.

### Engineering Pipeline
1. **Document Ingestion & Text Extraction**:
   - Parses uploaded PDF (`pdfjs-dist`), Word DOCX (`mammoth`), or TXT resumes into clean plain text.
2. **Information Extraction**:
   - Matches candidate skills against a taxonomy dictionary of 500+ technical skills.
   - Extracts estimated years of professional experience and degree levels using pattern recognition.
3. **Scoring & Similarity**:
   - Applies a weighted scoring formula: **Technical Skills (40%)**, **Experience Seniority (25%)**, **Education Level (15%)**, and **TF-IDF Text Similarity (20%)**.
   - TF-IDF calculates the cosine similarity between the job description and candidate resume word vectors.
4. **Ranking & Insights**:
   - Generates candidate rankings with explicit matched vs. missing skill lists and gap analysis.
   - Optional integration with Google Gemini API for qualitative interview question generation.
