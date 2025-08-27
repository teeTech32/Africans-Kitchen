"use client"

import { useState } from "react";
import { TiDelete } from "react-icons/ti";
import { AiFillEdit } from "react-icons/ai";
import Image from "next/image";
import DeleteMeal from "./DeleteMeal";
import EditMeal from "./EditMeal";
import Link from "next/link";

export default function MealReturnValue({meal, imageUrl, mealInstructions, email }){
  const [isdeleted, setIsdeleted] = useState(false)
  const [isedited, setIsedited] = useState(false)
  const para = meal
  
  return<>
    {isedited ? <EditMeal meal={meal} setIsedited={setIsedited}/> : <>
      <header className="flex flex-col md:flex-row  my-4 md:my-6 xl:my-10">
        <Link href={'/meals'} className="absolute top-38 lg:top-42 lg:left-12 md:top-32 left-10 cursor-pointer z-10">
          <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl xl:text-4xl cursor-pointer "/>
        </Link>
        <div className="flex justify-center mx-10 mt-35 lg:mt-45 xl:ml-15">
          <Image src={imageUrl} alt={meal.title} width={150} height={150} className="w-90 h-90 rounded-lg"/>
        </div>
        <div className="md:ml-5 mx-10 my-2">
          <div className="inline-flex gap-8 md:mt-35 lg:mt-45">
            <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-600 to-orange-600 font-extrabold text-xl md:text-2xl xl:text-3xl  ">{meal.title}</h1>
            {email === meal.creator_email ? 
             <div className="inline-flex mx-2">
             <div className="inline-flex mr-2 cursor-pointer text-white hover:text-red-600 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  hover:scale-110 border border-red-500 px-2 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 duration-200 hover:animate-pulse relative z-10" onClick={()=>setIsdeleted(true)}>
               <button type="button" className="text-xs md:text-sm font-light cursor-pointer">Delete</button>
               <TiDelete className="text-xl md:text-2xl cursor-pointer" />
             </div>
             <div className="inline-flex ml-2 cursor-pointer text-white hover:text-green-600   drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  hover:scale-110 border border-green-500 px-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 duration-200 hover:animate-pulse relative z-10" onClick={()=>setIsedited(true)}>
               <button type="button" className="text-xs md:text-sm font-light cursor-pointer">Edit</button>
               <AiFillEdit className="text-xl md:text-2xl cursor-pointer" />
             </div>
           </div> : ''}
          </div>
          <p className="text-white font-bold text-sm md:text-lg xl:text-xl" >
            by: <a href={`mailto:${meal.creator_email}`}>{meal.creator}</a>
          </p>
          <p className="text-white font-light text-xs md:text-sm xl:text-lg mt-3">{meal.summary}</p>
        </div>
      </header>
      <main className="flex flex-col md:flex-row bg-black/15 mx-10 xl:mx-15 mb-15 rounded-md">
        <h2 className="text-white text-sm md:text-lg xl:text-xl font-extrabold mx-5 mt-5 md-2">Cooking Instructions:</h2>
        <p className="text-white text-xs md:text-sm xl:text-lg  mx-5 mb-5" dangerouslySetInnerHTML={{
          __html:mealInstructions
        }}></p> 
      </main>
    </>}
    {isdeleted && <DeleteMeal setIsdeleted={setIsdeleted} params={para}/>}
</> 
}