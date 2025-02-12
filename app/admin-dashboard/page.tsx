"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const user = auth.currentUser;
      if (!user) {
        router.push("/login");
        return;
      }

      const adminRef = ref(database, `admins/${user.uid}`);
      const adminSnapshot = await get(adminRef);

      if (!adminSnapshot.exists()) {
        await signOut(auth);
        router.push("/login");
      } else {
        setAdminEmail(user.email || "Admin");
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Welcome, {adminEmail}</h1>
      <button
        onClick={() => {
          signOut(auth);
          router.push("/login");
        }}
        className="mt-4 bg-red-500 text-white p-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
