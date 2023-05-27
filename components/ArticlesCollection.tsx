"use client";
import React, { useEffect, useState } from "react";
import Data from "./../dummyData.json";
import BlogsSkeleton from "./BlogsSkeleton";
import Link from "next/link";
import { BookmarkIcon, Heart } from "lucide-react";
import { userInfo } from "os";
import { useRecoilState } from "recoil";
import { blogsList } from "@/atoms/allBlogs";
import { toast } from "react-toastify";
import { getFilePreview } from "@/lib/appwrite";

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
  likeCount?: Number;
  user?: {
    readingList?: String[];
    likeList?: String[];
  };
  handleBookmark?: (blogId: String) => void;
  handleLike?: (blogId: String) => void;
};

type BlogData = {
  _id: String;
  blogBanner: String;
  blogDescription: String;
  likeCount?: Number;
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
  const [picUrl, setPicUrl] = useState(props.blogPic);
  const [authorImage, setAuthorImage] = useState(props.authorImage);

  useEffect(() => {
    if (!props.blogPic.includes("http")) {
      getPicURL();
    }
    if (!props.authorImage.includes("http")) {
      getAuthorImageURL();
    }
  }, []);

  const getAuthorImageURL = async () => {
    const response = await getFilePreview(props.authorImage as string);

    setAuthorImage(response?.href as string);
  };

  const getPicURL = async () => {
    const response = await getFilePreview(props.blogPic as string);

    setPicUrl(response?.href as string);
  };

  return (
    <div
      className="flex flex-col gap-5 border-b border-zinc-200"
      key={props.key as string}
    >
      <Link href={"/blog/" + props.id}>
        <div className="flex gap-4">
          <img
            src={authorImage as string}
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
              src={picUrl as string}
              alt="Blog Banner Pic"
              className="rounded-lg w-80"
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-between">
        <div className="flex gap-4 mb-6">
          {props?.tags?.split(",").map((tag) => (
            <div className="w-44 rounded-full p-2 bg-gray-100 flex justify-center items-center">
              {tag.trim()}
            </div>
          ))}
        </div>
        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <Heart
              className={`hover:fill-red-500 cursor-pointer text-gray-700 ${
                props?.user?.likeList?.includes(props.id)
                  ? "fill-red-600 text-red-600"
                  : ""
              }`}
              onClick={() => props?.handleLike(props.id)}
            />
            <span>{String(props?.likeCount ?? 0)}</span>
          </div>
          <BookmarkIcon
            className={`hover:fill-gray-500 cursor-pointer text-gray-700 ${
              props?.user?.readingList?.includes(props.id)
                ? "fill-gray-800"
                : ""
            }`}
            onClick={() => props?.handleBookmark(props.id)}
          />
        </div>
      </div>
    </div>
  );
}

type User = {
  readingList?: String[];
  bio?: String;
  email?: String;
  name?: String;
  pic?: String;
  _id?: String;
};

export default function ArticlesCollection({
  selectedType,
}: {
  selectedType: String;
}) {
  const [isFetchingBlogs, setIsFetchingBlogs] = useState(true);
  const [blogs, setBlogs] = useRecoilState(blogsList);
  const [userInfo, setUserInfo] = useState<User>({});
  const id = localStorage.getItem("userId");

  useEffect(() => {
    fetchBlogs();
    fetchUser();
    console.log(selectedType);
  }, [selectedType]);

  const handleBookmark = async (blogId: String) => {
    try {
      console.log(blogs);
      const userId = localStorage.getItem("userId") ?? "";
      const response = await fetch("/api/blog/bookmark", {
        method: "PUT",
        body: JSON.stringify({
          userId,
          blogId,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const finalResponse = await response.json();

      if (!response.ok) {
        throw new Error(finalResponse?.message ?? "Network Error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  const handleLike = async (blogId: String) => {
    try {
      console.log(blogs);
      const userId = localStorage.getItem("userId") ?? "";
      const response = await fetch("/api/blog/like", {
        method: "PUT",
        body: JSON.stringify({
          userId,
          blogId,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const finalResponse = await response.json();

      if (!response.ok) {
        throw new Error(finalResponse?.message ?? "Network Error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/profile?id=" + id ?? "", {
        method: "GET",
      });

      const finalResponse = await response.json();

      if (!response.ok) {
        throw new Error(finalResponse?.message ?? "Network error");
      } else {
        setUserInfo(finalResponse?.user);
        console.log(finalResponse?.user);
      }
    } catch (err) {
      toast(String(err));
    }
  };

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
      toast(String(err));
    } finally {
      setIsFetchingBlogs(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {isFetchingBlogs && <BlogsSkeleton />}
      {!isFetchingBlogs && blogs.length === 0 && <span>No blogs yet</span>}
      {blogs.map((blogData: BlogData) => (
        <ArticleCard
          id={blogData?._id as string}
          likeCount={blogData?.likeCount as number}
          key={blogData?._id as string}
          authorName={blogData.user?.name}
          authorBio={blogData.user.bio}
          authorImage={blogData.user.pic}
          blogTitle={blogData.blogTitle}
          blogDescription={blogData.blogDescription}
          blogPic={blogData.blogBanner}
          createdAt={blogData.createdOn}
          tags={blogData.tags}
          user={userInfo ?? {}}
          handleBookmark={handleBookmark}
          handleLike={handleLike}
        />
      ))}
    </div>
  );
}
