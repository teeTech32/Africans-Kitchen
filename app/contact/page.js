"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Whatsapp from "@/assets/icons/whatsapp.png"
import Googlemail from "@/assets/icons/google.png"
import Image from "next/image";


export default function ContactUs(){
  const router = useRouter()
  return<div className="fixed w-screen h-full bg-black/75 z-50">
          <div className="bg-amber-600 max-w-[380px] md:max-w-[520px] h-[435px] md:h-[520px] rounded-lg -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 absolute">
            <div className="flex justify-center">
              <div className="bg-transparent bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300 max-w-[350px] h-[425px] md:max-w-[450px] md:h-[510px] rounded-lg mt-1.5">
                <h1 className="text-white flex justify-center text-sm md:text-xl font-bold pt-3 pb-3 md:py-4">Make A Contact</h1>
                <button type="button" className="absolute top-3 right-3">
                  <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/')} />
                </button>
                <div className='flex justify-center'>
                  <DotLottieReact
                            autoplay
                            loop
                            src="/images/application.lottie"
                            className="w-full max-w-[248px] h-[248px] md:h-[300px] md:max-w-[300px] bg-white rounded-xl shadow-2xl"
                          />
                </div>
                <div className="flex-col flex ">
                  <div className="ml-10 md:ml-18 pr-10 md:pr-15 ">
                    <a href="https://mail.google.com/mail/?view=cm&fs=1&to=timothyabidemi4618@gmail.com" target="_blank"  rel="noopener noreferrer">
                      <button className="relative rounded-full shadow-2xl w-62 md:w-76 md:font-extrabold my-2  p-4 md:p-5 text-black font-bold bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 hover:text-white hover:scale-105 cursor-pointer">Email</button>
                      <Image src={Googlemail} alt="Googlemail"  className="w-12 md:w-14 absolute left-11 md:left-19.5 bottom-19 md:bottom-21.5 bg-white rounded-full drop-shadow-2xl"/>
                    </a>
                    <a href="https://wa.me/2347032603814"  target="_blank"  rel="noopener noreferrer" >
                      <button className="relative rounded-full shadow-2xl w-62 md:w-76 md:font-extrabold mb-2 p-4 md:p-5 text-black font-bold bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 hover:text-white hover:scale-105 cursor-pointer">WhatsApp</button>
                      <Image src={Whatsapp} alt="WhatsApp" className="w-12 md:w-14 absolute left-11 md:left-19.5 bottom-3 md:bottom-3.5 bg-white rounded-full drop-shadow-2xl"/>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
} 
