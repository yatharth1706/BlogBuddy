"use client";
import React, { useState } from "react";
import ArticlesCollection from "./ArticlesCollection";
import { useRecoilState } from "recoil";
import { homePageSettings } from "@/atoms/homePageSettings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function Articles() {
  const [settings, setSettings] = useRecoilState(homePageSettings);
  const [open, setOpen] = useState(false);

  const handleItemActivate = () => {
    setOpen(false);
  };

  const handleSettings = (name: String) => {
    setSettings({ ...settings, blogType: name as string });
    handleItemActivate();
  };

  return (
    <div className="p-4 w-9/12 border-r border-zinc-200">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-8">
        <h1 className="font-bold text-base">Articles</h1>
        <DropdownMenu onOpenChange={(open) => setOpen(open)}>
          <DropdownMenuTrigger>
            <button className="btn-secondary rounded-3xl font-light w-32">
              <span>{settings.blogType}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10}>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSettings("All Blogs")}>
              All Blogs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSettings("My Blogs")}>
              My Blogs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ArticlesCollection selectedType="All" />
    </div>
  );
}
