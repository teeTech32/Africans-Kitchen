import prisma from "@/lib/prisma";

export default async function sitemap(){
  const meals = await prisma.meal.findMany({
    select:{
      slug: true,
      updatedAt: true,
    }
  })

  return [
    {
      url: process.env.NEXT_PUBLIC_BASE_URL,
      lastModified: new Date()
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/meals`,
      lastModified: new Date()
    },
    ...meals.map((meal)=>({
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/meals/${meal.slug}`,
      lastModified: meal.updatedAt 
    }))
  ]
}