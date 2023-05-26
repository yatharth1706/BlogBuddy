import React from "react";

export default function NavigationBar() {
  return (
    <div className="flex justify-center items-center py-3 border-b border-zinc-200 ">
      <h1 className="font-bold text-base">READER</h1>
      <div className="absolute right-12 border border-zinc-200 w-9 h-9 rounded-full">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
          alt="Profile pic"
          className="w-8 h-8 rounded-full object-cover mx-auto my-auto"
        />
      </div>
    </div>
  );
}
