const getRandomInt = (min: number, max: number): number => {
  const range = max - min + 1;
  return Math.floor(Math.random() * range) + min;
};

const tierOne = () => getRandomInt(4, 7);
const tierTwo = () => getRandomInt(9, 12);
const tierThree = () => getRandomInt(25, 28);

export { tierOne, tierTwo, tierThree };
