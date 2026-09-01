import jwt, { type JwtPayload } from "jsonwebtoken"
import crypto from "crypto"

type TokenPayload = {
  id: number;
  email: string;
};

type DecodedToken = JwtPayload & {
  payload: TokenPayload;

}

export const signAccessToken  = (payload: TokenPayload): string =>{
  return jwt.sign({payload}, process.env.JWT_SECRET as string, {expiresIn: "15m"})
}

export const verifyAccessToken = (token: string): DecodedToken | null =>{
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    if(typeof decoded === "string") return null
    if(!decoded.payload || typeof decoded.payload !== "object"){
      return null
    }
    const payload = decoded.payload as Partial<TokenPayload>;
    if( typeof payload.id !== "number" || typeof payload.email !== "string"){ return null}
    return decoded as DecodedToken;
  }catch{
   return null
  }
}

export const signRefreshToken  = (payload: TokenPayload): string=>{
  return jwt.sign({payload}, process.env.JWT_REFRESH_SECRET as string, {expiresIn: "7d"})
}

export const verifyRefreshToken = (token: string): DecodedToken | null =>{
  try{
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string)
    if(typeof decoded === "string"){ return null;}
    if(!decoded.payload || typeof decoded.payload !== "object") return null
    const payload = decoded.payload as Partial<TokenPayload>;
    if(typeof payload.id !== "number" || typeof payload.email !== "string") return null;
    return decoded as DecodedToken;
  }catch(error){
   return null
  }
}

export const hashRefreshToken = (token: string): string=>{
  return crypto.createHash("sha256").update(token).digest("hex")
}

