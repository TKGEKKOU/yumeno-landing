import React from 'react';
import './Waveform.css';

function Waveform({ bars = 42, isPlaying = false, progress = 0, onToggle, className = '' }) {
  return (
    <div className={`waveform ${isPlaying ? 'is-playing' : ''} ${className}`}>
      <div className="waveform-bars" aria-hidden="true">
        {Array.from({ length: bars }, (_, index) => {
          const baseHeight = 24 + Math.abs(Math.sin(index * 0.72)) * 58;
          const level = isPlaying ? 0.72 + Math.sin(index * 0.9 + progress * 18) * 0.24 : 0.22 + (index % 4) * 0.035;
          return <i key={index} style={{ '--wave-height': `${Math.max(10, baseHeight * level)}%`, '--wave-delay': `${index * 18}ms`, '--wave-progress': `${progress * 100}%` }} />;
        })}
      </div>
      <div className="waveform-track" aria-hidden="true"><span style={{ width: `${progress * 100}%` }} /></div>
      <button className="waveform-button" type="button" onClick={onToggle} aria-label={isPlaying ? '暂停声音试听' : '播放声音试听'} aria-pressed={isPlaying}>
        <span className="waveform-button-icon">{isPlaying ? 'Ⅱ' : '▶'}</span>
        <span>{isPlaying ? '暂停试听' : '播放试听'}</span>
      </button>
    </div>
  );
}

export default Waveform;
