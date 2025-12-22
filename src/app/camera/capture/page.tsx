"use client"

import { useRef, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import localFont from "next/font/local"
import LoadingDots from "../../components/UI/LoadingDots"
import BackButton from "../../components/UI/BackButton"
import Image from "next/image"
import CameraCaptureIcon from "../../components/assets/Capture-Image-icon.svg"

const roobertFontRegular = localFont({
  src: "../../fonts/RoobertTRIAL-Regular.woff2",
  weight: "400"
})

const roobertFontSemiBold = localFont({
  src: "../../fonts/RoobertTRIAL-SemiBold.woff2",
  weight: "600"
})

export default function CameraCapture() {

  const cameraRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [cameraImage, setCameraImage] = useState<string | null>(null)
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  const [isStatusLoading, setIsStatusLoading] = useState(false)
  const [isCameraStatusReady, setIsCameraStatusReady] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setErrorStatus(null)

    const cameraPermissions = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        })

        setMediaStream(mediaStream)
      } catch (error) {
        setErrorStatus(`Camera Permissions Error: ${error}`)
        setTimeout(() => router.push("/result"), 3000)
      }
    }

    cameraPermissions()
  }, [])

  useEffect(() => {
    if (mediaStream && cameraRef.current) {
      cameraRef.current.srcObject = mediaStream

      const cameraImageMetaData = () => {
        if (cameraRef.current) {
          cameraRef.current.play().then(() => {
            setIsCameraStatusReady(true)
          }).catch((error) => {
            setErrorStatus(`Camera Playback Error: ${error}`)
          })
        }
      }

      cameraRef.current.addEventListener("loadedmetadata", cameraImageMetaData)

      return () => {
        if (cameraRef.current) {
          cameraRef.current.removeEventListener("loadedmetadata", cameraImageMetaData)
        }
      }
    }
  }, [mediaStream])

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  const capturePhoto = () => {
    setErrorStatus(null)

    if (!cameraRef.current || !canvasRef.current) {
      setErrorStatus("Photo/Canvas is N/A.")
      return
    }

    if (!isCameraStatusReady) {
      setErrorStatus("Camera is not ready, please try again.")
      return
    }

    try {
      const currentCameraRef = cameraRef.current
      const currentCanvasRef = canvasRef.current
      const currentCanvasContext = currentCanvasRef.getContext("2d")
      currentCanvasRef.width = currentCameraRef.videoWidth
      currentCanvasRef.height = currentCameraRef.videoHeight

      if (!currentCameraRef.videoWidth || !currentCameraRef.videoHeight) {
        setErrorStatus("Invalid Camera Dimensions, please try again.")
        return
      }

      if (!currentCanvasContext) {
        setErrorStatus("Could not get canvas context")
        return
      }

      currentCanvasContext.fillStyle = "#FFFFFF"
      currentCanvasContext.fillRect(0, 0, currentCanvasRef.width, currentCanvasRef.height)
      currentCanvasContext.drawImage(currentCameraRef, 0, 0, currentCanvasRef.width, currentCanvasRef.height)

      setCameraImage(currentCanvasRef.toDataURL("image/jpeg", 0.9))

      stopCamera()
    } catch (error) {
      setErrorStatus(`Error Capturing your image: ${error}`)
    }
  }

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => {
        track.stop()
      })
      setMediaStream(null)
      setIsCameraStatusReady(false)
    }
  }

  const restartCamera = async () => {
    setCameraImage(null)
    setErrorStatus(null)
    setIsCameraStatusReady(false)

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false
      })

      setMediaStream(mediaStream)
    } catch (error) {
      setErrorStatus(`There was an error restarting your camera: ${error}`)
    }
  }

  const postImage = async () => {
    if (!cameraImage) {
      setErrorStatus("No Image was captured, please try again.")
      return
    }

    setIsStatusLoading(true)
    setErrorStatus(null)

    try {
      try {
        localStorage.setItem("uploadedImage", cameraImage)
      } catch (error) {
        setErrorStatus(`Failed to store your Image locally: ${error}`)
      }

      const apiResponse = await fetch("https://us-central1-frontend-simplified.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ image: cameraImage.split(",")[1] }),
        }
      )


      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`)
      }

      const apiData = await apiResponse.json()

      if (apiData.success === true) {
        localStorage.setItem("demographicData", JSON.stringify(apiData.data))
        router.push("/select")
      } else {
        throw new Error("API Response Unsuccessful.")
      }
    } catch (error) {
      setErrorStatus(`${error}`)
      setIsStatusLoading(false)
    }
  }

  return (
    <div className="relative h-[92vh] w-screen overflow-hidden bg-gray-900">
      {errorStatus && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-red-100 border border-red-400 text-red-700 
          px-4 py-3 rounded max-w-md ${roobertFontRegular.className}`}>
          <p>
            {errorStatus}
          </p>
        </div>
      )}

      {mediaStream && !isCameraStatusReady && !cameraImage && (
        <div className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-gray-100 border border-blue-400 text-blue-700 
          px-4 py-3 rounded max-w-md ${roobertFontRegular.className}`}>
          <p>Initializing camera, please wait...</p>
        </div>
      )}

      {mediaStream && !cameraImage && (
        <div className="absolute inset-0 z-10">
          <video ref={cameraRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />

          {
            isCameraStatusReady && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 flex items-center space-x-3">
                <div className={`font-semibold text-sm tracking-tight leading-3.5 text-[#FCFCFC] hidden sm:block ${roobertFontSemiBold.className}`}>
                  TAKE PICTURE
                </div>
                <div className="transform hover:scale-105 ease-in-out duration-300">
                  <Image src={CameraCaptureIcon} className="w-16 h-16 cursor-pointer" alt="Camera Capture Icon" onClick={capturePhoto} />
                </div>
              </div>)
          }

          <div className="absolute bottom-30 sm:bottom-40 left-0 right-0 text-center z-20">
            <p className={`text-sm mb-2 font-normal leading-6 text-[#FCFCFC] ${roobertFontRegular.className}`}>
              TO GET BETTER RESULTS MAKE SURE TO HAVE
            </p>
            <div className={`flex justify-center space-x-8 text-xs leading-6 text-[#FCFCFC] ${roobertFontRegular.className}`}>
              <p>◇ NEUTRAL EXPRESSION</p>
              <p>◇ FRONTAL POSE</p>
              <p>◇ ADEQUATE LIGHTING</p>
            </div>
          </div>
        </div>
      )}

      {
        cameraImage && (
          <div className="absolute inset-0 z-10 flex flex-col items-center">
            <img src={cameraImage} className="absolute inset-0 w-full h-full object-cover" alt="Captured Camera Image" />
            <div className={`absolute text-sm leading-6 uppercase text-[#FCFCFC] top-40 ${roobertFontSemiBold.className}`}>
              Good Shot!
            </div>

            <div className="absolute bottom-40 sm:bottom-16 left-0 right-0 flex flex-col items-center z-20">
              <h2 className={`text-lg font-semibold mb-5 md:mb-7 text-[#FCFCFC] drop-shadow-md ${roobertFontRegular.className}`}>
                Preview
              </h2>
              <div className="flex justify-center space-x-6">
                <button className={`px-4 py-1 bg-gray-200 text-gray-800 cursor-pointer hover:bg-gray-300 shadow-md text-sm ${roobertFontRegular.className}`}
                  onClick={restartCamera}>
                  Retake
                </button>
                <button
                  className={`px-6 py-2 bg-[#1A1B1C] text-[#FCFCFC] cursor-pointer hover:bg-gray-800 shadow-md text-sm ${roobertFontRegular.className}`}
                  onClick={postImage} disabled={isStatusLoading}>
                  {
                    isStatusLoading ?
                      "Uploading..." :
                      "Use This Photo"
                  }
                </button>
              </div>
            </div>
          </div>)
      }

      <div className="absolute md:bottom-8 bottom-60 left-8 z-20">
        <Link href="/result">
          <BackButton isWhite={true} />
        </Link>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {
        isStatusLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#FCFCFC]  opacity-50 p-6 rounded-lg shadow-lg text-center">
              <p className={`text-xl animate-pulse ${roobertFontRegular.className}`}>ANALYZING IMAGE...</p>
              <LoadingDots />
            </div>
          </div>)
      }
    </div>
  )
}