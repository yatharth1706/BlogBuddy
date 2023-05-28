"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function BlogLayout({ children }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      router.replace("/login");
    }
  }, []);

  return <main>{children}</main>;
}
