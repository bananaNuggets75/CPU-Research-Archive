"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signOut, User } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, getDocs, deleteDoc, setDoc } from "firebase/firestore";
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
  const [error, setError] = useState("");
  const [papers, setPapers] = useState<{ id: string; title: string; url: string }[]>([]);

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
    fetchPapers();
  }, [db, router, auth]);

  const fetchPapers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "papers"));
      const papersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPapers(papersList as { id: string; title: string; url: string }[]);
    } catch (err) {
      setError("Failed to fetch papers.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to upload file.");
      const data = await res.json();
      if (data.url) {
        const title = file.name.replace(/\.pdf$/, "");
        await setDoc(doc(db, "papers", file.name), { title, url: data.url });
        fetchPapers();
      }
    } catch (err) {
      setError("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "papers", id));
      setPapers(papers.filter((paper) => paper.id !== id));
    } catch (err) {
      setError("Failed to delete paper.");
    }
  };

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <h1 className="admin-title">Welcome, {adminEmail}</h1>
        <button onClick={() => signOut(auth).then(() => router.push("/login"))} className="logout-button">Logout</button>
        <form onSubmit={handleUpload} className="upload-form">
          <label className="form-label">Select a PDF to Upload:
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
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
          <button type="submit" disabled={uploading} className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition">
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="papers-container">
        <h2 className="papers-title">Uploaded Papers</h2>
        {papers.length === 0 ? <p className="no-papers-text">No papers uploaded yet.</p> : (
          <ul className="papers-list">
            {papers.map((paper) => (
              <li key={paper.id} className="paper-item">
                <div>
                  <p className="paper-title">{paper.title}</p>
                  <a href={paper.url} target="_blank" rel="noopener noreferrer" className="paper-link">View Paper</a>
                </div>
                <button onClick={() => handleDelete(paper.id)} className="delete-button">Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;