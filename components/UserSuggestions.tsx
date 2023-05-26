import React from "react";
import Data from "./../dummyData.json";

type UserSuggestionDetails = {
  image: String;
  name: String;
  bio: String;
};

function UserSuggestionsCard(props: UserSuggestionDetails) {
  return (
    <div className="flex gap-4">
      <img
        src={props.image as string}
        alt="User Profile Pic"
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex flex-col gap-1">
        <h2 className="font-medium">{props.name}</h2>
        <p className="font-light text-gray-600 text-xs">{props.bio}</p>
      </div>
      <div className="ml-auto">
        <button className="btn-secondary">Follow</button>
      </div>
    </div>
  );
}

export default function UserSuggestions() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-medium text-lg">People you might be interested</h1>
      {Data.userSuggestions.map((sug) => (
        <UserSuggestionsCard image={sug.image} name={sug.name} bio={sug.bio} />
      ))}
    </div>
  );
}
