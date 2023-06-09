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
    <div className="w-full p-4 md:w-9/12 md:border-r border-zinc-200">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-4 mb-8">
        <h1 className="font-bold text-base">Articles</h1>
        <DropdownMenu onOpenChange={(open) => setOpen(open)}>
          <DropdownMenuTrigger>
            <div className="p-2 w-24 border border-gray-300 rounded-lg">
              {settings.blogType}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={10}>
            <DropdownMenuItem onClick={() => handleSettings("All Blogs")}>
              All Blogs
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSettings("My Blogs")}>
              My Blogs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ArticlesCollection selectedType={settings.blogType} />
    </div>
  );
}
