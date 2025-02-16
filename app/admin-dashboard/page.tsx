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

  if (loading) return <p className="text-white text-center">Loading...</p>;

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
    <div className="flex justify-center items-center min-h-screen bg-black p-6">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome, {adminEmail}</h1>

        <button
          onClick={() => {
            signOut(auth);
            router.push("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded mb-6 w-full hover:bg-red-600 transition"
        >
          Logout
        </button>

        {/* File Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          <label className="block text-lg font-medium">
            Select a PDF to Upload:
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="block w-full text-white mt-2"
            />
          </label>

          {/* PDF Preview */}
          {file && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-lg font-semibold">File Preview:</h2>
              <p className="text-gray-400">Name: {file.name}</p>
              <p className="text-gray-400">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <iframe
                src={URL.createObjectURL(file)}
                className="mt-2 w-full h-64 border rounded"
              />
            </div>
          )}

          {/* Upload Button */}
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>

        {/* Uploaded File Link */}
        {url && (
          <div className="mt-4 text-center">
            <p>Uploaded PDF:</p>
            <a href={url} target="_blank" className="text-blue-400 underline">
              View File
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;