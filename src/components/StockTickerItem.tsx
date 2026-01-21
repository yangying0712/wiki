import React from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface StockTickerItemProps {
  name: string;
  color: string;
  currentValue: number;
  previousValue: number;
  history: Array<{ value: number }>;
  className?: string;
}

export const StockTickerItem: React.FC<StockTickerItemProps> = ({
  name,
  color,
  currentValue,
  previousValue,
  history,
  className = '',
}) => {
  const change = currentValue - previousValue;
  const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : '0';
  const isUp = change > 0;
  const isDown = change < 0;
  const isStable = change === 0;

  return (
    <div
      className={`
        p-4 rounded-xl border border-[var(--color-border)]
        bg-[var(--color-card)] hover:shadow-lg
        transition-all duration-300
        ${className}
      `}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: color }}
          />
          <span className="font-semibold">{name}</span>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium
          ${isUp ? 'text-green-500' : isDown ? 'text-red-500' : 'text-gray-500'}
        `}>
          {isUp && '▲'}
          {isDown && '▼'}
          {isStable && '—'}
          <span>{isUp ? '+' : ''}{change.toFixed(0)}</span>
          <span className="text-xs">({isUp ? '+' : ''}{changePercent}%)</span>
        </div>
      </div>
      
      {/* 当前值 */}
      <div className="flex items-end justify-between">
        <div>
          <span className="text-3xl font-bold" style={{ color }}>
            {currentValue}
          </span>
          <span className="ml-1 text-sm text-[var(--color-muted)]">/ 100</span>
        </div>
        
        {/* Sparkline 迷你折线图 */}
        <div className="w-24 h-12">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={history}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
                style={{
                  filter: `drop-shadow(0 0 3px ${color})`,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* 状态标签 */}
      <div className="mt-3 flex gap-2">
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          ${isUp 
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
            : isDown 
              ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
          }
        `}>
          {isUp ? '上涨中' : isDown ? '下跌中' : '持平'}
        </span>
      </div>
    </div>
  );
};

// 股票行情列表
interface StockTickerListProps {
  items: Array<{
    name: string;
    color: string;
    currentValue: number;
    previousValue: number;
    history: Array<{ value: number }>;
  }>;
  className?: string;
}

export const StockTickerList: React.FC<StockTickerListProps> = ({
  items,
  className = '',
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {items.map((item) => (
        <StockTickerItem key={item.name} {...item} />
      ))}
    </div>
  );
};

export default StockTickerItem;
