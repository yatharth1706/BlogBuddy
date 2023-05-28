"use client";
import React, { useEffect, useState } from "react";
import BlogsSkeleton from "./BlogsSkeleton";
import Link from "next/link";
import { BookmarkIcon, Heart } from "lucide-react";
import { userInfo } from "os";
import { useRecoilState } from "recoil";
import { blogsList } from "@/atoms/allBlogs";
import { toast } from "react-toastify";
import { getFilePreview } from "@/lib/appwrite";
import { homePageSettings } from "@/atoms/homePageSettings";
import moment from "moment";

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
  const [isLiked, setIsLiked] = useState(
    props?.user?.likeList?.includes(props.id)
  );
  const [isBookmarked, setIsBookmarked] = useState(
    props?.user?.readingList?.includes(props.id)
  );
  const [likeCount, setLikeCount] = useState(String(props?.likeCount ?? 0));

  useEffect(() => {
    setIsLiked(props?.user?.likeList?.includes(props.id));
    setIsBookmarked(props?.user?.readingList?.includes(props.id));
  }, [props?.user]);

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

  const handleLike = () => {
    if (localStorage.getItem("jwt")) {
      if (isLiked) {
        setIsLiked(false);
        setLikeCount(String(parseInt(likeCount) - 1));
      } else {
        setIsLiked(true);
        setLikeCount(String(parseInt(likeCount) + 1));
      }
    }
    if (props.handleLike) {
      props.handleLike(props.id);
    }
  };

  const handleBookmark = () => {
    if (localStorage.getItem("jwt")) {
      if (isBookmarked) {
        setIsBookmarked(false);
      } else {
        setIsBookmarked(true);
      }
    }
    if (props.handleBookmark) {
      props.handleBookmark(props.id);
    }
  };

  return (
    <div
      className="flex flex-col gap-6 border-b border-zinc-200"
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
      <div className="flex flex-col md:flex-row w-full gap-8">
        <div className="w-full md:w-8/12 flex flex-col gap-4">
          <Link href={"/blog/" + props.id}>
            <h1 className="font-bold text-2xl">{props.blogTitle}</h1>
          </Link>
          <Link href={"/blog/" + props.id}>
            <p className="text-gray-600">
              {props.blogDescription.slice(0, 400) + "..."}
            </p>
          </Link>
          <div className="flex gap-4 mb-6">
            {props?.tags?.split(",").map((tag) => (
              <div className="w-44 rounded-full p-2 bg-gray-100 flex justify-center items-center">
                {tag.trim()}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full mx-auto md:mx-0 md:w-4/12 p-2">
          <Link href={"/blog/" + props.id}>
            <img
              src={picUrl as string}
              alt="Blog Banner Pic"
              className="rounded-lg w-80"
            />
          </Link>
        </div>
      </div>
      <div className="flex justify-end -mt-3">
        <div className="flex gap-4 mb-6">
          <div className="flex gap-2">
            <Heart
              className={`hover:fill-red-500 cursor-pointer text-gray-700 ${
                isLiked ? "fill-red-600 text-red-600" : ""
              }`}
              onClick={() => handleLike()}
            />
            <span>{likeCount}</span>
          </div>
          <BookmarkIcon
            className={`hover:fill-gray-500 cursor-pointer text-gray-700 ${
              isBookmarked ? "fill-gray-800" : ""
            }`}
            onClick={() => handleBookmark()}
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
  const [blogSettings, setBlogSettings] = useRecoilState(homePageSettings);
  const id = localStorage.getItem("userId");

  useEffect(() => {
    fetchBlogs();
    fetchUser();
  }, [selectedType]);

  const handleBookmark = async (blogId: String) => {
    try {
      const userId = localStorage.getItem("userId") ?? "";
      const response = await fetch("/api/blog/bookmark", {
        method: "PUT",
        body: JSON.stringify({
          userId,
          blogId,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: `${localStorage.getItem("jwt") ?? ""}`,
        },
      });

      const finalResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          finalResponse?.message
            ? finalResponse?.message
            : finalResponse?.error
            ? finalResponse?.error
            : "Network error"
        );
      } else {
        setBlogSettings({
          ...blogSettings,
          bookmarkClickCount: blogSettings.bookmarkClickCount + 1,
        });
      }
    } catch (err) {
      toast(String(err));
    }
  };

  const handleLike = async (blogId: String) => {
    try {
      const userId = localStorage.getItem("userId") ?? "";
      const response = await fetch("/api/blog/like", {
        method: "PUT",
        body: JSON.stringify({
          userId,
          blogId,
        }),
        headers: {
          "content-type": "application/json",
          Authorization: `${localStorage.getItem("jwt") ?? ""}`,
        },
      });

      const finalResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          finalResponse?.message
            ? finalResponse?.message
            : finalResponse?.error
            ? finalResponse?.error
            : "Network error"
        );
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
        throw new Error(
          finalResponse?.message
            ? finalResponse?.message
            : finalResponse?.error
            ? finalResponse?.error
            : "Network error"
        );
      } else {
        setUserInfo(finalResponse?.user);
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
          setBlogs(finalResponse?.blogs);
        } else {
          throw new Error(
            finalResponse?.message
              ? finalResponse?.message
              : finalResponse?.error
              ? finalResponse?.error
              : "Network error"
          );
        }
      } else {
        const response = await fetch("/api/blog" + "?action=All");
        const finalResponse = await response.json();

        if (response.ok) {
          setBlogs(finalResponse?.blogs);
        } else {
          throw new Error(
            finalResponse?.message
              ? finalResponse?.message
              : finalResponse?.error
              ? finalResponse?.error
              : "Network error"
          );
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
          createdAt={moment(new Date(blogData?.createdOn as string)).format(
            "MMM DD YYYY"
          )}
          tags={blogData.tags}
          user={userInfo ?? {}}
          handleBookmark={handleBookmark}
          handleLike={handleLike}
        />
      ))}
    </div>
  );
}
