import jwt from "jsonwebtoken"
import crypto from "crypto"

export const signAccessToken  = (payload)=>{
  return jwt.sign({payload}, process.env.JWT_SECRET, {expiresIn: "15m"})
}

export const verifyAccessToken = (token)=>{
  if (!token) return null;
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if(!decoded?.payload?.id) return null
    return decoded
  }catch(error){
   return null
  }
}

export const signRefreshToken  = (payload)=>{
  return jwt.sign({payload}, process.env.JWT_REFRESH_SECRET, {expiresIn: "7d"})
}

export const verifyRefreshToken = (token)=>{
  if (!token) return null;
  try{
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    if(!decoded?.payload?.id) return null
    return decoded
  }catch(error){
   return null
  }
}

export const hashRefreshToken = (token)=>{
  return crypto.createHash("sha256").update(token).digest("hex")
}

