import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(){
  const cookieStored = await cookies()
  const token = cookieStored.get("token")?.value;
  if(!token){
    return NextResponse.json({error: "Expired token, user auto logged out"}, {status:401})
  }
  return NextResponse.json({token})
}