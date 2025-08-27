"use client"

import slickModule from 'react-slick'
import {TestimonialData}  from '@/data'
import Image from 'next/image';
import RemarkHeader from './RemarkHeader';

const Slider = slickModule.default

export default function Remarks(){
   var settings = {
      dots:true,
      arrows: false,
      infinite: true,
      speed: 500,
      slidesToScrolls: 1,
      autoplay: true,
      autoplaySpeed:2000,
      cssEase:'linear',
      pauseOnHover: true,
      pauseFocus: true,
      responsive:[
        {
          breakpoint: 10000,
          settings:{
            slidesToShow:3,
            slidesToScroll:1,
            infinite: true,
          },
        },
        {
          breakpoint:1024,
          settings:{
            slidesToShow:2,
            slidesToScroll:1,
            initialSlide:2,
          },
        },
        {
          breakpoint: 640,
            settings:{
            slidesToShow:1,
            slidesToScroll:1
          }
        }
      ]
    }
  return (
    <>
      <RemarkHeader/>
      <Slider {...settings}>
        {  
          TestimonialData.map((data)=>(
            <div key={data.id} className="my-6 lg:my-8"data-aos='flip-right'
                                                        data-aos-offset='200'
                                                        data-aos-delay='500'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'>
                <div  className="flex flex-col gap-4 shadow-lg py-8 px-6 mx-4 rounded-xl bg-gradient-to-tr from-orange-400 via-red-700 to-yellow-300 relative">
              <div className='inline-flex'>
                <Image src={data.img} alt="NetError" className="rounded-full w-14 h-14 lg:w-20 lg:h-20" width={80} height={80}/>
                <p className='font-bold text-white ml-3'>{data.name}</p>
              </div>
              <div className="flex flex-col items-center pt-2 lg:pt-4">
                <div className="space-y-1 lg:space-y-2">
                  <p className="text-xs lg:text-sm text-white">{data.text}</p>
                  <h1 className="text-sm font-bold lg:text-lg text-red-700">{data.location}</h1>
                </div>
              </div>
              <p className="text-white text-5xl lg:text-7xl font-serif absolute top-0 right-0">
              ``
              </p>
            </div>
          </div>
          ))
        }
      </Slider>
    </>
      
  )
}

