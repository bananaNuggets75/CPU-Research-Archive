interface Paper {
  id: string;
  title: string;
  author: string;
  category: string;
}

interface PaperListProps {
  papers: Paper[];
}

export default function PaperList({ papers }: PaperListProps) {
  return (
    <div className="container">
      {papers.length > 0 ? (
        <div className="paper-grid">
          {papers.map((paper) => (
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
