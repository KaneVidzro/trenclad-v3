import React from "react";
import type { Metadata } from "next";
import { SigninForm } from "@/components/auth/SigninForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default function page() {
  return <SigninForm />;
}
