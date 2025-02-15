"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import app from "@/lib/firebase";

const Navbar = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
        {/* Left: Brand */}
        <div className="logo">
          <Link href="/" className="text-2xl font-bold text-white">
          <Image
            src="/cpu-logo.png" 
            alt="SafeDrive Logo"
            width={40}
            height={40}
            className="mr-2" 
          />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="nav-links flex-grow flex justify-center">
          <ul className="flex gap-6">
            <li>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link href="/library" className="nav-link">
                Library
              </Link>
            </li>
            {user && (
              <li>
                <Link href="/admin-dashboard" className="nav-link">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Right: Login/Logout Button */}
        <div className="auth-button">
          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-danger"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="btn btn-primary"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
