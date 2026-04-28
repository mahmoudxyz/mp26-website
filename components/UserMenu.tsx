"use client";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, loading, signIn, signOut } = useAuth();

  if (loading) return null;

  if (!user) {
    return (
      <button onClick={signIn} className="auth-signin-btn">
        Sign in
      </button>
    );
  }

  return (
    <div className="auth-user-menu">
      {user.photoURL ? (
        <img
          src={user.photoURL}
          alt=""
          className="auth-avatar"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="auth-avatar auth-avatar-fallback">
          {user.name[0]?.toUpperCase() || "?"}
        </div>
      )}
      <button onClick={signOut} className="auth-signout-btn" title="Sign out">
        ⎋
      </button>
    </div>
  );
}
