import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Validates whether the extracted string resembles real readable resume text
 * rather than unreadable garbage, binary PDF stream leaks, or empty whitespace.
 */
function isValidResumeText(text: string): boolean {
  if (!text || typeof text !== "string") return false;
  const trimmed = text.trim();

  // Must have at least 40 characters and 8 words
  if (trimmed.length < 40) return false;
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 8) return false;

  // Check for raw binary PDF stream markers
  const pdfBinaryMarkers = [
    "%pdf-",
    "/filter",
    "/flatedecode",
    "/type /catalog",
    "/type /pages",
    "endobj",
    "xref",
    "trailer",
    "/font",
    "/mediabox",
  ];
  const lower = trimmed.toLowerCase();
  let binaryMarkerCount = 0;
  for (const marker of pdfBinaryMarkers) {
    if (lower.includes(marker)) {
      binaryMarkerCount++;
    }
  }

  if (lower.startsWith("%pdf-") || binaryMarkerCount >= 3) {
    return false;
  }

  // Check alphanumeric density
  const alphaNumericMatches = trimmed.match(/[a-zA-Z0-9]/g);
  const alphaNumericCount = alphaNumericMatches ? alphaNumericMatches.length : 0;
  const ratio = alphaNumericCount / trimmed.length;
  if (ratio < 0.4) {
    return false;
  }

  return true;
}

/**
 * Extracts plain text from binary PDF data using pdf-parse (pure Node native extractor)
 */
async function extractWithPdfParse(buffer: Buffer): Promise<string> {
  try {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const data = await parser.getText();
    await parser.destroy();
    return (data.text || "").trim();
  } catch (error) {
    console.warn("pdf-parse extraction failed:", error);
    return "";
  }
}

/**
 * Fallback digital PDF extraction using pdfjs-dist
 */
async function extractWithPdfJs(buffer: Buffer): Promise<string> {
  try {
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");

    const data = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({
      data,
      disableFontFace: true,
      isEvalSupported: false,
      useSystemFonts: true,
    });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      let pageText = "";
      let lastY: number | null = null;

      for (const item of textContent.items as any[]) {
        if (!item.str && !item.hasEOL) continue;

        const currentY = item.transform ? item.transform[5] : null;

        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 6) {
          pageText += "\n";
        } else if (
          pageText.length > 0 &&
          !pageText.endsWith("\n") &&
          !pageText.endsWith(" ") &&
          item.str &&
          !item.str.startsWith(" ")
        ) {
          pageText += " ";
        }

        if (item.str) {
          pageText += item.str;
        }

        if (item.hasEOL) {
          pageText += "\n";
        }

        if (currentY !== null) {
          lastY = currentY;
        }
      }

      fullText += pageText.trim() + "\n\n";
    }

    return fullText.trim();
  } catch (error) {
    console.warn("pdfjs extraction failed:", error);
    return "";
  }
}

/**
 * Extracts plain text from DOCX using mammoth
 */
async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value.trim();
  } catch (error) {
    console.error("DOCX Parsing error:", error);
    throw new Error("Unable to parse Word (.docx) document.");
  }
}

/**
 * Free 100% offline OCR using Tesseract.js (Zero API key needed)
 */
async function extractWithTesseractOCR(buffer: Buffer): Promise<string> {
  try {
    const { createWorker } = await import("tesseract.js");
    const worker = await createWorker("eng");
    const ret = await worker.recognize(buffer);
    await worker.terminate();
    return (ret.data.text || "").trim();
  } catch (error) {
    console.error("Tesseract OCR error:", error);
    return "";
  }
}

/**
 * Performs OCR and text extraction using Gemini Multimodal Vision (when API key is present)
 */
