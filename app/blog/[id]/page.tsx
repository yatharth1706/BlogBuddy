"use client";
import SingleBlogSkeleton from "@/components/SingleBlogSkeleton";
import { getFilePreview } from "@/lib/appwrite";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

type BlogData = {
  _id?: String;
  blogBanner?: String;
  blogDescription?: String;
  tags?: String;
  blogTitle?: String;
  createdBy?: String;
  createdOn?: String;
  user?: {
    bio?: String;
    email?: String;
    name?: String;
    pic?: String;
  };
};

function page() {
  const [blog, setBlog] = useState<BlogData>();

  const path = usePathname();
  const id = path?.split("/").pop();

  useEffect(() => {
    fetchBlogDetails();
  }, []);

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
        throw new Error(finalResponse?.message ?? "network error");
      }
    } catch (err) {}
  };

  return (
    <div className="py-4">
      {!blog && <SingleBlogSkeleton />}
      {blog && (
        <BlogCard
          banner={blog?.blogBanner}
          title={blog?.blogTitle}
          userImage={blog?.user?.pic}
          userName={blog?.user?.name}
          userBio={blog?.user?.bio}
          createdOn={blog?.createdOn}
          description={blog?.blogDescription}
          tags={blog?.tags}
        />
      )}
    </div>
  );
}

type BlogCardProps = {
  banner: String | undefined;
  title: String | undefined;
  userImage: String | undefined;
  userName: String | undefined;
  userBio: String | undefined;
  createdOn: String | undefined;
  description: String | undefined;
  tags: String | undefined;
};
function BlogCard(props: BlogCardProps) {
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
          src={props.userImage as string}
          alt="Blog Author Image"
          className="w-12 h-12 object-cover border-2 border-white rounded-full"
        />
        <div className="flex flex-col gap-1 w-full">
          <div className="font-semibold flex gap-3 items-center">
            <span>{props.userName}</span>
            <div className="w-1 h-1 bg-gray-800 rounded-full"></div>
            <span className="text-gray-500 font-light text-xs">
              {props.createdOn}
            </span>
          </div>
          <p className="text-gray-500 w-full">{props.userBio}</p>
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
    </div>
  );
}

export default page;
