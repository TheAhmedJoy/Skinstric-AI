import { analyzeImage } from "../_lib/analyzeImage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Verbatim expert-dermatologist prompt requested for the Weather feature.
const WEATHER_PROMPT =
  "You are an expert dermatologist. Analyze the provided photo and assess the person's skin weathering. Identify visible signs of sun damage, photoaging, UV-induced pigmentation, and wind or cold exposure. Note any oxidative stress or pollution-related dullness and uneven tone. Evaluate whether the skin is aging ahead of, in line with, or behind the expected rate. Flag any texture changes or dehydration patterns attributable to environmental exposure. Note any limitations from lighting or image quality. Write directly to the user in a professional but approachable tone."

// Free-form analysis — no severity ratings. Structured into a small set of
// labeled fields so the UI can render the assessment as cards consistent with
// the rest of the app.
const JSON_FORMAT_INSTRUCTION = `

Return ONLY a single JSON object (no markdown, no commentary) with exactly this shape:
{
  "summary": string,            // one or two sentences summarizing overall weathering
  "sunDamage": string,          // sun damage, photoaging, UV-induced pigmentation
  "environmentalExposure": string, // wind, cold, or other environmental exposure signs
  "pollution": string,          // oxidative stress / pollution-related dullness or uneven tone
  "agingRate": string,          // whether the skin is aging ahead of, in line with, or behind the expected rate, and why
  "textureChanges": string,     // texture changes or dehydration patterns attributable to environment
  "limitations": string         // any lighting/image-quality limitations, or "" if none
}

Write each field directly to the user in a professional but approachable tone. Use complete sentences. Do NOT include numeric ratings or severity scores.`

export async function POST(request: Request) {
  return analyzeImage(request, {
    prompt: WEATHER_PROMPT,
    jsonInstruction: JSON_FORMAT_INSTRUCTION,
  })
}
