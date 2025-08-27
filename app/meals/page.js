import { Suspense } from "react"
import Link from "next/link"
import MealGrid from "@/components/Meals/MealGrid"
import { getMeals } from "@/lib/meals"

export const metadata = {
  title: 'Delicious various meals',
  description:'A page that displays all shared meals from different african countries'
}

async function Meals(){
  const meals = await getMeals()
  return<MealGrid meals={meals}/>
}

export default function MealsPage(){
 
  return<>
          <header className="m-5">
            <h1 className="text-white font-extrabold text-xl md:text-3xl xl:text-5xl mx-5 mt-35 lg:mt-55 md:mb-4 xl:mb-6 mb-2" data-aos='fade-right'
                                           data-aos-offset='200'
                                           data-aos-delay='50'
                                           data-aos-duration='1000'
                                           data-aos-easing='ease-in-out'>
              Delicious meals,{' '}
              <span className="text text-transparent bg-clip-text bg-gradient-to-l from-red-600 to-orange-400">created by you</span>
            </h1>
            <p className="text-white text-xs md:text-sm xl:text-lg mx-5 my-2 md:my-3 xl:my-4"    data-aos='fade-right'
            data-aos-offset='200'
            data-aos-delay='200'
            data-aos-duration='1000'
            data-aos-easing='ease-in-out'>
              Choose your favorite recipe and cook it yourself. It is easy and fun!
            </p>
            <div data-aos='fade-right'
              data-aos-offset='200'
              data-aos-delay='400'
              data-aos-duration='1000'
              data-aos-easing='ease-in-out' className="relative z-10">
              <Link href={'/meals/share'} className="w-52 xl:w-64 mx-5 p-1  cursor-pointer bg-gradient-to-r from-amber-400 to-red-700 text-white text-xs md:text-sm xl:text-lg font-semibold rounded-md relative z-10 ">
                 Share Your Favorite Recipe
              </Link>
            </div> 
          </header>
          <Suspense fallback={<div className="flex justify-center">
             <p className="text-white font-extrabold text-sm md:text-xl xl:text-2xl mt-20 mb-30 md:mb-42 md:mt-25">Fetching Meals...</p>
             </div>}>
             <Meals/>
          </Suspense>
        </>
      }