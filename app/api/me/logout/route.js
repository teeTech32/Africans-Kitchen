import { NextResponse } from "next/server";

export async function POST() {
  const response =  NextResponse.json({message:'User logged out'}, {status:200});
  response.cookies.set('token', '', {path:'/', expires: new Date(0)});
  return response;
}