import { NextRequest, NextResponse } from "next/server";
import { oauthLogin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("/auth/signin?error=missing_code");
  }

  // Exchange code for tokens
  const tokenRes = await fetch(
    "https://graph.facebook.com/v17.0/oauth/access_token",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.FACEBOOK_CLIENT_ID!,
        client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/facebook/callback`,
        code,
      }),
    },
  );

  const tokenData = await tokenRes.json();

  // Fetch user info
  const userRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`,
  );
  const userData = await userRes.json();

  // Log in or create user
  await oauthLogin("facebook", userData.id, userData.email, userData.name, {
    accessToken: tokenData.access_token,
  });

  // Redirect to account page
  return NextResponse.redirect("/account");
}
