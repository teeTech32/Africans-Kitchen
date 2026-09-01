"use server"

import { redirect} from "next/navigation"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/tokens";
import { createMeal } from "./meals";
import { sendContactEmail } from "@/lib/sendcontactmail"
import { validemailInput, checkemail, logininput} from "@/lib/inputValidationWithZod";

// SignUpUsers
type SignUpState = {
  message: string | null;
}

function getFormString(formData: FormData, fieldName: string): string{
  const value = formData.get(fieldName);
  return typeof value === "string" ? value.trim() : "";
}

export async function signupUsers(_prevState:SignUpState, formData:FormData):Promise<SignUpState>{
  const name = getFormString(formData, 'name')
  const email = getFormString(formData,'email')
  const password = getFormString(formData,'password')
  const confirmPassword = getFormString(formData,'confirmPassword')
  
  function isValidSignupInput(input: string): boolean{
    return (!input) || input.trim() === ''
  }
  if(
    isValidSignupInput(name) ||
    isValidSignupInput(email) ||
    isValidSignupInput(password) ||
    isValidSignupInput(confirmPassword) ||
    !email.includes('@') ||
    password !== confirmPassword
  ){
    return{
      message: 'If your password and confirmPassword matched, check your inputs'
    }
  }
  const userSignup = {
    name: name,
    email: email,
    password: password
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup` , {
    method: "POST",
    headers: {"Content-Type" : "application/json" },
    body: JSON.stringify(userSignup)
  })
  const data = await response.json();
  if(data?.error){
    return{
      message:data.error || 'Check your input details, user already exist'
    }
  }
  if(data?.message){
    return{ message:data.message } 
  }
  return {
    message: null
  }
}

// LoginUsers
type LoginState = {
  message: string | null;
  information: string | null;
}
export async function loginUsers(_prevState:LoginState, formData:FormData):Promise<LoginState>{
  const loginInputs = {
    email: String(formData.get('email') ?? ""),
    password: String(formData.get('password') ?? "")
  }
  //Sanitizing inputs with Zod
  const parsedLoginInputs = logininput.safeParse(loginInputs);
  if(!parsedLoginInputs.success){
    return{
      message: parsedLoginInputs.error.issues[0]?.message ?? 'Invalid inputs, check your inputs',
      information: null
    }
  } 
  const userLogin = {
    email: parsedLoginInputs.data.email,
    password: parsedLoginInputs.data.password
  }
  try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {"Content-Type" : "application/json"},
      body: JSON.stringify(userLogin)
    })
    const data = await response.json()

    if(data?.error){
      return{
        message: data.error ,
        information: null
      }
    }
    const cookieStored = await cookies()
    cookieStored.set({
      name: "accessToken",
      value : data.accessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15 //15m
    })
    cookieStored.set({
      name: "refreshToken",
      value : data.refreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7 //7days(seconds)
    })
    return {
      information: data.information ,
      message: null
    }   
  }catch(error: unknown){
    console.error("The following error occured:", error)
    return{
      message: "Something went wrong in our end",
      information: null
    }
  }
}

//CheckUserEmail
type CheckEmailState = {
  message?: string | null;
  error?: string | null;
}
export async function checkEmailExist(_prevState:CheckEmailState, formData: FormData): Promise<CheckEmailState>{
  // Zod input check after getting inputvalues from the client form
  const emailInput = {email: String(formData.get("email") ?? "")}; 
  const parsedEmail = checkemail.safeParse(emailInput)
  if(!parsedEmail.success){
    return { 
      message: parsedEmail.error.issues[0]?.message ?? "Enter a valid email"
    }
  }
  const emailBody = {
    email: parsedEmail.data.email
  }
  try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/checkemail`, {
      method: "POST",
      headers: { "Content-Type" : "application/json"},
      body: JSON.stringify(emailBody) 
    })
    const data = await response.json()
    if(data?.error){
      return {
        message: data?.error ?? "Invalid Credential" 
      }
    }
    return {
      message: data?.message ?? "Check your email"
    }
  }catch(error){
    console.error("Somothing went wrong on our end:", error)
    return {
      message: "Somothing went wrong on our end"
    }
  }; 
}

//ShareMeals
type ShareMealState = {
  message?: string | null;
  error?: string | null;
}

export  async function sharemealData(_prevState:ShareMealState, formData:FormData):Promise<ShareMealState>{
  const cookieStored = await cookies();
  const accessToken = cookieStored.get('accessToken')?.value;
 if(!accessToken){
    return{ error:"Unauthorized User" }
  }
  const decoded = verifyAccessToken(accessToken);
  if(!decoded){
    return{ error:"Unauthorized User" }
  }
  const userId = decoded.payload.id;
  if(!userId){
    return{ error:"Unauthorized User" }
  }

  // Manual input check after getting inputvalues from the client form
  const userName = getFormString(formData, 'userName');
  const userEmail = getFormString(formData, 'userEmail');
  const title = getFormString(formData, 'title');
  const summary = getFormString(formData, 'summary');
  const instructions = getFormString(formData, 'instructions');

  const image = formData.get("image");

  function isInvalidText(value: string): boolean{
  return (!value) || value.trim() === "";
  }
  if(
    isInvalidText(userName) ||
    isInvalidText(userEmail) ||
    isInvalidText(title) || 
    isInvalidText(summary) || 
    isInvalidText(instructions) ||
    !userEmail.includes('@')
  ){
  return{ message:'Invalid Inputs' }
  }
  if(!(image instanceof File ) || image.size === 0 ){
    return { message:'Select an image and be connected to the internet' }
  }

  const meal = {
    userName,
    userEmail,
    title,
    summary,
    image,
    instructions,
    userId
  }

  try{
    const result = await createMeal(meal)
    if(!result.success){
      return {
        message: result.message ?? "Failed to create meal"
      }
    }
  }catch(error){
    console.error("Share meal failed")
    return { message: 'Network error. Please check your internet connection.' }
  }
  
  revalidatePath('/meals')
  redirect('/meals') 
}

//SendEmailContact
type EmailState = {
  message?: string | null;
  error?: string | null;
}
export async function sendEmail(_prevState: EmailState, formData:FormData):Promise<EmailState>{
  // Zod input check after getting inputvalues from the client form
  const emailData = {
    fullname: String(formData.get('fullname') ?? ""),
    email: String(formData.get('email') ?? ""),
    phonenumber: String(formData.get('phonenumber') ?? ""),
    subject: String(formData.get('subject') ?? ""),
    message: String(formData.get('message') ?? ""),
  }

  const parsed = validemailInput.safeParse(emailData);
  if(!parsed.success){
    return {error: parsed.error.issues[0]?.message || "Invalid Inputs"}
  }

  try{
     await sendContactEmail(parsed.data);
     return {message: "Your email is sent successfully"}
  }catch(error){
    console.error(error)
     return {error: "Check your internet connection, if your email is valid"}
  }
}

