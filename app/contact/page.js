"use client"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import Googlemail from "@/assets/icons/google.png"
import Image from "next/image";
import { useState, useEffect, useActionState} from "react";
import { sendEmail } from "@/lib/actions";
import {toast} from 'react-toastify'


export default function ContactUs(){
  const router = useRouter()

  const [state, formAction, isPending] = useActionState(sendEmail, {message: null});
  const [emailData, setEmailData] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    subject: "",
    message: ""
  })

  useEffect(()=>{
    if(state.message){
      toast.success(state.message);
      setEmailData({fullname:"", email:"", phonenumber:"", subject:"", message:"" });
    }
    if(state.error){
      toast.error(state.error);
    }
  }, [state.error, state.message,]);

  const handleOnSubmit = (e)=>{
    if(!navigator.onLine){
      e.preventDefault();
      toast.error("You are offline!");
      return
    }
  }

  const handleOnchange = (e)=>{
    setEmailData({ ...emailData, [e.target.name]:e.target.value });
  }

  const handleEmptymail = ()=>{
    setEmailData({fullname:"", email:"", phonenumber:"", subject:"", message:"" })
  }

  const {fullname, email, phonenumber, subject, message } = emailData;

  return<div className="fixed w-screen h-full bg-black/75 z-50">
          <div className="bg-amber-600  lg:w-[830px] h-[520px] md:h-[664px] lg:h-[667px] rounded-lg -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 absolute transition-all duration-100">
          <div className=" lg:flex-row lg:flex">
            <div className=" hidden lg:block">
                <button type="button" className="absolute top-2 left-2">
                  <TiDelete className="text-white hover:text-gray-300 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/')} />
                </button>
                <div className='absolute top-8 left-10'>
                  <DotLottieReact
                            autoplay
                            loop
                            src="/images/application.lottie"
                            className="max-w-[350px] h-[350px] bg-white rounded-xl "
                          />
                </div>
                <div className="absolute left-5 bottom-0 text-black mt-6">
                  <div className="bg-transparent max-w-[350px] m-5">
                    <h1 className="font-bold text-2xl align-middle text-center">Hi, this is Africans&apos; Kitchens built  by teeTech.
                    </h1>
                    <p className="mt-3 text-center font-semibold">
                      Reach out to teeTech for innovative, industry-standard, production-ready digital solutions. From web and mobile applications to AI, cloud, automation, and enterprise systems, we build technology that drives real business results.
                    </p>
                    <h3 className="font-bold mt-3">You can also call: +234 702360 3814</h3>
                  </div>
                </div>
                <p></p>
              </div>
            </div>
            <div className="flex justify-center lg:absolute top-0.5 right-0.5">
              <form action={formAction} onSubmit={handleOnSubmit} className="relative bg-transparent bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300 max-w-[470px] h-full md:max-w-[450px] rounded-lg m-1.5 px-8">
                <button type="button" className="absolute top-3 left-3 lg:hidden">
                  <TiDelete className="text-white hover:text-gray-300 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/')} />
                </button>
                <div className="flex justify-center">
                  <h1 className="text-white font-extrabold mx-3 mt-3 mb-0 md:text-xl">
                  Send Us An Email
                  </h1>
                </div>
                <Image src={Googlemail} alt="Googlemail"  className="w-12 md:w-14 absolute right-10 top-3 md:right-10  bg-white rounded-full drop-shadow-2xl"/>
                <div className="my-3 md:my-3.5 flex flex-col">
                  <label htmlFor="fullname" className=" font-bold text-sm md:text-lg">FullName</label>
                  <input type="text" required name="fullname" placeholder="Enter Fullname" className="w-68 md:w-82 p-2 md:p-3 rounded-md bg-white text-black text-xs md:text-sm" value={fullname} onChange={handleOnchange}/>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="font-bold text-sm md:text-lg">Email</label>
                  <input type="email" required name="email" placeholder="Enter Email" className="68 md:w-82 p-2 md:p-3 rounded-md bg-white text-black text-xs md:text-sm" value={email} onChange={handleOnchange}/>
                </div>
                <div className="my-3 md:my-3.5 flex flex-col">
                  <label htmlFor="phonenumber" className=" font-bold text-sm md:text-lg">PhoneNumber</label>
                  <input type="tel" required name="phonenumber" placeholder="Enter Phonenumber" className="68 md:w-82 p-2 md:p-3 rounded-md bg-white text-black text-xs md:text-sm" value={phonenumber} onChange={handleOnchange}/>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="subject" className="font-bold text-sm md:text-lg">Subject</label>
                  <input type="text" required name="subject" placeholder="Enter Subject" className="68 md:w-82 p-2 md:p-3 rounded-md bg-white text-black text-xs md:text-sm" value={subject} onChange={handleOnchange}/>
                </div>
                <div className="my-3 md:my-3.5 flex flex-col">
                  <label htmlFor="message" className="font-bold text-sm md:text-lg">Message</label>
                  <textarea type="text" required name="message" placeholder="Enter Message" className="68 md:w-82 p-2 md:p-3 rounded-md bg-white text-black text-xs md:text-sm" rows={6} value={message} onChange={handleOnchange} />
                </div>
                <div className="my-5 md:my-6">
                  <button className="rounded-md bg-white hover:bg-gray-300 text-black p-2 w-20 text-xs md:text-sm md:w-28 font-extrabold cursor-pointer" onClick={handleEmptymail}>
                    Cancel
                  </button>
                  <button type="submit" className="rounded-md bg-white hover:bg-gray-300 text-black p-2 w-20 md:w-28 float-end text-xs font-extrabold md:text-sm cursor-pointer">
                    { isPending  ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
       
} 
