import React, { useEffect, useRef, useState } from 'react';
import './AsciiSweep.css';

function AsciiSweep({ panels = [], index = 0, children, color = '#5657D9', duration = 0.75, className = '', onSweepStart, onSweepEnd }) {
  const [displayIndex, setDisplayIndex] = useState(index);
  const displayIndexRef = useRef(index);
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef(null);
  const rootRef = useRef(null);
  const animationRef = useRef(null);
  const timerRef = useRef(null);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reducedMotionRef.current = media.matches; };
    update();
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  useEffect(() => {
    if (index === displayIndexRef.current) return undefined;
    displayIndexRef.current = index;
    setDisplayIndex(index);
    onSweepStart?.(index);
    if (reducedMotionRef.current) {
      setIsAnimating(false);
      onSweepEnd?.(index);
      return undefined;
    }
    setIsAnimating(true);
    timerRef.current = window.setTimeout(() => {
      setIsAnimating(false);
      onSweepEnd?.(index);
    }, duration * 1000);
    return () => window.clearTimeout(timerRef.current);
  }, [index, duration, onSweepEnd, onSweepStart]);

  useEffect(() => {
    if (!isAnimating || !canvasRef.current || !rootRef.current || reducedMotionRef.current) return undefined;
    const canvas = canvasRef.current;
    const root = rootRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;
    const startedAt = performance.now();
    const chars = '·:+*#@';
    const resize = () => {
      const rect = root.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (time) => {
      const rect = root.getBoundingClientRect();
      const progress = Math.min(1, (time - startedAt) / (duration * 1000));
      const x = -rect.width * 0.18 + progress * rect.width * 1.36;
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace';
      for (let column = -80; column < 100; column += 16) {
        const distance = Math.abs(column * 1.3 - x);
        const alpha = Math.max(0, 1 - distance / 150) * 0.72;
        if (alpha <= 0) continue;
        for (let y = 12; y < rect.height; y += 15) {
          const char = chars[(column + Math.floor(y / 15) + Math.floor(time / 120)) % chars.length];
          ctx.globalAlpha = alpha * (0.65 + ((y / 15) % 3) * 0.12);
          ctx.fillStyle = color;
          ctx.fillText(char, column + x, y);
        }
      }
      ctx.globalAlpha = 1;
      if (progress < 1 && isAnimating) animationRef.current = requestAnimationFrame(draw);
    };
    animationRef.current = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [isAnimating, duration, color]);

  useEffect(() => () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    window.clearTimeout(timerRef.current);
  }, []);

  const content = panels.length ? panels[displayIndex] : children;
  return (
    <div ref={rootRef} className={`ascii-sweep ${isAnimating ? 'is-sweeping' : ''} ${className}`} style={{ '--ascii-color': color }}>
      <div className="ascii-sweep__content">{content}</div>
      <canvas ref={canvasRef} className="ascii-sweep__canvas" aria-hidden="true" />
    </div>
  );
}

export default AsciiSweep;

\n