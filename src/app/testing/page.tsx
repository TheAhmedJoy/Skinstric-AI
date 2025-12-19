"use client";

import { useState, useActionState, useCallback, startTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import BackButton from "../components/UI/BackButton";
import LoadingDots from "../components/UI/LoadingDots";
import ProceedButton from "../components/UI/ProceedButton";
import RectangleLayer1 from "../components/assets/Rectangle-Whole-Layer1.svg"
import RectangleLayer2 from "../components/assets/Rectangle-Whole-Layer2.svg"
import RectangleLayer3 from "../components/assets/Rectangle-Whole-Layer3.svg"


const roobertFontRegular = localFont({
  src: "../fonts/RoobertTRIAL-Regular.woff2",
  weight: "400"
})

const roobertFontSemiBold = localFont({
  src: "../fonts/RoobertTRIAL-SemiBold.woff2",
  weight: "600"
})

type PageState = {
  errors?: {
    name?: string[],
    location?: string[] 
  },
  message?: string,
  success?: string | boolean,
  step?: number,
  name?: string,
  location?: string
}

function checkInvalidInput(input: string): boolean {
  return /[0-9!@#$%^&*(),.?":{}|<>]/.test(input)
}

async function formSubmition(prevState: PageState, formData: FormData): Promise<PageState> {
  const step = prevState.step || 1

  switch (step) {
    case 1: {
      const name = formData.get("name") as string

      if (!name || name.trim() === "") {
        return {
          ...prevState,
          step: 1,
          errors: {
            name: ["Please enter your name."]
          }
        }
      }

      if (checkInvalidInput(name)) {
        return {
          ...prevState,
          step: 1,
          errors: {
            name: ["Please enter a valid name that does not contain numbers or special characters."]
          }
        }
      }

      return {
        step: 2,
        name: name.trim(),
        errors: {}
      }
    }

    case 2: {
      const name = prevState.name || ""
      const location = formData.get("location") as string
      const apiCall = formData.get("apiCall") === "true"

      if (apiCall) {
        try {
          const apiResponse = await fetch("https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseOne",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                name,
                location: prevState.location
              })
            }
          )

          const apiData = await apiResponse.json()

          if (apiData.success) {
            return {
              step: 3,
              name,
              location: prevState.location,
              success: `SUCCESS: Added ${name} from ${prevState.location}`,
              message: apiData.message
            }
          }
          else {
            throw new Error("Error fetching from API.")
          }
        } catch (error: any) {
          console.error("There was an error submitting your information. Please try again.", error)
          return {
            ...prevState,
            step: 2,
            errors: {
              location: error
            }
          }
        }
      }

      if (!location || location.trim() === "") {
        return {
          ...prevState,
          step: 2,
          errors: {
            location: ["Please enter a location."]
          }
        }
      }

      if (checkInvalidInput(location)) {
        return {
          ...prevState,
          step: 2,
          errors: {
            location: ["Please enter a valid location that does not contain numbers or special characters."]
          }
        }
      }

      return {
        ...prevState,
        step: 2,
        location: location.trim()
      }
    }

    default: return prevState
  }
}

function FormInputErrorMessage({ error }: { error?: string[] }) {
  return (
    <div className="flex flex-col items-center">
      {error &&
        error.map((theError, index) => (
          <p key={index} className="text-red-500 text-sm mb-2">
            {theError}
          </p>
        ))}
    </div>
  )
}

export default function Testing() {
  const [state, formAction] = useActionState(formSubmition, {
    step: 1,
    errors: {}
  })

  const [isStatusLoading, setIsLoading] = useState(false)

  const initiateApiCall = useCallback(() => {
    if (state.step === 2 && !isStatusLoading && state.location) {
      setIsLoading(true)

      setTimeout(() => {
        startTransition(() => {
          const apiFormData = new FormData()
          apiFormData.append("apiCall", "true")
          formAction(apiFormData)
          setIsLoading(false)
        })
      }, 2000)
    }
  }, [state.step, state.location, isStatusLoading, formAction])

  useEffect(() => {
    if (state.step === 2 && state.location && !isStatusLoading) {
      initiateApiCall()
    }
  }, [state.step, state.location, isStatusLoading, initiateApiCall])

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-white text-center">
      <div className="absolute top-16 left-9 text-left">
        <p className={`font-semibold text-xs ${roobertFontSemiBold.className}`}>TO START ANALYSIS</p>
      </div>

      <div className="relative flex flex-col items-center justify-center mb-40 w-full h-full">
        {state.step !== 3 && !isStatusLoading && (
          <p className={`text-sm text-gray-400 tracking-wider uppercase mb-1 ${roobertFontRegular.className}`}>
            CLICK TO TYPE
          </p>
        )}

        {isStatusLoading && (
          <div className="relative z-10">
            <p className="text-lg text-gray-500 mb-2">Processing submission</p>
            <LoadingDots />
          </div>
        )}

        {state.step === 1 && !isStatusLoading && (
          <form action={formAction} className="relative z-10">
            <FormInputErrorMessage error={state.errors?.name} />
            <input
              name="name"
              className={`text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[372px] 
              sm:w-[432px] pt-1 tracking-[-0.07em] leading-16 text-[#1A1B1C] placeholder:text-black placeholder:text-5xl z-10 ${roobertFontRegular.className}`}
              placeholder="Introduce Yourself"
              type="text"
              autoComplete="off"
              autoFocus
            />
          </form>
        )}

        {state.step === 2 && !isStatusLoading && !state.location && (
          <form action={formAction} className="relative z-10">
            <FormInputErrorMessage error={state.errors?.location} />
            <input
              name="location"
              className={`text-5xl sm:text-6xl font-normal text-center bg-transparent border-b border-black focus:outline-none appearance-none w-[400px] 
              sm:w-[460px] pt-1 tracking-[-0.07em] leading-16 text-[#1A1B1C] placeholder:text-black placeholder:text-5xl z-10 ${roobertFontRegular.className}`}
              placeholder="Where are you from?"
              type="text"
              autoComplete="off"
              autoFocus
            />
          </form>
        )}

        {state.step === 3 && (
          <div className="flex flex-col items-center gap-4 z-10">
            <p className={`text-2xl font-normal text-[#1A1B1C] tracking-wide ${roobertFontSemiBold.className}`}>
              Thank you!
            </p>
            <p className={`text-lg text-gray-600 ${roobertFontSemiBold.className}`}>Proceed for the next step</p>
          </div>
        )}

        <Image
          src={RectangleLayer1}
          alt="Rectangle Layer 1"
          className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[480px] h-[480px] md:w-[762px] md:h-[762px] animate-spin-slow rotate-190"
        />
        <Image
          src={RectangleLayer2}
          alt="Rectangle Layer 2"
          className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[400px] h-[400px] md:w-[682px] md:h-[682px] animate-spin-slower rotate-185"
        />
        <Image
          src={RectangleLayer3}
          alt="Rectangle Layer 3"
          className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[320px] h-80 md:w-[602px] md:h-[602px] animate-spin-slowest"
        />
      </div>

      <div className="absolute bottom-38.5 md:bottom-8 w-full flex justify-between md:px-9 px-13">
        <Link className="inset-0" aria-label="Back" href="/">
          <BackButton />
        </Link>

        {state.step === 3 && (
          <Link href="/result" className="inline-block">
            <ProceedButton isSummary={false}/>
          </Link>
        )}
      </div>
    </div>
  )
}