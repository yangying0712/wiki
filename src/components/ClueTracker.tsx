import React, { useState } from 'react';

interface Clue {
  id: string;
  title: string;
  description: string;
  status: 'planted' | 'recovered' | 'abandoned';
  plantedChapter: number;
  recoveredChapter?: number;
  importance: 'minor' | 'moderate' | 'major' | 'critical';
  theories?: string[];
}

interface ClueTrackerProps {
  clues: Clue[];
  title?: string;
  className?: string;
}

const statusLabels: Record<string, { label: string; color: string; icon: string }> = {
  planted: { label: '待回收', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30', icon: '🌱' },
  recovered: { label: '已回收', color: 'text-green-600 bg-green-100 dark:bg-green-900/30', icon: '✅' },
  abandoned: { label: '已弃用', color: 'text-gray-500 bg-gray-100 dark:bg-gray-800', icon: '❌' },
};

const importanceLabels: Record<string, { label: string; color: string }> = {
  minor: { label: '次要', color: 'border-gray-300 dark:border-gray-600' },
  moderate: { label: '中等', color: 'border-blue-400 dark:border-blue-500' },
  major: { label: '重要', color: 'border-amber-400 dark:border-amber-500' },
  critical: { label: '关键', color: 'border-red-500 dark:border-red-400' },
};

export const ClueTracker: React.FC<ClueTrackerProps> = ({
  clues,
  title = '伏笔追踪',
  className = '',
}) => {
  const [filter, setFilter] = useState<'all' | 'planted' | 'recovered' | 'abandoned'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredClues = filter === 'all' 
    ? clues 
    : clues.filter((c) => c.status === filter);

  const stats = {
    total: clues.length,
    planted: clues.filter((c) => c.status === 'planted').length,
    recovered: clues.filter((c) => c.status === 'recovered').length,
  };

  return (
    <div className={`rounded-xl border border-[var(--color-border)] overflow-hidden ${className}`}>
      {/* 标题栏 */}
      <div className="px-6 py-4 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            🔍 {title}
          </h3>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-[var(--color-muted)]">
              回收进度: {stats.recovered}/{stats.total}
            </span>
            <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full transition-all"
                style={{ width: `${(stats.recovered / stats.total) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* 过滤器 */}
        <div className="flex gap-2 mt-4">
          {(['all', 'planted', 'recovered', 'abandoned'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-3 py-1 rounded-full text-sm transition-colors
                ${filter === status 
                  ? 'bg-indigo-500 text-white' 
                  : 'bg-[var(--color-background)] hover:bg-[var(--color-border)]'
                }
              `}
            >
              {status === 'all' ? '全部' : statusLabels[status].label}
              {status !== 'all' && ` (${clues.filter((c) => c.status === status).length})`}
            </button>
          ))}
        </div>
      </div>
      
      {/* 伏笔列表 */}
      <div className="divide-y divide-[var(--color-border)]">
        {filteredClues.map((clue) => (
          <div 
            key={clue.id}
            className={`
              p-4 cursor-pointer hover:bg-[var(--color-card)] transition-colors
              border-l-4 ${importanceLabels[clue.importance].color}
            `}
            onClick={() => setExpandedId(expandedId === clue.id ? null : clue.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xl">{statusLabels[clue.status].icon}</span>
                <div>
                  <h4 className="font-medium">{clue.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-sm text-[var(--color-muted)]">
                    <span>埋线: 第{clue.plantedChapter}章</span>
                    {clue.recoveredChapter && (
                      <>
                        <span>→</span>
                        <span>回收: 第{clue.recoveredChapter}章</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  ${statusLabels[clue.status].color}
                `}>
                  {statusLabels[clue.status].label}
                </span>
                <span className={`
                  transform transition-transform
                  ${expandedId === clue.id ? 'rotate-180' : ''}
                `}>
                  ▼
                </span>
              </div>
            </div>
            
            {/* 展开详情 */}
            {expandedId === clue.id && (
              <div className="mt-4 pl-9 space-y-3">
                <p className="text-sm text-[var(--color-muted)]">{clue.description}</p>
                {clue.theories && clue.theories.length > 0 && (
                  <div>
                    <h5 className="text-sm font-medium mb-1">预测/理论:</h5>
                    <ul className="text-sm text-[var(--color-muted)] space-y-1">
                      {clue.theories.map((theory, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span>💡</span>
                          <span>{theory}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClueTracker;
