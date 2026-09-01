"use client"

import {createContext, useState, useCallback, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from "@/components/Meals/ShareForm";

type User = {
  id: number;
  password: string;
  email: string;
  name: string;
  createdAt: Date;
  hashedVerificationToken: string | null;
  verificationExpires: Date | null;
  verified: boolean;
}

type FormContextType = {
  visibleMessage: null | string;
  setVisibleMessage: Dispatch<SetStateAction<null | string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  pickedImage: null | string;
  setPickedImage: Dispatch<SetStateAction<null | string>>;
  user: null | User ;
  fetchUser: ()=> Promise<void>;
}

type FormProviderProps = {
children: ReactNode;
}

export const FormContext = createContext<FormContextType | null>(null);

export default function FormProvider({children}: FormProviderProps){

  const [visibleMessage, setVisibleMessage]= useState<string | null>('')
  const [loading, setLoading] = useState<boolean>(true)
  const [pickedImage, setPickedImage] = useState< string | null>(null)
  const [user, setUser] = useState<null | User>(null)
  
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

