"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

export default function layout({ children }: Props) {
  const router = useRouter();
  useEffect(() => {
    if (!localStorage.getItem("jwt")) {
      router.push("/login");
    }
  }, []);

  return <main>{children}</main>;
}
