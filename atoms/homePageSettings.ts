import { atom } from "recoil";

export const homePageSettings = atom({
  key: "homePageSettings", // unique ID (with respect to other atoms/selectors)
  default: {
    blogType: "All Blogs",
  },
});
