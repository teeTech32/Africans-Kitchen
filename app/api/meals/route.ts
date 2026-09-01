import { getMeals } from "@/lib/meals";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 5;

    const meals = await getMeals(page, limit);
    console.log(meals);

    return Response.json(meals);
  } catch (error) {
    return Response.json({
      message: "Failed to fetch meal",
      status: 500,
    });
  }
} 