import React from 'react';
import { SHORT_MONTHS, MONTHS } from '../utils/helpers';

export default function Header({ 
  theme, toggleTheme, heroImg, currentYear, currentMonth, 
  showYearPicker, setShowYearPicker, showMonthPicker, setShowMonthPicker, jumpToDate 
}) {
  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Dark Mode">
        {theme === 'dark' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
      </button>

      {/* hiding this svg definition since it's just used for the image cut-out */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id="diamond-curve-bottom" clipPathUnits="objectBoundingBox">
            <path d="M 0,0 L 1,0 L 1,0.7 Q 0.5,1.1 0,0.7 Z" />
          </clipPath>
        </defs>
      </svg>

      <header className="header-wrapper">
        <div className="header-bg-left"></div>
        <div className="header-image-container">
          <img className="hero-img" src={heroImg.url} alt="Monthly inspiration" />
          <div className="hero-overlay">
            <div className="hero-quote">{heroImg.quote}</div>
          </div>
        </div>

        <div className="header-bg-right">
          {/* dynamic z-index here prevents the year dropdown from hiding under the month diamond */}
          <div className="dropdown-wrapper" style={{ zIndex: showYearPicker ? 100 : 10 }} onClick={(e) => { e.stopPropagation(); setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }}>
            <div className="year-text">{currentYear} ▾</div>
            {showYearPicker && (
              <div className="custom-dropdown">
                {Array.from({length: 11}, (_, i) => currentYear - 5 + i).map(y => (
                  <div key={y} className="dropdown-item" onClick={() => jumpToDate(y, currentMonth)}>{y}</div>
                ))}
              </div>
            )}
          </div>

          <div className="month-diamond-container dropdown-wrapper" style={{ zIndex: showMonthPicker ? 100 : 10 }} onClick={(e) => { e.stopPropagation(); setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }}>
            <div className="month-diamond">
              <span>{SHORT_MONTHS[currentMonth]} ▾</span>
            </div>
            {showMonthPicker && (
              <div className="custom-dropdown month-dropdown">
                {MONTHS.map((m, i) => (
                  <div key={m} className="dropdown-item" onClick={() => jumpToDate(currentYear, i)}>{m}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}