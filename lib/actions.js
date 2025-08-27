"use server"

import { redirect} from "next/navigation"
import { createMeal } from "./meals"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export  async function sharemealData(prevState, formData){
  const meal ={
    title: formData.get('title'),
    creator: formData.get('name'),
    creator_email: formData.get('email'),
    summary: formData.get('summary'),
    image: formData.get('image'),
    instructions: formData.get('instructions')
  }
  function isInvalidText(text){
    return !text || text.trim() === '' ;
  }
  if(
      isInvalidText(meal.title) || 
      isInvalidText(meal.creator) || 
      isInvalidText(meal.creator_email) || 
      isInvalidText(meal.summary) || 
      isInvalidText(meal.instructions) ||
      !meal.creator_email.includes('@')
    ){
       return{message:'Invalid Inputs'}
     }else if(!meal.image || meal.image.size === 0 ){
       return {message:'Pick an image after you are connected to the internet'}
     }

     const result = await createMeal(meal);
     if(!result.success){
       return { message: 'Something went wrong, check your internet connections.' };
     }

  revalidatePath('/meals')
  redirect('/meals')
}

export async function signupUsers(prevState, formData){
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')
  
  function isValidSignupInput(input){
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
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    body: JSON.stringify(userSignup),
    headers: {'Content-Type' : 'application/json'}
  })
  const userSignInData = await response.json()
  if(!response.ok){
    return{
      message:userSignInData.error || 'Check your input details, user already exist'
    }
  }
  if(userSignInData.token){
    const cookieStore = await cookies()
    cookieStore.set(
      {
        name: 'token',
        value: userSignInData.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'strict',
        maxAge:  60 * 30, // 30m expiring duration
      }
    )
    return userSignInData.token,
    redirect('/meals')
  }
}

export async function loginUsers(prevState, formData){
    const email =  formData.get('email')
    const password =  formData.get('password')
  function isValidLoginInput(input){
    return (!input) || input.trim() === ''
  }
  if(
    isValidLoginInput(email) ||
    isValidLoginInput(password) ||
    !email.includes('@')
  ){
    return{
      message: 'Invalid inputs, check your inputs'
    }
  }
  const userLogin = {
    email: email,
    password: password
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, {
    method: 'POST',
    body: JSON.stringify(userLogin),
    credentials:"include",
    headers: {'Content-Type' : 'application/json'}
  })
  const userData = await response.json()
  if(!response.ok){
    return{
      message: userData.error ||  'Invalid Credentials, check your input details'
    }
  }
  if(userData.token){
     const cookieStore = await cookies()
     cookieStore.set(
      {
        name: "token",
        value: userData.token,
        sameSite: "strict",
        maxAge: 60 * 30 , // 30m expiring duration,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      }
    )
    return userData.token,
    redirect('/meals')
  } 
}
export async function checkEmailExist(prevState, formData){
  const email = formData.get('email')
  if(!email || !email.includes('@')){
    return {message: 'Invalid Input'}
  }
  const body = {
    email: email
  }
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/checkemail`, {
    method : 'POST',
    body: JSON.stringify(body),
    headers: {"Content-Type":"application/json"}
  })
  if(response.ok){
    const useEmail = await response.json()
    return {
    message: useEmail.message || "Check your email"
    }
  }
  if(!response.ok){
    try{
      const useEmail = await response.json()
      return {
        message: useEmail.error || "Invalid Credential, check your internet connection" 
      }
    }catch(error){
      return {
        message: "Chech Your Internet Connection"
      }
    }
  }
}