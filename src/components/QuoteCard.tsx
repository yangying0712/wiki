import React from 'react';

interface QuoteCardProps {
  quote: string;
  speaker?: string;
  speakerColor?: string;
  chapter?: number | string;
  context?: string;
  importance?: 'normal' | 'memorable' | 'iconic';
  className?: string;
}

// 验证颜色是否为有效的十六进制颜色
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$/.test(color);
};

// 获取安全的颜色值
const getSafeColor = (color: string | undefined, fallback: string): string => {
  if (!color) return fallback;
  return isValidHexColor(color) ? color : fallback;
};

export const QuoteCard: React.FC<QuoteCardProps> = ({
  quote,
  speaker,
  speakerColor,
  chapter,
  context,
  importance = 'normal',
  className = '',
}) => {
  // 验证并获取安全的颜色
  const safeColor = getSafeColor(speakerColor, '#6366f1');
  const hasValidColor = speakerColor && isValidHexColor(speakerColor);
  
  // 根据重要性决定样式
  const importanceStyles = {
    iconic: {
      borderGradient: hasValidColor 
        ? `linear-gradient(180deg, ${safeColor}, ${safeColor}50)` 
        : 'linear-gradient(180deg, #6366f1, #a855f7)',
      bgGradient: hasValidColor 
        ? `linear-gradient(135deg, ${safeColor}10, transparent)` 
        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), transparent)',
      glowColor: safeColor,
    },
    memorable: {
      borderGradient: hasValidColor 
        ? `linear-gradient(180deg, ${safeColor}cc, ${safeColor}40)` 
        : 'linear-gradient(180deg, #a855f7cc, #a855f740)',
      bgGradient: hasValidColor 
        ? `linear-gradient(135deg, ${safeColor}08, transparent)` 
        : 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), transparent)',
      glowColor: hasValidColor ? safeColor : '#a855f7',
    },
    normal: {
      borderGradient: hasValidColor ? safeColor : 'var(--color-primary)',
      bgGradient: 'linear-gradient(135deg, var(--color-card), transparent)',
      glowColor: hasValidColor ? safeColor : 'var(--color-primary)',
    },
  };

  const styles = importanceStyles[importance];

  return (
    <figure
      className={`
        relative my-6 rounded-xl overflow-hidden
        transition-all duration-500 hover:scale-[1.02]
        group cursor-default
        ${importance === 'iconic' ? 'hover:shadow-2xl' : 'hover:shadow-lg'}
        ${className}
      `}
      style={{
        background: styles.bgGradient,
      }}
    >
      {/* 左侧渐变边框 */}
      <div 
        className={`
          absolute left-0 top-0 bottom-0 w-1.5 
          ${importance === 'iconic' ? 'w-2' : 'w-1.5'}
        `}
        style={{ background: styles.borderGradient }}
      />
      
      {/* 发光效果（仅限iconic） */}
      {importance === 'iconic' && (
        <div 
          className="absolute -left-20 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"
          style={{ backgroundColor: styles.glowColor }}
        />
      )}
      
      {/* 内容区域 */}
      <div className="relative p-6 md:p-8">
        {/* 装饰性引号 */}
        <span
          className={`
            absolute -top-2 left-4 font-serif select-none
            transition-transform duration-300 group-hover:scale-110
            ${importance === 'iconic' ? 'text-8xl opacity-20' : 'text-7xl opacity-10'}
          `}
          style={hasValidColor ? { color: safeColor } : undefined}
          aria-hidden="true"
        >
          "
        </span>
        
        {/* 闭合引号 */}
        <span
          className={`
            absolute -bottom-6 right-4 font-serif select-none
            transition-transform duration-300 group-hover:scale-110
            ${importance === 'iconic' ? 'text-8xl opacity-20' : 'text-7xl opacity-10'}
          `}
          style={hasValidColor ? { color: safeColor } : undefined}
          aria-hidden="true"
        >
          "
        </span>
        
        {/* 引用文本 */}
        <blockquote 
          className={`
            relative z-10 font-serif italic leading-relaxed
            ${importance === 'iconic' ? 'text-2xl md:text-3xl' : 'text-xl md:text-2xl'}
          `}
        >
          <span 
            className={`
              ${importance === 'iconic' ? 'bg-clip-text text-transparent' : ''}
            `}
            style={importance === 'iconic' && hasValidColor ? {
              backgroundImage: `linear-gradient(135deg, ${safeColor}, ${safeColor}cc)`,
            } : undefined}
          >
            {quote}
          </span>
        </blockquote>
        
        {/* 底部信息 */}
        <figcaption className="mt-6 flex flex-wrap items-center gap-4">
          {speaker && (
            <cite
              className="not-italic font-semibold text-lg flex items-center gap-2"
              style={hasValidColor ? { color: safeColor } : undefined}
            >
              <span 
                className="w-3 h-3 rounded-full animate-pulse"
                style={hasValidColor ? { backgroundColor: safeColor } : undefined}
              />
              {speaker}
            </cite>
          )}
          {chapter && (
            <span className="px-3 py-1 rounded-full text-sm bg-[var(--color-card)] text-[var(--color-muted)] border border-[var(--color-border)]">
              📖 第 {chapter} 章
            </span>
          )}
        </figcaption>
        
        {/* 语境说明 */}
        {context && (
          <p className="mt-4 text-sm text-[var(--color-muted)] italic pl-4 border-l-2 border-[var(--color-border)]">
            💭 {context}
          </p>
        )}
      </div>
      
      {/* 重要性角标 */}
      {importance !== 'normal' && (
        <div 
          className={`
            absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white
            ${importance === 'iconic' ? 'animate-pulse' : ''}
          `}
          style={{
            background: importance === 'iconic' 
              ? `linear-gradient(135deg, ${hasValidColor ? safeColor : '#6366f1'}, ${hasValidColor ? safeColor + 'cc' : '#a855f7'})`
              : hasValidColor ? safeColor : '#a855f7',
          }}
        >
          {importance === 'iconic' && '⭐ 经典'}
          {importance === 'memorable' && '💎 难忘'}
        </div>
      )}
    </figure>
  );
};

export default QuoteCard;
