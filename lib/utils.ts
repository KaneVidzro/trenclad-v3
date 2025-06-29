import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SessionOptions } from "iron-session";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Session options for iron-session
export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: "trenclad-session",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};
