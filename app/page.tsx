"use client";

import Link from "next/link";
import Image from "next/image"; 

const researchTopics = [
  { 
    id: 1, 
    title: "Neural Networks", 
    image: "/cat5.jpg", 
    designer: "David Borg",
    papers: 8,
    views: 35,
    ranking: 1
  },
  { 
    id: 2, 
    title: "Quantum Computing", 
    image: "/cat4.jpg", 
    designer: "Lucy",
    papers: 7,
    views: 28,
    ranking: 2
  },
  { 
    id: 3, 
    title: "AI Ethics", 
    image: "/cat3.jpg", 
    designer: "Jerry Cool West",
    papers: 6,
    views: 23,
    ranking: 3
  },
  { 
    id: 4, 
    title: "Cybersecurity", 
    image: "/cat2.jpg", 
    designer: "Bold",
    papers: 4,
    views: 18,
    ranking: 4
  },
    { 
    id: 5, 
    title: "Blockchain Technology", 
    image: "/cat1.jpg", 
    designer: "David Borg",
    papers: 2,
    views: 15,
    ranking: 5
  }
];

export default function Dashboard() {
  return (
    <div className="dashboard-container mx-auto p-6 text-white bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
      <h1 className="text-3xl font-bold mb-4 text-center">Welcome to CPU Research Archive</h1>
      <p className="text-gray-400 mb-6 text-center">Browse research papers. Sign in for full access.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {researchTopics.map((topic) => (
          <Link key={topic.id} href={{ pathname: "/library", query: { category: topic.title } }}>
            <div className="card"> 
              <div className="card-image-container">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  className="card-image"
                  sizes="100vw"
                />
                <div className="card-image-overlay"></div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{topic.title}</h3>
                <div className="card-meta">
                  <span>By {topic.designer}</span>
                  <span>#{topic.ranking}</span>
                </div>
                <div className="card-stats">
                  <span>{topic.papers} Papers</span>
                  <span>{topic.views} Views</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}