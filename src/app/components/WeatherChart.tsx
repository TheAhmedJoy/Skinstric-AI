"use client"

import React from "react"
import localFont from "next/font/local"
import { useWeather } from "./Weather"

const roobertFontRegular = localFont({
  src: "../fonts/RoobertTRIAL-Regular.woff2",
  weight: "400",
})

const roobertFontMedium = localFont({
  src: "../fonts/RoobertTRIAL-Medium.woff2",
  weight: "500",
})

const roobertFontSemiBold = localFont({
  src: "../fonts/RoobertTRIAL-SemiBold.woff2",
  weight: "600",
})

interface WeatherSection {
  label: string
  body: string
}

const WeatherChart: React.FC = () => {
  const { data, reanalyze } = useWeather()

  if (!data) {
    return null
  }

  const sections: WeatherSection[] = [
    { label: "SUN DAMAGE & PHOTOAGING", body: data.sunDamage },
    { label: "WIND & COLD EXPOSURE", body: data.environmentalExposure },
    { label: "POLLUTION & OXIDATIVE STRESS", body: data.pollution },
    { label: "AGING RATE", body: data.agingRate },
    { label: "TEXTURE & DEHYDRATION PATTERNS", body: data.textureChanges },
  ].filter((s) => s.body && s.body.trim() !== "")

  return (
    <div className="mt-6 mb-10 md:mb-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-base leading-6 tracking-tight font-medium ${roobertFontMedium.className}`}>
          WEATHERING ASSESSMENT
        </h4>
        <button className={`text-xs md:text-sm text-[#A0A4AB] hover:text-[#1A1B1C] underline underline-offset-2 cursor-pointer transition-colors ${roobertFontRegular.className}`}
                onClick={reanalyze} >
          Re-analyze
        </button>
      </div>

      {data.summary && data.summary.trim() !== "" && (
        <div className="bg-[#F3F3F4] border-t border-[#1A1B1C] p-4 mb-8">
          <p className={`text-sm leading-6 tracking-tight mb-2 text-[#A0A4AB] ${roobertFontRegular.className}`}>
            SUMMARY
          </p>
          <p className={`text-base md:text-lg leading-7 ${roobertFontRegular.className}`}>
            {data.summary}
          </p>
        </div>
      )}

      {sections.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sections.map((section, index) => (
            <div key={index} className="bg-[#F3F3F4] border-t border-[#1A1B1C] p-4 flex flex-col">
              <h5 className={`text-base font-semibold uppercase tracking-tight leading-6 mb-3 ${roobertFontSemiBold.className}`}>
                {section.label}
              </h5>
              <p className={`text-sm leading-6 text-[#1A1B1C] ${roobertFontRegular.className}`}>
                {section.body}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-sm text-[#A0A4AB] mb-8 ${roobertFontRegular.className}`}>
          No weathering observations were provided.
        </p>
      )}

      {data.limitations && data.limitations.trim() !== "" && (
        <div className="bg-[#F3F3F4] border-t border-[#1A1B1C] p-4 mt-6 text-black">
          <h4 className={`text-base font-medium tracking-tight mb-3 text-black ${roobertFontMedium.className}`}>
            ASSESSMENT NOTE
          </h4>
          <p className={`text-sm leading-6 text-black ${roobertFontRegular.className}`}>
            {data.limitations}
          </p>
        </div>
      )}
    </div>
  )
}

export default WeatherChart
