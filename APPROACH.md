# Approach & Technical Architecture Write-Up

### Problem-Solving Approach
Recruiters waste hundreds of hours manually filtering resumes against dense job descriptions, often suffering from keyword bias and inconsistent scoring. To solve this, **TalentScan AI** implements a **hybrid dual-tier screening architecture** designed for high throughput, strict accuracy, and deterministic evaluation:

1. **Deterministic Local NLP & Ontology Engine (Zero-Latency, Free)**: 
   - Uses a 500+ entity taxonomy dictionary with fuzzy alias matching to accurately extract technical stacks, experience duration, education levels, and contact metadata.
   - Computes multi-criteria weighted scoring (Technical Skills 40%, Experience 25%, Education 15%, and TF-IDF Cosine Similarity 20%).
   - Generates deterministic gap analysis, strength breakdowns, and candidate-specific interview questions with zero external dependencies.

2. **Qualitative LLM Layer (Optional Gemini 1.5 Flash)**:
   - When configured, provides deep qualitative semantic reasoning, evaluating project complexity, leadership trajectory, and nuanced edge cases, with automated fallback to the local NLP engine on rate limits or errors.

3. **Recruiter-Centric UX**:
   - Features 1-click test drives with preloaded realistic candidates, batch PDF/Word parsing, dynamic scoring weight sliders, radar chart visualizations, and instant CSV/JSON exports.
