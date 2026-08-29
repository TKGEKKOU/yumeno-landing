import React, { useEffect, useRef, useState } from 'react';
import './PeelReveal.css';

function PeelReveal({ children, reveal, className = '' }) {
  const [progress, setProgress] = useState(0);
  const [isPinned, setIsPinned] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isTouch, setIsTouch] = useState(false);
  const rootRef = useRef(null);
  const open = isPinned || isFocused || progress > 0.06;

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none), (pointer: coarse)').matches);
  }, []);

  const handlePointerMove = (event) => {
    if (isTouch || isPinned) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const edgeDistance = event.clientX - rect.left;
    const next = Math.max(0, Math.min(1, 1 - edgeDistance / 190));
    setProgress(next);
  };

  const handlePointerLeave = () => {
    if (!isPinned && !isFocused) setProgress(0);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsPinned((value) => !value);
      setProgress(1);
    }
    if (event.key === 'Escape') {
      setIsPinned(false);
      setIsFocused(false);
      setProgress(0);
      rootRef.current?.blur();
    }
  };

  const togglePinned = (event) => {
    event.stopPropagation();
    setIsPinned((value) => !value);
    setProgress(isPinned ? 0 : 1);
  };

  const sheetStyle = {
    '--peel-progress': progress,
    '--peel-open': open ? 1 : 0,
  };

  return (
    <div
      ref={rootRef}
      className={`peel-reveal ${open ? 'peel-open' : ''} ${isPinned ? 'is-pinned' : ''} ${className}`}
      tabIndex={0}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onFocus={() => setIsFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsFocused(false);
          if (!isPinned) setProgress(0);
        }
      }}
      onKeyDown={handleKeyDown}
      aria-label="角色工作台工具栏"
      aria-expanded={open}
    >
      <div className="peel-reveal__under">{reveal}</div>
      <div className="peel-reveal__sheet" style={sheetStyle}>{children}</div>
      <button className="peel-reveal__toggle" type="button" onClick={togglePinned} aria-label={open ? '关闭角色工具栏' : '打开角色工具栏'} aria-pressed={isPinned}>
        <span>{open ? '‹' : '›'}</span>
      </button>
      <span className="peel-reveal__hint" aria-hidden="true">靠近边缘打开工具栏</span>
    </div>
  );
}

export default PeelReveal;
