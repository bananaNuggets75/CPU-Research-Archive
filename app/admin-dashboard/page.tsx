"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import { signOut } from "firebase/auth";

const UploadForm = () => {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (data.url) {
      setUrl(data.url);
    }

    setUploading(false);
  };

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

      <form onSubmit={handleUpload} className="mt-6">
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit" disabled={uploading} className="ml-4 bg-blue-500 text-white px-4 py-2 rounded">
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>
      {url && <p className="mt-4">Uploaded PDF: <a href={url} target="_blank" className="text-blue-500 underline">View File</a></p>}
    </div>
  );
};

export default UploadForm;
