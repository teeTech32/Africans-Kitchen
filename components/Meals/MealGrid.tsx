"use client"

import { useState, useMemo, type ChangeEvent } from "react";
import MealItem from "./MealItem";
import { GrFormSearch } from "react-icons/gr";
import { useDebounced } from "@/lib/useDebounced";
import { Meal, MealDataResponse } from "@/types/meal"


type MealGridProps = {
  mealData: MealDataResponse;
}

type LoadMoreData = {
  data: Meal[],
  meta:{
    total: number;
    totalPages: number;
  }
}
 
export default function MealGrid({mealData}: MealGridProps){

  const [meals, setMeals] = useState<Meal[]>(mealData.data);
  const [filterName, setFilterName] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const loadMore = async() =>{
    setIsLoading(true)
    try{
      const nextPage = page + 1
      const mealData = await fetch(`/api/meals?page=${nextPage}&limit=5`)
      const data: LoadMoreData = await mealData.json()
      setMeals((prev) => [...prev, ...data.data])
      setPage(nextPage)
      if(nextPage >= data.meta.totalPages){
        setHasMore(false)
      }
    }catch(error){
      console.error("Failed to fetch meals:", error)
    }finally{
      setIsLoading(false)
    }
  }

  function handleOnchange(e:ChangeEvent<HTMLInputElement>){
    setFilterName(e.target.value)
  }
// Debounced filtering meal by name (filterName) so that it doesn't filter at every keystrock in useMemo, that is it will only update after user pauses typing.
const debouncedfilterName = useDebounced(filterName, 400);

// useMemo is used to prevent re-rending of expensive calculations and unnecessary component. It memorize values and return results.
const filterMeals = useMemo(()=>{
    return debouncedfilterName ? meals.filter((meal) => meal.title.toLowerCase().includes(debouncedfilterName.toLowerCase())) : meals
  }, [meals, debouncedfilterName]) 

  return<>
          <div className="lg:float-right lg:absolute lg:top-60 right-10 xl:right-6">
            <div className="mx-5 my-2 flex flex-col ml-10 ">
                <label htmlFor="jobTitle" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold mb-1" data-aos='flip-right'
                                    data-aos-offset='200'
                                    data-aos-delay='100'
                                    data-aos-duration='1000'
                                    data-aos-easing='ease-in-out'>
                                      QUICK SEARCH
                  </label>
                <div className="relative z-10 text-xs"  data-aos='fade-left'
                                                        data-aos-offset='200'
                                                        data-aos-delay='400'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'>
                  <div className="relative">
                    <input type="text" value={filterName} placeholder="Use meal Title" onChange={handleOnchange} className=" w-70 py-2 pl-7 pr-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm " />
                    <div className="absolute top-1 left-1 w-6 h-6">
                      <GrFormSearch className="text-white w-full h-full" />
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <ul className="m-10 grid grid-cols-1 md:grid-cols-2  lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filterMeals.map((meal)=>(
              <li key={meal.id}>
                <MealItem {...meal}/>
              </li>
            ))}
          </ul>
          <div className="relative z-10 mb-10 mx-20 flex justify-end">
            <div className=" w-28 md:w-34 p-2 md:p-3 font-bold bg-amber-500 text-white text-xs md:text-sm hover:bg-amber-400 hover:text-black rounded-2xl">
              Total Meals: {mealData.meta.total}
            </div>
            <div className=" mx-2 w-28 md:w-34 p-2 md:p-3 font-bold bg-amber-500 text-white text-xs md:text-sm hover:bg-amber-400 hover:text-black rounded-2xl">
              Total Pages: {mealData.meta.totalPages}
            </div>
            <button type="submit" className=" w-20 md:w-32 p-2 md:p-3 font-bold bg-amber-500 text-white text-xs md:text-sm hover:bg-amber-400 hover:text-black rounded-2xl " onClick={loadMore}
            disabled={!hasMore || isLoading}
            style={{
              opacity: hasMore ? 1 : 0.5,
              cursor: hasMore ? "pointer" : "not-allowed"
            }}>
              {isLoading ? "Loading..." : hasMore ? "Load More" : "No meal"}
            </button>
          </div>
        </>
}