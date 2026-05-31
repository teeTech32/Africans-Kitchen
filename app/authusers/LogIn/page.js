import {Suspense} from 'react'
import LoginForm from '../LoginForm/LoginForm'

export default function Login(){

  return <Suspense fallback={<div className='flex justify-center'><p className='text-sm md:text-2xl text-white'>Loading LoginForm...</p></div>}>
           <LoginForm/>
         </Suspense>
}