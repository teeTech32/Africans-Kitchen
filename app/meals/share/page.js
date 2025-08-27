"use client"

import { useActionState, useEffect, useState } from "react"
import ImagePicker from "@/components/Meals/ImagePicker"
import { sharemealData } from "@/lib/actions"
import { TiDelete } from "react-icons/ti";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ShareMeals(){
// this manages the responses and state of the form component before and after the server-action-function was trigger.The useActionState() hook, plays the major role here by standing in-between the two states.
  const [state, formAction, isPending] = useActionState(sharemealData, {message:null});
  const [visibleMessage, setVisibleMessage]= useState('')
  const [loading, setLoading] = useState(true)
  const [pickedImage, setPickedImage] = useState(null)
  const [formInputData, setFormInputData] = useState({
      name: '',
      email: '',
      title: '',
      summary: '',
      instructions:'',
    })
  const router = useRouter()
  
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
      name: '',
      email: '',
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

  useEffect(()=>{
    setLoading(true)
    fetch('/api/me/profile')
      .then(res => res.json())
      .then(data => {
        if(!data || data.error){
          router.push('/authusers/SignUp')
        }else{
          setLoading(false)
        }
      })
  },[router]);

  const {name, email, title, summary, instructions} = formInputData
  
  function handleChange(e){
    setFormInputData({...formInputData, [e.target.id]: e.target.value})
  }

  return<>
    {loading ? <div className="flex justify-center">
                <p  className="text-white font-extrabold my-60 md:my-72 md:text-lg lg:text-2xl">Loading Shearing Form...</p> 
            </div>:
      <div>
        <header>
            <Link href={'/meals'} className="absolute top-38 lg:top-44 lg:left-12 left-10 cursor-pointer z-10">
              <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl xl:text-4xl cursor-pointer "/>
            </Link>
            <h1 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-400 to-yellow-300 text-xl md:text-2xl xl:text-3xl font-extrabold leading-10 mt-35 lg:mt-50">
              Share your <span>favorite meal</span> 
            </h1>
            <p className="text-center text-white text-lg md:text-xl xl:text-2xl font-bold mb-10 md:mt-5">Or any other meal you feel needs sharing !</p>
          </header>
          <main className="relative mx-10 mb-30">
            <form action={formAction} >
              <div className="flex flex-col md:flex-row">
                <p className="mx-5  my-2">
                  <label htmlFor="Name" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR NAME</label>
                  <input type="text" required name="name" id="name" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm relative z-10" placeholder="Use your SignUp Name for accessibility" value={name} onChange={handleChange} />
                </p>
                <p className="mx-5 my-2">
                  <label htmlFor="Email" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR EMAIL</label>
                  <input type="email" required name="email" id="email" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm relative z-10" placeholder="Use your SignUp Email for accessibility" value={email} onChange={handleChange} />
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
      </div>
      }      
  </>
}