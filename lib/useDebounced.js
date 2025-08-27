import { useState, useEffect } from "react";

export function useDebounced(value, delay){
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(()=>{
    const handleTimeout = setTimeout(()=>{
      setDebouncedValue(value)
    }, delay)
    return ()=> clearTimeout(handleTimeout);
  },[value, delay])
  return debouncedValue;
}