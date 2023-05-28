"use client";
import React, { useEffect, useState } from "react";
import InterestedUsersSkeleton from "./InterestedUsersSkeleton";
import { toast } from "react-toastify";
import { getFilePreview } from "@/lib/appwrite";

type UserSuggestionDetails = {
  key?: String;
  bio?: String;
  email?: String;
  name?: String;
  pic?: String;
  _id?: String;
  userId?: String;
  myUser: User;
};

function UserSuggestionsCard(props: UserSuggestionDetails) {
  const [userPic, setUserPic] = useState(props.pic);
  const [isFollowed, setIsFollowed] = useState(
    props?.myUser?.followList?.includes(props._id as string) ?? false
  );

  useEffect(() => {
    setIsFollowed(
      props?.myUser?.followList?.includes(props._id as string) ?? false
    );
  }, [props.myUser]);

  useEffect(() => {
    if (!props.pic?.includes("http")) {
      getPicURL();
    }
  }, []);

  const handleFollow = async (followId: string) => {
    try {
      if (followId && props?.userId) {
        setIsFollowed(!isFollowed);
      }
      const response = await fetch("/api/user/follow", {
        method: "PUT",
        body: JSON.stringify({
          userId: props.userId,
          followUserId: followId,
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

  const getPicURL = async () => {
    const file = await getFilePreview(props.pic as string);

    setUserPic(file?.href);
  };

  return (
    <div key={props?.key as string} className="flex gap-4">
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
          className={
            "btn-secondary " + (isFollowed ? "btn-primary bg-opacity-70" : "")
          }
          onClick={() => {
            handleFollow(props?._id as string);
          }}
        >
          {isFollowed ? "Following" : "Follow"}
        </button>
      </div>
    </div>
  );
}

type User = {
  readingList?: String[];
  followList?: String[];
  bio?: String;
  email?: String;
  name?: String;
  pic?: String;
  _id?: String;
};

export default function UserSuggestions() {
  const userId =
    typeof window !== "undefined" ? window.localStorage.getItem("userId") : "";
  const [userInfo, setUserInfo] = useState<User>({});
  const [userSuggestions, setUserSuggestions] = useState<
    UserSuggestionDetails[]
  >([]);

  useEffect(() => {
    fetchAllUsers();
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

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("/api/user/profile", { method: "GET" });

      const finalResponse = await response.json();

      if (response?.ok) {
        setUserSuggestions(finalResponse?.users);
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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-medium text-lg">People you might be interested</h1>
      {userSuggestions.length == 0 && <InterestedUsersSkeleton />}
      {userSuggestions.map(
        (sug, index) =>
          sug._id !== userId && (
            <UserSuggestionsCard
              key={index.toString()}
              userId={userId as string}
              name={sug.name}
              bio={sug.bio}
              pic={sug.pic}
              _id={sug._id}
              myUser={userInfo}
            />
          )
      )}
    </div>
  );
}
