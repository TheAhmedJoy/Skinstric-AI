import localFont from "next/font/local"

const roobertFontRegular = localFont({
  src: "../../fonts/RoobertTRIAL-Regular.woff2",
  weight: "400",
})

type DisclaimerProps = {
  className?: string
}

export default function Disclaimer({ className = "" }: DisclaimerProps) {
  return (
    <p className={`text-red-600 text-xs md:text-sm leading-5 max-w-2xl m-auto text-center px-4 ${roobertFontRegular.className} ${className}`}>
      This AI analysis is for informational purposes only and is{" "}
      <strong className="font-bold underline">NOT</strong> a substitute for
      professional medical or dermatological advice, diagnosis, or treatment.
      Always consult a qualified professional.
    </p>
  )
}
