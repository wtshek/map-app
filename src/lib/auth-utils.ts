import { User } from "firebase/auth";
import { auth } from "./firebase";

export async function setSessionCookie(user: User) {
  const idToken = await user.getIdToken();
  const response = await fetch("/api/auth/session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to set session cookie");
  }
}

export async function clearSessionCookie() {
  const response = await fetch("/api/auth/session", {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to clear session cookie");
  }
}

export async function signOut() {
  try {
    await auth.signOut();
    await clearSessionCookie();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}
