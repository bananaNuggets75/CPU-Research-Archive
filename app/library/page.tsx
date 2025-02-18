"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "@/lib/firebase";

export default function LibraryPage() {
  const db = getFirestore(app);
  const [searchQuery, setSearchQuery] = useState("");
  const [papers, setPapers] = useState<{ id: string; title: string; authors: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPapers() {
      try {
        const querySnapshot = await getDocs(collection(db, "papers"));
        const papersList = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPapers(papersList as { id: string; title: string; authors: string; url: string }[]);
      } catch (error) {
        console.error("Error fetching papers:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPapers();
  }, [db]);

  const filteredPapers = papers.filter(
    (paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.authors.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">Library</h1>
      <input
        type="text"
        placeholder="Search papers..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 rounded bg-gray-800 text-white border border-gray-600"
      />
      {loading ? (
        <p className="text-center text-gray-400">Loading papers...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800 text-left">
              <th className="p-2 border border-gray-700">Title</th>
              <th className="p-2 border border-gray-700">Authors</th>
            </tr>
          </thead>
          <tbody>
            {filteredPapers.length > 0 ? (
              filteredPapers.map((paper) => (
                <tr key={paper.id} className="border border-gray-700">
                  <td className="p-2 border border-gray-700">
                    <a href={paper.url} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                      {paper.title}
                    </a>
                  </td>
                  <td className="p-2 border border-gray-700">{paper.authors}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="p-4 text-center text-gray-400">
                  No papers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
