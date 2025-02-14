"use client";
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import PaperList from "@/components/PaperList";
import { getDatabase, ref, onValue } from "firebase/database";
import firebase from "@/lib/firebase";

// Define the Paper type
interface Paper {
  id: string;
  title: string;
  author: string;
  category: string;
  [key: string]: any;
}

export default function Dashboard() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const db = getDatabase(firebase);
    const papersRef = ref(db, "papers");
    onValue(papersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const paperArray: Paper[] = Object.keys(data).map((key) => ({
          id: key,
          title: data[key].title || "Untitled",
          author: data[key].author || "Unknown",
          category: data[key].category || "Uncategorized",
          ...data[key],
        }));
        setPapers(paperArray);
      }
    });
  }, []);

  return (
    <div className="container">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search for research papers..."
        className="search-bar"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Paper List */}
      <div className="paper-grid">
        <PaperList papers={papers} searchQuery={searchQuery} />
      </div>
    </div>
  );
}
