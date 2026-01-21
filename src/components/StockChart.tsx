import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface StockDataPoint {
  chapter: number;
  value: number;
  event?: string;
}

interface CharacterStock {
  name: string;
  color: string;
  data: StockDataPoint[];
}

interface StockChartProps {
  characters: CharacterStock[];
  title?: string;
  className?: string;
}

export const StockChart: React.FC<StockChartProps> = ({
  characters,
  title = '好感度走势图',
  className = '',
}) => {
  // 合并所有章节数据
  const allChapters = new Set<number>();
  characters.forEach((char) => {
    char.data.forEach((point) => allChapters.add(point.chapter));
  });
  
  const sortedChapters = Array.from(allChapters).sort((a, b) => a - b);
  
  // 构建图表数据
  const chartData = sortedChapters.map((chapter) => {
    const point: Record<string, number | string> = { chapter: `第${chapter}章` };
    characters.forEach((char) => {
      const dataPoint = char.data.find((d) => d.chapter === chapter);
      if (dataPoint) {
        point[char.name] = dataPoint.value;
      }
    });
    return point;
  });

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      
      {/* 图例 */}
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {characters.map((char) => (
          <div key={char.name} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: char.color }}
            />
            <span className="text-sm">{char.name}</span>
          </div>
        ))}
      </div>
      
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
          <XAxis 
            dataKey="chapter" 
            tick={{ fill: 'currentColor', fontSize: 11 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            domain={[0, 100]}
            tick={{ fill: 'currentColor', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          />
          <ReferenceLine y={50} stroke="#666" strokeDasharray="3 3" label="基准线" />
          {characters.map((char) => (
            <Line
              key={char.name}
              type="monotone"
              dataKey={char.name}
              stroke={char.color}
              strokeWidth={2}
              dot={{ fill: char.color, strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: char.color, strokeWidth: 2 }}
              style={{
                filter: `drop-shadow(0 0 4px ${char.color})`,
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
