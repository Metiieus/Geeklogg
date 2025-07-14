import React, { useState } from "react";

interface TruncatedBioProps {
  bio: string;
  maxLength?: number;
  className?: string;
  showLessText?: string;
  showMoreText?: string;
}

export const TruncatedBio: React.FC<TruncatedBioProps> = ({
  bio,
  maxLength = 400,
  className = "text-slate-400",
  showLessText = "ler menos",
  showMoreText = "ler mais",
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!bio || bio.trim().length === 0) {
    return <p className={className}>Sem biografia definida.</p>;
  }

  const trimmedBio = bio.trim();
  const shouldTruncate = trimmedBio.length > maxLength;

  if (!shouldTruncate) {
    return <p className={className}>{trimmedBio}</p>;
  }

  const truncatedText = trimmedBio.slice(0, maxLength);
  const displayText = isExpanded ? trimmedBio : truncatedText;

  return (
    <div className={className}>
      <p className="whitespace-pre-wrap break-words">
        {displayText}
        {!isExpanded && shouldTruncate && "..."}
      </p>
      {shouldTruncate && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-purple-400 hover:text-purple-300 text-sm font-medium underline transition-colors"
        >
          {isExpanded ? showLessText : showMoreText}
        </button>
      )}
    </div>
  );
};
