import { cacheGoal, cacheTotalProgess } from "./cache";

let points = 0;
const max = 500;
let progress = 0;
let goal = "";
let total = 0;
const setPoints = (p: number) => {
  points = 0;
  total = 0;
  update(p);
};
const update = (p: number) => {
  points += p;
  total += p;
  cacheTotalProgess(total);
  if (points > max) points -= max;
  progress = (points / max) * 100;
  return progress;
};
const setGoal = (g: string) => {
  goal = g;
  cacheGoal(goal);
};
export { progress, update, goal, setGoal, setPoints, total };
