"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import app from "@/lib/firebase";

const AdminDashboard = () => {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkAdmin = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        router.push("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists() || userSnap.data().role !== "admin") {
          await signOut(auth);
          router.push("/login");
        } else {
          setUser(currentUser);
          setAdminEmail(currentUser.email || "Admin");
        }
      } catch (err) {
        setError("Failed to verify admin status.");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [db, router, auth]);

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
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to upload file.");

      const data = await res.json();
      if (data.url) {
        setUrl(data.url);
      }
    } catch (err) {
      setError("File upload failed.");
    } finally {
      setUploading(false);
    }
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

          {file && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-lg font-semibold">File Preview:</h2>
              <p className="text-gray-400">Name: {file.name}</p>
              <p className="text-gray-400">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <iframe
                title="PDF Preview"
                src={URL.createObjectURL(file)}
                className="mt-2 w-full h-64 border rounded"
              ></iframe>

            </div>
          )}

          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition"
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {url && file && (
        <div className="mt-4 text-center">
          <p>Uploaded PDF:</p>
          <a href={url} target="_blank" className="text-blue-400 underline">
            {file.name.replace(/\.pdf$/, "")}
            </a>
            </div>
            )}
      </div>
    </div>
  );
};

export default AdminDashboard;
