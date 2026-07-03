import { createClient } from "redis";

const redis_client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();

console.log("Redis client connected");

export { redis_client };