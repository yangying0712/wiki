import React from 'react';

interface ScopedTagProps {
  tag: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// 解析标签格式: "scope:value" -> { scope, value }
function parseTag(tag: string): { scope: string | null; value: string } {
  const colonIndex = tag.indexOf(':');
  if (colonIndex === -1) {
    return { scope: null, value: tag };
  }
  return {
    scope: tag.substring(0, colonIndex),
    value: tag.substring(colonIndex + 1),
  };
}

// 根据 scope 返回对应的颜色类
function getTagColors(scope: string | null): string {
  const colorMap: Record<string, string> = {
    trope: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-300 dark:border-purple-700',
    vibe: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
    status: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    warning: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    tag: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    character: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
  };
  
  return colorMap[scope || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600';
}

// 获取标签图标
function getTagIcon(scope: string | null): string | null {
  const iconMap: Record<string, string> = {
    trope: '📖',
    vibe: '✨',
    status: '💫',
    warning: '⚠️',
    tag: '🏷️',
    character: '👤',
  };
  return iconMap[scope || ''] || null;
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
  lg: 'px-4 py-1.5 text-base',
};

export const ScopedTag: React.FC<ScopedTagProps> = ({ tag, size = 'md', className = '' }) => {
  const { scope, value } = parseTag(tag);
  const colors = getTagColors(scope);
  const icon = getTagIcon(scope);
  
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full border font-medium
        transition-all duration-200 hover:scale-105 cursor-default
        ${sizeClasses[size]}
        ${colors}
        ${className}
      `}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {scope && (
        <span className="opacity-60 font-normal">{scope}:</span>
      )}
      <span>{value}</span>
    </span>
  );
};

// 标签列表组件
interface TagListProps {
  tags: string[];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({ tags, size = 'md', className = '' }) => {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((tag, index) => (
        <ScopedTag key={index} tag={tag} size={size} />
      ))}
    </div>
  );
};

export default ScopedTag;
