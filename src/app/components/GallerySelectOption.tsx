"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import localFont from "next/font/local"
import { useRouter } from "next/navigation"
import { useModal } from "./Modals/Modal"
import LoadingDots from "./UI/LoadingDots"
import SmallRectangleLayer1 from "../components/assets/Small-Rectangle-Whole-Layer1.svg"
import SmallRectangleLayer2 from "../components/assets/Small-Rectangle-Whole-Layer2.svg"
import SmallRectangleLayer3 from "../components/assets/Small-Rectangle-Whole-Layer3.svg"
import GalleryIcon from "../components/assets/Access-Gallery-Icon.svg"
import GalleryIconUnion from "../components/assets/Access-Gallery-Union.svg"

const roobertFontRegular = localFont({
    src: "../fonts/RoobertTRIAL-Regular.woff2",
    weight: "400"
})

const roobertFontSemiBold = localFont({
    src: "../fonts/RoobertTRIAL-SemiBold.woff2",
    weight: "600"
})

export default function GallerySelectOption() {
    const imageFileInputRef = useRef<HTMLInputElement>(null)

    const [imagePreview, setPreviewImage] = useState<string | null>(null)
    const [isLoadingStatus, setIsLoadingStatus] = useState(false)

    const { isModalStatusOpen } = useModal()

    // const router = useRouter()

    const galleryOptionHandler = () => {
        if (!isModalStatusOpen) {
            imageFileInputRef.current?.click()
        }
    }

    const storeImageLocally = (key: string, value: string) => {
        try {
            localStorage.setItem(key, value)
        } catch (error) {
            console.warn(`Failed to store ${key} in localStorage:`, error)
        }
    }

    const convertImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()

            reader.readAsDataURL(file)

            reader.onload = (event) => {
                const image = new (window.Image as any)()
                image.src = event.target?.result as string

                image.onload = () => {
                    let width = image.width
                    let height = image.height

                    if (width > 800) {
                        height = Math.round((height * 800) / width)
                        width = 800
                    }

                    if (height > 800) {
                        width = Math.round((width * 800) / height)
                        height = 800
                    }

                    const canvas = document.createElement("canvas")
                    canvas.width = width
                    canvas.height = height

                    const canvasContext = canvas.getContext("2d")
                    canvasContext?.drawImage(image, 0, 0, width, height)

                    const resizedBase64 = canvas.toDataURL("image/jpeg", 0.7)
                    resolve(resizedBase64)
                }

                image.onerror = reject
            }

            reader.onerror = reject
        })
    }

    const fileSelectHandler = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files

        let fileUrl: any
        let convertedImage: any

        if (!files || files.length === 0)
            return

        const file = files[0]

        try {
            fileUrl = URL.createObjectURL(file)
            setPreviewImage(fileUrl)

            setIsLoadingStatus(true)

            convertedImage = await convertImage(file)

            storeImageLocally("uploadedImage", convertedImage)

            const stripedConvertedImage = convertedImage.split(",")[1]
            
            await postImage(stripedConvertedImage)
        } catch (error) {
            console.error("Error processing image:", error)
            alert("Failed to process the image. Please try again.")
        }

        setIsLoadingStatus(false)
    }

    const postImage = async (base64String: string) => {
        try {
            const response = await fetch(
                "https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ image: base64String }),
                }
            )

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`)
            }

            const data = await response.json()

            if (data.success === true) {
                storeImageLocally("demographicData", JSON.stringify(data.data))
                alert("Image analyzed successfully!")
                // router.push("/selectPage")
            } else {
                throw new Error("POST Unsuccessful.")
            }
        } catch (error) {
            console.error("API Error:", error)
            alert("Failed to analyze image. Please try again.")
        }
    }

    return (
        <>
            <div
                className={`relative md:absolute md:left-[45%] lg:left-[50%] xl:left-[55%] flex flex-col items-center mt-12 md:mt-0 justify-center md:translate-y-[0%] 
                    -translate-y-[10%] transition-opacity duration-300 ${isModalStatusOpen ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]" />

                <Image src={SmallRectangleLayer1} className="absolute w-[270px] h-[270px] md:w-[482px] md:h-[482px] animate-spin-slow rotate-205" alt="Small Rectangle Layer" />
                <Image src={SmallRectangleLayer2} className="absolute w-[230px] h-[230px] md:w-[444.34px] md:h-[444.34px] animate-spin-slower rotate-195" alt="Smaller Rectangle Layer" />
                <Image src={SmallRectangleLayer3} className="absolute w-[190px] h-[190px] md:w-[405.18px] md:h-[405.18px] animate-spin-slowest" alt="Smallest Rectangle Layer" />

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Image src={GalleryIcon} alt="Gallery Upload Icon" className="absolute w-[100px] h-[100px] md:w-[136px] md:h-[136px] hover:scale-108 duration-700 ease-in-out cursor-pointer"
                        onClick={galleryOptionHandler} />

                    <div className="absolute top-[75%] md:top-[70%] md:left-[17px] -translate-y-2.5">
                        <p className={`text-[12px] md:text-[14px] font-normal mt-2 leading-6 text-right ${roobertFontRegular.className}`}>
                            ALLOW A.I.
                            <br />
                            ACCESS GALLERY
                        </p>
                        <Image src={GalleryIconUnion} alt="Gallery Line" className="absolute hidden md:block md:left-[120px] md:bottom-[39px]" />
                    </div>
                </div>
            </div>

            <div className={`absolute top-[-75px] right-7 md:top-[-50px] md:right-8 transition-opacity duration-300 ${isModalStatusOpen ? "opacity-50" : "opacity-100"}`}>
                <h1 className={`text-xs md:text-sm font-normal mb-1 ${roobertFontRegular.className}`}>
                    Preview
                </h1>
                <div className="w-24 h-24 md:w-32 md:h-32 border border-gray-300 overflow-hidden">
                    {imagePreview && (
                        <Image src={imagePreview} className="w-full h-full object-cover" width={128} height={128} alt="Uploaded Image Preview" />
                    )}
                </div>
            </div>

            {isLoadingStatus && (
                <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-11">
                    <div className="w-[270px] h-[270px] md:w-[482px] md:h-[482px]" />

                    <Image src={SmallRectangleLayer1} className="absolute w-[270px] h-[270px] md:w-[482px] md:h-[482px] animate-spin-load rotate-205" alt="Small Rectangle Layer" />
                    <Image src={SmallRectangleLayer2} className="absolute w-[230px] h-[230px] md:w-[444.34px] md:h-[444.34px] animate-spin-loader rotate-195" alt="Smaller Rectangle Layer" />
                    <Image src={SmallRectangleLayer3} className="absolute w-[190px] h-[190px] md:w-[405.18px] md:h-[405.18px] animate-spin-loadest" alt="Smallest Rectangle Layer" />
                    <div className="absolute bg-white p-4 space-y-0">
                        <p className={`text-base font-semibold leading-6 tracking-tight ${roobertFontSemiBold.className}`}>
                            PREPARING YOUR ANALYSIS...
                        </p>
                        <div>
                            <LoadingDots />
                        </div>
                    </div>
                </div>
            )}

            <input type="file" accept="image/*" className="hidden" ref={imageFileInputRef} onChange={fileSelectHandler} />
        </>

    )
}