interface Paper {
    id: string;
    title: string;
    author: string;
    category: string;
  }
  
  interface PaperListProps {
    papers: Paper[];
    searchQuery: string;
  }
  
  export default function PaperList({ papers, searchQuery }: PaperListProps) {
    const filteredPapers = papers.filter((paper) =>
      paper.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    return (
      <div className="paper-list">
        {filteredPapers.length > 0 ? (
          filteredPapers.map((paper) => (
            <div key={paper.id} className="paper-item">
              <h3>{paper.title}</h3>
              <p>{paper.author} - {paper.category}</p>
            </div>
          ))
        ) : (
          <p>No research papers found.</p>
        )}
      </div>
    );
  }