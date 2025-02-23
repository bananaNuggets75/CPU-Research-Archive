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
  const [papers, setPapers] = useState<{ id: string; title: string; url: string; size: number }[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);

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
      setPapers(papersList as { id: string; title: string; url: string; size: number }[]);
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
        await setDoc(doc(db, "papers", file.name), { title, url: data.url, size: file.size });
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

  const handleSort = (key: keyof typeof papers[number]) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  
    setPapers((prevPapers) =>
      [...prevPapers].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];
  
        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return direction === "asc" ? aValue - bValue : bValue - aValue;
        }
  
        return 0;
      })
    );
  };
  

  if (loading) return <p className="loading-text">Loading...</p>;

  return (
    <div className="admin-dashboard bg-gray-100 min-h-screen">
      <div className="admin-container max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="admin-title text-2xl font-bold text-gray-800">Welcome, {adminEmail}</h1>
          <button onClick={() => signOut(auth).then(() => router.push("/login"))} className="logout-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>

        <form onSubmit={handleUpload} className="upload-form bg-white p-6 rounded-lg shadow">
          <label className="form-label block text-gray-700 font-bold mb-2">
            Select a PDF to Upload:
            <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input w-full" />
          </label>
          {file && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h2 className="text-lg font-semibold text-white">File Preview:</h2>
              <p className="text-gray-400">Name: {file.name}</p>
              <p className="text-gray-400">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <iframe
                title="PDF Preview"
                src={URL.createObjectURL(file)}
                className="mt-2 w-full h-64 border rounded"
              ></iframe>
            </div>
          )}
          <button type="submit" disabled={uploading} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-4 disabled:opacity-50">
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
        {error && <p className="error-message text-red-500 mt-4">{error}</p>}

        <div className="papers-container mt-8">
          <h2 className="papers-title text-2xl font-bold text-gray-800">Uploaded Papers</h2>
          {papers.length === 0 ? (
            <p className="no-papers-text text-gray-600">No papers uploaded yet.</p>
          ) : (
            <table className="w-full bg-white shadow-md rounded mt-4">
              <thead>
                <tr>
                  <th onClick={() => handleSort("title")} className="cursor-pointer">Title</th>
                  <th onClick={() => handleSort("size")} className="cursor-pointer">Size (bytes)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper) => (
                  <tr key={paper.id}>
                    <td><a href={paper.url} target="_blank" className="text-blue-500 hover:underline">{paper.title}</a></td>
                    <td>{paper.size}</td>
                    <td><button onClick={() => handleDelete(paper.id)} className="bg-red-500 text-white py-1 px-3 rounded">Delete</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
