"use client";
import React, { useEffect, useState } from "react";
import Data from "./../dummyData.json";
import Link from "next/link";
import { toast } from "react-toastify";

type ReadingCardDetails = {
  _id: String;
  image: String;
  title: String;
  description: String;
  authorName: String;
  authorPic: String;
  createdAt: String;
};

function ReadingCard(props: ReadingCardDetails) {
  return (
    <div className="flex w-full gap-4 h-auto pb-4 ">
      <Link href={"/blog/" + props._id} className="w-6/12">
        <img
          src={props.image as string}
          alt="Blog pic"
          className="w-full h-44 rounded-lg object-cover"
        />
      </Link>
      <div className="flex flex-col gap-2 w-6/12">
        <Link href={"/blog/" + props._id}>
          <h2 className="font-medium">{props.title}</h2>
        </Link>
        <Link href={"/blog/" + props._id}>
          <p>{props.description.slice(0, 80) + "..."}</p>
        </Link>
        <div className="flex gap-1 w-full text-gray-600 text-xs items-center">
          <img
            src={props.authorPic as string}
            className="w-6 h-6 rounded-full"
            alt="Author Pic"
          />
          <span>{props.authorName}</span>
          <div className="w-1 h-1 rounded-full bg-gray-800"></div>
          <span>{props.createdAt}</span>
        </div>
      </div>
    </div>
  );
}

type ReadingListData = {
  blogBanner?: String;
  blogDescription?: String;
  blogTitle?: String;
  createdBy?: String;
  createdOn?: String;
  tags?: String;
  _id?: String;
  user?: {
    bio: String;
    email: String;
    name: String;
    pic: String;
    _id: String;
  };
};

export default function MyReadingList() {
  const [readingList, setReadingList] = useState<ReadingListData[]>([]);

  useEffect(() => {
    fetchMyReadingList();
  }, []);

  const fetchMyReadingList = async () => {
    try {
      const userId = localStorage.getItem("userId") ?? "";
      const response = await fetch("/api/user/readinglist?id=" + userId, {
        method: "GET",
      });
      const finalResponse = await response.json();

      if (response?.ok) {
        setReadingList(finalResponse?.readingList);
      } else {
        throw new Error(finalResponse?.message ?? "Network Error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-medium text-lg">My Reading List</h1>
      {readingList.length === 0 && (
        <span className="text-sm text-gray-600">No Data Yet</span>
      )}
      {readingList.map((reading) => (
        <ReadingCard
          _id={reading._id as string}
          authorName={reading?.user?.name as string}
          authorPic={reading?.user?.pic as string}
          description={reading.blogDescription as string}
          image={reading.blogBanner as string}
          title={reading.blogTitle as string}
          createdAt={reading.createdOn as string}
        />
      ))}
    </div>
  );
}
