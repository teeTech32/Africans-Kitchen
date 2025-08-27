import ForgetPassword from "@/components/ForgetPassword/ForgetPasswordClient";
import { Suspense } from "react";

export default function ForgetPasswordPage(){
  return<Suspense fallback={<div className="flex justify-center">
             <p className="text-white font-extrabold text-sm md:text-xl xl:text-2xl mt-20 mb-30 md:mb-42 md:mt-25">Sending mail...</p>
             </div>}>
          <ForgetPassword/>
        </Suspense>
}

