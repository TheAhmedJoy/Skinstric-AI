import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

// Model is configurable via OPENAI_MODEL in .env.local. Default is a current
// GPT-5 multimodal model (gpt-4o-era models are being phased out).
const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini"

// GPT-5 / o-series are reasoning models with a different request contract than
// gpt-4o: they require `max_completion_tokens` (not `max_tokens`), reject a
// custom `temperature`, and accept `reasoning_effort`. The non-reasoning
// "-chat" variants behave like gpt-4o.
const IS_REASONING_MODEL =
  /^(o[134]|gpt-5)/.test(MODEL) && !/-chat/.test(MODEL)

// Generous budget: reasoning models spend tokens "thinking" before the answer,
// so too small a limit yields empty content (finish_reason: "length").
const MAX_COMPLETION_TOKENS = Number(process.env.OPENAI_MAX_TOKENS) || 5000

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

interface OpenAIChatResponse {
  choices?: {
    message?: { content?: string | null; refusal?: string | null }
    finish_reason?: string
  }[]
  error?: { message?: string }
}

function extractJson(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    // Models occasionally wrap JSON in prose or code fences despite instructions.
    const start = raw.indexOf("{")
    const end = raw.lastIndexOf("}")
    if (start !== -1 && end !== -1 && end > start) {
      return JSON.parse(raw.slice(start, end + 1))
    }
    throw new Error("Response was not valid JSON")
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.trim() === "") {
    return NextResponse.json(
      {
        success: false,
        error:
          "OpenAI API key is not configured. Add OPENAI_API_KEY to .env.local and restart the dev server.",
      },
      { status: 500 }
    )
  }

  let image: string | undefined

  try {
    const body = await request.json()
    image = body?.image
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid request body." },
      { status: 400 }
    )
  }

  if (!image || typeof image !== "string") {
    return NextResponse.json(
      { success: false, error: "No image was provided for analysis." },
      { status: 400 }
    )
  }

  // The capture/upload flow stores a full data URL. OpenAI accepts data URLs
  // directly; tolerate a bare base64 string by adding a jpeg prefix.
  const imageUrl = image.startsWith("data:")
    ? image
    : `data:image/jpeg;base64,${image}`

  const requestBody: Record<string, unknown> = {
    model: MODEL,
    max_completion_tokens: MAX_COMPLETION_TOKENS,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: DERMATOLOGIST_PROMPT + JSON_FORMAT_INSTRUCTION,
          },
          {
            type: "image_url",
            image_url: { url: imageUrl, detail: "auto" },
          },
        ],
      },
    ],
  }

  if (IS_REASONING_MODEL) {
    // Keep reasoning light so the token budget goes to the JSON answer, not
    // to extended chain-of-thought (this is a structured extraction task).
    requestBody.reasoning_effort = "low"
  } else {
    requestBody.temperature = 0.4
  }

  try {
    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      }
    )

    const payload = (await openaiResponse.json()) as OpenAIChatResponse

    if (!openaiResponse.ok) {
      return NextResponse.json(
        {
          success: false,
          error:
            payload?.error?.message ||
            `OpenAI request failed with status ${openaiResponse.status}.`,
        },
        { status: 502 }
      )
    }

    const choice = payload?.choices?.[0]
    const content = choice?.message?.content
    const refusal = choice?.message?.refusal
    const finishReason = choice?.finish_reason

    if (!content) {
      let detail = `OpenAI (${MODEL}) returned no content`
      if (refusal) {
        detail = `The model declined to analyze this image: ${refusal}`
      } else if (finishReason === "length") {
        detail = `OpenAI (${MODEL}) hit the token limit before producing an answer. Increase OPENAI_MAX_TOKENS (currently ${MAX_COMPLETION_TOKENS}) or use a lighter model.`
      } else if (finishReason) {
        detail += ` (finish_reason: ${finishReason})`
      }
      return NextResponse.json(
        { success: false, error: detail },
        { status: 502 }
      )
    }

    try {
      const data = extractJson(content)
      return NextResponse.json({ success: true, data })
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Could not parse the analysis response.",
          raw: content,
        },
        { status: 502 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: `Failed to reach OpenAI: ${
          error instanceof Error ? error.message : String(error)
        }`,
      },
      { status: 502 }
    )
  }
}
