"use client"

import { useState,useEffect, useActionState } from "react";
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
  } else {
    setSignupData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  }
  return () => {
    if(timeout) clearTimeout(timeout);
  };
}, [state.message]);

  function handleChange(e){
    setSignupData({...signupData, [e.target.id]: e.target.value })
  }
  const { name, email, password, confirmPassword } = signupData

   return<div className="fixed h-full w-screen bg-black/75  z-50 top-0  left-0 backdrop-blur-sm"    data-aos='fade-down'
   data-aos-offset='200'
   data-aos-delay='200'
   data-aos-duration='1500'
   data-aos-easing='linear'>
           {signupAlert && <p className="bg-red-600 p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold my-10 md:mt-10">
              {signupAlert}
            </p>}
            <div className="md:h-[410px] h-[400px] md:w-[610px]  md:flex-row md:flex rounded-md bg-amber-600 -translate-y-1/2 -translate-x-1/2 top-1/2  left-1/2 absolute">
              <div className="flex justify-center md:m-2">
                <Image src={image} alt="SingUp Image" width={500} height={700} className="h-[399px] w-[300px] object-cover hidden md:block rounded-l-lg "/>
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
                          <label htmlFor="Password" className="text-white text-xs font-semibold">PASSWORD</label>
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
                          <button  type="submit" disabled={isPending} className='w-32 text-white font-semibold text-xs  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-2 rounded-md cursor-pointer hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105'>{isPending ? 'Signing...' : 'SignUp'}</button>
                        </p>
                        <div className="flex justify-center">
                          <button type="button" className="text-center text-white text-xs"> Have you created an account ?<span className='text-transparent bg-clip-text font-extrabold  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 rounded-md cursor-pointer  hover:text-white hover:transition-1000 duration-500 hover:scale-105 ml-1'onClick={()=>router.push('/authusers/LogIn')}>LOGIN</span>
                          </button>
                        </div>
                      </form> 
                    </div>
                  </div>
                </div>
              </div>
            </div>
}