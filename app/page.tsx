"use client";

import Link from "next/link";
import Image from "next/image"; 

const researchTopics = [
  { 
    id: 1, 
    title: "Neural Networks", 
    image: "/images/neural_networks.jpg", 
    designer: "David Borg",
    papers: 2342,
    views: 4738,
    ranking: 1
  },
  { 
    id: 2, 
    title: "Quantum Computing", 
    image: "/images/quantum_computing.jpg", 
    designer: "Lucy",
    papers: 1500,
    views: 3200,
    ranking: 2
  },
  { 
    id: 3, 
    title: "AI Ethics", 
    image: "/images/ai_ethics.jpg", 
    designer: "Jerry Cool West",
    papers: 1800,
    views: 2800,
    ranking: 3
  },
  { 
    id: 4, 
    title: "Cybersecurity", 
    image: "/images/cybersecurity.jpg", 
    designer: "Bold",
    papers: 2000,
    views: 2500,
    ranking: 4
  },
    { 
    id: 5, 
    title: "Blockchain Technology", 
    image: "/images/blockchain.jpg", 
    designer: "David Borg",
    papers: 1200,
    views: 2000,
    ranking: 5
  }
];

export default function Dashboard() {
  return (
    <div className="container mx-auto p-6 text-white bg-gradient-to-r from-indigo-900 via-purple-900 to-black">
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