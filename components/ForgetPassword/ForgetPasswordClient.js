"use client"

import { useState, } from "react"
import Image from "next/image"
import image from "@/assets/usersauth/image.jpeg"
import { useSearchParams, useRouter} from "next/navigation";
import { TiDelete } from "react-icons/ti";
import { FaEye, FaEyeSlash } from "react-icons/fa6"

export default function ForgetPasswordClient(){
  const [isPending, setIsPending] = useState(false)
  const [visible, setVisible] = useState(false)
  const [visibles, setVisibles] = useState(false)
  const [passwordReclaimAlert, setPasswordReclaimAlert] = useState('')
  const [inputData, setInputData] =  useState({
    password: '',
    confirmpassword: ''
  })
  const searchParams = useSearchParams()
  const router = useRouter()
  const {password, confirmpassword} = inputData

  function handleOnchange(e){
    setInputData({
      ...inputData, [e.target.id]: e.target.value
    })
  }
  const token = searchParams.get('token')
  async function handleOnsubmit(e){
    try{
      e.preventDefault()
      setIsPending(true)
      if(!password || !confirmpassword){
        setTimeout(()=>{
        setIsPending(false)
        setPasswordReclaimAlert('Check your inputs')
        },3000)      
        return setTimeout(()=>{
          setPasswordReclaimAlert('')
        },8000)
      } 
      if(password !== confirmpassword){
        setTimeout(()=>{
        setIsPending(false)
        setPasswordReclaimAlert('Password and confirmPassword must be matched')
        },3000)      
        return setTimeout(()=>{
          setPasswordReclaimAlert('')
        },8000)
      }
      const body = {
        token: token,
        password: password
      }
      const resetPassword = await fetch('/api/auth/resetpassword',{
        method: 'POST',
        body: JSON.stringify(body),
        headers: {'Content-Type':'application/json'}
      })
      const resetData = await resetPassword.json()
      if(resetData.message){
        setTimeout(()=>{
        setIsPending(false)
        setPasswordReclaimAlert(resetData.message)
        setInputData({password:'', confirmpassword:''})
        },3000)      
        return setTimeout(()=>{
          setPasswordReclaimAlert('')
          router.push('/authusers/LogIn')
        },8000)
      }
       if(resetData.error){
        setTimeout(()=>{
        setIsPending(false)
        setPasswordReclaimAlert(resetData.error)
        },3000)      
        return setTimeout(()=>{
          setPasswordReclaimAlert('')
        },8000)
      }
    }catch(error){
      return setPasswordReclaimAlert('Something went wrong')
    }
  }

   return<div className="fixed h-full w-screen bg-black/75  z-50 top-0  left-0 backdrop-blur-sm">
              {passwordReclaimAlert && <p className={`${passwordReclaimAlert === "Password reset successfully" ? 'bg-green-600' : 'bg-red-600'} text-white  text-center text-sm md:text-lg xl:text-xl font-bold my-10 p-2 mx-10 md:mx-20 rounded-md `}>
                {passwordReclaimAlert}
              </p>}
               <div className="md:h-[410px] h-[300px] md:w-[610px]  md:flex-row md:flex rounded-md bg-amber-600 -translate-y-1/2 -translate-x-1/2 top-1/2  left-1/2 absolute">
                 <div className="flex justify-center md:m-2">
                   <Image src={image} alt="SingUp Image" width={500} height={700} className="h-[399px] w-[300px] object-cover hidden md:block rounded-l-lg "/>
                     <div className="flex justify-center">
                       <p className="hidden md:block text-white text-sm font-extrabold absolute top-6 right-30">Reclaim Your Account</p>
                       <div className=" md:mt-12 h-[351px] w-[300px]  bg-transparent md:rounded-l-none rounded-lg bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300">
                          <button className="absolute top-3  right-3">
                            <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/meals')} />
                          </button>
                          <header className="text-center text-white text-sm font-extrabold p-4">
                            Account Reclaiming
                          </header>
                          <form onSubmit={handleOnsubmit} >
                            <div className="mx-5 my-2">
                              <label htmlFor="New password" className="text-white text-xs font-semibold">NEW PASSWORD</label>
                              <input type={visibles ? "text" : "password"}  placeholder="********" required name="password" id="password" className="relative w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={password} onChange={handleOnchange}/>
                              <p className="absolute right-8 top-22 md:top-36 cursor-pointer text-2xl text-white" onClick={() => setVisibles(!visibles)}>
                                {visibles ? <FaEyeSlash/> : <FaEye/>}
                              </p> 
                            </div>
                            <div className="mx-5 mt-5 mb-3 flex flex-col">
                              <label htmlFor="Confirm password" className="text-white text-xs font-semibold">CONFIRM NEW PASSWORD</label>
                              <input type={visible ? "text" : "password"}  placeholder="********" required name="confirmpassword" id="confirmpassword" className="relative w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={confirmpassword} onChange={handleOnchange}/>
                              <p className="absolute right-8 top-39 md:top-53 cursor-pointer text-2xl text-white" onClick={() => setVisible(!visible)}>
                                {visible ? <FaEyeSlash/> : <FaEye/>}
                              </p> 
                            </div>
                            
                            <p className="text-center  mt-15 mb-3">
                              <button type="submit" disabled={isPending} className='w-32 text-white font-semibold text-xs  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-2 rounded-md cursor-pointer hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105'>{isPending ? 'Resetting...' : 'Reset Password'}</button>
                            </p>
                         </form> 
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
}