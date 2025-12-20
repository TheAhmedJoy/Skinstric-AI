import Link from 'next/link'
import localFont from 'next/font/local'
import ResultModalWrapper from '../components/ResultModalWrapper'
import CameraSelectOption from '../components/CameraSelectOption'
import BackButton from '../components/UI/BackButton'
import ProceedButton from '../components/UI/ProceedButton'
import GallerySelectOption from '../components/GallerySelectOption'

const roobertFontSemiBold = localFont({
  src: "../fonts/RoobertTRIAL-SemiBold.woff2",
  weight: "600"
})

export default function Result() {
    return (
        <div className="min-h-[92vh] flex flex-col bg-white relative md:pt-16 justify-center">
            <div className="absolute top-2 left-9 md:left-8 text-left">
                <p className={`font-semibold text-xs md:text-sm ${roobertFontSemiBold.className}`}>TO START ANALYSIS</p>
            </div>

            <ResultModalWrapper>
                <div className="flex-[0.4] md:flex-1 flex flex-col md:flex-row items-center xl:justify-center relative mb-0 md:mb-30 -space-y-5 md:space-y-0">
                    <CameraSelectOption/>
                    <GallerySelectOption />
                </div>
            </ResultModalWrapper>

            <div className="pt-4 md:pt-0 pb-8 bg-white sticky md:static bottom-30.5 mb-0 md:mb-0">
                <div className="absolute bottom-8 w-full flex justify-between md:px-9 px-13">
                    <Link className="relative" aria-label="Back" href="/testing">
                        <BackButton />
                    </Link>

                    <Link href="/select">
                        <div className="hidden">
                            <ProceedButton isSummary={false} isHome={false}/>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    )
}
