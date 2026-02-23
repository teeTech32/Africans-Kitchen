"use server"

import { redirect} from "next/navigation"
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

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
  if(data.message){
    return{message:data.message} 
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
    method: "POST",
    headers: {"Content-Type" : "application/json"},
    body: JSON.stringify(userLogin)
  })
  const data = await response.json()

  if(data?.error){
    return{message: data.error }
  }
  const cookieStored = cookies()
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
  return {information: data.information }   
}
export async function checkEmailExist(prevState, formData){
  const email = formData.get('email')
  if(!email || !email.includes('@')){
    return {message: 'Invalid Input'}
  }
  const emailBody = {
    email: email
  }
  const cookieStored = cookies()
  const token = cookieStored.get("accessToken")?.value;
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/checkemail`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(emailBody) 
  })
  const data = await response.json()
  if(data?.error){
    return {
      message: data?.error ?? "Invalid Credential" 
    }
  }
  return {
    message: data.message || "Check your email"
  }
}

export  async function sharemealData(prevState, formData){
  const meal ={
    userName: formData.get('userName'),
    userEmail: formData.get('userEmail'),
    title: formData.get('title'),
    summary: formData.get('summary'),
    image: formData.get('image'),
    instructions: formData.get('instructions')
  }
  function isInvalidText(text){
    return !text || text.trim() === '' ;
  }
  if(
      isInvalidText(meal.userName) ||
      isInvalidText(meal.userEmail) ||
      isInvalidText(meal.title) || 
      isInvalidText(meal.summary) || 
      isInvalidText(meal.instructions) ||
      !meal.userEmail.includes('@')
    ){
    return{message:'Invalid Inputs'}
  }else if(!meal.image || meal.image.size === 0 ){
    return {message:'Select an image and be connected to the internet'}
  }
  const cookieStored = cookies();
  const accessToken = cookieStored.get('accessToken')?.value;
  let response
  let data = null;
  try{
    response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/meal/createmeal`,{
      method:"POST",
      headers:{
        Authorization: `Bearer ${accessToken}`
      },
      body: formData 
    }
  );
  data = await response.json()
  }catch{
    return { message: 'Network error. Please check your internet connection.' }
  }
  if(response.status === 401){
    return { error: "Unauthorized User"};
  }

  if(response.status === 409){
  return {message: data?.error}
  }

  if(!response.ok){
  return {message: data?.error ?? "Something went wrong, check your internet connections."}
  }
  
  revalidatePath('/meals')
  redirect('/meals') 
}

