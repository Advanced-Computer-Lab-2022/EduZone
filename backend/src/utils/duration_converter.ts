// make a function that takes duration as ISO 8601 string with optional hours and minutes value and return a number in hours
//
// Example:
// durationConverter('PT1H30M') // 1.5
// durationConverter('PT1H') // 1
// durationConverter('PT30M') // 0.5
// durationConverter('PT1M') // 0.016666666666666666
// durationConverter('PT1S') // 0.0002777777777777778
const durationConverter = (duration: string) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, hours, minutes, seconds] = regex.exec(duration) || [];
  const hoursInMinutes = hours ? parseInt(hours) * 60 : 0;
  const minutesInMinutes = minutes ? parseInt(minutes) : 0;
  const secondsInMinutes = seconds ? parseInt(seconds) / 60 : 0;
  return (hoursInMinutes + minutesInMinutes + secondsInMinutes) / 60;
};

export default durationConverter;
