import { useState, useEffect, useMemo } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  GoogleAuthProvider,
  type User,
} from "firebase/auth";
import { auth } from "../firebase";

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // Listen for auth state changes
  useEffect(() => {
    if (!auth) {
      setAuthState({
        user: null,
        loading: false,
        error: "Firebase not available",
      });
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState({
        user,
        loading: false,
        error: null,
      });
    });

    return unsubscribe;
  }, []);

  // Memoize the return value to prevent unnecessary re-renders
  const authValue = useMemo(
    () => ({
      user: authState.user,
      loading: authState.loading,
      error: authState.error,
      signIn: async (email: string, password: string) => {
        if (!auth) {
          throw new Error("Firebase not available");
        }

        try {
          setAuthState((prev) => ({ ...prev, loading: true, error: null }));
          const result = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          return result.user;
        } catch (error: any) {
          const errorMessage =
            error.code === "auth/user-not-found"
              ? "No account found with this email"
              : error.code === "auth/wrong-password"
              ? "Incorrect password"
              : error.message || "Failed to sign in";

          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
          throw new Error(errorMessage);
        }
      },
      signUp: async (email: string, password: string) => {
        if (!auth) {
          throw new Error("Firebase not available");
        }

        try {
          setAuthState((prev) => ({ ...prev, loading: true, error: null }));
          const result = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );
          return result.user;
        } catch (error: any) {
          const errorMessage = error.message || "Failed to create account";
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
          throw new Error(errorMessage);
        }
      },
      signInWithGoogle: async () => {
        if (!auth) {
          throw new Error("Firebase not available");
        }
        setAuthState((prev) => ({ ...prev, loading: true, error: null }));
        try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          setAuthState((prev) => ({ ...prev, loading: false, error: null }));
          return result.user;
        } catch (error: any) {
          const errorMessage = error.message || "Google login failed";
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
          }));
          throw new Error(errorMessage);
        }
      },
      logout: async () => {
        if (!auth) {
          throw new Error("Firebase not available");
        }

        try {
          setAuthState((prev) => ({ ...prev, loading: true, error: null }));
          await signOut(auth);
        } catch (error: any) {
          setAuthState((prev) => ({
            ...prev,
            loading: false,
            error: "Failed to sign out",
          }));
          throw new Error("Failed to sign out");
        }
      },
      clearError: () => {
        setAuthState((prev) => ({ ...prev, error: null }));
      },
    }),
    [authState.user, authState.loading, authState.error]
  );

  return authValue;
};
