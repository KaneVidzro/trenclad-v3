"use client";

import { useState } from "react";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Loader2 } from "lucide-react";

// Validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const formData = formSchema.safeParse({ email });

    if (!formData.success) {
      const message = Object.values(
        formData.error.flatten().fieldErrors,
      ).flat()[0];
      setError(message);
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.data),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {success ? (
        <div className="text-center space-y-2">
          <h1 className="text-xl font-semibold">Check your email</h1>
          <p className="text-sm text-muted-foreground">
            If this email is registered, a password reset link has been sent.
          </p>
        </div>
      ) : (
        <>
          <div className="text-center space-y-1">
            <h1 className="text-xl font-semibold">Forgot your password?</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset it.
            </p>
          </div>

          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  "Send reset email"
                )}
              </Button>
            </div>
          </form>
        </>
      )}

      <div className="text-center text-sm">
        <Link
          href="/auth/signin"
          className="text-blue-600 hover:underline font-medium"
        >
          Back to Sign in
        </Link>
      </div>
    </div>
  );
}
