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

export default function NavigationBar() {
  const [open, setOpen] = useState(false);
  const token = localStorage.getItem("jwt");
  const userId = localStorage.getItem("userId") ?? "";

  const [userProfile, setUserProfile] = useState<{
    user?: {
      bio?: String;
      email?: String;
      name?: String;
      pic?: String;
      _id?: String;
    };
  }>({});
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
        console.log(finalResponse);
        setUserProfile(finalResponse);
      } else {
        throw new Error(finalResponse?.message ?? "Network error");
      }
    } catch (err) {
      alert(err);
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
      const { blogBanner, blogTitle, blogDescription } = blogData;
      const response = await fetch("/api/blog", {
        method: "POST",
        body: JSON.stringify({
          blogBanner,
          blogTitle,
          blogDescription,
          CreatedBy: "GetLoggedInUser",
          CreatedOn: "May 27, 10:26",
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const finalResponse = await response.json();

      if (response.ok) {
        alert("Blog published successfully");
        router.push("/");
      } else {
        throw new Error(finalResponse?.message ?? "Network error");
      }
    } catch (err) {
      alert(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    handleItemActivate();
    router.refresh();
  };

  return !path?.includes("login") && !path?.includes("signup") ? (
    <div className="flex items-center py-3 border-b border-zinc-200 relative">
      <h1 className="font-bold text-base text-center w-full">
        {path?.includes("/blog/new") ? "Blog Draft" : "READER"}
      </h1>
      <div className="flex items-center gap-4 absolute right-8 top-1/2 transform -translate-y-1/2">
        {path?.includes("/blog/new") ? (
          <button className="btn-primary" onClick={handlePublish}>
            Publish
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
              {userProfile?.user ? (
                <img
                  src={userProfile?.user?.pic as string}
                  alt="Profile pic"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="rounded-full bg-gray-300 h-8 w-8"></div>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={10}>
              <Link href={"/profile/" + userId} onClick={handleItemActivate}>
                <DropdownMenuLabel>My Profile</DropdownMenuLabel>
              </Link>
              <DropdownMenuSeparator />
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