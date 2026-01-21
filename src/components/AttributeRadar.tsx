import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface AttributeData {
  attribute: string;
  value: number;
  fullMark: number;
}

interface AttributeRadarProps {
  name: string;
  color: string;
  attributes: {
    intelligence: number;
    strength: number;
    charm: number;
    loyalty: number;
    cunning: number;
    emotional: number;
  };
  className?: string;
  showGlow?: boolean;
}

const attributeLabels: Record<string, string> = {
  intelligence: '智力',
  strength: '力量',
  charm: '魅力',
  loyalty: '忠诚',
  cunning: '谋略',
  emotional: '情商',
};

export const AttributeRadar: React.FC<AttributeRadarProps> = ({
  name,
  color,
  attributes,
  className = '',
  showGlow = true,
}) => {
  const data: AttributeData[] = Object.entries(attributes).map(([key, value]) => ({
    attribute: attributeLabels[key] || key,
    value,
    fullMark: 100,
  }));

  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-center font-semibold mb-2" style={{ color }}>
        {name}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data}>
          <PolarGrid 
            stroke="currentColor" 
            strokeOpacity={0.2}
          />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: 'currentColor', fontSize: 10 }}
          />
          <Radar
            name={name}
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.3}
            strokeWidth={2}
            style={showGlow ? {
              filter: `drop-shadow(0 0 8px ${color})`,
            } : undefined}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 对比雷达图
interface RadarCompareProps {
  characters: Array<{
    name: string;
    color: string;
    attributes: {
      intelligence: number;
      strength: number;
      charm: number;
      loyalty: number;
      cunning: number;
      emotional: number;
    };
  }>;
  className?: string;
}

export const RadarCompare: React.FC<RadarCompareProps> = ({
  characters,
  className = '',
}) => {
  // 转换数据格式
  const data = Object.keys(attributeLabels).map((key) => {
    const item: Record<string, string | number> = {
      attribute: attributeLabels[key],
    };
    characters.forEach((char) => {
      item[char.name] = char.attributes[key as keyof typeof char.attributes];
    });
    return item;
  });

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {characters.map((char) => (
          <div key={char.name} className="flex items-center gap-2">
            <span 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: char.color }}
            />
            <span className="text-sm font-medium">{char.name}</span>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="currentColor" strokeOpacity={0.2} />
          <PolarAngleAxis 
            dataKey="attribute" 
            tick={{ fill: 'currentColor', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]}
            tick={{ fill: 'currentColor', fontSize: 10 }}
          />
          {characters.map((char) => (
            <Radar
              key={char.name}
              name={char.name}
              dataKey={char.name}
              stroke={char.color}
              fill={char.color}
              fillOpacity={0.15}
              strokeWidth={2}
              style={{
                filter: `drop-shadow(0 0 6px ${char.color})`,
              }}
            />
          ))}
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttributeRadar;
