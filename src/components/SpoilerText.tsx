import React, { useState } from 'react';

interface SpoilerTextProps {
  children: React.ReactNode;
  warningText?: string;
  className?: string;
}

export const SpoilerText: React.FC<SpoilerTextProps> = ({
  children,
  warningText = '点击查看剧透内容',
  className = '',
}) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      className={`
        relative inline cursor-pointer select-none
        ${className}
      `}
      onClick={() => setRevealed(!revealed)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setRevealed(!revealed);
        }
      }}
      tabIndex={0}
      role="button"
      aria-expanded={revealed}
      aria-label={revealed ? '隐藏剧透' : warningText}
    >
      <span
        className={`
          transition-all duration-300
          ${revealed 
            ? 'blur-none opacity-100' 
            : 'blur-sm opacity-50 hover:blur-[2px] hover:opacity-70'
          }
        `}
      >
        {children}
      </span>
      {!revealed && (
        <span 
          className="
            absolute inset-0 flex items-center justify-center
            bg-[var(--color-card)]/80 backdrop-blur-sm rounded
            text-xs text-[var(--color-muted)] font-medium
            hover:bg-[var(--color-card)]/60
            transition-all duration-200
          "
        >
          🔒 {warningText}
        </span>
      )}
    </span>
  );
};

// 块级剧透组件
interface SpoilerBlockProps {
  children: React.ReactNode;
  title?: string;
  warningText?: string;
  className?: string;
}

export const SpoilerBlock: React.FC<SpoilerBlockProps> = ({
  children,
  title = '剧透警告',
  warningText = '此处包含重要剧透，点击展开',
  className = '',
}) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div
      className={`
        my-6 rounded-lg border border-rose-200 dark:border-rose-800
        overflow-hidden
        ${className}
      `}
    >
      <button
        className="
          w-full px-4 py-3 flex items-center justify-between
          bg-rose-50 dark:bg-rose-950/30
          hover:bg-rose-100 dark:hover:bg-rose-900/30
          transition-colors duration-200
          text-left
        "
        onClick={() => setRevealed(!revealed)}
        aria-expanded={revealed}
      >
        <span className="flex items-center gap-2 font-medium text-rose-700 dark:text-rose-300">
          <span>⚠️</span>
          <span>{title}</span>
        </span>
        <span
          className={`
            transform transition-transform duration-200
            ${revealed ? 'rotate-180' : ''}
          `}
        >
          ▼
        </span>
      </button>
      
      <div
        className={`
          transition-all duration-300 ease-in-out
          ${revealed ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
          overflow-hidden
        `}
      >
        <div className="p-4 prose dark:prose-invert max-w-none">
          {children}
        </div>
      </div>
      
      {!revealed && (
        <div className="px-4 py-2 text-sm text-[var(--color-muted)] text-center">
          {warningText}
        </div>
      )}
    </div>
  );
};

export default SpoilerText;
