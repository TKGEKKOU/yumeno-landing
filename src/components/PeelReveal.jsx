import React, { useState } from 'react';
import './PeelReveal.css';

function PeelReveal({ children, reveal, className = '' }) {
  const [progress, setProgress] = useState(0);
  const [focused, setFocused] = useState(false);
  const sheetStyle = focused ? undefined : {
    '--peel-progress': progress,
    clipPath: `polygon(0 0, ${100 - progress * 38}% 0, ${100 - progress * 62}% 100%, 0 100%)`,
  };

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const edgeDistance = rect.right - event.clientX;
    const next = Math.max(0, Math.min(1, 1 - edgeDistance / 210));
    setProgress(next);
  };

  return (
    <div
      className={`peel-reveal ${className}`}
      tabIndex="0"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setProgress(0)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label="移动到右侧边缘以揭开 YUMENO 介绍"
    >
      <div className="peel-reveal__under">{reveal}</div>
      <div className="peel-reveal__sheet" style={sheetStyle}>{children}</div>
      <span className="peel-reveal__hint" aria-hidden="true">靠近右侧边缘，揭开一角</span>
    </div>
  );
}

export default PeelReveal;
