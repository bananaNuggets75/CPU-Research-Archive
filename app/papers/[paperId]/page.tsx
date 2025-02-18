"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import app from "@/lib/firebase";

const PaperDetail = () => {
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) {
      router.push("/login");
    }
  }, [auth, router]);

  return (
    <div>
      <h1>Paper Details</h1>
      {/* Add your paper detail content here */}
    </div>
  );
};

export default PaperDetail;
