import React from 'react';

interface QuoteCardProps {
  quote: string;
  speaker?: string;
  speakerColor?: string;
  chapter?: number | string;
  context?: string;
  className?: string;
}

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  speaker,
  speakerColor,
  chapter,
  context,
  className = '',
}) => {
  return (
    <figure
      className={`
        relative my-8 p-6 rounded-lg
        bg-gradient-to-br from-[var(--color-card)] to-transparent
        border-l-4 border-[var(--color-primary)]
        ${className}
      `}
      style={speakerColor ? { borderLeftColor: speakerColor } : undefined}
    >
      {/* 装饰性引号 */}
      <span
        className="absolute -top-4 -left-2 text-8xl opacity-10 font-serif select-none"
        style={speakerColor ? { color: speakerColor } : undefined}
        aria-hidden="true"
      >
        "
      </span>
      
      <blockquote className="relative z-10 text-xl md:text-2xl font-serif italic leading-relaxed">
        {quote}
      </blockquote>
      
      <figcaption className="mt-4 flex items-center gap-4">
        {speaker && (
          <cite
            className="not-italic font-semibold"
            style={speakerColor ? { color: speakerColor } : undefined}
          >
            — {speaker}
          </cite>
        )}
        {chapter && (
          <span className="text-sm text-[var(--color-muted)]">
            第 {chapter} 章
          </span>
        )}
      </figcaption>
      
      {context && (
        <p className="mt-3 text-sm text-[var(--color-muted)] italic">
          {context}
        </p>
      )}
    </figure>
  );
};

export default QuoteCard;
