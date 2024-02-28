import Redis, { Callback } from "ioredis";

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL)
  : undefined;

const cacheGetCallback: Callback<string> = (err, result) => {
  if (err) {
    console.log(err);
    return null;
  } else {
    return result;
  }
};

const cacheGoal = (goal: string) => redis?.set("goal", goal);
const cachedGoal = () => redis?.get("goal", cacheGetCallback);

const cacheTotalProgess = (points: number) =>
  redis?.set("totalProgress", points);
const cachedTotalProgess = () => redis?.get("totalProgress", cacheGetCallback);

const cacheTimeleft = (time: number) => redis?.set("timeleft", time);
const cachedTimeleft = () => redis?.get("timeleft", cacheGetCallback);

const cacheTimeElapsed = (time: number) => redis?.set("elapsed", time);
const cachedTimeElapsed = () => redis?.get("elapsed", cacheGetCallback);

const clearCache = async () => {
  await cacheGoal(null);
  await cacheTotalProgess(null);
  await cacheTimeleft(null);
  await cacheTimeElapsed(null);
};
export {
  clearCache,
  cacheGoal,
  cachedGoal,
  cacheTimeleft,
  cachedTimeleft,
  cacheTimeElapsed,
  cachedTimeElapsed,
  cacheTotalProgess,
  cachedTotalProgess,
};
