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
    <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
      <div>
        <Link href="/" className="text-xl font-bold">Research Archive</Link>
      </div>
      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/library">Library</Link>
        {user && <Link href="/admin-dashboard">Admin Dashboard</Link>}
      </div>
      <div>
        {user ? (
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">
            Logout
          </button>
        ) : (
          <Link href="/login" className="bg-green-500 px-4 py-2 rounded">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
