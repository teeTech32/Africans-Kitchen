"use client"

import { useState, useEffect, useActionState} from "react"
import { TiDelete } from "react-icons/ti";
import { useRouter, redirect } from "next/navigation";
import { checkEmailExist } from "@/lib/actions";

export default function   CheckEmail(){
  const [state, formAction, isPending] = useActionState(checkEmailExist, {message: null})
  const [checkEmailAlert, setCheckEmailAlert] = useState('')
  const [emailData, setEmailData] = useState('')
  const router = useRouter()
  useEffect(() => {
  if (!state.message) return;

  setCheckEmailAlert(state.message);

  const timeout = setTimeout(() => {
    setCheckEmailAlert('');
    if (state.message === "Email sent, check your inbox to proceed") {
      setEmailData('');
      redirect('/');
    }
  }, 5000);

  return () => clearTimeout(timeout);
}, [state.message]);

   return<div className="fixed h-full w-screen bg-black/75  z-50 top-0  left-0 backdrop-blur-sm" data-aos='fade-up'
   data-aos-offset='200'
   data-aos-delay='200'
   data-aos-duration='1500'
   data-aos-easing='linear'>
            {checkEmailAlert && <p className={`${state.message === "Email sent, check your inbox to proceed" ? 'bg-green-600' : 'bg-red-600'} text-white  text-center text-sm md:text-lg xl:text-xl font-bold my-10 p-2 mx-10 md:mx-20 rounded-md `}>
                {state.message}
              </p>}
              <div className="flex justify-center">
                <div className="relative mt-20 h-[200px] w-[300px]  bg-transparent  rounded-lg bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300">
                  <button type="button" className="absolute top-2 right-3">
                    <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/meals')} />
                  </button>
                  <header className="text-center text-white text-sm font-extrabold p-4">
                    Account Confirmation
                  </header>
                  <form action={formAction} >
                    <p className="mx-5 mt-5 mb-3 flex flex-col">
                      <label htmlFor="Check Email" className="text-white text-xs font-semibold">CHECK EMAIL</label>
                      <input type="email"  placeholder="userName@gmail.com" required name="email" id="email" className="w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={emailData} onChange={(e)=>setEmailData(e.target.value)}/>
                    </p>
                    <p className="text-center  mt-8 mb-3">
                      <button  type="submit" disabled={isPending} className='w-32 text-white font-semibold text-xs  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-2 rounded-md cursor-pointer hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105'>{isPending ? 'Checking...' : 'Check'}</button>
                    </p>
                  </form> 
                </div>
              </div>
            </div>
                 
}