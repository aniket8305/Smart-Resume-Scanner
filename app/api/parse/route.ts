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

  // Must have at least 60 characters and 10 words
  if (trimmed.length < 60) return false;
  const words = trimmed.split(/\s+/).filter((w) => w.length > 0);
  if (words.length < 10) return false;

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

  // If text starts with %PDF or has multiple raw PDF syntax markers, it's raw stream leak
  if (lower.startsWith("%pdf-") || binaryMarkerCount >= 3) {
    return false;
  }

  // Check alphanumeric density (readable English text has > 50% letters/numbers)
  const alphaNumericMatches = trimmed.match(/[a-zA-Z0-9]/g);
  const alphaNumericCount = alphaNumericMatches ? alphaNumericMatches.length : 0;
  const ratio = alphaNumericCount / trimmed.length;
  if (ratio < 0.45) {
    return false;
  }

  return true;
}

/**
 * Extracts plain text from binary PDF data using pdfjs-dist with layout reconstruction
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
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

        // Line break on noticeable vertical coordinate shift
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
    console.warn("Digital PDF extraction failed:", error);
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
 * Performs OCR and text extraction using Gemini Multimodal Vision
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

    const text = result.response.text();
    return text.trim();
  } catch (error: any) {
    console.error("Gemini Vision OCR error:", error);
    throw new Error(`Gemini OCR failed: ${error.message || "Unknown error"}`);
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

    // 1. Image Files (Directly use Vision OCR)
    if (["png", "jpg", "jpeg", "webp"].includes(extension)) {
      if (!apiKey) {
        return NextResponse.json(
          {
            error:
              "Image-based resume uploaded. Please provide a Google Gemini API Key in the settings for Vision OCR.",
            requiresApiKey: true,
          },
          { status: 422 }
        );
      }
      const mimeType = extension === "png" ? "image/png" : extension === "webp" ? "image/webp" : "image/jpeg";
      extractedText = await extractWithGeminiVisionOCR(buffer, mimeType, apiKey);
      extractionMethod = "gemini-vision-ocr";
    }
    // 2. PDF Files
    else if (extension === "pdf") {
      // Step 2a: Try digital PDF extraction first
      extractedText = await extractTextFromPDF(buffer);
      extractionMethod = "pdf-digital";

      // Step 2b: If text is insufficient, corrupted, or scanned, fallback to Gemini Vision OCR
      if (!isValidResumeText(extractedText)) {
        console.log(`[PDF Parse] Digital extraction returned insufficient text (${extractedText.length} chars). Attempting Vision OCR...`);
        if (apiKey) {
          extractedText = await extractWithGeminiVisionOCR(buffer, "application/pdf", apiKey);
          extractionMethod = "gemini-vision-ocr";
        } else {
          // If digital text was somewhat present but short, only fail if completely empty
          if (!extractedText || extractedText.trim().length === 0) {
            return NextResponse.json(
              {
                error:
                  "This PDF appears to be scanned or image-based with no embedded text. Please enter your Gemini API Key in the settings (top navigation bar) to enable AI Vision OCR, or upload a digital PDF/Word document.",
                requiresApiKey: true,
              },
              { status: 422 }
            );
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
        { error: "Parsed document was empty. Please check the file contents." },
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

