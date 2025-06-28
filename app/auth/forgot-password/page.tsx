import React from "react";
import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Forgot your password?",
};

export default function page() {
  return <ForgotPasswordForm />;
}
