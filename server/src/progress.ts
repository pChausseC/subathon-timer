let points = 0;
const goal = 500;
let progress = 0;
const update = (p: number) => {
  points += p;
  if (points > 500) points -= goal;
  progress = (points / goal) * 100;
  return progress;
};
export { progress, update };
