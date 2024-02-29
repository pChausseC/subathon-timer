import { cacheGoal, cacheTotalProgess } from "./cache";

let points = 0;
const max = 250;
let progress = 0;
let goal = "";
let total = 0;
const setPoints = (p: number) => {
  points = 0;
  total = 0;
  update(p);
};
function getPreviousMultipleOfMax(x: number): number {
  return Math.floor(x / max) * max;
}
const update = (p: number) => {
  points += p;
  total += p;
  cacheTotalProgess(total);
  if (points > max) points -= getPreviousMultipleOfMax(points);
  progress = (points / max) * 100;
  return progress;
};
const setGoal = (g: string) => {
  goal = g;
  cacheGoal(goal);
};
export { progress, update, goal, setGoal, setPoints, total };
