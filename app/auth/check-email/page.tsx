import Link from "next/link";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto mt-16 text-center px-4">
      <h1 className="text-xl font-semibold">Thank you for signing up!</h1>

      <p className="text-base">Check your email to confirm your account.</p>

      <p className="text-sm text-muted-foreground">
        You&apos;ve successfully signed up. Please confirm your email before
        signing in.
      </p>

      <Link
        href="/auth/signin"
        className="text-blue-600 hover:underline font-medium text-sm"
      >
        Back to Sign in
      </Link>
    </div>
  );
}