async function extractWithGeminiVisionOCR(
  buffer: Buffer,
  mimeType: string,
  apiKey: string
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const base64Data = buffer.toString("base64");
    const prompt = `You are a high-precision OCR and document intelligence engine specializing in resumes and CVs.
Extract the entire text content from this document with 100% fidelity.
Guidelines:
- Extract all text, preserving section headers (Contact, Summary, Experience, Education, Skills, Projects, Certifications).
- Maintain chronological work history, company names, job titles, dates, and bullet points.
- Extract all technical skills, programming languages, tools, frameworks, and proficiencies.
- Do NOT summarize or omit anything.
- Return ONLY the extracted plain text without adding commentary, markdown code blocks, or extra notes.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType,
        },
      },
    ]);

    return result.response.text().trim();
  } catch (error: any) {
    console.warn("Gemini Vision OCR fallback warning:", error.message);
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const apiKeyFromForm = (formData.get("apiKey") as string) || "";
    const apiKeyFromHeader = req.headers.get("x-gemini-api-key") || "";
    const apiKey = apiKeyFromForm || apiKeyFromHeader || process.env.GEMINI_API_KEY || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = fileName.split(".").pop()?.toLowerCase() || "";

    let extractedText = "";
    let extractionMethod = "direct";

    // 1. Image Files (PNG, JPG, JPEG, WEBP)
    if (["png", "jpg", "jpeg", "webp"].includes(extension)) {
      const mimeType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";

      // Try Gemini OCR if key available, else Tesseract.js free OCR
      if (apiKey) {
        extractedText = await extractWithGeminiVisionOCR(buffer, mimeType, apiKey);
        if (extractedText) extractionMethod = "gemini-vision-ocr";
      }

      if (!extractedText) {
        extractedText = await extractWithTesseractOCR(buffer);
        extractionMethod = "tesseract-offline-ocr";
      }
    }
    // 2. PDF Files
    else if (extension === "pdf") {
      // Step 2a: Try pdf-parse first
      extractedText = await extractWithPdfParse(buffer);
      extractionMethod = "pdf-parse";

      // Step 2b: If pdf-parse returned insufficient text, try pdfjs-dist
      if (!isValidResumeText(extractedText)) {
        const altText = await extractWithPdfJs(buffer);
        if (isValidResumeText(altText)) {
          extractedText = altText;
          extractionMethod = "pdfjs-dist";
        }
      }

      // Step 2c: If digital text is still invalid or empty (scanned PDF), apply OCR
      if (!isValidResumeText(extractedText)) {
        console.log(`[PDF Parse] Scanned/empty PDF detected. Running OCR for ${fileName}...`);

        // Try Gemini Vision OCR first if user configured an API key
        if (apiKey) {
          const geminiText = await extractWithGeminiVisionOCR(buffer, "application/pdf", apiKey);
          if (isValidResumeText(geminiText)) {
            extractedText = geminiText;
            extractionMethod = "gemini-vision-ocr";
          }
        }

        // If no API key or Gemini failed, run free offline Tesseract OCR
        if (!isValidResumeText(extractedText)) {
          const tesseractText = await extractWithTesseractOCR(buffer);
          if (tesseractText && tesseractText.trim().length > 0) {
            extractedText = tesseractText;
            extractionMethod = "tesseract-offline-ocr";
          }
        }
      }
    }
    // 3. Word (.docx) Files
    else if (extension === "docx") {
      extractedText = await extractTextFromDocx(buffer);
      extractionMethod = "docx-parser";
    }
    // 4. Plain Text / Markdown / JSON
    else if (extension === "txt" || extension === "md" || extension === "json") {
      extractedText = buffer.toString("utf-8");
      extractionMethod = "plain-text";
    } else {
      return NextResponse.json(
        {
          error: `Unsupported file format: .${extension}. Please upload PDF, Word (.docx), TXT, or image resumes.`,
        },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          error: `Could not extract readable text from ${fileName}. Please ensure the file is not empty or password protected.`,
        },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      fileName,
      text: extractedText,
      extractionMethod,
    });
  } catch (error: any) {
    console.error("Parse API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse document" },
      { status: 500 }
    );
  }
}


