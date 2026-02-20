"use client"

import Link from 'next/link'
import {api} from "@/lib/api"


export const getUser = async()=>{
  const authUser = await api.get('/api/auth/accesstoken');
  return authUser.data; 
}

export default function ShareForm(){
 
  return <Link href={'/meals/share'} className="w-52 xl:w-64 mx-5 p-1   cursor-pointer bg-gradient-to-r from-amber-400 to-red-700 text-white text-xs md:text-sm xl:text-lg font-semibold rounded-md relative z-10 ">
          Share Your Favorite Recipe
        </Link>
        
       
}