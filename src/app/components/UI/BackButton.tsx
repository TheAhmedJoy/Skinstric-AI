import Image from "next/image";
import localFont from "next/font/local";
import ButtonLeft from "../assets/button-icon-shrunk-left.svg"
import ButtonLeftWhite from "../assets/buttin-icon-shrunk-left-white.svg"

const roobertFontSemiBold = localFont({
    src: "../assets/fonts/RoobertTRIAL-SemiBold.woff2",
    weight: "600"
})

type BackType = {
    isWhite: boolean
}

export default function BackButton({ isWhite }: BackType) {
    return (
        <div>
            <div className="relative w-12 h-12 flex items-center justify-center border 
            border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                <span className="-rotate-45deg text-xs font-semibold sm:hidden">
                    BACK
                </span>
            </div>
            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                {isWhite ?
                    <Image className="group-hover:scale-110 duration-300" src={ButtonLeftWhite} alt="Left button" />
                    : <Image className="group-hover:scale-110 duration-300" src={ButtonLeft} alt="Left button" />
                }
                <span className={isWhite ?
                    `text-white text-sm font-semibold hidden sm:block ml-6 ${roobertFontSemiBold.className}` :
                    `text-sm font-semibold hidden sm:block ml-6 ${roobertFontSemiBold.className}`}>
                    BACK
                </span>
            </div>
        </div>
    );
}
