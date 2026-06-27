import { NextResponse } from "next/server"

// Shared helper for image analysis routes (cosmetic-concerns, skin-type,
// weather). Centralizes the OpenAI request shape so each feature only has to
// declare its prompt and JSON schema instructions.

// Model is configurable via OPENAI_MODEL in .env.local. Default is a current
// GPT-5 multimodal model (gpt-4o-era models are being phased out).
export const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5.4-mini"

// GPT-5 / o-series are reasoning models with a different request contract than
// gpt-4o: they require `max_completion_tokens` (not `max_tokens`), reject a
// custom `temperature`, and accept `reasoning_effort`. The non-reasoning
// "-chat" variants behave like gpt-4o.
const IS_REASONING_MODEL =
  /^(o[134]|gpt-5)/.test(MODEL) && !/-chat/.test(MODEL)

// Generous budget: reasoning models spend tokens "thinking" before the answer,
// so too small a limit yields empty content (finish_reason: "length").
const MAX_COMPLETION_TOKENS = Number(process.env.OPENAI_MAX_TOKENS) || 5000

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

export interface AnalyzeImageOptions {
  /** The verbatim expert prompt for this feature. */
  prompt: string
  /** Appended to the prompt; tells the model the exact JSON shape to return. */
  jsonInstruction: string
}

/**
 * Reads the image from the request body, sends it (with the supplied prompt)
 * to OpenAI's chat completions API, and returns the parsed JSON response as a
 * NextResponse. Used by every image-analysis route in this app so the OpenAI
 * call lives in exactly one place.
 */
export async function analyzeImage(
  request: Request,
  options: AnalyzeImageOptions
): Promise<NextResponse> {
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
            text: options.prompt + options.jsonInstruction,
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
