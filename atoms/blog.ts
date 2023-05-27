import { atom } from "recoil";

export const newBlog = atom({
  key: "newBlog", // unique ID (with respect to other atoms/selectors)
  default: {
    blogBanner: "",
    blogTitle: "",
    blogDescription: "",
    blogTags: "",
  },
});
