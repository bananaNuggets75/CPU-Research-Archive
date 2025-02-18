"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface PDF {
  public_id: string;
  url: string;
}

const Library = () => {
  const [pdfs, setPdfs] = useState<PDF[]>([]);

  useEffect(() => {
    const fetchPdfs = async () => {
      try {
        const response = await axios.get("/api/getPdfs");
        setPdfs(response.data);
      } catch (error) {
        console.error("Failed to fetch PDFs:", error);
      }
    };

    fetchPdfs();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Library</h1>
      <ul className="list-disc pl-5 space-y-2">
        {pdfs.map((pdf) => (
          <li key={pdf.public_id}>
            <Link href={pdf.url} target="_blank" rel="noopener noreferrer">
              {pdf.public_id}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Library;
