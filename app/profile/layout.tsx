"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function ProfileLayout({ children }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !window.localStorage.getItem("jwt")) {
      router.replace("/login");
    }
  }, []);

  return <main>{children}</main>;
}
