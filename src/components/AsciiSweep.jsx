import React, { useEffect, useRef, useState } from 'react';
import './AsciiSweep.css';

export function AsciiSweep({ children, style, enabled = true, ...props }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isSupported, setIsSupported] = useState(false);
  const animationRef = useRef(null);

  useEffect(() => {
    // 检测 HTML-in-Canvas API 支持
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const supported = typeof ctx?.drawElement === 'function';
    setIsSupported(supported && enabled);
    
    if (!supported && enabled) {
      console.info('ASCII Sweep: HTML-in-Canvas API 不支持，使用纯 CSS 降级方案');
    }
  }, [enabled]);

  useEffect(() => {
    if (!isSupported || !canvasRef.current || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    
    // 设置 Canvas 尺寸匹配容器
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // ASCII 字符集
    const asciiChars = '░▒▓█▄▀■□▪▫';
    let sweepPosition = -100;
    
    const animate = () => {
      if (!ctx || !canvas.width) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 绘制 ASCII 扫描带
      const bandWidth = 120;
      const x = sweepPosition;
      
      for (let i = 0; i < bandWidth; i++) {
        const alpha = Math.sin((i / bandWidth) * Math.PI) * 0.6;
        const char = asciiChars[Math.floor(Math.random() * asciiChars.length)];
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#0066CC';
        ctx.font = '16px monospace';
        
        // 随机分布字符
        for (let y = 0; y < canvas.height; y += 20) {
          const offset = Math.random() * 10;
          ctx.fillText(char, x + i + offset, y + offset);
        }
        
        ctx.restore();
      }
      
      // 循环扫描
      sweepPosition += 3;
      if (sweepPosition > canvas.width) {
        sweepPosition = -bandWidth;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSupported]);

  return (
    <div 
      ref={containerRef}
      className={scii-sweep-container }
      style={style}
      {...props}
    >
      {isSupported && (
        <canvas
          ref={canvasRef}
          className="ascii-sweep-canvas"
        />
      )}
      <div className="ascii-sweep-content">
        {children}
      </div>
    </div>
  );
}

export default AsciiSweep;
