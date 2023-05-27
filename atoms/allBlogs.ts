import { atom } from "recoil";

export const blogsList = atom({
  key: "blogsList", // unique ID (with respect to other atoms/selectors)
  default: [],
});
