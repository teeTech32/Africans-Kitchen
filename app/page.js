import HomeClient from "@/components/homeclient/HomeClient"

// Search Engine Optimization (SEO)
export const metadata = {
  title: "Home",
  description: "Discover delicious Nigerian and African meals.",
  alternates:{
    canonical: "/"
  },
  openGraph:{
    title: "Africans' Kitchens",
    description: "Discover delicious Nigerian and African meals.",
    url: "/",
    images:["/images/pattern.jpg"]
  }
}

export default function Home(){
  
return<HomeClient/> 
 
}
