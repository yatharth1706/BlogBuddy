"use client";

import React, { useState } from "react";
import { Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { toast } from "react-toastify";

type LoginFormValues = {
  email: String;
  password: String;
};

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const loginSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Too Short!")
      .max(50, "Too Long!")
      .required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
  });

  const formInitialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const formSubmit = async (values: LoginFormValues) => {
    try {
      const { email, password } = values;
      if (!email || !password) {
        return toast("All fields are required");
      }

      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const finalResponse = await response.json();

      if (response.ok) {
        if (typeof window !== "undefined") {
          localStorage.setItem("jwt", finalResponse.token);
          localStorage.setItem("userId", finalResponse.id);
        }
        toast("Logged in successfully");
        window.location.href = "/";
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
    <div className="max-w-xl mx-auto h-screen flex justify-center items-center">
      <Formik
        initialValues={formInitialValues}
        onSubmit={formSubmit}
        validationSchema={loginSchema}
      >
        {(formik) => (
          <form
            className="text-sm bg-white shadow border border-zinc-200 rounded-lg flex flex-col gap-3 p-12 w-full"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex gap-3 items-center">
              <span className="text-lg font-medium">Log in</span>
            </div>
            <p className="font-light text-sm mb-4">
              Enter following details to login to BlogBuddy
            </p>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("email")}
            />
            {formik?.errors?.email && formik?.touched?.email && (
              <div className="text-red-500 text-xs text-right">
                {String(formik?.errors?.email)}
              </div>
            )}
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("password")}
            />
            {formik?.errors?.password && formik?.touched?.password && (
              <div className="text-red-500 text-xs text-right">
                {String(formik?.errors?.password)}
              </div>
            )}
            <button
              type="submit"
              className={
                "btn-primary mt-4 " + (isLoading ? "bg-opacity-70" : "")
              }
              disabled={isLoading}
            >
              {isLoading ? "Logging in ..." : "Log in"}
            </button>
            <p className="text-center font-light text-gray-700 mt-1">
              Don&apos;t have an account.
              <Link href="/signup">
                <span className="font-bold mx-1">Sign up</span>
              </Link>
              here
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Login;
