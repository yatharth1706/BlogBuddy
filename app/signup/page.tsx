"use client";

import React from "react";
import { Formik } from "formik";
import Link from "next/link";

type SignupFormValues = {
  name: String;
  email: String;
  password: String;
};

function Signup() {
  const formInitialValues: SignupFormValues = {
    name: "",
    email: "",
    password: "",
  };

  const formSubmit = (values: SignupFormValues) => {
    alert(JSON.stringify(values, null, 2));
  };

  return (
    <div className="max-w-xl mx-auto h-screen flex justify-center items-center">
      <Formik initialValues={formInitialValues} onSubmit={formSubmit}>
        {(formik) => (
          <form
            className="text-sm bg-white shadow border border-zinc-200 rounded-lg flex flex-col gap-3 p-12 w-full"
            onSubmit={formik.handleSubmit}
          >
            <div className="flex gap-3 items-center">
              <span className="text-lg font-medium">Create a new account</span>
            </div>
            <p className="font-light text-sm mb-4">
              Enter following details to create a new account in formvibe
            </p>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="name"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("name")}
            />
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("email")}
            />
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="border-zinc-300 border px-4 py-2 outline-sky-300 rounded-md"
              {...formik.getFieldProps("password")}
            />
            <button type="submit" className="btn-primary mt-4">
              Sign up
            </button>
            <p className="font-light text-center">Or</p>
            <button
              type="button"
              className="flex items-center gap-2 justify-center btn-secondary"
            >
              <img
                className="w-4"
                src="/assets/GoogleLogo.png"
                alt="google logo"
              />
              Sign up with Google
            </button>
            <p className="text-center font-light text-gray-700 mt-1">
              Already have an account?{" "}
              <Link href="/login">
                <span className="font-bold">Log in</span>
              </Link>{" "}
              here
            </p>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;
