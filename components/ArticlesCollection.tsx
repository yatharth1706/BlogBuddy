import React from "react";
import Data from "./../dummyData.json";

type ArticleCardDetails = {
  authorName: String;
  authorImage: String;
  authorBio: String;
  blogTitle: String;
  blogDescription: String;
  blogPic: String;
  createdAt: String;
  tags?: String[];
};

function ArticleCard(props: ArticleCardDetails) {
  return (
    <div className="flex flex-col gap-5 border-b border-zinc-200">
      <div className="flex gap-4">
        <img
          src={props.authorImage as string}
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
      <div className="flex w-full gap-8">
        <div className="w-8/12 flex flex-col gap-4">
          <h1 className="font-bold text-2xl">{props.blogTitle}</h1>
          <p className="text-gray-600">{props.blogDescription}</p>
        </div>
        <div className="w-4/12 p-2">
          <img
            src={props.blogPic as string}
            alt="Blog Banner Pic"
            className="rounded-lg w-80"
          />
        </div>
      </div>
      <div className="flex gap-4 mb-6">
        {props?.tags?.map((tag) => (
          <div className="w-44 rounded-full p-2 bg-gray-100 flex justify-center items-center">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ArticlesCollection() {
  return (
    <div className="flex flex-col gap-6">
      {Data.blogs.map((blogData) => (
        <ArticleCard
          authorName={blogData.AuthorDetails.Name}
          authorBio={blogData.AuthorDetails.Bio}
          authorImage={blogData.AuthorDetails.Image}
          blogTitle={blogData.BlogTitle}
          blogDescription={blogData.BlogDescription}
          blogPic={blogData.BlogPic}
          createdAt={blogData.CreatedAt}
          tags={blogData.tags}
        />
      ))}
    </div>
  );
}
