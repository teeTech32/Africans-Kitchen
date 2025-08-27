"use client"

import { useState, useTransition } from "react";
import { deleteMeal } from "@/lib/meals";
import { IoCheckmarkDoneSharp } from "react-icons/io5"; 
import { FaXmark } from "react-icons/fa6";
import { useRouter } from 'next/navigation'
import {revalidatePage} from '@/lib/revalidatepage'


export default function DeleteMeal({setIsdeleted, params}){
  const [isPending, startTransition] = useTransition();
  const [deleteAlert, setDeleteAlert] = useState(false)
  const router = useRouter()

  const  handleDeleteMeal = ()=>{
    startTransition(async()=>{
      const { id } = await params;
      const result = await deleteMeal(id);
      if(!result.success){
        setDeleteAlert(true)
        setTimeout(()=>{
          setDeleteAlert(false)
          router.push('/meals')
        },5000)
      }else{
      router.refresh()
      await revalidatePage();
      router.push('/meals')
      }
    })
  }
 
  return<div className="fixed h-full w-screen bg-black/75  z-50 top-0  left-0 backdrop-blur-sm">
         {deleteAlert && <p className="bg-red-600 p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold
          my-10 mt-20 mb-0">
            Something went wrong, check your internet connections !
          </p>}
          <div className=" h-[200px] md:h-[250px] w-[200px] md:w-[250px] bg-transparent -translate-y-1/2 -translate-x-1/2 top-1/2  left-1/2 absolute rounded-lg bg-gradient-to-b from-orange-400 via-red-700 to-yellow-300">
            <p className="text-center text-white text-xs md:text-sm xl:text-lg font-semibold p-4">
              This is an irreversible action, choose wisely !
            </p>
            <div className="text-center">
              <div className="text-center my-3 mx-5 cursor-pointer text-white hover:text-green-600   drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  hover:scale-110 border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 duration-200 hover:animate-pulse" onClick={()=>setIsdeleted(false)}>
                <button type="button" className="inline-flex text-xs md:text-sm font-bold cursor-pointer p-1">
                  Cancil<FaXmark className="text-xl md:text-2xl cursor-pointer ml-1" />
                </button>
              </div>
            </div>
            <div className="text-center">
              <div className=" mt-10 mb-1 mx-5 cursor-pointer text-white hover:text-red-600 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  hover:scale-110 border border-red-500 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 duration-200 hover:animate-pulse" onClick={handleDeleteMeal}>
                <button disabled={isPending} type="button" className="inline-flex text-xs md:text-sm font-bold cursor-pointer p-1">
                  {isPending ? 'Deleting...' : <> Delete <IoCheckmarkDoneSharp className=" text-xl  md:text-2xl cursor-pointer ml-1" />
                                                </>  }
                </button>
              </div>
            </div> 
          </div>
        </div>
}