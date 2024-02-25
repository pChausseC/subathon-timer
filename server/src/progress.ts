let points = 0;
const max = 500;
let progress = 0;
let goal = "";
const update = (p: number) => {
  points += p;
  if (points > max) points -= max;
  progress = (points / max) * 100;
  return progress;
};
const setGoal = (g: string) => {
  goal = g;
};
export { progress, update, goal, setGoal };
