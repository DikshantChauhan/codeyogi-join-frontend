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
