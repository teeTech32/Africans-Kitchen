import Redis from "ioredis"

const globalForThis = globalThis;

const redis = globalForThis.redis || new Redis({
  host : process.env.REDIS_HOST || "redis",
  port : process.env.REDIS_PORT || 6379,
})

if(process.env.NODE_ENV !== "production"){
  globalForThis.redis = redis;
}

(async()=>{
  try{
    const response = await redis.ping();
    console.log("Redis Is Ready:", response) 
  }catch(error){
    console.log("Redis Failed:", error.message)
  }
})();

export default redis;
