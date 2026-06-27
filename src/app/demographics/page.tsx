import Link from "next/link"
import localFont from "next/font/local"
import Demographics from "../components/Demographics"
import RadialChart from "../components/RadicalChart"
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

export default function Summary() {
  return (
    <div className="h-screen md:h-[90vh] flex flex-col md:mt-5">
      <main className="flex-1 w-full bg-white overflow-auto">
        <div className="md:h-full max-w-full mx-5 px-4 md:px-auto flex flex-col min-h-0">
          <div className="text-start ml-4 mb-4 md:mb-10 md:ml-0">
            <h2 className={`text-base md:text-base font-semibold mb-1 leading-6 ${roobertFontSemiBold.className}`}>
              A.I. ANALYSIS
            </h2>
            <h3 className={`text-4xl md:text-[72px] font-normal leading-16 tracking-tighter ${roobertFontRegular.className}`}>
              DEMOGRAPHICS
            </h3>
            <h4 className={`text-sm mt-2 leading-6 ${roobertFontRegular.className}`}>
              PREDICTED RACE &amp; AGE
            </h4>
          </div>

          <Demographics>
            <RadialChart />
          </Demographics>

          <Disclaimer className="mt-6 md:mt-2" />

          <div className="pt-8 md:pt-[37px] pb-28 md:pb-6 bg-white sticky bottom-0 md:static z-10 mb-0 md:mb-16">
            <div className="flex justify-between max-w-full mx-auto px-4 md:px-0">
              <Link href="/select">
                <BackButton isWhite={false}/>
              </Link>
              <Link href="/">
                <ProceedButton isSummary={false} isHome={true} />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}