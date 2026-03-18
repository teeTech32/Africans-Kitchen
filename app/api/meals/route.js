import { getMeals } from "@/lib/meals";

export async function GET(req){
  try{
    const {searchParams} = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1
    const limit = Number(searchParams.get("limit")) || 5

    const meals = await getMeals(page, limit);
    
    return Response.json(meals)

  }catch(error){
    return Response.json({
      message: "Failed to fetch meal",
      status: 500
    })
  }
  
} 