import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut,
  type User,
} from "firebase/auth";

import { auth } from "../firebase/firebaseApp";

interface AuthContextValue {
  user: User | null;
  isAuthLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsAuthLoading(false);
      },
      (error) => {
        console.error("Authentication state error:", error);
        setUser(null);
        setIsAuthLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  async function logout(): Promise<void> {
    await signOut(auth);
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthLoading,
      logout,
    }),
    [user, isAuthLoading],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider.",
    );
  }

  return context;
}