"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged, signOut, User as FirebaseUser } from "firebase/auth";
import { getDatabase, ref, set, get } from "firebase/database";
import firebaseApp from "@/lib/firebase";

// Firebase instances
const auth = getAuth(firebaseApp);
const db = getDatabase(firebaseApp);

// Define user type
interface User {
  uid: string;
  email: string; // Ensured it's always a string
  role: "admin" | "user";
}

// Define AuthContext type
interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);

// Define AuthProvider Props
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider Component
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) { // ✅ Check if email is not null
        const userRef = ref(db, `users/${firebaseUser.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: userData.role });
        } else {
          if (firebaseUser.email.endsWith("@cpu.edu.ph")) {
            await set(userRef, { role: "user" });
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: "user" });
          } else {
            await signOut(auth);
            alert("Unauthorized email! Use a @cpu.edu.ph email.");
            setUser(null);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
