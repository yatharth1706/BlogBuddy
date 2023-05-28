"use client";
import { newBlog } from "@/atoms/blog";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { Edit2 } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import { getFilePreview, storeFile } from "@/lib/appwrite";
import moment from "moment";

export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setToken(window.localStorage.getItem("jwt") ?? "");
      setUserId(window.localStorage.getItem("userId") ?? "");
    }
  }, []);

  const [userProfile, setUserProfile] = useState<{
    user?: {
      bio?: String;
      email?: String;
      name?: String;
      pic?: String;
      _id?: String;
    };
  }>({});
  const [userPic, setUserPic] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch("/api/user/profile?id=" + userId, {
        method: "GET",
      });
      const finalResponse = await response.json();

      if (response.ok) {
        setUserProfile(finalResponse);
        getRightUserProfilePic(finalResponse.user.pic);
      } else {
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

  const getRightUserProfilePic = async (pic: string) => {
    if (!pic?.includes("http")) {
      const response = await getFilePreview(pic);
      setUserPic(response?.href as string);
    } else {
      setUserPic(pic);
    }
  };

  const handleItemActivate = () => {
    setOpen(false);
  };

  const path = usePathname();
  const blogData = useRecoilValue(newBlog);
  const router = useRouter();

  const handlePublish = async () => {
    try {
      // validations for the blog
      setIsLoading(true);
      const { blogTitle, blogDescription, blogTags } = blogData;
      if (!blogTitle || !blogDescription || !blogTags) {
        return toast("All fields are required");
      }
      let fileResponse;
      if (typeof window !== "undefined" && window.localStorage.getItem("jwt")) {
        fileResponse = await storeFile();
      }

      const response = await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          blogBanner: fileResponse?.$id,
          blogTitle,
          blogDescription,
          blogTags,
          createdBy:
            typeof window !== "undefined"
              ? window.localStorage.getItem("userId")
              : "",
          createdOn: moment(),
        }),
        headers: {
          "content-type": "application/json",
          Authorization: `${
            typeof window !== "undefined"
              ? window.localStorage.getItem("jwt")
              : ""
          }`,
        },
      });

      const finalResponse = await response.json();

      if (response.ok) {
        toast("Blog published successfully");
        router.push("/");
      } else {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    handleItemActivate();
    if (typeof window !== "undefined") {
      window.localStorage.clear();
      window.location.reload();
    }
  };

  return !path?.includes("login") && !path?.includes("signup") ? (
    <div className="flex items-center py-3 border-b border-zinc-200 relative">
      <Link href="/" className="text-center mx-auto">
        <h1 className="font-bold text-base text-center w-full">
          {path?.includes("/blog/new") ? "Blog Draft" : "READER"}
        </h1>
      </Link>
      <div className="flex items-center gap-4 absolute right-8 top-1/2 transform -translate-y-1/2">
        {path?.includes("/blog/new") ? (
          <button
            className={"btn-primary " + (isLoading ? "bg-opacity-70" : "")}
            onClick={handlePublish}
          >
            {isLoading ? "Publishing..." : "Publish"}
          </button>
        ) : (
          <Link href="/blog/new">
            <div className="flex gap-2 mr-2 cursor-pointer items-center">
              <Edit2 className="text-gray-600 w-4 h-4" /> Write
            </div>
          </Link>
        )}

        {token && (
          <DropdownMenu onOpenChange={(open) => setOpen(open)}>
            <DropdownMenuTrigger>
              {userPic ? (
                <img
                  src={userPic}
                  alt="Profile pic"
                  className="w-8 h-8 rounded-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="rounded-full bg-gray-300 h-8 w-8"></div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10}>
              <DropdownMenuItem
                onClick={() => {
                  handleItemActivate();
                  router.push("/profile/" + userId);
                }}
              >
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!token && (
          <Link href="/signup">
            <button className="btn-primary">Get Started</button>
          </Link>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
}
