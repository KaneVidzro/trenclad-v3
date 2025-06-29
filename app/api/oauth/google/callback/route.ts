import { NextRequest, NextResponse } from "next/server";
import { oauthLogin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/auth/signin?error=missing_code");
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/google/callback`,
      grant_type: "authorization_code",
    }),
  });
  const tokenData = await tokenRes.json();

  // Fetch user info
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();

  // Log in or create user
  await oauthLogin("google", userData.id, userData.email, userData.name);

  // Redirect to account page
  return NextResponse.redirect("/account");
}
