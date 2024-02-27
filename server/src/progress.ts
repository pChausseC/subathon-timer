let points = 6;
const max = 500;
let progress = 6;
let goal = "";
let total = 6;
const update = (p: number) => {
  points += p;
  total += p;
  if (points > max) points -= max;
  progress = (points / max) * 100;
  return progress;
};
const setGoal = (g: string) => {
  goal = g;
};
export { progress, update, goal, setGoal, total };
