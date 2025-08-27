"use client"

import { useState } from "react"
import Image from "next/image"
import logo from "../../assets/head.jpeg"
import Link from "next/link"
import MainHeaderBg from "./MainHeaderBg"
import NavLink from "./NavLink"
import { AiOutlineClose } from 'react-icons/ai';
import { BiMenu } from 'react-icons/bi';
import { useRouter } from "next/navigation"

export default function Header(){
  const [istoggle, setIstoggle] = useState(false)
  const [toggleLogout, setToggleLogout] = useState(false)
  const router = useRouter()

  async function handleLoggOut(){
    await fetch('/api/me/logout',{method: 'POST'})
    router.push('/')
  }

  return<div className="fixed top-0 left-0 z-10 w-full mb-2 ">
          <MainHeaderBg/>
          <main>
            <div data-aos='zoom-in'
                 data-aos-offset='200'
                 data-aos-delay='50'
                 data-aos-duration='1000'
                 data-aos-easing='ease-in-out'>
              <Link href={'/'} className="inline-flex cursor-pointer">
                <Image src={logo} alt="It's a plate of food logo" priority   className="m-4 md:m-6 xl:m-8 w-10 h-10 md:w-15 md:h-15  xl:w-20 xl:h-20 relative shadow-black shadow-2xl rounded-full"/>
                <p className="absolute top-4 md:top-8  xl:top-12 left-16 md:left-24  xl:left-30 text-sm md:text-xl  xl:text-2xl text-white hover:text-transparent hover:bg-gradient-to-r hover:from-yellow-300 hover:via-red-600 hover:to-orange-400 hover:bg-clip-text transition-all duration-500 drop-shadow-lg hover:drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  translate-0.5 scale-110 font-extrabold align-middle xl:mx-2">AFRICANS&apos; KITCHEN</p>
              </Link>
            </div>
            <div className={` flex-col lg:flex-row absolute right-4 xl:right-4 top-5 xl:top-7 lg:flex  ${istoggle ? 'block' : 'hidden'} bg-amber-400  rounded-b-md lg:bg-transparent`} >
              <NavLink href={'/meals'} className="my-2">
                Browse Meals
              </NavLink>
              <NavLink href={'/community'} className="my-2">
                Foodies Community
              </NavLink>
              <NavLink href={'/authusers/SignUp'} className="hover:text-orange-600">
                <button className="hover:text-orange-600 cursor-pointer">
                  SignUp
                </button>
              </NavLink>
              <NavLink href={'/authusers/LogIn'}>
                <button className="hover:text-orange-600 cursor-pointer">
                  LogIn
                </button>
              </NavLink>
              <div className="flex float-left flex-col text-white my-1  mx-3 font-bold cursor-pointer">
                <button onClick={()=>setToggleLogout((toggleLogout)=>!toggleLogout)} className="cursor-pointer text-sm md:text-lg xl:text-xl font-bold lg:mt-3 xl:mt-4 hover:text-orange-600">
                  Settings:
                </button>
                {toggleLogout &&  <button className="my-2 cursor-pointer text-xs lg:text-sm hover:text-orange-600 z-10" onClick={handleLoggOut} >
                                    LogOut
                                  </button>}
              </div>
            </div>
            <div className="hover:text-orange-600 text-white text-3xl cursor-pointer top-4 right-5 absolute lg:hidden " onClick={()=>setIstoggle((istoggle)=> !istoggle)}>
              { istoggle ? <AiOutlineClose className="text-2xl"/> : <BiMenu />}
            </div>
          </main>
        </div>
}