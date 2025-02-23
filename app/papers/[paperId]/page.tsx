"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";
import app from "@/lib/firebase";

interface Paper {
  id: string;
  title: string;
  category: string;
  shortIntro: string;
  pdfUrl: string;
  uploadedBy: string;
}

export default function PaperDetail() {
  const [paper, setPaper] = useState<Paper | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { paperId } = useParams();
  const db = getFirestore(app);

  useEffect(() => {
    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchPaper = async () => {
      if (!paperId) return;

      const paperRef = doc(db, "research-papers", paperId as string);
      const paperSnap = await getDoc(paperRef);

      if (paperSnap.exists()) {
        setPaper({ id: paperSnap.id, ...paperSnap.data() } as Paper);
      } else {
        console.log("Paper not found");
      }
    };

    fetchPaper();
  }, [db, paperId]);

  if (!paper) return <p>Loading paper...</p>;

  return (
    <div className="container">
      <h2>{paper.title}</h2>
      <span className="paper-category">{paper.category}</span>
      <p className="paper-intro">{paper.shortIntro}</p>

      {/* Restrict PDF access */}
      {user ? (
        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
          Read Full Paper
        </a>
      ) : (
        <button onClick={() => router.push("/login")}>Login to Read</button>
      )}
    </div>
  );
}
