import { NextResponse } from "next/server";
import { openai } from "@/lib/openai";
import { validateAndFix } from "@/lib/validateAndFix";
import { hashRefreshToken, verifyAccessToken, verifyRefreshToken } from "@/lib/tokens";
import { generateRecipeSchem } from "@/lib/inputValidationWithZod";
import prisma from "@/lib/prisma";

export async function POST(request){
  const body = await request.json();

  const accessToken = request.cookies.get("accessToken")?.value;

  const decoded = verifyAccessToken(accessToken);
  if(!decoded){
    return NextResponse.json({error: "Unauthorized User"}, {status: 401})
  }

  const refreshToken = request.cookies.get('refreshToken')?.value;
 
  const decodedrefreshToken = verifyRefreshToken(refreshToken)
  if(!decodedrefreshToken){
    return NextResponse.json({error: "Unauthorized User"}, {status: 401})
  }

  const hashToken = hashRefreshToken(refreshToken)

  const session = await prisma.session.findFirst({
    where:{hashedRefreshToken: hashToken }
  })
  if(!session){
    return NextResponse.json({error: "Unautorized User"}, {status: 401})
  }
  if(session.aiGenerationCount >= 3){
    return NextResponse.json({error: "You have reached your 3 times AI support limit for every users."})
  }

  const parsed = generateRecipeSchem.safeParse(body)
  if(!parsed.success){
    const firstError = parsed.error.issues[0]?.message || "Invalid Inputs"
    return NextResponse.json({ error: firstError }, {status: 400 })
  }

  const mealName = parsed.data.meal.trim().replace(/\s+/g, " ");

  try{
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "system",
          content:`
          Return ONLY valid JSON.
          Format:
          {
            "summary": "one sentence around twenty words",
            "steps": [
              "step 1",
              "step 2",
              "step 3",
              "step 4",
              "step 5"
            ]
          }
          
          Rules:
          - summary must be one sentence
          - summary should be around 20 words
          - exactly 5 cooking steps
          - no extra text
          `,
        },
        {
          role: "user",
          content: `Generate a recipe for ${mealName}`
        }
      ],

      max_tokens: 250,
    })
    const raw = completion.choices[0].message.content;
    const parsed = JSON.parse(raw);
    const recipe = validateAndFix(parsed);
    await prisma.session.update({
      where:{ id: session.id},
      data: {
        aiGenerationCount:{
          increment: 1
        }
      }
    })
    return NextResponse.json(recipe); 
  }catch(error){
    console.error(error);
    return NextResponse.json({error: "AI generation failed, check your server connection."}, {status: 500})
  }
}