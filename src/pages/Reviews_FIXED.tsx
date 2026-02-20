import { useState } from 'react';
import DOMPurify from 'dompurify';

interface ReviewTextProps {
  text: string;
  maxLength?: number;
}

export const ReviewText = ({ text, maxLength = 300 }: ReviewTextProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const needsTruncate = text.length > maxLength;
  const displayText = expanded || !needsTruncate 
    ? text 
    : text.substring(0, maxLength) + '...';

  // Sanitizar HTML antes de renderizar
  const sanitizedHtml = DOMPurify.sanitize(displayText, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'p', 'br', 'ul', 'ol', 'li', 'a'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ALLOW_DATA_ATTR: false,
  });

  return (
    <div>
      <div
        className="text-slate-300 leading-relaxed prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      {needsTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors mt-2"
        >
          {expanded ? '▲ Ver menos' : '▼ Ver mais'}
        </button>
      )}
    </div>
  );
};
