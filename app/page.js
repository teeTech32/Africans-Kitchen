"use client"
import Link from "next/link";
import Image from "next/image";
import MainImages from "@/components/MainShowcaseImages/MainImages";
import Remarks from "@/components/Remarks/Remarks";
import front1 from "@/assets/icons/front4.jpeg"
import front2 from "@/assets/icons/front2.jpeg"
import front3 from "@/assets/icons/front3.jpeg"
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'aos/dist/aos.css'
import AOS from 'aos'
import { useEffect } from "react";


export default function Home(){
  useEffect(()=>{
  AOS.init({
    duration: 1000,
    once: true
  })
},[])

return <div>
          <header className="flex flex-col  md:flex-row md:gap-2 xl:gap-4 ">
            <MainImages/>
            <div className=" my-2 md:my-10 flex-col mx-10 md:mx-0 ">
              <div className="my-2" data-aos='fade-left'
                                    data-aos-offset='200'
                                    data-aos-delay='50'
                                    data-aos-duration='1000'
                                    data-aos-easing='ease-in-out'>
                <h1 className=" mx-10 mb-3 md:mt-30 lg:mt-40 font-bold text-sm md:text-xl  xl:text-2xl  text-transparent bg-gradient-to-r from-red-500 via-yellow-300 to-red-500 bg-clip-text transition-all duration-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  translate-0.5 scale-110">
                  AFRICANS&apos; FOODS FOR AFRICAN FOODIES
                </h1>
                <p className="text-sm md:text-lg xl:text-xl font-semibold md:font-bold text-white mx-5 my-3">
                  Taste & share food from all over the world.
                </p>
              </div>
              <div className=" ml-4 mr-4 md:mr-0 text-xs md:text-sm xl:text-lg my-8 relative z-10"  data-aos='zoom-in'
              data-aos-offset='200'
              data-aos-delay='1000'
              data-aos-duration='1000'
              data-aos-easing='ease-in-out'>
                <Link href={'/community'} className="m-2 btn cursor-pointer text-transparent hover:text-white bg-gradient-to-r from-yellow-300  to-red-500 bg-clip-text  drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  translate-0.5 scale-110 border border-gray-500 bg-transparent px-2 py-1 rounded-md  focus:outline-none focus:ring-2 focus:ring-gray-300 transition duration-200 ">Join the community</Link>
                <Link href={'/meals'} className="m-2 btn cursor-pointer text-white bg-gradient-to-r from-red-600  to-yellow-300 hover:text-slate-800  transition-all duration-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  translate-0.5  p-1 rounded-md">Explore Meals</Link>
              </div>
            </div>
          </header>
          <main className="text-white mx-10 mb-20">
            <section className="my-10">
              <h2 className="flex justify-center font-bold text-sm md:text-lg  mb-2" data-aos='zoom-in'
              data-aos-offset='200'
              data-aos-delay='50'
              data-aos-duration='1000'
              data-aos-easing='ease-in-out'>
                How it works
              </h2>
              <div data-aos='zoom-in'
                   data-aos-offset='200'
                   data-aos-delay='500'
                   data-aos-duration='1000'
                   data-aos-easing='ease-in-out'>
                <p className="flex justify-center text-xs md:text-sm leading-5 mb-2">
                  Africans&apos; Kitchen is a platform for African foodies to share their favorite
                  recipes with the world. It&apos;s a place to discover new African dishes, and to
                  connect with other food lovers.
                </p>
                <p className="flex justify-center text-xs md:text-sm leading-5">
                  Africans&apos; Kitchen is a place to discover different new dishes in African, and to connect
                  with other Africans all over the world.
                </p>
              </div>
            </section>
            <section className="my-10">
              <h2 className="flex justify-center font-bold text-sm md:text-lg mb-2" 
                data-aos='zoom-in'
                data-aos-offset='200'
                data-aos-delay='50'
                data-aos-duration='1000'
                data-aos-easing='ease-in-out' >
                Why Africans&apos; Kitchen?
              </h2>
              <div data-aos='zoom-in'
                   data-aos-offset='200'
                   data-aos-delay='500'
                   data-aos-duration='1000'
                   data-aos-easing='ease-in-out'>
                <p className="flex justify-center text-xs md:text-sm leading-5 mb-2">
                  From the spicy stews of West Africa to the savory grilled meats of East Africa and the comforting staples of Southern and North African cuisine, Africans&apos; Kitchen brings together the continent&apos;s culinary variety under one roof. Whether it&apos;s jollof rice, injera with wot, suya, bunny chow, or North African tagines, every dish tells a story — of community, resilience, and the joy of sharing food.
                </p>
                <p className="flex justify-center text-xs md:text-sm leading-5">
                  Beyond the meals, Africans&apos; Kitchen platform serves as a cultural hub, promoting not only food but also the stories, ingredients, and traditions behind each recipe. It&apos;s more than a place to eat — it&apos;s an experience of Africa&apos;s warmth, generosity, and spirit.
                </p>
              </div>
            </section>
            <section>
              <div className="flex justify-center my-5" data-aos='zoom-in'
                                                        data-aos-offset='200'
                                                        data-aos-delay='200'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'>
                <h1 className="font-extrabold text-sm md:text-xl  xl:text-2xl  text-transparent bg-gradient-to-r from-red-500 via-yellow-300 to-red-500 bg-clip-text transition-all duration-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.7)]  translate-0.5">
                  Some Food Festivals In Africa
                </h1>
              </div>
              <h3 className="font-bold text-sm md:text-xl  xl:text-2xl mt-5 mb-3" 
                data-aos='zoom-in-right'
                data-aos-offset='200'
                data-aos-delay='500'
                data-aos-duration='1000'
                data-aos-easing='ease-in-out'>
                Equatorial Guinea
              </h3>
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                <Image src={front1} alt="HomepageImage" data-aos='fade-right'
                                                        data-aos-offset='200'
                                                        data-aos-delay='50'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'/>
                <p className="text-xs md:text-md leading-5 prose prose-lg lg:mt-0"  data-aos='fade-left'
                data-aos-offset='200'
                data-aos-delay='50'
                data-aos-duration='1000'
                data-aos-easing='ease-in-out'>
                  Equatorial Guinea&apos;s annual food festival is a vibrant celebration of the nation&apos;s rich culinary heritage and cultural diversity. Held in the capital city of Malabo, the festival attracts local chefs, farmers, artisans, and food lovers from all over the country and beyond. From bustling street stalls to elegant tasting events, visitors are invited to experience the flavors that define this Central African nation, shaped by indigenous traditions, Spanish influences, and tropical ingredients.
                  At the heart of the festival are traditional dishes like sopa de pescado (fish soup), pepesup (a spicy fish stew), and cassava prepared in many forms. Locally grown plantains, yams, and coconuts feature prominently in meals that are both hearty and flavorful. Attendees can also enjoy cooking demonstrations where chefs share the secrets behind their recipes, offering insights into the spices and preparation techniques that make Equatoguinean cuisine so unique.
                  Beyond the food, the festival serves as a platform for cultural expression. Live music, traditional dance performances, and storytelling add to the festive atmosphere, creating a space where culinary arts and cultural identity intersect. Visitors are encouraged to engage with local producers and learn about sustainable farming and fishing practices that support the community and preserve the environment.
                </p>
              </div>
              <h3 className="font-bold text-sm md:text-xl  xl:text-2xl mt-5 mb-3"  data-aos='zoom-in-right'
              data-aos-offset='200'
              data-aos-delay='500'
              data-aos-duration='1000'
              data-aos-easing='ease-in-out'>
                Tunisia
              </h3>
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                <Image src={front2} alt="HomepageImage" data-aos='fade-right'
                                                        data-aos-offset='200'
                                                        data-aos-delay='500'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'/>
                <p className="text-xs md:text-md mt-2 lg:mt-0 leading-5  prose prose-lg  prose prose-lg" data-aos='fade-left'
                          data-aos-offset='200'
                          data-aos-delay='500'
                          data-aos-duration='1000'
                          data-aos-easing='ease-in-out'>
                  Tunisia’s food festivals are a dynamic celebration of the country&apos;s diverse culinary traditions, drawing on Berber, Arab, Mediterranean, and French influences. One of the most popular events is the Djerba Food Festival, held annually on the island of Djerba, where visitors are treated to a colorful array of traditional dishes, fresh seafood, and locally produced olive oil and dates. The festival is a gathering place for chefs, artisans, and food lovers who come together to share, taste, and celebrate the nation’s vibrant food culture.
                  Tunisian cuisine is known for its bold spices, rich stews, and use of local ingredients like harissa (a chili paste), couscous, lamb, and seafood. During the festival, attendees can enjoy iconic dishes such as brik (a crispy pastry filled with egg and tuna), couscous au poisson, and lablabi, a hearty chickpea soup. Food stalls line the streets with fresh breads, pastries, and sweets like makroud and zgougou cream, giving visitors a full sensory experience of Tunisian flavor.
                  The festival isn’t just about eating—it&apos;s an immersion into Tunisian culture. Live performances of traditional music and dance, artisanal craft exhibitions, and culinary workshops bring together generations of knowledge and creativity. Guests can watch live cooking competitions, learn how to make traditional dishes from local chefs, and hear stories about the origins and symbolism of Tunisian meals.
                </p>
              </div>
              <h3 className="font-bold text-sm md:text-xl  xl:text-2xl mt-5 mb-3" 
              data-aos='zoom-in-right'
              data-aos-offset='200'
              data-aos-delay='500'
              data-aos-duration='1000'
              data-aos-easing='ease-in-out'>
                Northern Nigeria
              </h3>
              <div className="flex flex-col lg:flex-row gap-5 lg:gap-8">
                <Image src={front3} alt="HomepageImage" data-aos='fade-right'
                                                        data-aos-offset='200'
                                                        data-aos-delay='500'
                                                        data-aos-duration='1000'
                                                        data-aos-easing='ease-in-out'/>
                <p className="text-xs md:text-md mt-2 lg:mt-0 leading-5"
                  data-aos='fade-left'
                  data-aos-offset='200'
                  data-aos-delay='500'
                  data-aos-duration='1000'
                  data-aos-easing='ease-in-out'>
                  Northern Nigeria’s food festivals are a vibrant showcase of tradition, hospitality, and the rich culinary diversity of the region. One of the most notable gatherings is the Arewa Food and Cultural Festival, held in cities like Kano or Kaduna. This event brings together communities from across the northern states to celebrate local cuisine, indigenous ingredients, and time-honored cooking methods. It’s a place where tradition meets creativity, with both street vendors and renowned chefs presenting dishes passed down through generations.
                  The cuisine of Northern Nigeria is known for its deep flavors and use of grains, spices, and smoked meats. At the festival, visitors can enjoy iconic dishes such as tuwo shinkafa (rice pudding), miyan kuka (baobab leaf soup), kilishi (spicy dried meat), and fura da nono (millet and yogurt drink). Local staples like sorghum, millet, and beans are transformed into hearty, flavorful meals. Live cooking demonstrations offer guests a chance to learn the secrets behind these traditional dishes and the cultural significance they hold.
                  The festivals are more than just a feast—they are platforms for cultural exchange and storytelling. Traditional drumming and dance performances, poetry recitations, and fashion shows highlight the strong connection between food, identity, and history in the region. Elders often share oral histories about the origins of certain meals, while young chefs present new takes on classic dishes, blending heritage with innovation.
                </p>
              </div>
            </section>
            <Remarks/>
          </main>
        </div>
 
}