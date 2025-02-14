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
      <div className="container">
        {filteredPapers.length > 0 ? (
          <div className="paper-grid">
            {filteredPapers.map((paper) => (
              <div key={paper.id} className="paper-card">
                <h3>{paper.title}</h3>
                <p className="paper-author">{paper.author}</p>
                <span className="paper-category">{paper.category}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-results">No research papers found.</p>
        )}
      </div>
    );
  }
  