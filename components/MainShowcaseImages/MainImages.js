'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import head from '../../assets/head.jpeg'
import food2 from '../../assets/food2.jpeg'
import food3 from '../../assets/food3.jpeg'
import food4 from '../../assets/food4.jpeg'
import food5 from '../../assets/food5.jpeg'
import food6 from '../../assets/food6.jpeg'
import food7 from '../../assets/food7.jpeg'
import food8 from '../../assets/food8.jpeg'
import food9 from '../../assets/food9.jpg'
import food10 from '../../assets/food10.jpeg'
import food11 from '../../assets/food11.jpeg'
import food12 from '../../assets/food12.jpeg'

const images = [
  {image: head, alt: 'african food'},
  {image: food11, alt: 'african food'},
  {image: food12, alt: 'african food'},
  {image: food2, alt: 'african food'},
  {image: food3, alt: 'african food'},
  {image: food4, alt: 'african food'},
  {image: food5, alt: 'african food'},
  {image: food6, alt: 'african food'},
  {image: food7, alt: 'african food'},
  {image: food8, alt: 'african food'},
  {image: food9, alt: 'african food'},
  {image: food10, alt: 'african food'}
]

export default function MainImages(){
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(()=>{
    const interval = setInterval(()=>{
    setCurrentImageIndex((preIndex)=>(
      preIndex < images.length - 1 ? preIndex + 1 : 0 
    ))
    },5000)
    return ()=> clearInterval(interval);
  },[]  )

  return<div className='relative w-[400px] md:w-full mx-4 md:ml-10 mr-30 md:mr-0 mt-38 md:mt-40 lg:mt-50 mb-10 h-64 md:h-96  overflow-hidden rounded-lg shadow-lg' data-aos='fade-right'
                                                                     data-aos-offset='200'
                                                                     data-aos-delay='50'
                                                                     data-aos-duration='1000'
                                                                     data-aos-easing='ease-in-out'>
          {images.map((image, index)=>(
            <Image key={index} 
                   src={image.image} 
                   alt={image.alt} 
                   fill
                   className={` object-cover transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`} priority/>
              )
            )
          }
        </div>
}