"use client";
import { Formik, FormikValues } from "formik";
import { useParams, useRouter } from "next/navigation";
import { type } from "os";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type ProfilePageForm = {
  name: String;
  email: String;
  bio: String;
  pic: String;
};

type UserInfo = {
  name: String;
  email: String;
  bio?: String;
  pic?: String;
};

export default function page() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const userId = params?.id;
      const response = await fetch("/api/user/profile?id=" + userId, {
        method: "GET",
      });

      const finalResponse = await response.json();
      if (response.ok) {
        console.log(finalResponse);
        setUserInfo({
          ...userInfo,
          name: finalResponse?.user?.name,
          email: finalResponse?.user?.email,
          bio: finalResponse?.user?.bio ?? "",
          pic: finalResponse?.user?.pic ?? "",
        });
      } else {
        throw new Error(finalResponse?.message ?? "Network error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  const formInitialValues: ProfilePageForm = {
    name: userInfo?.name ?? "",
    email: userInfo?.email ?? "",
    pic: userInfo?.pic ?? "",
    bio: userInfo?.bio ?? "",
  };

  const formSubmit = async (values: FormikValues) => {
    try {
      const { name, email, bio, pic } = values;
      if (!pic) {
        return toast("Profile pic is mandatory");
      }
      const userId = params?.id;
      const response = await fetch("/api/user/profile?id=" + userId, {
        method: "PUT",
        body: JSON.stringify({
          name,
          email,
          bio,
          pic,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const finalResponse = await response.json();
      if (response.ok) {
        console.log(finalResponse);
        toast("User profile updated successfully");
        router.push("/");
      } else {
        throw new Error(finalResponse?.message ?? "Network error");
      }
    } catch (err) {
      toast(String(err));
    }
  };

  return (
    <div className="max-w-xl mx-auto h-screen flex justify-center items-center">
      <Formik
        enableReinitialize={true}
        initialValues={formInitialValues}
        onSubmit={formSubmit}
      >
        {(formik) => (
          <form
            className="text-sm bg-white shadow border border-zinc-200 rounded-lg flex flex-col gap-3 p-12 w-full"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex gap-3 items-center">
              <span className="text-lg font-medium">Update your profile</span>
            </div>

            <label htmlFor="email">Name</label>
            <input
              id="name"
              type="name"
              disabled
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("name")}
            />
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              disabled
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("email")}
            />
            <label htmlFor="profilePic">Profile Pic</label>
            <input
              id="profilePic"
              type="profilePic"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("pic")}
            />
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("bio")}
            />
            <button type="submit" className="btn-primary mt-4">
              Save
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
