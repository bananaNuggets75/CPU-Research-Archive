"use client";
import { useState, useEffect } from "react";
import { getDatabase, ref, onValue, off } from "firebase/database";
import firebase from "@/lib/firebase";
import Link from "next/link";

interface Paper {
  id: string;
  title: string;
  author: string;
  category: string;
}

export default function Dashboard() {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const db = getDatabase(firebase);
    const papersRef = ref(db, "papers");

    const unsubscribe = onValue(papersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categorySet = new Set<string>();

        Object.keys(data).forEach((key) => {
          const category = data[key].category;
          if (category) {
            categorySet.add(category);
          }
        });

        setCategories(Array.from(categorySet));
      }
    });

    return () => {
      off(papersRef);
    };
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to CPU Research Archive</h1>
      <p className="text-gray-600 mb-6">
        Browse through various research papers categorized by topics. Sign in to access full papers.
      </p>

      <h2 className="text-xl font-semibold mb-2">Explore by Category:</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={{ pathname: "/library", query: { category } }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}
