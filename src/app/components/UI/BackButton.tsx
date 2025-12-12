import Image from "next/image";
import ButtonLeft from "./assets/button-icon-shrunk-left.svg"

export default function BackButton() {
    return (
        <div>
            <div className="relative w-12 h-12 flex items-center justify-center border 
            border-[#1A1B1C] rotate-45 scale-[1] sm:hidden">
                <span className="-rotate-45deg text-xs font-semibold sm:hidden">
                    BACK
                </span>
            </div>
            <div className="group hidden sm:flex flex-row relative justify-center items-center">
                <Image className="group-hover:scale-110 duration-300" src={ButtonLeft} alt="Left button" />
                <span className="text-sm font-semibold hidden sm:block ml-6 ">
                    BACK
                </span>
            </div>
        </div>
    );
}
