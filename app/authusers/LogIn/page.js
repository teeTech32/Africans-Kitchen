"use client"
import { useState, useEffect, useActionState } from "react"
import Image from "next/image"
import image from "../../../assets/usersauth/images.jpeg"
import { useRouter } from "next/navigation"
import { TiDelete } from "react-icons/ti";
import { loginUsers } from "@/lib/actions"
import { FaEye, FaEyeSlash } from "react-icons/fa6"

export default function Login(){
  const [state, formAction, isPending] = useActionState(loginUsers, {message: null})
  const [loginAlert, setLoginAlert] = useState('')
  const [visible, setVisible] = useState(false)
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })
  const router = useRouter()

  useEffect(() => {
    const timeout = state.message ? setTimeout(() => {
    setLoginAlert('');
  }, 5000) : null
  if(state.message){
    setLoginAlert(state.message); 
  }else{
   setLoginData({email:'', password:''})
  }
  return ()=>{
    if(timeout) clearTimeout(timeout)
  }
}, [state.message, state.timestamp]);

  const {email, password} = loginData

  function handleChange(e){
    setLoginData({...loginData, [e.target.id]: e.target.value})
  }

   return<div className="fixed h-full w-screen bg-black/75   z-50 top-0  left-0 backdrop-blur-sm"
   data-aos='fade-down'
   data-aos-offset='200'
   data-aos-delay='200'
   data-aos-duration='1500'
   data-aos-easing='linear'>
              {loginAlert && <p className="bg-red-600 p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold my-15 md:mt-10 ">
                 {state.message}
               </p>}
               <div className=" md:h-[410px] h-[300px] md:w-[610px]  md:flex-row md:flex rounded-md bg-amber-600 -translate-y-1/2 -translate-x-1/2 top-1/2  left-1/2 absolute">
                 <div className="flex justify-center md:m-2">
                   <Image src={image} alt="SingUp Image" width={500} height={700} className="h-[399px] w-[300px] object-cover hidden md:block rounded-l-lg "/>
                     <div className="flex justify-center">
                       <p className="hidden md:block text-white text-sm font-extrabold absolute top-6 right-45">Welcome Back</p>
                       <div className="relative md:mt-12 h-[351px] w-[300px]  bg-transparent md:rounded-l-none rounded-lg bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300">
                        <button type="button" className="absolute top-2 right-2 ">
                          <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl cursor-pointer " onClick={()=>router.push('/meals')} />
                        </button>
                         <header className="text-center text-white text-sm font-extrabold p-4">
                           LogIn
                         </header>
                         <form action={formAction} >
                           <p className="mx-5 my-2">
                             <label htmlFor="Email" className="text-white text-xs font-semibold">YOUR EMAIL</label>
                             <input type="email" placeholder="userName@gmail.com" required name="email" id="email" className="w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={email} onChange={handleChange} />
                           </p>
                           <div className="mx-5 mt-5 mb-3 flex flex-col">
                             <label htmlFor="Password" className="text-white text-xs font-semibold">PASSWORD</label>
                             <input type={visible ? "text" : "password"}  placeholder="********" required name="password" id="password" className="relative w-full p-2 bg-gray-950 rounded-sm text-white text-xs" value={password} onChange={handleChange}/>
                             <p className="absolute right-8 top-39 cursor-pointer text-2xl text-white" onClick={() => setVisible(!visible)}>
                                {visible ? <FaEyeSlash/> : <FaEye/>}
                              </p> 
                           </div>
                           <p className="float-right ">
                              <button  type="button"  className='text-white font-semibold text-xs  hover:text-yellow-400 cursor-pointer hover:transition-1000 duration-500 hover:scale-105 mx-5'onClick={()=>router.push('/authusers/CheckEmail')}>     
                                Forgot Password
                              </button>
                           </p>
                           <p className="text-center  mt-15 mb-3">
                             <button  type="submit" disabled={isPending} className='w-32 text-white font-semibold text-xs  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-2 rounded-md cursor-pointer hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105'>{isPending ? 'Loging...' : 'LogIn'}</button>
                           </p>
                           <div className="flex justify-center mt-5">
                             <button type="button" className="text-center text-white text-xs"> Haven&apos;t you created an account ?<span className='text-transparent bg-clip-text font-extrabold  bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 rounded-md cursor-pointer  hover:text-white hover:transition-1000 duration-500 hover:scale-105 ml-1' onClick={()=>router.push('/authusers/SignUp')}>SignUp</span>
                             </button>
                           </div>
                         </form> 
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
}