"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
} from "firebase/auth";
import { ref, get, set } from "firebase/database";
import { auth, db, googleProvider, firebaseConfig } from "@/lib/firebase";
import {
  setAuthCookie,
  getAuthCookie,
  clearAuthCookie,
  refreshIdToken,
  fetchProfileREST,
} from "@/lib/auth-cookies";

export interface UserProfile {
  email: string;
  name: string;
  photoURL: string | null;
  banned: boolean;
  createdAt: string;
}

interface AuthUser {
  uid: string;
  email: string;
  name: string;
  photoURL: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (cancelled) return;

      if (fbUser) {
        const u: AuthUser = {
          uid: fbUser.uid,
          email: fbUser.email || "",
          name: fbUser.displayName || fbUser.email?.split("@")[0] || "",
          photoURL: fbUser.photoURL,
        };
        setUser(u);

        setAuthCookie({ ...u, refreshToken: fbUser.refreshToken });

        try {
          const snap = await get(ref(db, `users/${fbUser.uid}`));
          if (cancelled) return;
          if (snap.exists()) {
            setProfile(snap.val() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              email: u.email,
              name: u.name,
              photoURL: u.photoURL,
              banned: false,
              createdAt: new Date().toISOString(),
            };
            await set(ref(db, `users/${fbUser.uid}`), newProfile);
            if (!cancelled) setProfile(newProfile);
          }
        } catch (err) {
          console.error("Profile load error:", err);
        }
      } else {
        const cookie = getAuthCookie();
        if (cookie) {
          setUser({
            uid: cookie.uid,
            email: cookie.email,
            name: cookie.name,
            photoURL: cookie.photoURL,
          });

          const idToken = await refreshIdToken(
            cookie.refreshToken,
            firebaseConfig.apiKey
          );
          if (!cancelled && idToken) {
            const p = await fetchProfileREST(
              firebaseConfig.databaseURL!,
              cookie.uid,
              idToken
            );
            if (!cancelled && p) setProfile(p as unknown as UserProfile);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }

      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code !== "auth/popup-closed-by-user") {
        console.error("Sign-in error:", err);
      }
    }
  };

  const handleSignOut = async () => {
    clearAuthCookie();
    await fbSignOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
