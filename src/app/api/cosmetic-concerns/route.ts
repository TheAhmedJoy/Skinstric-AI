import { analyzeImage } from "../_lib/analyzeImage"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Verbatim expert-dermatologist prompt requested for the Cosmetic Concerns feature.
const DERMATOLOGIST_PROMPT =
  "You are an expert cosmetic dermatologist and skin care specialist with deep knowledge of skin analysis and treatment. Analyze the provided photo of a person and give a thorough, professional skin care concern assessment. Evaluate overall skin texture and tone including smoothness, pore size, rough patches, uneven tone, and any hyper or hypopigmentation, identify pigmentation concerns such as sunspots, melasma, post-inflammatory hyperpigmentation, redness, and rosacea-like patterns, note any acne or blemishes including active breakouts, whiteheads, blackheads, cystic acne, scarring types, and comedones, assess the under-eye area for discoloration and puffiness, evaluate fine lines and wrinkles as they relate to skin health and hydration, identify any visible signs of dehydration, dryness, oiliness, or combination skin patterns, and note any visible irritation, sensitivity, or inflammatory skin conditions. For each concern identified, rate its severity on a scale of 1 to 5, briefly describe what is observed, and suggest a general skin care treatment or product category that could address it. Close with a summary of the top 3 to 5 priority skin care concerns based on visibility and impact along with a general recommended skin care routine or treatment pathway. Keep the tone professional, clinical, and objective, and note if lighting or angle limits any part of the assessment."

// Appended so the response is machine-parseable for the structured-card UI.
const JSON_FORMAT_INSTRUCTION = `

Return ONLY a single JSON object (no markdown, no commentary) with exactly this shape:
{
  "concerns": [
    { "name": string, "severity": integer 1-5, "observation": string, "treatment": string }
  ],
  "priorities": [string],   // the top 3 to 5 priority concerns, most important first
  "routine": string,        // the general recommended skin care routine / treatment pathway
  "limitations": string     // any lighting/angle limitations on the assessment, or "" if none
}`

export async function POST(request: Request) {
  return analyzeImage(request, {
    prompt: DERMATOLOGIST_PROMPT,
    jsonInstruction: JSON_FORMAT_INSTRUCTION,
  })
}
