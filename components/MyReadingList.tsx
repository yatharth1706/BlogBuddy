import React from "react";
import Data from "./../dummyData.json";

type ReadingCardDetails = {
  image: String;
  title: String;
  description: String;
  authorName: String;
  authorPic: String;
  createdAt: String;
};

function ReadingCard(props: ReadingCardDetails) {
  return (
    <div className="flex gap-4 h-auto pb-4 ">
      <img
        src={props.image as string}
        alt="Blog pic"
        className="w-6/12 h-44 rounded-lg object-cover"
      />
      <div className="flex flex-col gap-2 w-6/12">
        <h2 className="font-medium">{props.title}</h2>
        <p>{props.description.slice(0, 80) + "..."}</p>
        <div className="flex gap-2 text-gray-600 text-xs items-center">
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

export default function MyReadingList() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-medium text-lg">My Reading List</h1>
      {MyReadingList.length === 0 && (
        <span className="text-sm text-gray-600">No Data Yet</span>
      )}
      {/* {readingList.map((reading) => (
        <ReadingCard
          authorName={reading.authorName}
          authorPic={reading.authorImage}
          description={reading.description}
          image={reading.image}
          title={reading.title}
          createdAt={reading.createdAt}
        />
      ))} */}
    </div>
  );
}
