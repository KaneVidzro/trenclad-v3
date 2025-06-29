"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Loader2, MailCheck, MailWarning, MailX } from "lucide-react";
import { notFound } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >(token ? "loading" : "idle");
  const [error, setError] = useState<string | null>(null);

  const verifyEmail = useCallback(async () => {
    try {
      setStatus("loading");
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email verification failed");
      }

      setStatus("success");
      // Optional: Redirect after success
      setTimeout(() => (window.location.href = "/account"), 2000);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "Email verification failed",
      );
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      verifyEmail();
    }
  }, [token, verifyEmail]);

  const resendVerificationEmail = async () => {
    try {
      setStatus("loading");
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend verification email");
      }

      setStatus("idle");
      setError(null);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error
          ? err.message
          : "Failed to resend verification email",
      );
    }
  };

  // Case 1: No params - show 404
  if (!email && !token) {
    notFound();
  }

  // Case 2: Email param - show verification required
  if (email && !token && status !== "success") {
    return (
      <div className="w-[360px] mx-auto mt-12 space-y-6 text-center">
        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <MailWarning className="h-6 w-6 text-blue-600" />
        </div>
        <h1 className="text-xl font-semibold">Verification Required</h1>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent a verification email to{" "}
          <span className="font-medium">{email}</span>. Please check your inbox
          and click the link to verify your account.
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
            <Link href={`/auth/signin?email=${encodeURIComponent(email)}`}>
              Proceed to Login
            </Link>
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white hover:bg-gray-100"
            onClick={resendVerificationEmail}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
            ) : (
              "Resend Verification Email"
            )}
          </Button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }

  // Case 3: Verification success
  if (status === "success") {
    return (
      <div className="w-[360px] mx-auto mt-12 space-y-6 text-center">
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <MailCheck className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-xl font-semibold">Email Verified!</h1>
        <p className="text-sm text-muted-foreground">
          Your email has been successfully verified. Redirecting you to your
          account...
        </p>
        <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
          <Link href="/account">Go to Account Now</Link>
        </Button>
      </div>
    );
  }

  // Case 4: Verification loading
  if (status === "loading") {
    return (
      <div className="w-[360px] mx-auto mt-12 space-y-6 text-center">
        <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Loader2 className="h-6 w-6 text-green-600 animate-spin" />
        </div>
        <h1 className="text-xl font-semibold">Verifying Your Email</h1>
        <p className="text-sm text-muted-foreground">
          Please wait while we verify your email address...
        </p>
      </div>
    );
  }

  // Case 5: Verification error
  if (status === "error") {
    return (
      <div className="w-[360px] mx-auto mt-12 space-y-6 text-center">
        <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <MailX className="h-6 w-6 text-red-600" />
        </div>
        <h1 className="text-xl font-semibold">Verification Failed</h1>
        <p className="text-sm text-muted-foreground">
          {error || "The verification link is invalid or has expired."}
        </p>
        {email && (
          <Button
            onClick={resendVerificationEmail}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={false}
          >
            Resend Verification Email
          </Button>
        )}
        <Button
          asChild
          variant="outline"
          className="w-full bg-white hover:bg-gray-100"
        >
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    );
  }

  // Default case: Token param - show verification in progress
  return null;
}
