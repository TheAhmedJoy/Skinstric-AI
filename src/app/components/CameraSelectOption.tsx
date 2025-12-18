"use client"

import { useState } from "react"
import { useModal } from "./Modals/Modal"
import { useRouter } from "next/router"
import localFont from "next/font/local"
import Image from "next/image"
import SmallRectangleLayer1 from "../components/assets/Small-Rectangle-Whole-Layer1.svg"
import SmallRectangleLayer2 from "../components/assets/Small-Rectangle-Whole-Layer2.svg"
import SmallRectangleLayer3 from "../components/assets/Small-Rectangle-Whole-Layer3.svg"
import CameraIcon from "../components/assets/Access-Camera-Icon.svg"
import CameraIconUnion from "../components/assets/Access-Camera-Union.svg"

const roobertFontRegular = localFont({
    src: "../fonts/RoobertTRIAL-Regular.woff2",
    weight: "400"
})

export default function CameraSelectOption() {
    const [displayModal, setDisplayModal] = useState(false)
    const { setModalStatusOpen } = useModal()
    // const router = useRouter()

    const cameraOptionHandler = () => {
        setDisplayModal(true)
        setModalStatusOpen(true)
    }

    const cameraPermsAllowedHandler = () => {
        setDisplayModal(false)
        setModalStatusOpen(false)
        // router.push("/camera")
    }

    const cameraPermsDeniedHandler = () => {
        setDisplayModal(false)
        setModalStatusOpen(false)
    }

    return (
        <div className="relative md:absolute md:left-[55%] lg:left-[50%] xl:left-[40%] md:translate-y-[0%] -translate-y-[1%] md:-translate-x-full flex flex-col items-center justify-center">
            <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]" />

            <Image src={SmallRectangleLayer1} className="absolute w-[270px] h-[270px] md:w-[482px] md:h-[482px] animate-spin-slow rotate-200" alt="Small Rectangle Layer" />
            <Image src={SmallRectangleLayer2} className="absolute w-[230px] h-[230px] md:w-[444.34px] md:h-[444.34px] animate-spin-slower rotate-190" alt="Smaller Rectangle Layer" />
            <Image src={SmallRectangleLayer3} className="absolute w-[190px] h-[190px] md:w-[405.18px] md:h-[405.18px] animate-spin-slowest" alt="Smallest Rectangle Layer" />

            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Image src={CameraIcon} className="absolute w-[100px] h-[100px] md:w-[136px] md:h-[136px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                    onClick={cameraOptionHandler} alt="Camera Icon" />

                <div className="absolute bottom-[1%] right-[90px] md:top-[30.9%] md:-right-3 -translate-y-5">
                    <p className={`text-xs md:text-sm font-normal mt-1 leading-6 ${roobertFontRegular.className}`}>
                        ALLOW A.I.
                        <br />
                        TO SCAN YOUR FACE
                    </p>
                    <Image src={CameraIconUnion} className="absolute hidden md:block md:right-[143px] md:top-5" alt="Camera Icon Union" />
                </div>
            </div>

            {displayModal && (
                <div className="absolute md:top-[43%] md:left-[360px] w-[352px] z-50">
                    <div className="bg-[#1A1B1C] pt-4 pb-2">
                        <h2 className={`text-[#FCFCFC] text-base font-semibold mb-12 leading-6 pl-4 ${roobertFontRegular.className}`}>
                            ALLOW A.I. TO ACCESS YOUR CAMERA
                        </h2>
                        <div className="flex mt-4 border-t border-[#FCFCFC] pt-2">
                            <button className={`px-7 md:translate-x-45 text-[#fcfcfca1] font-normal text-sm leading-4 tracking-tight 
                            cursor-pointer hover:text-gray-500 ${roobertFontRegular.className}`}
                                onClick={cameraPermsDeniedHandler} >
                                DENY
                            </button>
                            <button className={`px-5 md:translate-x-45 text-[#FCFCFC] font-semibold text-sm leading-4 tracking-tight 
                            cursor-pointer hover:text-gray-300 ${roobertFontRegular.className}`}
                                onClick={cameraPermsAllowedHandler} >
                                ALLOW
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
