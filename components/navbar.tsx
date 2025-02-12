"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import app from "@/lib/firebase";

const Navbar = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/">Research Archive</Link>
      </div>
      <div className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/library">Library</Link>
        {user && <Link href="/admin-dashboard">Admin Dashboard</Link>}
      </div>
      <div className="navbar-actions">
        {user ? (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        ) : (
          <Link href="/login" className="login-btn">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
