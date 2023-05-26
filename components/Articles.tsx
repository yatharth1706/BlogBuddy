import React from "react";
import ArticlesCollection from "./ArticlesCollection";

export default function Articles() {
  return (
    <div className="p-4 w-9/12 border-r border-zinc-200">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-8">
        <h1 className="font-bold text-base">Articles</h1>
        <button className="btn-secondary rounded-3xl font-light w-32">
          Following
        </button>
      </div>
      <ArticlesCollection />
    </div>
  );
}
