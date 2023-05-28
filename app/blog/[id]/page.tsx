"use client";
import { homePageSettings } from "@/atoms/homePageSettings";
import SingleBlogSkeleton from "@/components/SingleBlogSkeleton";
import { getFilePreview } from "@/lib/appwrite";
import { BookmarkIcon, Heart } from "lucide-react";
import moment from "moment";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";

type BlogData = {
  _id?: String;
  blogBanner?: String;
  blogDescription?: String;
  tags?: String;
  blogTitle?: String;
  createdBy?: String;
  createdOn?: String;
  likeCount?: Number;
  user?: {
    bio?: String;
    email?: String;
    name?: String;
    pic?: String;
  };
};

type User = {
  readingList?: String[];
  bio?: String;
  email?: String;
  name?: String;
  pic?: String;
  _id?: String;
};

function BlogPage() {
  const [blog, setBlog] = useState<BlogData>();
  const [blogSettings, setBlogSettings] = useRecoilState(homePageSettings);
  const [userInfo, setUserInfo] = useState<User>({});
  const userId = localStorage.getItem("userId") ?? "";

  const path = usePathname();
  const id = path?.split("/").pop();

  useEffect(() => {
    fetchBlogDetails();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/user/profile?id=" + userId ?? "", {
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

  const fetchBlogDetails = async () => {
    try {
      const response = await fetch("/api/blog?blogId=" + id, {
        method: "GET",
      });

      const finalResponse = await response.json();

      if (response.ok) {
        let blogBanner = finalResponse?.blogs?.[0].blogBanner;
        let authorPic = finalResponse?.blogs?.[0].user?.pic;
        if (!blogBanner.includes("http")) {
          let blogBannerResponse = await getFilePreview(blogBanner);
          blogBanner = blogBannerResponse?.href;
        }

        if (!authorPic.includes("http")) {
          let authorPicResponse = await getFilePreview(authorPic);
          authorPic = authorPicResponse?.href;
        }

        let temp = { ...finalResponse?.blogs?.[0] };
        temp.blogBanner = blogBanner;
        temp.user.pic = authorPic;
        setBlog({ ...temp });
      } else {
        0;
        throw new Error(
          finalResponse?.message
            ? finalResponse?.message
            : finalResponse?.error
            ? finalResponse?.error
            : "Network error"
        );
      }
    } catch (err) {}
  };

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

  return (
    <div className="py-4">
      {!blog && <SingleBlogSkeleton />}
      {blog && (
        <BlogCard
          id={blog?._id as string}
          likeCount={blog?.likeCount as number}
          banner={blog?.blogBanner}
          title={blog?.blogTitle}
          createdOn={moment(new Date(blog?.createdOn as string)).format(
            "MMM DD YYYY"
          )}
          description={blog?.blogDescription}
          tags={blog?.tags}
          user={userInfo}
          handleBookmark={handleBookmark}
          handleLike={handleLike}
        />
      )}
    </div>
  );
}

type BlogCardProps = {
  id: String | undefined;
  banner: String | undefined;
  title: String | undefined;
  likeCount: Number | undefined;
  createdOn: String | undefined;
  description: String | undefined;
  tags: String | undefined;
  handleLike: (blogId: String) => void;
  handleBookmark: (blogId: String) => void;
  user?: {
    readingList?: String[];
    likeList?: String[];
    pic?: String;
    name?: String;
    bio?: String;
  };
};

function BlogCard(props: BlogCardProps) {
  const [isLiked, setIsLiked] = useState(
    props?.user?.likeList?.includes(props.id as string)
  );
  const [isBookmarked, setIsBookmarked] = useState(
    props?.user?.readingList?.includes(props.id as string)
  );
  const [likeCount, setLikeCount] = useState(String(props?.likeCount ?? 0));

  useEffect(() => {
    setIsLiked(props?.user?.likeList?.includes(props.id as string));
    setIsBookmarked(props?.user?.readingList?.includes(props.id as string));
  }, [props?.user]);

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
    props.handleLike(props.id as string);
  };

  const handleBookmark = () => {
    if (localStorage.getItem("jwt")) {
      if (isBookmarked) {
        setIsBookmarked(false);
      } else {
        setIsBookmarked(true);
      }
    }
    props.handleBookmark(props.id as string);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-8 border-b border-zinc-200 p-8">
      <div className="p-4 flex justify-center">
        <img
          src={props.banner as string}
          alt="Blog Banner Pic"
          className="rounded-lg w-full"
        />
      </div>
      <div className="flex gap-4 w-full">
        <img
          src={props.user?.pic as string}
          alt="Blog Author Image"
          className="w-12 h-12 object-cover border-2 border-white rounded-full"
        />
        <div className="flex flex-col gap-1 w-full">
          <div className="font-semibold flex gap-3 items-center">
            <span>{props.user?.name}</span>
            <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
            <span className="text-gray-500 font-light text-xs">
              {moment(new Date(props?.createdOn as string)).format(
                "MMM DD YYYY"
              )}
            </span>
          </div>
          <p className="text-gray-500 w-full">{props.user?.bio}</p>
        </div>
      </div>
      <div className="flex w-full gap-8">
        <div className="w-full flex flex-col gap-4">
          <h1 className="font-bold text-2xl">{props.title}</h1>
          <p className="text-gray-600 leading-relaxed">{props.description}</p>
        </div>
      </div>
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
  );
}

export default BlogPage;
