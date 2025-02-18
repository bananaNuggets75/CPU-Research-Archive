"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import app from "@/lib/firebase";

const Navbar = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists() && userDoc.data().role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <nav className="bg-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-16">
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
            {isAdmin && (
              <li>
                <Link href="/admin-dashboard" className="nav-link">
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        <div className="auth-button">
          {user ? (
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;