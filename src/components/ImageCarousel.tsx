import React, { useState, useEffect, useCallback, useRef } from 'react';

interface CarouselImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoPlayInterval?: number;
  className?: string;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  autoPlayInterval = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 清除动画超时
  const clearAnimationTimeout = useCallback(() => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  }, []);

  // 设置动画状态
  const startAnimation = useCallback(() => {
    clearAnimationTimeout();
    setIsAnimating(true);
    animationTimeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [clearAnimationTimeout]);

  // 清理动画超时
  useEffect(() => {
    return () => clearAnimationTimeout();
  }, [clearAnimationTimeout]);

  const goToNext = useCallback(() => {
    if (isAnimating) return;
    startAnimation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length, isAnimating, startAnimation]);

  const goToPrev = useCallback(() => {
    if (isAnimating) return;
    startAnimation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length, isAnimating, startAnimation]);

  const goToSlide = useCallback((index: number) => {
    if (isAnimating || index === currentIndex) return;
    startAnimation();
    setCurrentIndex(index);
  }, [currentIndex, isAnimating, startAnimation]);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [goToNext, autoPlayInterval, images.length]);

  if (images.length === 0) return null;

  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      {/* 图片容器 */}
      <div className="relative h-[400px] md:h-[500px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-700 ease-in-out ${
              index === currentIndex
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
          >
            {/* 半透明图片层 */}
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${image.src})`,
                opacity: 0.7,
              }}
            />
            {/* 渐变遮罩 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            
            {/* 文字内容 */}
            {(image.title || image.description) && (
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                {image.title && (
                  <h3 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in-up">
                    {image.title}
                  </h3>
                )}
                {image.description && (
                  <p className="text-lg md:text-xl opacity-90 animate-fade-in-up animation-delay-100">
                    {image.description}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 左右箭头 */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 
                       flex items-center justify-center rounded-full
                       bg-white/20 hover:bg-white/40 backdrop-blur-sm
                       text-white transition-all duration-300 hover:scale-110
                       border border-white/30"
            aria-label="上一张"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 
                       flex items-center justify-center rounded-full
                       bg-white/20 hover:bg-white/40 backdrop-blur-sm
                       text-white transition-all duration-300 hover:scale-110
                       border border-white/30"
            aria-label="下一张"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* 指示点 */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 
                         ${index === currentIndex 
                           ? 'bg-white scale-125' 
                           : 'bg-white/50 hover:bg-white/80'}`}
              aria-label={`跳转到第 ${index + 1} 张`}
            />
          ))}
        </div>
      )}

      {/* 进度条 */}
      {images.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div 
            className="h-full bg-white/80 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
