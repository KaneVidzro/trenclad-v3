import React from "react";
import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your password",
};

export default function page() {
  return <ResetPasswordForm />;
}
