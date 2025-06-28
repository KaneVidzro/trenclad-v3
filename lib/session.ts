import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

// Secret used for signing the JWT
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

// --- Create Session ---
/**
 * Creates a session by signing a JWT and setting it in a secure HTTP-only cookie.
 * @param userId - The ID of the authenticated user
 */
export async function createSession(userId: string) {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days from now
  const session = await encrypt({ userId, expiresAt });

  (await cookies()).set("session", session, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
    maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
  });
}

// --- Delete Session ---
/**
 * Deletes the session cookie.
 */
export async function deleteSession() {
  (await cookies()).delete("session");
}

// --- Types ---
type SessionPayload = {
  userId: string;
  expiresAt: number;
};

// --- Encrypt (Sign JWT) ---
/**
 * Encrypts session data into a signed JWT.
 * @param payload - The session payload to encrypt
 * @returns A signed JWT string
 */
export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

// --- Decrypt (Verify JWT) ---
/**
 * Verifies and decodes a session JWT.
 * @param token - The JWT string
 * @returns The decoded session payload, or null if invalid/expired
 */
async function decrypt(token: string): Promise<SessionPayload | null> {
  const { payload } = await jwtVerify<SessionPayload>(token, encodedKey, {
    algorithms: ["HS256"],
  });

  if (Date.now() > payload.expiresAt) return null;

  return {
    userId: payload.userId,
    expiresAt: payload.expiresAt,
  };
}

// --- Get Session ---
/**
 * Retrieves and verifies the current session from the cookie.
 * @returns The session payload or null if not authenticated
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;

  if (!token) return null;
  return await decrypt(token);
}
