import Link from "next/link"
import localFont from "next/font/local"
import SelectOptions from "../components/UI/SelectOptions"
import BackButton from "../components/UI/BackButton"
import ProceedButton from "../components/UI/ProceedButton"
import Disclaimer from "../components/UI/Disclaimer"

const roobertFontRegular = localFont({
    src: "../fonts/RoobertTRIAL-Regular.woff2",
    weight: "400"
})

const roobertFontSemiBold = localFont({
    src: "../fonts/RoobertTRIAL-SemiBold.woff2",
    weight: "600"
})

export default function Select() {
    return (
        <div>
            <div className="absolute top-10 left-8 text-left mt-5">
                <h1 className={`text-base font-semibold leading-6 tracking-tight ${roobertFontSemiBold.className}`}>
                    A.I. ANALYSIS
                </h1>
                <p className={`text-sm mt-1 text-muted-foreground uppercase leading-6 ${roobertFontRegular.className}`}>
                    A.I. has estimated the following.
                    <br />
                    Fix estimated information if needed.
                </p>
            </div>

            <div className="h-[64vh] md:h-[72vh] flex flex-col items-center justify-center bg-white">
                <SelectOptions />
            </div>

            <div className="max-w-full mx-5 px-4 md:px-auto">
                <Disclaimer className="mt-6 md:mt-2" />

                <div className="pt-8 md:pt-[37px] pb-12 bg-white static z-10">
                    <div className="flex justify-between max-w-full mx-auto px-4 md:px-0">
                        <Link href="/result">
                            <BackButton isWhite={false}/>
                        </Link>
                        <Link href="/demographics">
                            <ProceedButton isSummary={true} isHome={false}/>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
