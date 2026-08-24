import { NextRequest, NextResponse } from "next/server";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Extracts plain text from binary PDF data using pdfjs-dist
 */
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // Dynamic import to avoid SSR build bundling issues
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.js");
    
    // Disable worker for serverless/node environment
    const data = new Uint8Array(buffer);
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = "";
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || "")
        .join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("PDF Parsing error:", error);
    // Fallback: decode raw ASCII strings if pdfjs-dist fails on legacy stream
    const rawString = buffer.toString("utf-8");
    const extractedWords = rawString
      .replace(/[^\x20-\x7E\n]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (extractedWords.length > 50) {
      return extractedWords;
    }
    throw new Error("Unable to parse PDF content.");
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

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = fileName.split(".").pop()?.toLowerCase();

    let extractedText = "";

    if (extension === "pdf") {
      extractedText = await extractTextFromPDF(buffer);
    } else if (extension === "docx") {
      extractedText = await extractTextFromDocx(buffer);
    } else if (extension === "txt" || extension === "md") {
      extractedText = buffer.toString("utf-8");
    } else {
      return NextResponse.json(
        { error: `Unsupported file format: .${extension}. Please upload PDF, DOCX, or TXT.` },
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
    });
  } catch (error: any) {
    console.error("Parse API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to parse document" },
      { status: 500 }
    );
  }
}
