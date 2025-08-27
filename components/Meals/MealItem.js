import { useState } from "react";
import Image from "next/image"
import Link from "next/link"
import { GiLoveHowl } from "react-icons/gi";


export default function MealItem({title, slug, creator, summary, image}){
  const [isLiked, setIsLiked] = useState(false)

  return<article className="hover:animate-pulse duration-1000" data-aos='fade-up'
                                                               data-aos-offset='200'
                                                               data-aos-delay='200'
                                                               data-aos-duration='3000'
                                                               data-aos-easing='ease-in-out'>
          <header >
            <div className="flex justify-center ">
              <Image src={`https://teetech-foodies-bucket.s3.eu-north-1.amazonaws.com/${image}`} alt={title} className="relative w-80 md:w-70 h-80 md:h-70 rounded-t-md" width={150} height={150}/>
            </div>
          </header>
          <div className="flex justify-center">
            <div className="text-white bg-amber-500 relative pb-10 w-80 md:w-70 rounded-b-md">
              <h2 className="text-xs font-stretch-50% md:text-sm mt-2 ml-2">
                {title}
              </h2>
              <p className="text-xs font-bold  md:text-sm mt- ml-2 font">
                by: {creator}
              </p>
              <p className="text-xs font-stretch-50%  md:text-sm mt-2 mx-2">{summary}</p>
              <div className="bg-gradient-to-r from-yellow-300 to-red-700 p-1 rounded-md text-xs font-bold  md:text-sm mt-2 ml-2 mr-2 absolute bottom-2 right-2 hover:text-amber-300 hover:transition-1000 hover:scale-105 duration-500">
                <Link href={`/meals/${slug}`} className="w-20 relative z-10">
                  Veiw Details
                </Link>
              </div>
              <button className={`absolute bottom-4 left-4 w-6 h-6 cursor-pointer ${isLiked ? 'text-red-600':'text-white'}`}>
                <GiLoveHowl className='w-full h-full mt-2 z-10 relative' onClick={()=>setIsLiked((isLiked ) => !isLiked)}/>
              </button>
            </div>
          </div>
        </article>
} 