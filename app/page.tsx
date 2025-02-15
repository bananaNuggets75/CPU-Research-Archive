"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import SearchBar from "@/components/SearchBar";
import PaperList from "@/components/PaperList";
import { getDatabase, ref, onValue, off } from "firebase/database";
import firebase from "@/lib/firebase";

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

    const unsubscribe = onValue(papersRef, (snapshot) => {
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

    return () => {
      off(papersRef); // Clean up Firebase listener on unmount
    };
  }, []);

  // Memoized filtered papers for performance optimization
  const filteredPapers = useMemo(() => {
    return papers.filter((paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [papers, searchQuery]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div className="container">
      <SearchBar onSearch={handleSearch} />
      <div className="paper-grid">
        <PaperList papers={filteredPapers} />
      </div>
    </div>
  );
}
