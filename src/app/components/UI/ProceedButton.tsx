import Image from "next/image"
import localFont from "next/font/local"
import ButtonRight from "../assets/button-icon-shrunk-right.svg"

const roobertFontSemiBold = localFont({
  src: "../assets/fonts/RoobertTRIAL-SemiBold.woff2",
  weight: "600"
})

type ProceedType = {
    isSummary: boolean,
    isHome: boolean
}

export default function ProceedButton({ isSummary, isHome }: ProceedType) {
    return (
        <div>
            <div className=" w-12 h-12 flex items-center justify-center border 
            border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                <span className="-rotate-45deg text-xs font-semibold sm:hidden">
                    {isHome ? "HOME" : (isSummary ? "GET SUMMARY" : "PROCEED")}
                </span>
            </div>
            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                <span className={`text-sm font-semibold hidden sm:block mr-5 ${roobertFontSemiBold.className}`}>
                    {isHome ? "HOME" : (isSummary ? "GET SUMMARY" : "PROCEED")}
                </span>
                <Image className="group-hover:scale-110 duration-300" src={ButtonRight} alt="Right button" />
            </div>
        </div>
    )
}
