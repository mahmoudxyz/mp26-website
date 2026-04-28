const COOKIE_DOMAIN = ".mahmoud.ninja";
const COOKIE_NAME = "mn_auth";

function isLocalhost(): boolean {
  return (
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1")
  );
}

function getCookieOptions(): string {
  const domain = isLocalhost() ? "" : `; domain=${COOKIE_DOMAIN}`;
  const secure = isLocalhost() ? "" : "; Secure";
  return `${domain}; path=/; max-age=2592000${secure}; SameSite=Lax`;
}

export interface AuthCookieData {
  uid: string;
  email: string;
  name: string;
  photoURL: string | null;
  refreshToken: string;
}

export function setAuthCookie(data: AuthCookieData): void {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(data))}${getCookieOptions()}`;
}

export function getAuthCookie(): AuthCookieData | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    return JSON.parse(
      decodeURIComponent(match.split("=").slice(1).join("="))
    );
  } catch {
    return null;
  }
}

export function clearAuthCookie(): void {
  const domain = isLocalhost() ? "" : `; domain=${COOKIE_DOMAIN}`;
  document.cookie = `${COOKIE_NAME}=; path=/${domain}; max-age=0`;
}

export async function refreshIdToken(
  refreshToken: string,
  apiKey: string
): Promise<string | null> {
  try {
    const res = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.id_token || null;
  } catch {
    return null;
  }
}

export async function fetchProfileREST(
  databaseURL: string,
  uid: string,
  idToken: string
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(
      `${databaseURL}/users/${uid}.json?auth=${idToken}`
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
