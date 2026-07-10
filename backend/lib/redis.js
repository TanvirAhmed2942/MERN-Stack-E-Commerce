import { createClient } from "redis";

const redis_client = await createClient()
  .on("error", (err) => console.log("Redis Client Error", err.code))
  .on("connect", () => console.log("Redis client connected"))
  .connect()

export { redis_client };