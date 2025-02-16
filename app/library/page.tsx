"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import  app  from "@/lib/firebase";

interface Paper {
  id: string;
  title: string;
  author: string;
  category: string;
}

const PublicLibrary = () => {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const db = getFirestore(app);

  useEffect(() => {
    const fetchPapers = async () => {
      const papersCollection = collection(db, "research_papers");
      const papersSnapshot = await getDocs(papersCollection);
      const papersList: Paper[] = papersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Paper));
      setPapers(papersList);
    };
    fetchPapers();
  }, [db]);

  const filteredPapers = papers
    .filter((paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((paper) => (categoryFilter ? paper.category === categoryFilter : true));

  const handlePaperClick = (paperId: string) => {
    router.push(`/login`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Public Library</h1>
      <div className="max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search research papers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar w-full p-2 mb-4 text-black rounded"
        />
        {filteredPapers.length > 0 ? (
          <ul className="space-y-4 mt-4">
            {filteredPapers.map((paper) => (
              <li key={paper.id} className="bg-gray-800 p-4 rounded-lg shadow">
                <button
                  onClick={() => handlePaperClick(paper.id)}
                  className="text-blue-400 hover:underline"
                >
                  {paper.title} - {paper.author}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No research papers found.</p>
        )}
      </div>
    </div>
  );
};

export default PublicLibrary;
