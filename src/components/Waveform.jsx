import React from 'react';
import './Waveform.css';

function Waveform({ bars = 42, className = '' }) {
  return (
    <div className={`waveform ${className}`} aria-hidden="true">
      {Array.from({ length: bars }, (_, index) => (
        <i key={index} style={{ '--wave-height': `${18 + Math.round(Math.abs(Math.sin(index * 0.72)) * 54)}%` }} />
      ))}
    </div>
  );
}

export default Waveform;

