"use client";
import React, { useEffect, useState } from "react";
import InterestedUsersSkeleton from "./InterestedUsersSkeleton";
import { toast } from "react-toastify";
import { getFilePreview } from "@/lib/appwrite";

type UserSuggestionDetails = {
  bio?: String;
  email?: String;
  name?: String;
  pic?: String;
  _id?: String;
  userId?: String;
};

function UserSuggestionsCard(props: UserSuggestionDetails) {
  const [userPic, setUserPic] = useState(props.pic);

  useEffect(() => {
    if (!props.pic?.includes("http")) {
      getPicURL();
    }
  }, []);

  const handleFollow = async (followId: string) => {
    try {
      const response = await fetch("/api/user/follow", {
        method: "PUT",
        body: JSON.stringify({
          userId: props.userId,
          followUserId: followId,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const finalResponse = await response.json();
      if (!response.ok) {
        toast(finalResponse?.message ?? "Network error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  const getPicURL = async () => {
    const file = await getFilePreview(props.pic as string);

    setUserPic(file?.href);
  };

  return (
    <div className="flex gap-4">
      <img
        src={userPic as string}
        alt="User Profile Pic"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">{props.name}</h2>
        <p className="font-light text-gray-600 text-xs">{props.bio}</p>
      </div>
      <div className="ml-auto">
        <button
          className="btn-secondary"
          onClick={() => handleFollow(props?._id as string)}
        >
          Follow
        </button>
      </div>
    </div>
  );
}

export default function UserSuggestions() {
  const userId = localStorage.getItem("userId") ?? "";
  const [userSuggestions, setUserSuggestions] = useState<
    UserSuggestionDetails[]
  >([]);

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/user/profile", { method: "GET" });

      const finalResponse = await response.json();

      if (response?.ok) {
        setUserSuggestions(finalResponse?.users);
        console.log(finalResponse);
      } else {
        throw new Error(finalResponse?.message ?? "Network error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-medium text-lg">People you might be interested</h1>
      {userSuggestions.length == 0 && <InterestedUsersSkeleton />}
      {userSuggestions.map(
        (sug) =>
          sug._id !== userId && (
            <UserSuggestionsCard
              userId={userId}
              name={sug.name}
              bio={sug.bio}
              pic={sug.pic}
              _id={sug._id}
            />
          )
      )}
    </div>
  );
}
