"use client";
import React, { useEffect, useState } from "react";
import Data from "./../dummyData.json";
import BlogsSkeleton from "./BlogsSkeleton";
import Link from "next/link";

type ArticleCardDetails = {
  id: String;
  key: String;
  authorName: String;
  authorImage: String;
  authorBio: String;
  blogTitle: String;
  blogDescription: String;
  blogPic: String;
  createdAt: String;
  tags?: String;
};

type BlogData = {
  _id: String;
  blogBanner: String;
  blogDescription: String;
  tags?: String;
  blogTitle: String;
  createdBy: String;
  createdOn: String;
  user: {
    bio: String;
    email: String;
    name: String;
    pic: String;
  };
};

function ArticleCard(props: ArticleCardDetails) {
  return (
    <div
      className="flex flex-col gap-5 border-b border-zinc-200"
      key={props.key as string}
    >
      <Link href={"/blog/" + props.id}>
        <div className="flex gap-4">
          <img
            src={props.authorImage as string}
            alt="Blog Author Image"
            className="w-12 h-12 object-cover border-2 border-white rounded-full"
          />
          <div className="flex flex-col gap-1">
            <div className="font-semibold flex gap-3 items-center">
              <span>{props.authorName}</span>
              <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
              <span className="text-gray-500 font-light text-xs">
                {props.createdAt}
              </span>
            </div>
            <p className="text-gray-500">{props.authorBio}</p>
          </div>
        </div>
      </Link>
      <div className="flex w-full gap-8">
        <div className="w-8/12 flex flex-col gap-4">
          <Link href={"/blog/" + props.id}>
            <h1 className="font-bold text-2xl">{props.blogTitle}</h1>
          </Link>
          <Link href={"/blog/" + props.id}>
            <p className="text-gray-600">
              {props.blogDescription.slice(0, 500) + "..."}
            </p>
          </Link>
        </div>
        <div className="w-4/12 p-2">
          <Link href={"/blog/" + props.id}>
            <img
              src={props.blogPic as string}
              alt="Blog Banner Pic"
              className="rounded-lg w-80"
            />
          </Link>
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        {props?.tags?.split(",").map((tag) => (
          <div className="w-44 rounded-full p-2 bg-gray-100 flex justify-center items-center">
            {tag.trim()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticlesCollection({
  selectedType,
}: {
  selectedType: String;
}) {
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    fetchBlogs();
    console.log(selectedType);
  }, [selectedType]);

  const fetchBlogs = async () => {
    try {
      setIsFetchingBlogs(true);
      setBlogs([]);
      if (selectedType === "My Blogs") {
        const response = await fetch(
          "/api/blog" + "?action=MyBlogs&userId=" + id
        );
        const finalResponse = await response.json();

        if (response.ok) {
          console.log(finalResponse);
          setBlogs(finalResponse?.blogs);
        } else {
          throw new Error(finalResponse?.message ?? "Network Error");
        }
      } else {
        const response = await fetch("/api/blog" + "?action=All");
        const finalResponse = await response.json();

        if (response.ok) {
          console.log(finalResponse);
          setBlogs(finalResponse?.blogs);
        } else {
          throw new Error(finalResponse?.message ?? "Network Error");
        }
      }
    } catch (err) {
      alert(err);
    } finally {
      setIsFetchingBlogs(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {isFetchingBlogs && <BlogsSkeleton />}
      {blogs.map((blogData: BlogData) => (
        <ArticleCard
          id={blogData?._id as string}
          key={blogData?._id as string}
          authorName={blogData.user?.name}
          authorBio={blogData.user.bio}
          authorImage={blogData.user.pic}
          blogTitle={blogData.blogTitle}
          blogDescription={blogData.blogDescription}
          blogPic={blogData.blogBanner}
          createdAt={blogData.createdOn}
          tags={blogData.tags}
        />
      ))}
    </div>
  );
}
