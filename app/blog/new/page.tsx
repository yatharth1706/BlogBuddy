"use client";
import { newBlog } from "@/atoms/blog";
import React, { FormEvent, useState } from "react";
import { useRecoilState } from "recoil";

function page() {
  const [blog, setBlog] = useRecoilState(newBlog);
  const [filePreview, setFilePreview] = useState("");

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview("");
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto py-16 gap-3 text-gray-700">
      <label>Blog Banner</label>

      <input
        type="file"
        className="p-2 outline-sky-300 border border-gray-300 rounded"
        id="uploader"
        onChange={handleFileChange}
      />

      {filePreview && (
        <img className="w-full" src={filePreview} alt="Blog Banner" />
      )}

      <label>Tags</label>

      <input
        type="text"
        value={blog.blogTags}
        className="p-2 outline-sky-300 border border-gray-300 rounded"
        placeholder="Enter tags comma seperated"
        onChange={(e) => setBlog({ ...blog, blogTags: e.target.value })}
      />
      <label>Blog Title</label>

      <input
        type="text"
        value={blog.blogTitle}
        placeholder="Enter title here"
        className="p-2 outline-sky-300 border border-gray-300 rounded"
        onChange={(e) => setBlog({ ...blog, blogTitle: e.target.value })}
      />

      <label>Blog Description</label>

      <textarea
        className="h-96 p-2 outline-sky-300 border border-gray-300 rounded"
        value={blog.blogDescription}
        placeholder="Enter description here"
        onChange={(e) => setBlog({ ...blog, blogDescription: e.target.value })}
      />
    </div>
  );
}

export default page;
