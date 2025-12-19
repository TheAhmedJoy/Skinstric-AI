import Link from "next/link"
import localFont from "next/font/local"
import SelectOptions from "../components/UI/SelectOptions"
import BackButton from "../components/UI/BackButton"
import ProceedButton from "../components/UI/ProceedButton"

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

            <div className="h-[78.3vh] flex flex-col items-center justify-center bg-white">
                <SelectOptions />
            </div>

            <div className="pt-4 md:pt-12 pb-8 bg-white sticky md:static bottom-40 mb-0 md:mb-0">
                <div className="flex justify-between max-w-full mx-auto px-13 md:px-9">
                    <Link href="/result">
                        <BackButton />
                    </Link>
                    <Link href="/summary">
                        <ProceedButton isSummary={true}/>
                    </Link>
                </div>
            </div>
        </div>
    )
}
