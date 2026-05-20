"use client"

import React from "react"
import localFont from "next/font/local"
import { useCosmeticConcerns } from "./CosmeticConcerns"

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

const SeverityBar: React.FC<{ severity: number }> = ({ severity }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((segment) => (
          <span key={segment} className={`h-2.5 w-5 ${segment <= severity ? "bg-[#1A1B1C]" : "bg-[#E1E1E2]"}`} />
        ))}
      </div>
      <span className={`text-sm font-medium tracking-tight ${roobertFontMedium.className}`}>
        {severity}/5
      </span>
    </div>
  )
}

const SkinConcernChart: React.FC = () => {
  const { data, reanalyze } = useCosmeticConcerns()

  if (!data) {
    return null
  }

  return (
    <div className="mt-6 mb-10 md:mb-10">
      <div className="flex items-center justify-between mb-4">
        <h4 className={`text-base leading-6 tracking-tight font-medium ${roobertFontMedium.className}`}>
          IDENTIFIED CONCERNS
        </h4>
        <button className={`text-xs md:text-sm text-[#A0A4AB] hover:text-[#1A1B1C] underline underline-offset-2 cursor-pointer transition-colors ${roobertFontRegular.className}`}
                onClick={reanalyze} >
          Re-analyze
        </button>
      </div>

      {data.concerns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
          {data.concerns.map((concern, index) => (
            <div key={index} className="bg-[#F3F3F4] border-t border-[#1A1B1C] p-4 flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h5 className={`text-base font-semibold uppercase tracking-tight leading-6 ${roobertFontSemiBold.className}`}>
                  {concern.name}
                </h5>
                <SeverityBar severity={concern.severity} />
              </div>
              <p className={`text-sm leading-6 text-[#1A1B1C] mb-3 ${roobertFontRegular.className}`}>
                {concern.observation}
              </p>
              {concern.treatment && (
                <p className={`text-sm leading-6 text-[#A0A4AB] mt-auto ${roobertFontRegular.className}`}>
                  &rarr; {concern.treatment}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-sm text-[#A0A4AB] mb-8 ${roobertFontRegular.className}`}>
          No specific concerns were identified from the provided image.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-[#F3F3F4] border-t border-[#1A1B1C] p-4">
          <h4 className={`text-base font-medium tracking-tight mb-3 ${roobertFontMedium.className}`}>
            TOP PRIORITIES
          </h4>
          {data.priorities.length > 0 ? (
            <ol className="space-y-2">
              {data.priorities.map((priority, index) => (
                <li key={index} className={`flex gap-2 text-sm leading-6 ${roobertFontRegular.className}`}>
                  <span className={`font-semibold ${roobertFontSemiBold.className}`}>
                    {index + 1}.
                  </span>
                  <span>{priority}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className={`text-sm text-[#A0A4AB] ${roobertFontRegular.className}`}>
              No priority concerns reported.
            </p>
          )}
        </div>

        <div className="bg-[#F3F3F4] border-t border-[#1A1B1C] p-4">
          <h4 className={`text-base font-medium tracking-tight mb-3 ${roobertFontMedium.className}`}>
            RECOMMENDED ROUTINE
          </h4>
          <p className={`text-sm leading-6 text-[#1A1B1C] ${roobertFontRegular.className}`}>
            {data.routine || "No routine recommendation provided."}
          </p>
        </div>
      </div>

      {data.limitations && data.limitations.trim() !== "" && (
        <p className={`text-xs md:text-sm text-[#A0A4AB] mt-6 leading-6 ${roobertFontRegular.className}`}>
          <span className="font-medium">Assessment note:</span>{" "}
          {data.limitations}
        </p>
      )}
    </div>
  )
}

export default SkinConcernChart
