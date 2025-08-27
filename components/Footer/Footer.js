import { FaFacebook, FaInstagram, FaLinkedin, FaLocationArrow } from 'react-icons/fa6'
import { MdLocationPin } from "react-icons/md";
import { FaMobileAlt } from 'react-icons/fa'
import { ImportantLinks } from '@/data'
import { QuickLinks } from '@/data'
import Link from 'next/link'

export default function Footer(){
  return ( 
    <div  className="text-red-700 bg-[url('/images/pattern.jpg')]  bg-cover bg-center w-screen">
      <div className='container'>
        <div className='grid md:grid-cols-3 pb-44 pt-5' data-aos='zoom-in'
                                                        data-aos-offset='200'
                                                        data-aos-delay='200'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'>
          <div className='py-8 mx-10'>
            <h1 className='text-white text-lg lg:text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3'>
              AFRICANS&apos;Kitchen
            </h1>
            <p className='lg:text-sm text-xs text-red-700'>
              At AFRICANS&apos;Kitchen, we celebrate the rich and diverse flavors of African cuisine. From traditional recipes passed down through generations to modern twists on classic dishes, we bring you the best of Africa’s culinary heritage. Whether you&apos;re a lover of spicy West African stews, North African spices, or savory East African dishes, there&apos;s something here for everyone. Our mission is to share authentic recipes, cooking tips, and cultural stories — all while building a vibrant food-loving community. Join us today and experience the taste of Africa in every bite
            </p>
          </div>
          <div className='grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10'>
            <div>
              <div className='py-8 mx-10'>
                <h1 className='text-lg lg:text-xl text-white  font-bold sm:text-left text-justify mb-3'>Useful Links
                </h1>
                <ul className='flex flex-col gap-3 relative z-10'>
                  {
                    ImportantLinks.map((link)=>(
                      <li key={link.title} className='cursor-pointer hover:text-white  hover:translate-x-1 duration-300 text-red-700 font-bold text-sm lg:text-sm'>
                        <span>{link.title}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
             <div>
              <div className='py-8 mx-10'>
                <h1 className='text-lg lg:text-xl text-white  font-bold sm:text-left text-justify mb-3'>Quick Links
                </h1>
                <ul className='flex flex-col gap-3 relative z-10'>
                  {
                    QuickLinks.map((link)=>(
                      <li key={link.title} className='cursor-pointer hover:text-white  hover:translate-x-1 duration-300 text-text-red-700 font-bold text-sm lg:text-sm'>
                        <span>{link.title}</span>
                      </li>
                    ))
                  }
                </ul>
              </div>
            </div>
            <div>
              <p className='pt-8 mx-10 text-white  font-bold text-lg lg:text-xl'>Contacts</p>
              <div className='flex items-center gap-3 mt-2 mx-10 relative z-10'>
                <Link href={'/#'}>
                  <FaInstagram className='text-red-700 text-xl lg:text-2xl'/>
                </Link>
                <Link href={'/#'}>
                  <FaLinkedin className='text-red-700 text-xl lg:text-2xl'/>
                </Link>
                <Link href={'/#'}>
                  <FaFacebook className='text-red-700 text-xl lg:text-2xl'/>
                </Link>      
              </div>
              <div className='mt-4 lg:text-sm text-xs text-red-600 mx-10 relative z-10 cursor-pointer'>
                <div className='inline-flex items-center gap-3'>
                  <MdLocationPin className='text-2xl lg:text-4xl'/>
                </div>
                <p className='text-xs lg:text-md font-semibold'>
                  Banana Island, Lagos Nigeria
                </p>
                <div className='inline-flex items-center gap-3 mt-3'>
                  <FaMobileAlt className='text-2xl lg:text-4xl'/>
                </div>
                <p className='text-xs lg:text-md font-semibold'>
                  +234 703 2603814
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
