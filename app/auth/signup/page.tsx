import React from "react";
import { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default function page() {
  return <SignupForm />;
}
