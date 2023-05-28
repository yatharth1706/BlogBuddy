"use client";
import { storeFile } from "@/lib/appwrite";
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

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: "", email: "" });
  const [filePreview, setFilePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        setUserInfo({
          ...userInfo,
          name: finalResponse?.user?.name,
          email: finalResponse?.user?.email,
          bio: finalResponse?.user?.bio ?? "",
          pic: finalResponse?.user?.pic ?? "",
        });
      } else {
        throw new Error(
          finalResponse?.message
            ? finalResponse?.message
            : finalResponse?.error
            ? finalResponse?.error
            : "Network error"
        );
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

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview("");
    }
  };

  const formSubmit = async (values: FormikValues) => {
    try {
      const { name, email, bio, pic } = values;
      if (!bio) {
        return toast("Bio is mandatory");
      }
      setIsLoading(true);
      const fileResponse = await storeFile();

      const userId = params?.id;
      const response = await fetch("/api/user/profile?id=" + userId, {
        method: "PUT",
        body: JSON.stringify({
          name,
          email,
          bio,
          pic: fileResponse?.$id,
        }),
        headers: {
          "content-type": "application/json",
        },
      });

      const finalResponse = await response.json();
      if (response.ok) {
        toast("User profile updated successfully");
        router.push("/");
      } else {
        throw new Error(
          finalResponse?.message
            ? finalResponse?.message
            : finalResponse?.error
            ? finalResponse?.error
            : "Network error"
        );
      }
    } catch (err) {
      toast(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto h-auto pt-20 px-4 flex justify-center items-center">
      <Formik
        enableReinitialize={true}
        initialValues={formInitialValues}
        onSubmit={formSubmit}
      >
        {(formik) => (
          <form
            className="text-sm bg-white shadow border border-zinc-200 rounded-lg flex flex-col gap-3 p-5 md:p-12 w-full"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex gap-3 items-center">
              <span className="text-lg font-medium">Update your profile</span>
            </div>

            <label htmlFor="profilePic">Profile Pic</label>
            <input
              type="file"
              id="uploader"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              onChange={handleFileChange}
            />

            {filePreview && <img src={filePreview} />}
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
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("bio")}
            />
            <button
              type="submit"
              className={
                "btn-primary mt-4 " + (isLoading ? "bg-opacity-70" : "")
              }
            >
              {isLoading ? "Saving" : "Save"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}
