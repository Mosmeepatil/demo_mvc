require("dotenv").config()
const redis = require("ioredis")
const redisClient = () => {
    if (process.env.REDIS_URL) {
        console.log("Redis Connected");
        return process.env.REDIS_URL;
    }
    throw new Error('Redis connection failed')
}
export const redis = new redis.Redis(redisClient())