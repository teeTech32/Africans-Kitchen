"use client"

import { useState, useRef } from "react";
import Image from "next/image";
import { TiDelete } from "react-icons/ti";
import { editMeal } from "@/lib/meals";
import { useRouter } from "next/navigation";
import {revalidatePage} from '@/lib/revalidatepage'

export default  function EditMeal({meal, setIsedited}){
  const [pendind, setPending] = useState(false)
  const [alertMessage, setAlertMessage] = useState(false)
  const [pickedEditImage, setPickedEditImage] = useState(null)
  const [imageAlert, setImageAlert] = useState(false)
  const [inputData, setInputData] = useState({
   creator: meal.creator,
   creator_email: meal.creator_email,
   title: meal.title,
   summary: meal.summary,
   instructions: meal.instructions,
   image: meal.image, 
  })
  const pickEditImage = useRef()
  const router = useRouter()

  const {creator, creator_email, title, summary, instructions, image} = inputData;

  const instructionsText = instructions
                          .replace(/<br\s*\/?>/g, '\n') // Replace all <br/> with newlines
                          .split('\n')                  // Split into individual lines
                          .map(line => line.replace('/\r/g', ''))     //  clean carriage return
                          .filter(line => line !== '') // kepp lines with spaces
                          .join('\n');                // Join with single lines 

  const imageUrl = `https://teetech-foodies-bucket.s3.eu-north-1.amazonaws.com/${image}`  
  
  function handleEditInput(){
    pickEditImage.current.click()
  }

  function handleEditImage(event){
    const file = event.target.files[0];
    if(!file){
      setPickedEditImage(null) 
      return; 
    }
     // I checked if the prospective image file size is not greater than 3mb to prevent serverAction resources over consumed
    if(file.size >= 3 * 1024 * 1024){
      setImageAlert(true)

      window.imageAlertTimeout = setTimeout(() => {
      setImageAlert(false);
      }, 5000);

      // Clear any existing timeout to prevent overlapping
       if (window.imageAlertTimeout) {
         clearTimeout(window.imageAlertTimeout);
        }
      return 
    }
    setImageAlert(false)
    const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = ()=>{
      setPickedEditImage(fileReader.result)
      } 
  }

  function handleOnchange(event){
    setInputData({...inputData, [event.target.id]: event.target.value})
  }

  async function handleSubmit(event){
    setPending(true)
    event.preventDefault()
    const formData = new FormData();
    formData.append('id', meal.id);
    formData.append('creator', creator);
    formData.append('creator_email', creator_email);
    formData.append('title', title);
    formData.append('summary', summary);
    formData.append('instructions', instructions);
    if(pickEditImage.current.files[0]){
      formData.set('image', pickEditImage.current.files[0])
    }else{
      formData.set('image', image)
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
                    <input type="text" name="name" id="name" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm" value={creator} onChange={handleOnchange}/>
                  </p>
                  <p className="mx-5 my-2">
                    <label htmlFor="Email" className="text-gray-400 text-xs md:text-sm xl:text-lg font-semibold">YOUR EMAIL</label>
                    <input type="email"  name="email" id="email" className="w-full p-2 bg-gray-900 rounded-sm text-white text-xs md:text-sm" value={creator_email} onChange={handleOnchange}/>
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
                  <textarea type="text" 
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
                  <button disabled={pendind}  type="submit" className={`z-10 text-white font-semibold text-xs md:text-sm xl:text-lg bg-gradient-to-l from-red-700 via-yellow-400 to-orange-400 p-1 rounded-md cursor-pointer absolute ${alertMessage ? 'bottom-12' : 'bottom-0'} right-5 hover:text-red-500 hover:transition-1000 duration-500 hover:scale-105`}>{pendind ? 'Editing...' : 'Edit Meal'}</button>
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
