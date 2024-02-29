const ONE_SECOND = 1000;
const ONE_MIN = 60 * ONE_SECOND;
const ONE_HOUR = 60 * ONE_MIN;
const ONE_DAY = 24 * ONE_HOUR;
const timeToPoints = (ms: number) => ms / ONE_MIN;
const pointsToTime = (ms: number) => ms * ONE_MIN;

export { ONE_SECOND, ONE_MIN, ONE_HOUR, ONE_DAY, timeToPoints, pointsToTime };
