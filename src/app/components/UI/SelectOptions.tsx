"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import RectangleWholeLayer1 from "../assets/Rectangle-Whole-Layer1.svg"

type SelectOptionType = "demographics" | "cosmetic" | "skin" | "weather" | null

export default function SelectOptions() {
    const [hoveredButton, setHoveredButton] = useState<SelectOptionType>(null)

    const isAnyHovered = hoveredButton !== null

    return (
        <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className={`absolute transition-all duration-400
                    ${isAnyHovered ? "w-[602px] h-[602px] opacity-100" : "w-[400px] h-[400px] opacity-0"}`}>
                    <Image src={RectangleWholeLayer1} alt="Rectangle Layer 1" />
                </div>
            </div>

            <div className="relative z-10 grid grid-cols-3 grid-rows-3 gap-0">
                <div className="flex items-center justify-center col-start-2">
                    <Link href="/demographics">
                        <button className="w-[110px] h-[110px] sm:w-[153.88px] sm:h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-4 sm:-m-5
                            cursor-pointer font-semibold leading-tight tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300 text-[11px] sm:text-base"
                            onMouseEnter={() => setHoveredButton("demographics")} onMouseLeave={() => setHoveredButton(null)}>
                            <span className="transform -rotate-45 text-center px-1">
                                Demographics
                            </span>
                        </button>
                    </Link>
                </div>

                <div className="flex items-center justify-center row-start-2 col-start-1">
                    <Link href="/cosmetic-concerns">
                        <button className="w-[110px] h-[110px] sm:w-[153.88px] sm:h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-4 sm:-m-5
                            cursor-pointer font-semibold leading-tight tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300 text-[11px] sm:text-base"
                            onMouseEnter={() => setHoveredButton("cosmetic")} onMouseLeave={() => setHoveredButton(null)}>
                            <span className="transform -rotate-45 text-center px-1">
                                Cosmetic Concerns
                            </span>
                        </button>
                    </Link>
                </div>

                <div className="flex items-center justify-center row-start-2 col-start-3">
                    <Link href="/skin-type-details">
                        <button className="w-[110px] h-[110px] sm:w-[153.88px] sm:h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-4 sm:-m-5
                            cursor-pointer font-semibold leading-tight tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300 text-[11px] sm:text-base"
                            onMouseEnter={() => setHoveredButton("skin")} onMouseLeave={() => setHoveredButton(null)}>
                            <span className="transform -rotate-45 text-center px-1">
                                Skin Type Details
                            </span>
                        </button>
                    </Link>
                </div>

                <div className="flex items-center justify-center row-start-3 col-start-2">
                    <Link href="/weather">
                        <button className="w-[110px] h-[110px] sm:w-[153.88px] sm:h-[153.88px] bg-gray-200 hover:bg-gray-300 transform rotate-45 flex items-center justify-center -m-4 sm:-m-5
                            cursor-pointer font-semibold leading-tight tracking-tight uppercase hover:scale-[1.05] transition-transform duration-300 text-[11px] sm:text-base"
                            onMouseEnter={() => setHoveredButton("weather")} onMouseLeave={() => setHoveredButton(null)}>
                            <span className="transform -rotate-45 text-center px-1">
                                Weather
                            </span>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
