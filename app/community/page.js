"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import mealIcon from '@/assets/icons/mealIcon.png'
import eventsIcon from '@/assets/icons/eventsIcon.jpg'
import communityIcon from '@/assets/icons/communityIcon.png'
import community from '@/assets/icons/community.jpg'
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Community(){
  const [loading, setLoading] = useState(true)
  const router = useRouter()

   useEffect(()=>{
    setLoading(true)
    fetch('/api/me/profile')
      .then(res => res.json())
      .then(data => {
        if(!data || data.error){
          router.push('/authusers/SignUp')
        }else{
          setLoading(false)
        }
      })
  },[router]);
  
return <>
  {loading ? <div className="flex justify-center">
                <p  className="text-white font-extrabold my-60 md:my-72 md:text-lg lg:text-2xl">Loading Community...</p> 
            </div>:
  <div>
    <header className='flex justify-center'>
      <div className="flex flex-col">
        <h1 className="text-white text-lg md:text-2xl xl:text-3xl font-extrabold m-4 mt-35  lg:mt-50 text-center"data-aos='fade-up'
                    data-aos-offset='200'
                    data-aos-delay='200'
                    data-aos-duration='1500'
                    data-aos-easing='linear'>
          One shared passion: <span className='font-extrabold text-lg md:text-3xl  xl:text-4xl text-transparent bg-gradient-to-r from-yellow-300 via-red-600 to-orange-500 bg-clip-text drop-shadow-black'>Food</span>
        </h1>
        <p className="text-white text-xs md:text-sm xl:text-lg font-bold m-4"
        data-aos='fade-up'
        data-aos-offset='200'
        data-aos-delay='500'
        data-aos-duration='4000'
        data-aos-easing='linear'>Now that you&apos;ve Joined our community, share your favorite recipes!</p>
        <Link href={'/meals/share'} className="w-18 md:w-21 xl:w-26 mx-5 p-1  cursor-pointer bg-gradient-to-r from-amber-400 to-red-600 text-white text-xs md:text-sm xl:text-lg font-semibold rounded-md absolute z-10 top-58 right-5 md:top-60 md:right-30 lg:top-64  ">
          Share Now
        </Link>
      </div>
    </header>
    <main className=''>
      <h2 className="m-10 text-white text-xs md:text-sm xl:text-lg font-semibold"
      data-aos='flip-right'
      data-aos-offset='200'
      data-aos-delay='250'
      data-aos-duration='1000'
      data-aos-easing='ease-in-out'>
        Community Perks
      </h2>
      <ul className='my-5'>
        <li className="mx-10 mb-20 flex justify-center">
          <div className="flex flex-col">
            <Image src={mealIcon} alt="A delicious meal" data-aos='fade-down'
                                                         data-aos-offset='200'
                                                         data-aos-delay='200'
                                                         data-aos-duration='1000'
                                                         data-aos-easing='ease-in-out' />
            <p className="text-white text-xs md:text-sm xl:text-lg font-semibold text-center  "data-aos='fade-up'
             data-aos-offset='200'
             data-aos-delay='200'
             data-aos-duration='1000'
             data-aos-easing='ease-in-out'>
              Share & discover recipes
            </p>
          </div>
        </li>
        <li className="mx-10 my-20 flex justify-center">
          <div className="flex flex-col">
            <Image src={communityIcon} alt="A crowd of people, cooking" data-aos='fade-down'
                                                                        data-aos-offset='200'
                                                                        data-aos-delay='200'
                                                                        data-aos-duration='1000'
                                                                        data-aos-easing='ease-in-out' />
            <p className="text-white text-xs md:text-sm xl:text-lg font-semibold text-center" data-aos='fade-up'
            data-aos-offset='200'
            data-aos-delay='200'
            data-aos-duration='1000'
            data-aos-easing='ease-in-out'>
              Find new friends & like-minded people
            </p>
          </div>
        </li>
        <li className="mx-10 my-20 ">
          <h1 className="text-sm lg:text-lg xl:text-xl font-bold text-white mb-2">Some Crops In Africa</h1>
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <Image src={community}
            alt="African raw foods" className="rounded-md" data-aos='fade-right'
                                                           data-aos-offset='200'
                                                           data-aos-delay='200'
                                                           data-aos-duration='1000'
                                                           data-aos-easing='ease-in-out'/>
            <p className="text-white text-xs md:text-sm xl:text-lg font-semibold  mt-3 lg:mt-0"  data-aos='fade-left'
            data-aos-offset='200'
            data-aos-delay='200'
            data-aos-duration='1000'
            data-aos-easing='ease-in-out'>
              This vibrant image showcases a bustling African open-air market, brimming with a rich variety of fresh vegetables and produce. The colorful assortment includes tomatoes, carrots, onions, eggplants, potatoes, green apples, cabbage, green peas, and more—each neatly arranged in baskets, crates, and sacks. Such markets are a vital part of daily life in many African communities, offering not only food but also a sense of connection and shared culture. The diversity of colors and textures reflects the abundance of nature and the importance of agriculture in African livelihoods.
              In African cuisine, these vegetables play a central role in daily meals. Staples like onions, tomatoes, and peppers form the base of countless stews and sauces, while root vegetables such as potatoes and yams provide hearty nourishment. Leafy greens, legumes, and fresh herbs are commonly added to dishes to enhance flavor and nutrition. The produce seen here likely supports a wide range of traditional meals—from spicy jollof rice in West Africa to vegetable-rich curries and stir-fries in East and Southern Africa. Each item carries its own culinary and cultural significance.
            </p>
          </div>
        </li>
        <li className="mx-10 my-20 ">
          <h1 className="text-sm lg:text-lg xl:text-xl font-bold text-white mb-2">A Get-together Picture of Community Members</h1>
          <div className="flex flex-col lg:flex-row lg:gap-8">
            <Image src={eventsIcon}
            alt="An African food event" className="rounded-md w-[500px] md:w-[620px] md:h-[450px] h-[350px]" data-aos='fade-right'
                     data-aos-offset='200'
                     data-aos-delay='200'
                     data-aos-duration='1000'
                     data-aos-easing='ease-in-out'/>
            <p className="text-white text-xs md:text-sm xl:text-lg font-semibold  mt-3 lg:mt-0"
            data-aos='fade-left'
            data-aos-offset='200'
            data-aos-delay='200'
            data-aos-duration='1000'
            data-aos-easing='ease-in-out'>
              Experience the vibrant flavors of Africa through every dish on display. From smoky grilled meats and rich stews to colorful vegetables and fragrant spices, this event is a true celebration of African heritage and hospitality. It&apos;s more than just food — it&apos;s a gathering of cultures, stories, and traditions passed down through generations. Come taste the essence of the continent, where every meal tells a story and every bite brings us closer together.
              Whether enjoyed in a bustling market stall, a family courtyard, or at a festive community gathering, African food reflects a deep connection to the land and to one another. Each ingredient is a testament to generations of farming, foraging, and culinary wisdom, lovingly preserved and shared. As you savor these dishes, you’re not just tasting a meal — you&apos;re partaking in a living tradition that honors ancestors, celebrates community, and nourishes both body and soul.
            </p>
          </div>
        </li>
      </ul>
    </main>
  </div> 
    }
  </>
}