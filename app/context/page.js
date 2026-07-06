"use client"

import {createContext, startTransition, useActionState, useState} from 'react';
import { sharemealData } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { getUser } from "@/components/Meals/ShareForm";

export const FormContext = createContext();

export default function FormProvider({children}){

  const [state, formAction, isPending] = useActionState(sharemealData, {message:null});
  const [visibleMessage, setVisibleMessage]= useState('')
  const [loading, setLoading] = useState(true)
  const [pickedImage, setPickedImage] = useState(null)
  const [user, setUser] = useState(null)
  const [lastFormData, setLastFormData] = useState(null);
  const [notification, setNotification] = useState(false);
  const [zodInputValidation, setZodInputValidation] = useState(false);
  const [zoderrormessage, setZoderrormessage] = useState(null)
  const [aiRecipe, setAiRecipe] = useState(null);
  const [spinner, setSpinner] = useState(false)
  const [formInputData, setFormInputData] = useState({
    title: '',
    summary: '',
    instructions:'',
  })

  const handledSubmitForm = (formData)=>{
    setLastFormData(formData);
    startTransition(()=>{
      formAction(formData);
    })
  }
  
  function handleChange(e){
    setFormInputData({...formInputData, [e.target.id]: e.target.value})
  }

  const router = useRouter()

  const fetchUser = async()=>{
    try{
      const response = await getUser();
      setUser(response)
    }catch(error){
      router.push('/authusers/LogIn');
      return
    }finally{
      setLoading(false)
    }
  }
  

  function setDataInputEmpty(){
      setFormInputData({
      title: '',
      summary: '',
      instructions:'',
    });
  }

  async function handleAiRequest(){
    try{
      setSpinner(true)
      console.log("spinner true")
      const response = await api.post('/api/generate-recipe',{meal: title});
      return setAiRecipe(response.data)
    }catch(error){
      console.log(error)
      console.log(error.message)
      console.log(error.response?.data)
      setZoderrormessage(error.response?.data?.error ?? error.message ?? "Something went wrong")
      setZodInputValidation(true)
      return
    }finally{
      setSpinner(false)
      console.log("spinner false")
    }
  }
  
  
  return<FormContext.Provider value={{state, formAction, isPending,visibleMessage, setVisibleMessage, loading, pickedImage, setPickedImage, user, lastFormData, setLastFormData, notification, setNotification, zodInputValidation, setZodInputValidation, zoderrormessage, setZoderrormessage, aiRecipe, setAiRecipe, spinner, setSpinner, formInputData, setFormInputData, handledSubmitForm, handleChange, setDataInputEmpty, handleAiRequest, fetchUser }}>
          {children}
        </FormContext.Provider>
}