export function generateState(length = 32) {
  if (typeof window === "undefined") {
    return "";
  }
  return Array.from(window.crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function startOAuth(provider: "google" | "facebook") {
  let url = "";
  const state = generateState();
  sessionStorage.setItem(`${provider}_oauth_state`, state);

  if (provider === "google") {
    url =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/google/callback`,
        response_type: "code",
        scope: "openid email profile",
        prompt: "select_account",
        access_type: "offline",
        state,
      });
  } else if (provider === "facebook") {
    url =
      "https://www.facebook.com/v17.0/dialog/oauth?" +
      new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/oauth/facebook/callback`,
        response_type: "code",
        scope: "email public_profile",
        auth_type: "rerequest",
        state,
      });
  }
  window.location.href = url;
}
