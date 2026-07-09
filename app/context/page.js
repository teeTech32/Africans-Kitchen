"use client"

import {createContext, useState, useCallback} from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from "@/components/Meals/ShareForm";


export const FormContext = createContext();

export default function FormProvider({children}){

  const [visibleMessage, setVisibleMessage]= useState('')
  const [loading, setLoading] = useState(true)
  const [pickedImage, setPickedImage] = useState(null)
  const [user, setUser] = useState(null)
  
  const router = useRouter()

  const fetchUser = useCallback(async()=>{
    try{
      const response = await getUser();
      setUser(response)
    }catch(error){
      router.push('/authusers/LogIn');
      return
    }finally{
      setLoading(false)
    }
  },[router])
  
  return<FormContext.Provider value={{visibleMessage, setVisibleMessage, loading, setLoading, pickedImage, setPickedImage, user, fetchUser }}>
          {children}
        </FormContext.Provider>
}