"use client"

import { useState, useRef, useEffect, type Dispatch, type SetStateAction, type SubmitEvent, ChangeEvent } from "react";
import Image from "next/image";
import { TiDelete } from "react-icons/ti";
import { editMeal } from "@/lib/meals";
import { useRouter } from "next/navigation";
import {revalidatePage} from '@/lib/revalidatepage'
import { api } from "@/lib/api";
import { Meal } from "@prisma/client";


type InputData = {
  userName: string;
  userEmail: string;
  title: string;
  summary: string;
  instructions: string;
  image: string;
}
type EditMealProps = {
  meal: Meal;
  setIsedited: Dispatch<SetStateAction<boolean>>;
};

export default function EditMeal({ meal, setIsedited }: EditMealProps) {
  const [pending, setPending] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<boolean>(false);
  const [pickedEditImage, setPickedEditImage] = useState<string | null>(null);
  const [imageAlert, setImageAlert] = useState<boolean>(false)
  const [inputData, setInputData] = useState<InputData >({
   userName: meal.userName,
   userEmail: meal.userEmail,
   title: meal.title,
   summary: meal.summary,
   instructions: meal.instructions,
   image: meal.image, 
  })
  const pickEditImage = useRef<HTMLInputElement | null>(null)
  const router = useRouter()

  const  {userName, userEmail, title, summary, instructions, image} = inputData;

  const instructionsText = instructions
                          .replace(/<br\s*\/?>/g, '\n') // Replace all <br/> with newlines
                          .split('\n')                  // Split into individual lines
                          .map(line => line.replace('/\r/g', ''))     //  clean carriage return
                          .filter(line => line !== '') // keep lines with spaces
                          .join('\n');                // Join with single lines 

  const imageUrl = `https://new-foodies.s3.eu-north-1.amazonaws.com/${image}`  
  
  function handleEditInput(){
    pickEditImage.current?.click()
  }

  const imageAlertTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(()=>{
    return ()=>{
      if(imageAlertTimeout.current){
        clearTimeout(imageAlertTimeout.current)
      }
    }
  },[])

  function handleEditImage(event: ChangeEvent<HTMLInputElement>){
    const file = event.target.files?.[0];
    if(!file){
      setPickedEditImage(null) 
      return; 
    }
     // I checked if the prospective image file size is not greater than 3mb to prevent serverAction resources over consumed
    if(file.size >= 3 * 1024 * 1024){
      setImageAlert(true)
      imageAlertTimeout.current = setTimeout(() => {
      setImageAlert(false);
      imageAlertTimeout.current = null;
      }, 5000);
    }
    setImageAlert(false)
    const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = ()=>{
        if(typeof fileReader.result === 'string'){
          setPickedEditImage(fileReader.result)
        }
      } 
  }

  function handleOnchange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    setInputData({...inputData, [event.target.id]: event.target.value})
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>){
    event.preventDefault()
    setPending(true)
    try{
      await api.get('/api/auth/accesstoken');
      const formData = new FormData();
      formData.append('id', String(meal.id));
      formData.append('userName', userName);
      formData.append('userEmail', userEmail);
      formData.append('title', title);
      formData.append('summary', summary);
      formData.append('instructions', instructions);
      if(pickEditImage.current?.files?.[0]){
        formData.append('image', pickEditImage.current.files[0])
      }else{
        formData.append('image', image)
      }
      const result = await editMeal(formData);
      if(!result.success){
        setPending(false)
        setAlertMessage(true)
       setTimeout(()=>{
          setAlertMessage(false)
        },5000)
      }else{
        router.refresh()
        await revalidatePage();
        setIsedited(false)
      }
    }catch(error){
      console.error("Server connection problem:", error)
    }finally{
      setPending(false);
    }
   
  }

  return<>
          <div className="w-screen h-full z-50 top-0 left-0">
            <header className="relative" >
              <h1 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-red-800 via-orange-600 to-yellow-200 text-xl md:text-2xl xl:text-3xl font-extrabold leading-10 mt-35 lg:mt-50 mb-5">
                Edit Your Meal Here 
              </h1>
              <button className="absolute top-4 right-20 cursor-pointer z-10">
                <TiDelete className="text-white hover:text-red-600 text-2xl md:text-3xl xl:text-4xl cursor-pointer " onClick={()=>setIsedited(false)} />
              </button>
            </header>
            <main className="relative mx-10 mb-30">
              <form  onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row">
                  <p className="mx-5  my-2">
                    <label htmlFor="Name" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR NAME</label>
                    <input type="text" name="userName" id="userName" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm" readOnly value={userName} onChange={handleOnchange}/>
                  </p>
                  <p className="mx-5 my-2">
                    <label htmlFor="Email" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR EMAIL</label>
                    <input type="email"  name="userEmail" id="userEmail" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm" readOnly value={userEmail} onChange={handleOnchange}/>
                  </p>
                </div>
                <p className="mx-5 my-2 flex flex-col">
                  <label htmlFor="Title" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">TITLE</label>
                  <input type="text"  name="title" id="title" className="w-full md:w-68 xl:w-74  p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm relative z-10" value={title} onChange={handleOnchange}/>
                </p>
                <p className="mx-5 my-2">
                  <label htmlFor="Summary" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">SHORT SUMMARY</label>
                  <input type="text"  name="summary" id="summary" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm relative z-10" value={summary} onChange={handleOnchange}/>
                </p>
                <p className="mx-5 mt-2">
                  <label htmlFor="Instructions" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">INSTRUCTIONS</label>
                  <textarea 
                            rows={10}
                            name="instructions" 
                            id="instructions" 
                            value={instructionsText}
                            onChange={handleOnchange}
                            className="bg-gray-900 rounded-sm text-white w-full text-xs md:text-sm p-2 relative z-10"/>
                    
                </p>
                <div>
                  <label htmlFor='image' className="mx-5 text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">Preveiw edit image</label>
                  <div className="flex flex-row">
                    <div className="container w-40 md:w-50 xl:w-60 h-40 md:h-50 xl:h-60 border-2 border-white mx-5">
                      {!pickedEditImage && <Image src={imageUrl}  alt="Preveiwed image" width={150} height={150} className="w-40 h-39 md:w-50 md:h-49 xl:w-60 xl:h-59 object-cover"/> }
                      {pickedEditImage && <Image src={pickedEditImage}  alt="Preveiwed image" width={150} height={150} className="w-40 h-39 md:w-50 md:h-49 xl:w-60 xl:h-59 object-cover"/>}
                    </div>
                    <div>
                      <button type="button" className="w-30 h-10 md:w-40 p-2 bg-gray-300 text-xs font-semibold md:text-sm  mx-5 rounded-sm cursor-pointer absolute right-0  z-10" onClick={handleEditInput} >
                        Edit Image
                      </button>
                    </div>
                  </div>
                  <div className="hidden">
                    <input type="file" 
                            name="image" 
                            id="image"
                            accept="image/png, image/jpeg, image/jpg" 
                            className="mx-5"
                            ref={pickEditImage}
                            onChange={handleEditImage} />
                  </div>
                </div>
                <p className="mx-5 my-2 ">
                  <button disabled={pending}  type="submit" className={`z-10 text-white font-semibold text-xs md:text-sm xl:text-lg bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-1 rounded-md cursor-pointer absolute ${alertMessage ? 'bottom-12' : 'bottom-0'} right-5 hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105`}>{pending ? 'Editing...' : 'Edit Meal'}</button>
                </p>
                {alertMessage && <p className="bg-red-600 p-2 mx-10 md:mx-20 rounded-md text-white text-center text-sm md:text-lg xl:text-xl font-bold">Bad connection, check your connections !</p>}
              </form> 
              {imageAlert && <main className="flex flex-col border-2 border-red-700 ml-5 mr-25 lg:mr-30 my-2 rounded-md">
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-600 to-orange-600 font-extrabold text-xs md:text-lg xl:text-xl text-center mt-2">Error!!!</p>
                <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-red-600 to-orange-600 font-extrabold  text-xs md:text-lg xl:text-xl text-center mt-2 mb-3 mx-5">An image size of 3mb or greater than 3mb is not allowed !...</h1>
                </main> }  
            </main>
          </div>
        </>
}
