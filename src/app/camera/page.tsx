"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import localFont from "next/font/local"
import Image from "next/image"
import CameraIcon from "../components/assets/Access-Camera-Icon.svg"
import RectangleWholeLayer1 from "../components/assets/Rectangle-Whole-Layer1.svg"
import RectangleWholeLayer2 from "../components/assets/Rectangle-Whole-Layer2.svg"
import RectangleWholeLayer3 from "../components/assets/Rectangle-Whole-Layer3.svg"

const roobertFontRegular = localFont({
    src: "../fonts/RoobertTRIAL-Regular.woff2",
    weight: "400"
})

const roobertFontSemiBold = localFont({
    src: "../fonts/RoobertTRIAL-SemiBold.woff2",
    weight: "600"
})

export default function Camera() {
    const router = useRouter()

    useEffect(() => {
        const timeOut = setTimeout(() => {
            router.push("/camera/capture")
        }, 3000)

        return () => clearTimeout(timeOut)
    }, [router])

    return (
        <div className="md:h-[85vh] h-[65vh] bg-white flex items-center justify-center">
            <div className="flex flex-col items-center justify-center h-[70vh] overflow-auto">
                <div className="flex-0 flex flex-col md:flex-row items-center justify-center relative">
                    <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]" />

                    <Image src={RectangleWholeLayer1} className="absolute w-[270px] h-[270px] md:w-[482px] md:h-[482px] animate-spin-slow" alt="Rectangle Layer 1" />
                    <Image src={RectangleWholeLayer2} className="absolute w-[230px] h-[230px] md:w-[444.34px] md:h-[444.34px] animate-spin-slower" alt="Rectangle Layer 2" />
                    <Image src={RectangleWholeLayer3} className="absolute w-[190px] h-[190px] md:w-[405.18px] md:h-[405.18px] animate-spin-slowest" alt="Rectangle Layer 3" />

                    <div className="absolute inset-0 flex flex-col items-center justify-center animate-pulse">
                        <Image src={CameraIcon} className="w-[100px] h-[100px] md:w-[136px] md:h-[136px] animate-pulse-grow" alt="Camera Icon" />
                        <p className={`absolute font-semibold text-sm md:text-base leading-6 tracking-tight translate-y-22 animate-pulse ${roobertFontSemiBold.className}`}>
                            SETTING UP CAMERA ...
                        </p>
                    </div>
                </div>

                <div className={`mt-0 text-center ${roobertFontRegular.className}`}>
                    <p className="text-xs md:text-sm mb-4 leading-6">
                        TO GET BETTER RESULTS MAKE SURE TO HAVE
                    </p>
                    <div className="flex justify-center space-x-8">
                        <p className="text-xs md:text-sm leading-6">◇ NEUTRAL EXPRESSION</p>
                        <p className="text-xs md:text-sm leading-6">◇ FRONTAL POSE</p>
                        <p className="text-xs md:text-sm leading-6">◇ ADEQUATE LIGHTING</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
