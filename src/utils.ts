import { User } from "./Models/User";

export const isStudentProfileComplete = (user: User) => {
  const properties = Object.values(user);
  if (properties.length === 0) {
    return false;
  }
  return properties.every((property) => {
    return !!property;
  });
};

export const secondsToHHMMSS = (secs: number) => {
  var hours = Math.floor(secs / 3600);
  var minutes = Math.floor(secs / 60) % 60;
  var seconds = secs % 60;

  return [hours, minutes, seconds]
    .map((v) => (v < 10 ? "0" + v : v))
    .filter((v, i) => v !== "00" || i > 0)
    .join(":");
};
