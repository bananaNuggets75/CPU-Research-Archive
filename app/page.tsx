"use client";

import Link from "next/link";
import Image from "next/image"; 

const researchTopics = [
  { 
    id: 1, 
    title: "Neural Networks", 
    image: "/cat5.jpg", 
    designer: "Mark Burg",
    papers: 8,
    views: 35,
    ranking: 1
  },
  { 
    id: 2, 
    title: "Quantum Computing", 
    image: "/cat4.jpg", 
    designer: "Elon Mars",
    papers: 7,
    views: 28,
    ranking: 2
  },
  { 
    id: 3, 
    title: "AI Ethics", 
    image: "/cat3.jpg", 
    designer: "Sam Ctrlman",
    papers: 6,
    views: 23,
    ranking: 3
  },
  { 
    id: 4, 
    title: "Cybersecurity", 
    image: "/cat2.jpg", 
    designer: "Ryan Montgeormetry",
    papers: 4,
    views: 18,
    ranking: 4
  },
    { 
    id: 5, 
    title: "Blockchain Technology", 
    image: "/cat1.jpg", 
    designer: "Stuart Barber",
    papers: 2,
    views: 15,
    ranking: 5
  },
  { 
    id: 6, 
    title: "Machine Learning", 
    image: "/cat1.jpg", 
    designer: "Arthur Pencilgon",
    papers: 2,
    views: 15,
    ranking: 5
  }
];

export default function Dashboard() {
  return (
    <div className="mx-auto p-6 text-white bg-gradient-to-r bg-dark to-black min-h-screen">
      <h1 className="text-4xl font-bold mb-6 text-center">Welcome to CPU Research Archive</h1>
      <p className="text-lg text-gray-300 mb-8 text-center">Browse research papers. Sign in for full access.</p>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {researchTopics.map((topic) => (
          <Link key={topic.id} href={{ pathname: "/library", query: { category: topic.title } }}>
            <div className="bg-white shadow-lg rounded-xl overflow-hidden flex flex-col h-full">
              
              {/* Image Container */}
              <div className="relative w-full h-48">
                <Image
                  src={topic.image}
                  alt={topic.title}
                  fill
                  className="object-cover"
                />
              </div>
  
              {/* Card Content */}
              <div className="flex-grow flex flex-col justify-between p-4">
                <h3 className="text-lg font-bold text-gray-900">{topic.title}</h3>
                <p className="text-sm text-gray-700">
                  By <span className="font-semibold">{topic.designer}</span>
                  <span className="ml-3 font-semibold text-gray-600">#{topic.ranking}</span>
                </p>
                <div className="flex justify-between text-sm font-medium text-gray-800">
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