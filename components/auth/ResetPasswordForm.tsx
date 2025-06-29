"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter" })
      .regex(/[0-9]/, { message: "Must contain at least one number" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export function ResetPasswordForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  // Handle auto-redirect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (success && countdown === 0) {
      router.push("/login");
    }
    return () => clearTimeout(timer);
  }, [success, countdown, router]);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Password reset failed");
      }

      setSuccess(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[360px] mx-auto mt-12 space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <h1 className="text-xl font-semibold">Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter a new password for your account
        </p>
      </div>

      {success ? (
        <div className="text-center space-y-4">
          <p className="text-green-600">
            Password reset successfully! Redirecting to login in {countdown}...
          </p>
          <Button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Go to Login Now
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
