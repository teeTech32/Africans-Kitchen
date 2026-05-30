"use client"

import { startTransition, useActionState, useEffect, useState } from "react"
import ImagePicker from "@/components/Meals/ImagePicker"
import { sharemealData } from "@/lib/actions"
import { TiDelete } from "react-icons/ti";
import { HiSparkles } from "react-icons/hi2";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getUser } from "@/components/Meals/ShareForm";
import { TbAlertHexagonFilled } from "react-icons/tb";
import { FaXmark } from "react-icons/fa6";

export default function ShareMeals(){
  const [state, formAction, isPending] = useActionState(sharemealData, {message:null});
  const [visibleMessage, setVisibleMessage]= useState('')
  const [loading, setLoading] = useState(true)
  const [pickedImage, setPickedImage] = useState(null)
  const [user, setUser] = useState(null)
  const [formInputData, setFormInputData] = useState({
      title: '',
      summary: '',
      instructions:'',
    })
  const [lastFormData, setLastFormData] = useState(null);
  const [notification, setNotification] = useState(false);
  const [mealAbsent, setMealAbsent] = useState(false);
  const [aiAbsent, setAiAbsent] = useState(false);
  const router = useRouter()

useEffect(()=>{
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
  fetchUser();
},[router]);

const handledSubmitForm = (formData)=>{
  setLastFormData(formData);
  startTransition(()=>{
    formAction(formData);
  })
}

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
}, [state, lastFormData, formAction, router])
  
useEffect(() => {
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
}, [state.message]);

  const {title, summary, instructions} = formInputData
  const name = user?.name || ""
  const email = user?.email || ""
  
  function handleChange(e){
    setFormInputData({...formInputData, [e.target.id]: e.target.value})
  }

  function handleAiRequest(){
    if(title === ''){
    setMealAbsent(true)
    }
    if(title){
      setAiAbsent(true)
    }
  }

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
                        className="bg-gray-900 rounded-sm text-white w-full text-xs md:text-sm p-2 relative z-10"value={instructions} onChange={handleChange}/>
                
            </p>
            <ImagePicker label={'Preview your image'} name={'image'} isRequired = {state.message} pickedImage = {pickedImage} setPickedImage = {setPickedImage}/>
            <p className="mx-5 my-2">
              <button  type="submit" disabled={isPending} className={`text-white font-semibold text-xs md:text-sm xl:text-lg bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-1 rounded-md cursor-pointer absolute ${visibleMessage ? 'bottom-12' : 'bottom-0'} right-5 hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105`}>{isPending ? "Sharing..." : "Share Meal"}</button>
            </p>
              {visibleMessage && <p className="bg-red-600 p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold">{visibleMessage}
            </p>}
          </form> 
        </main>
        {mealAbsent &&  <div className="fixed w-screen h-full bg-black/75 backdrop-blur-sm top-0 left-0 z-50">
            <div className="flex justify-center items-center h-screen">
              <div className="bg-white border-x-10 border-amber-500 rounded-2xl w-[280px] md:w-[320px] h-[170px] md:h-[230px] flex flex-col px-3 pb-3">
                <div  className="inline-flex w-65 h-65 md:w-75 md:h-75 md:gap-45 justify-between gap-43 ">
                  <TbAlertHexagonFilled className="text-amber-500"/>
                  <FaXmark onClick={()=>setMealAbsent(false)} className="cursor-pointer text-black hover:text-red-600 p-4 md:p-6"/>
                </div>
                <p className="text-black font-extrabold text-sm md:text-lg mb-1">Note:</p>
                <p className="text-black text-sm md:text-lg ">You need to enter your meal name or meal title before AI can help you generate its summary and cooking steps.</p>
              </div>
            </div>
          </div> } 
           {aiAbsent &&  <div className="fixed w-screen h-full bg-black/75 backdrop-blur-sm top-0 left-0 z-50">
            <div className="flex justify-center items-center h-screen">
              <div className="bg-white border-x-10 border-orange-600 rounded-2xl w-[280px] md:w-[320px] h-[150px] md:h-[210px] flex flex-col px-3 pb-3">
                <div  className="inline-flex w-65 h-65 md:w-75 md:h-75 md:gap-45 justify-between gap-43 ">
                  <TbAlertHexagonFilled className="text-orange-600"/>
                  <FaXmark onClick={()=>setAiAbsent(false)} className="cursor-pointer text-black hover:text-red-600 p-4 md:p-6"/>
                </div>
                <p className="text-black font-extrabold text-sm md:text-lg mb-1">Note:</p>
                <p className="text-black text-sm md:text-lg">This feature has not been implemented yet, please bear with us, thank you.</p>
              </div>
            </div>
          </div> } 
      </div>
      }      
  </>
}