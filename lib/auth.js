"use server"

import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function getUser(email) {
  try {
    const user = await prisma.user.findUnique({ where: { email: email }})
    if (!user) {
      return NextResponse.json({ error: "User doesn't exist" }, { status: 404 })
    }
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user", details: error.message },
      { status: 500 }
    )
  }
}


// "use server"

// import { NextResponse } from "next/server"
// import sql from "better-sqlite3"

// const db = sql("app.db")

// export async function getUser(email){
//   try{
//    const user =  db.prepare(`
//     SELECT * FROM users WHERE email = ?`).get(email)
//     return NextResponse.json({user}, {status: 200})
//   }catch(error){
//     return NextResponse.json({error: "User doesn't exists"}, {status: 400})
//   }
// }