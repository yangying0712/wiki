import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';

interface EmotionDataPoint {
  chapter: number;
  value: number;
  event?: string;
}

interface EmotionChartProps {
  data: EmotionDataPoint[];
  characterName: string;
  color: string;
  title?: string;
  className?: string;
}

// 自定义 Tooltip
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as EmotionDataPoint;
    return (
      <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg">
        <p className="font-semibold">第 {data.chapter} 章</p>
        <p className="text-sm">
          情感值: <span className="font-bold">{data.value}</span>
        </p>
        {data.event && (
          <p className="text-sm text-[var(--color-muted)] mt-1 max-w-[200px]">
            {data.event}
          </p>
        )}
      </div>
    );
  }
  return null;
};

export const EmotionChart: React.FC<EmotionChartProps> = ({
  data,
  characterName,
  color,
  title,
  className = '',
}) => {
  // 找出关键事件点
  const keyEvents = data.filter((d) => d.event);

  return (
    <div className={`w-full ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}
      
      <div className="flex items-center gap-2 mb-4 justify-center">
        <span 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="font-medium">{characterName} 情感波动</span>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis 
            dataKey="chapter" 
            tick={{ fill: 'currentColor', fontSize: 11 }}
            label={{ value: '章节', position: 'bottom', fill: 'currentColor' }}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fill: 'currentColor', fontSize: 11 }}
            label={{ value: '情感值', angle: -90, position: 'insideLeft', fill: 'currentColor' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={3}
            dot={{ fill: color, strokeWidth: 2, r: 4 }}
            activeDot={{ r: 8, stroke: color, strokeWidth: 2 }}
            style={{
              filter: `drop-shadow(0 0 6px ${color})`,
            }}
          />
          {/* 标记关键事件 */}
          {keyEvents.map((event) => (
            <ReferenceDot
              key={event.chapter}
              x={event.chapter}
              y={event.value}
              r={8}
              fill={color}
              stroke="white"
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      {/* 事件列表 */}
      {keyEvents.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-semibold text-[var(--color-muted)]">关键事件</h4>
          {keyEvents.map((event) => (
            <div 
              key={event.chapter}
              className="flex items-start gap-2 text-sm"
            >
              <span 
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{ backgroundColor: color }}
              />
              <span>
                <strong>第 {event.chapter} 章</strong>: {event.event}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EmotionChart;
