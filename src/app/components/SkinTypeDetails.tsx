"use client"

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode,} from "react"
import { useRouter } from "next/navigation"

export interface SkinTypeData {
  skinType: string
  characteristics: string
  zoneDifferences: string
  hydration: string
  pores: string
  barrierConcerns: string
  limitations: string
}

interface SkinTypeDetailsContextValue {
  data: SkinTypeData | null
  isStatusLoading: boolean
  error: string | null
  reanalyze: () => void
}

const SkinTypeDetailsContext = createContext<SkinTypeDetailsContextValue>({
  data: null,
  isStatusLoading: true,
  error: null,
  reanalyze: () => {},
})

const CACHE_KEY = "skinTypeDetailsData"

// Cheap, collision-resistant-enough fingerprint so we don't re-bill OpenAI on
// back-navigation while still re-analyzing when the captured image changes.
const fingerprintImage = (image: string): string =>
  `${image.length}:${image.slice(0, 32)}:${image.slice(-32)}`

const normalizeData = (raw: unknown): SkinTypeData => {
  const obj = (raw ?? {}) as Record<string, unknown>
  return {
    skinType: String(obj.skinType ?? "").trim(),
    characteristics: String(obj.characteristics ?? ""),
    zoneDifferences: String(obj.zoneDifferences ?? ""),
    hydration: String(obj.hydration ?? ""),
    pores: String(obj.pores ?? ""),
    barrierConcerns: String(obj.barrierConcerns ?? ""),
    limitations: String(obj.limitations ?? ""),
  }
}

interface SkinTypeDetailsProviderProps {
  children: ReactNode
}

const SkinTypeDetails: React.FC<SkinTypeDetailsProviderProps> = ({ children }) => {
  const [data, setData] = useState<SkinTypeData | null>(null)
  const [isStatusLoading, setIsStatusLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasImage, setHasImage] = useState(true)

  const router = useRouter()

  const fetchAnalysis = useCallback(async (forceRefresh: boolean) => {
    setIsStatusLoading(true)
    setError(null)

    let image: string | null = null

    try {
      image = localStorage.getItem("uploadedImage")
    } catch {
      image = null
    }

    if (!image) {
      setHasImage(false)
      setData(null)
      setIsStatusLoading(false)
      return
    }

    setHasImage(true)
    const fingerprint = fingerprintImage(image)

    if (!forceRefresh) {
      try {
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const parsed = JSON.parse(cached)
          if (parsed?.fingerprint === fingerprint && parsed?.data) {
            setData(normalizeData(parsed.data))
            setIsStatusLoading(false)
            return
          }
        }
      } catch {
        // Ignore corrupt cache and fall through to a fresh request.
      }
    }

    try {
      const response = await fetch("/api/skin-type", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image }),
      })

      const result = await response.json()

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.error || `Analysis request failed (${response.status}).`
        )
      }

      const normalized = normalizeData(result.data)
      setData(normalized)

      try {
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ fingerprint, data: result.data })
        )
      } catch {
        // Non-fatal: storage full / unavailable just means no caching.
      }
    } catch (err) {
      setData(null)
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsStatusLoading(false)
    }
  }, [])

  useEffect(() => { fetchAnalysis(false) }, [fetchAnalysis])

  const reanalyze = useCallback(() => {
    try {
      localStorage.removeItem(CACHE_KEY)
    } catch {
      // Ignore — a failed removal still triggers a forced refresh below.
    }
    fetchAnalysis(true)
  }, [fetchAnalysis])

  return (
    <SkinTypeDetailsContext.Provider value={{ data, isStatusLoading, error, reanalyze }}>
      {isStatusLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-pulse text-2xl">
            Analyzing your skin type...
          </div>
        </div>
      ) : !hasImage ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-xl mb-4">
            No image found. Please upload an image first.
          </p>
          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800" onClick={() => router.push("/result")}>
            Go to Upload Page or take a Picture with your device
          </button>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-xl mb-2">Could not complete the analysis.</p>
          <p className="text-sm text-[#A0A4AB] mb-6 max-w-md">{error}</p>
          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800" onClick={reanalyze}>
            Try again
          </button>
        </div>
      ) : data ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <p className="text-xl mb-4">No analysis data available.</p>
          <button className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800" onClick={reanalyze}>
            Try again
          </button>
        </div>
      )}
    </SkinTypeDetailsContext.Provider>
  )
}

export const useSkinTypeDetails = () => {
  return useContext(SkinTypeDetailsContext)
}

export default SkinTypeDetails
