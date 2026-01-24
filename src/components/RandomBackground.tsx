import React, { useEffect, useState } from 'react';

interface RandomBackgroundProps {
  // 预设的背景图片列表
  images?: string[];
  // 切换间隔（毫秒）
  interval?: number;
  // 透明度
  opacity?: number;
  // 固定背景模式（用于角色详情页）
  fixedImage?: string;
  // 是否启用
  enabled?: boolean;
}

// 默认背景图片列表（占位符）
const defaultBackgrounds = [
  '/images/backgrounds/bg-1.jpg',
  '/images/backgrounds/bg-2.jpg',
  '/images/backgrounds/bg-3.jpg',
];

export const RandomBackground: React.FC<RandomBackgroundProps> = ({
  images = defaultBackgrounds,
  interval = 30000, // 默认30秒切换一次
  opacity = 0.15,
  fixedImage,
  enabled = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hasError, setHasError] = useState<Record<string, boolean>>({});

  // 如果是固定图片模式，直接使用固定图片
  const displayImage = fixedImage || (images.length > 0 ? images[currentIndex] : null);

  useEffect(() => {
    // 如果是固定图片模式或没有图片，不启动轮换
    if (fixedImage || images.length <= 1 || !enabled) return;

    // 随机初始化起始索引
    setCurrentIndex(Math.floor(Math.random() * images.length));

    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 1000); // 过渡时间
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, fixedImage, enabled]);

  if (!enabled || !displayImage) return null;

  // 如果所有图片都加载失败，不显示背景
  if (hasError[displayImage]) return null;

  return (
    <div 
      className="fixed inset-0 -z-10 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          backgroundImage: `url(${displayImage})`,
          opacity: isTransitioning ? 0 : opacity,
        }}
        onError={() => {
          setHasError((prev) => ({ ...prev, [displayImage]: true }));
        }}
      />
      {/* 渐变遮罩，确保内容可读性 */}
      <div 
        className="absolute inset-0" 
        style={{
          background: `linear-gradient(
            to bottom,
            var(--color-background) 0%,
            transparent 20%,
            transparent 80%,
            var(--color-background) 100%
          )`,
        }}
      />
    </div>
  );
};

export default RandomBackground;
