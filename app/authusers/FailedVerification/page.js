"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";


export default function VerificationFailed(){
  const router = useRouter()

  return<div className="fixed w-screen h-full bg-black/75 z-50">
          <div className="bg-amber-600 w-[410px] md:w-[510px] h-[435px] md:h-[520px] rounded-lg -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 absolute">
            <div className="flex justify-center">
              <div className="bg-transparent bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300 w-[400px] h-[425px] md:w-[500px] md:h-[510px] rounded-lg mt-1.5">
                <h1 className="text-white flex justify-center text-sm md:text-xl font-bold pt-4 pb-4">Failed Verification</h1>
                <button type="button" className="absolute top-3 right-3">
                  <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/')} />
                </button>
                <div className='flex justify-center'>
                  <DotLottieReact
                            autoplay
                            loop
                            src="/images/application.lottie"
                            className="w-full max-w-[250px] h-[250px] md:h-[300px] md:max-w-[300px] bg-white rounded-xl shadow-2xl"
                          />
                </div>
                <p className="text-white text-xs md:text-lg flex justify-center p-5 ">Your email verification failed, you might have verified your email before, try to LogIn.</p>
                <div className="flex justify-center">
                  <button className="rounded-full shadow-2xl w-68 md:w-72 md:font-extrabold p-1 text-black font-bold bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 hover:text-white hover:scale-105 cursor-pointer" onClick={()=>router.push('/authusers/LogIn')}>LogIn</button>
                </div>
              </div>
            </div>
          </div>
        </div>
} 