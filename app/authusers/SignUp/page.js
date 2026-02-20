"use client"

import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useState, useEffect, useActionState } from "react";
import image from "../../../assets/usersauth/imagess.jpg"
import Image from "next/image";
import {signupUsers} from "@/lib/actions"
import { TiDelete } from "react-icons/ti";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6"

export default function Signup(){
  const [state, formAction, isPending] = useActionState(signupUsers, {message:null});
  const [signupAlert, setSignupAlert] = useState()
  const [visible, setVisible] = useState(false)
  const [isvisible, setIsvisible] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [signupData, setSignupData] = useState({
    name:'',
    email:'',
    password:'',
    confirmPassword:''
  })
  const router = useRouter()
  
  useEffect(() => {
    
  const timeout = state.message ? setTimeout(() => {
    setSignupAlert('');
  }, 5000) : null;

  if(state.message) {
    setSignupAlert(state.message);
    if(state.message === "Email sent, check your email to Login"){
      setSignupData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
    setTimeout(()=>{
      setEmailSent(true)
    },5000)
    }
  }
  return () => {
    if(timeout) clearTimeout(timeout);
  };
}, [state.message, router]);

  function handleChange(e){
    setSignupData({...signupData, [e.target.id]: e.target.value })
  }

  function closeNotification(){
    router.push('/')
  }
  
  const { name, email, password, confirmPassword } = signupData

return <>{emailSent ?  <div className="fixed w-screen h-full bg-black/75 z-50">
      <div className="bg-amber-600 w-[410px] md:w-[510px] h-[410px] md:h-[510px] rounded-lg -translate-y-1/2 -translate-x-1/2 top-1/2 left-1/2 absolute">
        <div className="flex justify-center">
          <div className="bg-transparent bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-lg mt-1.5">
            <h1 className="text-white flex justify-center text-sm md:text-xl font-bold pt-5 pb-5">Email Verification Alert</h1>
            <button type="button" className="absolute top-3 right-3">
              <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>closeNotification()} />
            </button>
            <div className='flex justify-center'>
              <DotLottieReact
                        autoplay
                        loop
                        src="/images/notificatio.lottie"
                        className="w-full max-w-[250px] h-[250px] md:h-[300px] md:max-w-[300px] bg-white rounded-xl shadow-2xl"
                      />
            </div>
            <p className="text-white text-xs md:text-lg flex justify-center p-5 ">Check the provided email inbox to continue your registration, if you can&apos;t find a verification note after some minutes, then you have provided a wrong email address. </p>
        </div>
        </div>
      </div>
   </div> : <div className="fixed h-full w-screen bg-black/75  z-50 top-0  left-0 backdrop-blur-sm" data-aos='fade-down'
   data-aos-offset='200'
   data-aos-delay='200'
   data-aos-duration='1500'
   data-aos-easing='linear'>
           {signupAlert && <p className={`${signupAlert === "Email sent, check your email to Login" ? 'bg-green-600' : 'bg-red-600'} p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold my-10 md:mt-10`}>
              {signupAlert}
            </p>}
            <div className="md:h-[410px] h-[400px] md:w-[610px]  md:flex-row md:flex rounded-md bg-amber-600 -translate-y-1/2 -translate-x-1/2 top-1/2  left-1/2 absolute">
              <div className="flex justify-center md:m-2">
                <Image src={image} alt="SingUp Image" priority width={500} height={700} className="h-[399px] w-[300px] object-cover hidden md:block rounded-l-lg "/>
                  <div className="flex justify-center">
                  <p className="hidden md:block text-white text-sm font-extrabold absolute top-2 right-55">Welcome</p>
                    <div className="md:h-[370px] h-[400px] w-[300px]  bg-transparent md:rounded-l-none rounded-lg bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300 md:mt-7">
                      <button type="button" className="absolute top-3 right-3 md:top-10">
                        <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/meals')} />
                      </button>
                      <header className="text-center text-white text-sm font-extrabold md:p-2 p-4">
                        Register
                      </header>
                      <form action = {formAction} >
                        <p className="mx-5 mb-2 mt-1">
                          <label htmlFor="Name" className="text-white text-xs font-semibold">YOUR NAME</label>
                          <input type="text" placeholder="name" required name="name" id="name" className="w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={name} onChange={handleChange} />
                        </p>
                        <p className="mx-5 my-2">
                          <label htmlFor="Email" className="text-white text-xs font-semibold">YOUR EMAIL</label>
                          <input type="email" placeholder="userName@gmail.com" required name="email" id="email" className="w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={email} onChange={handleChange} />
                        </p>
                        <div className="mx-5 my-2 flex flex-col">
                          <label htmlFor="Password" className="text-white text-xs font-semibold mb-0.5">PASSWORD</label>
                          <input type={isvisible ? "text" : "password"}  placeholder="********" required name="password" id="password" className="w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={password} onChange={handleChange}/>
                          <p className="absolute right-8 bottom-43 md:bottom-40.5 cursor-pointer text-2xl text-white" onClick={() => setIsvisible(!isvisible)}>
                                {isvisible ? <FaEyeSlash/> : <FaEye/>}
                          </p> 
                        </div>
                        <div className="mx-5 my-2">
                          <label htmlFor="ConfirmPassword" className="text-white text-xs font-semibold">CONFIRM PASSWORD</label>
                          <input type={visible ? "text" : "password"} placeholder="********" required name="confirmPassword" id="confirmPassword" className="w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={confirmPassword} onChange={handleChange} />
                          <p className="absolute right-8 bottom-27 md:bottom-24.5 cursor-pointer text-2xl text-white" onClick={() => setVisible(!visible)}>
                                {visible ? <FaEyeSlash/> : <FaEye/>}
                          </p> 
                        </div>
                        <p className="text-center my-5 md:my-4">
                          <button  type="submit" disabled={isPending} className='w-32 text-black font-extrabold text-xs  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-2 rounded-md cursor-pointer hover:text-white hover:transition-1000 duration-500 hover:scale-105'>{isPending ? 'Signing...' : 'SignUp'}</button>
                        </p>
                        <div className="flex justify-center">
                          <button type="button" className="text-center text-white text-xs"> Have you created an account ?<span className='text-black font-extrabold  hover:text-white hover:transition-1000 duration-500 hover:scale-105 ml-1'onClick={()=>router.push('/authusers/LogIn')}>LOGIN</span>
                          </button>
                        </div>
                      </form> 
                    </div>
                  </div>
                </div>
              </div>
            </div>}
   </>
}