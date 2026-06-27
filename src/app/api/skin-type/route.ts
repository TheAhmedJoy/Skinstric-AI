import { analyzeImage } from "../_lib/analyzeImage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Verbatim expert-dermatologist prompt requested for the Skin Type Details feature.
const SKIN_TYPE_PROMPT =
  "You are an expert dermatologist. Analyze the provided photo and assess the person's skin type (oily, dry, combination, normal, or sensitive). Describe the visible characteristics supporting that classification, note any differences across facial zones, distinguish between dehydration and dryness, evaluate pore appearance, and flag any barrier function concerns. Note any limitations from lighting or image quality. Write directly to the user in a professional but approachable tone."

// Free-form analysis — no severity ratings. Structured into a small set of
// labeled fields so the UI can render the assessment as cards consistent with
// the rest of the app.
const JSON_FORMAT_INSTRUCTION = `

Return ONLY a single JSON object (no markdown, no commentary) with exactly this shape:
{
  "skinType": string,           // one of: oily, dry, combination, normal, sensitive
  "characteristics": string,    // visible characteristics supporting the classification
  "zoneDifferences": string,    // differences observed across facial zones (T-zone, cheeks, etc.)
  "hydration": string,          // distinguish dehydration vs dryness as it appears
  "pores": string,              // pore appearance and distribution
  "barrierConcerns": string,    // any barrier function concerns, or note that none were visible
  "limitations": string         // any lighting/image-quality limitations, or "" if none
}

Write each field directly to the user in a professional but approachable tone. Use complete sentences. Do NOT include numeric ratings or severity scores.`

export async function POST(request: Request) {
  return analyzeImage(request, {
    prompt: SKIN_TYPE_PROMPT,
    jsonInstruction: JSON_FORMAT_INSTRUCTION,
  })
}
