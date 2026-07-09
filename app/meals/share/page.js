"use client"

import { startTransition, useContext, useEffect, useActionState, useState } from "react"
import { sharemealData } from '@/lib/actions';
import ImagePicker from "@/components/Meals/ImagePicker"
import { TiDelete } from "react-icons/ti";
import { HiSparkles } from "react-icons/hi2";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { TbAlertHexagonFilled } from "react-icons/tb";
import { FaXmark } from "react-icons/fa6";
import {FormContext} from '@/app/context/page'

export default function ShareMeals(){
  const {visibleMessage, setVisibleMessage, loading, pickedImage, setPickedImage, user, fetchUser } = useContext(FormContext)

  const [state, formAction, isPending] = useActionState(sharemealData, {message:null});
  const [spinner, setSpinner] = useState(false)
  const [lastFormData, setLastFormData] = useState(null);
  const [notification, setNotification] = useState(false);
  const [zodInputValidation, setZodInputValidation] = useState(false);
  const [zoderrormessage, setZoderrormessage] = useState(null)
  const [aiRecipe, setAiRecipe] = useState(null);
  const [formInputData, setFormInputData] = useState({
    title: '',
    summary: '',
    instructions:'',
  })
  const router = useRouter()

  useEffect(()=>{
    fetchUser()
  },[fetchUser])

  useEffect(()=>{
    if(state?.error === "Unauthorized User" && lastFormData){
      (async()=>{
        try{
          // Siliently refresh the token
          await api.post('/api/auth/refreshtoken');
          // Re-dispatch the server action
          startTransition(()=>{
            formAction(lastFormData);
          })
        }catch(error){
          router.push('/authusers/LogIn')
        }
      })()
    }
  },[state?.error, lastFormData, formAction, router])

  useEffect(()=>{
    const timeout = state.message ? setTimeout(() => {
      setVisibleMessage('');
    }, 5000) : null;
    if(state.message) {
      setVisibleMessage(state.message);
      if(state.message === 'Something went wrong, check your internet connections.'){
        const handleTimeout = setTimeout(()=>{
          setPickedImage(null)
        },5000)
        return ()=> clearTimeout(handleTimeout);
      }
    } else {
      setFormInputData({
        title: '',
        summary: '',
        instructions:'',
      });
      setPickedImage(null)
    }
    return () => {
      if(timeout) clearTimeout(timeout);
    }; 
  }, [state.message, setFormInputData, setVisibleMessage, setPickedImage])

  async function handleAiRequest(){
    try{
      console.log("AI was clicked")
      setSpinner(true)
      const response = await api.post('/api/generate-recipe',{meal: title});
      console.log("AI was clicked yes it was clicked")
      console.log(response.data)
      return setAiRecipe(response.data)
    }catch(error){
      console.log("Error is discovered")
      console.log(error.message)
      setZoderrormessage(error.response?.data?.error)
      setZodInputValidation(true)
      return
    }finally{
      setSpinner(false)
    }
  }

  const handledSubmitForm = (formData)=>{
      setLastFormData(formData);
      startTransition(()=>{
        formAction(formData);
      })
    }
    
    function handleChange(e){
      setFormInputData({...formInputData, [e.target.id]: e.target.value})
    }

    function setDataInputEmpty(){
      setFormInputData({
      title: '',
      summary: '',
      instructions:'',
    });
  }
  
  
  const {title, summary, instructions} = formInputData
  const name = user?.name || ""
  const email = user?.email || ""
  
  return<>
    {loading ? <div className="flex justify-center">
                <p  className="text-white font-extrabold my-60 md:my-72 md:text-lg lg:text-2xl">Loading Shearing Form...</p> 
            </div>:
      <div>
        <header>
            <button className="absolute top-38 lg:top-44 xl:top-56 2xl:top-70 lg:left-12 left-10 cursor-pointer z-10" onClick={()=> router.back()}>
              <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl xl:text-4xl cursor-pointer "/>
            </button>
            <h1 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300 text-xl md:text-2xl xl:text-3xl font-extrabold leading-10 mt-35 lg:mt-50 xl:mt-55 2xl:mt-70">
              Share your <span>favorite meal</span> 
            </h1>
            <p className="text-center text-white text-lg md:text-xl xl:text-2xl font-bold mb-10 md:mt-5">Or any other meal you feel needs sharing !</p>
        </header>
        <div className="absolute right-20 top-56 z-10 lg:right-30 lg:top-100 ">
          <button onMouseOver={()=>{setNotification(true)}} onMouseOut={()=> setNotification(false)} onClick={handleAiRequest} className="bg-gradient-to-r from-orange-600 to-yellow-300 orange-600 text-white float-end rounded-full shadow-2x cursor-pointer hover:text-orange-600">
            <div className="inline-flex px-2 pt-2 lg:p-3 lg:text-lg xl:p-4 xl:text-2xl">
              <HiSparkles className="font-bold text-xl"/>
              <p className="font-bold">AI</p>
            </div>
          </button>
          {notification && <p className="text-xs md:text-sm xl:text-md bg-black/55 w-30 md:w-48 xl:w-62 rounded-md text-white p-2">
            Enter your meal title and generate summary with cooking steps for your meal using AI. 
          </p>}
        </div>
        <main className="relative mx-10 mb-30">
          <form action={handledSubmitForm} >
            <div className="flex flex-col md:flex-row">
              <p className="mx-5  my-2">
                <label htmlFor="Name" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR NAME</label>
                <input type="text" name="userName" id="userName" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm" placeholder="Use your SignUp Name for accessibility" value={name} onChange={handleChange} readOnly />
              </p>
              <p className="mx-5 my-2">
                <label htmlFor="Email" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR EMAIL</label>
                <input type="email" name="userEmail" id="userEmail" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm" placeholder="Use your SignUp Email for accessibility" value={email} onChange={handleChange} readOnly/>
              </p>
            </div>
            <p className="mx-5 my-2 flex flex-col">
              <label htmlFor="Title" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">TITLE</label>
              <input type="text" required name="title" id="title" className="w-full md:w-68 xl:w-74  p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm relative z-10" value={title} onChange={handleChange}/>
            </p>
            <p className="mx-5 my-2">
              <label htmlFor="Summary" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">SHORT SUMMARY</label>
              <input type="text" required name="summary" id="summary" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm relative z-10" value={summary} onChange={handleChange}/>
            </p>
            <p className="mx-5 mt-2">
              <label htmlFor="Instructions" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">INSTRUCTIONS</label>
              <textarea type="text" 
                        required 
                        rows={10}
                        name="instructions" 
                        id="instructions" 
                        className="bg-gray-900 rounded-sm text-white w-full text-xs md:text-sm p-2 relative z-10" value={instructions} onChange={handleChange}/>  
            </p>
            <ImagePicker label={'Preview your image'} name={'image'} isRequired = {state.message} pickedImage = {pickedImage} setPickedImage = {setPickedImage}/>
            <div className="mx-5 my-2 inline-flex  float-start">
              <button  type="submit" disabled={isPending} className={`text-black font-semibold text-xs md:text-sm xl:text-lg bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 py-1 px-2 rounded-md cursor-pointer absolute ${visibleMessage ? 'bottom-12' : 'bottom-0'} right-5 hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105`}>{isPending ? "Sharing..." : "Share Meal"}</button>
              <button  type="cancel" onClick={setDataInputEmpty} className={`text-black font-semibold text-xs md:text-sm xl:text-lg bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 py-1 px-2 rounded-md cursor-pointer absolute ${visibleMessage ? 'bottom-12' : 'bottom-0'} right-30 md:right-35 xl:right-45 hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105`}>Cancel</button>
            </div>
              {visibleMessage && <p className="bg-red-600 p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold">{visibleMessage}
            </p>}
          </form> 
        </main>
        {zodInputValidation &&  <div className="fixed w-screen h-full bg-black/75 backdrop-blur-sm top-0 left-0 z-50">
            <div className="flex justify-center items-center h-screen">
              <div className="bg-white border-x-10 border-amber-500 rounded-2xl w-[280px] md:w-[300px] h-[130px] md:h-[165px] flex flex-col px-3 pb-3 md:pb-2">
                <div  className="inline-flex md:gap-45 justify-between gap-43 w-65 md:w-70">
                  <TbAlertHexagonFilled className="text-amber-500"/>
                  <FaXmark onClick={()=>setZodInputValidation(false)} className="cursor-pointer text-black hover:text-red-600 p-4 md:p-5 "/>
                </div>
                <p className="text-black font-extrabold text-sm md:text-lg mb-1">Note:</p>
                <p className="text-black text-sm md:text-lg ">{zoderrormessage}</p>
              </div>
            </div>
          </div> } 
          {spinner &&  <div className="fixed w-screen inset-0 h-full bg-black/75 backdrop-blur-sm z-[5000] flex justify-center items-center">
            <div className=" md:h-[150px] md:w-[150px] h-[100px] w-[100px] animate-spinner rounded-full border-[8px] md:border-[12px] border-solid border-t-amber-500 border-r-transparent border-b-amber-500 border-l-transparent justify-items-center">
             <p className="text-white text-sm font-bold md:text-lg mt-8 md:mt-12">teeTech</p> 
            </div>
          </div> } 
      </div>
      }      
  </>
}