import { useContext } from "react";
import { FormContext } from "@/app/context/page";

export default function useFormContext(){
  const context = useContext(FormContext);

  if(context === null ){
    throw new Error("useFormContext must be used inside FormProvider")
  }
  return context;
}