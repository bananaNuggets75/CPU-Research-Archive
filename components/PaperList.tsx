import { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "@/lib/firebase";

interface Paper {
  id: string;
  title: string;
  category: string;
  shortIntro: string;
  pdfUrl: string;
  uploadedBy: string;
}

export default function PaperList() {
  const [papers, setPapers] = useState<Paper[]>([]);
  const db = getFirestore(app);

  useEffect(() => {
    const fetchPapers = async () => {
      const papersCollection = collection(db, "research-papers");
      const papersSnapshot = await getDocs(papersCollection);

      const papersData = papersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Paper[];

      setPapers(papersData);
    };

    fetchPapers();
  }, [db]);

  return (
    <div className="container">
      {papers.length > 0 ? (
        <div className="paper-grid">
          {papers.map((paper) => (
            <div key={paper.id} className="paper-card">
              <h3>{paper.title}</h3>
              <span className="paper-category">{paper.category}</span>
              <p className="paper-intro">{paper.shortIntro}</p>
              <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                Read More
              </a>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-results">No research papers found.</p>
      )}
    </div>
  );
}
