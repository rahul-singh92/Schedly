import React from 'react';
import { formatDisplayDate } from '../utils/helpers';

export default function CalendarSection({ 
  slideDuration, targetDate, displayDate, animating, slideClass, 
  renderCalendarPane, rangeStart, rangeEnd, setRangeStart, setRangeEnd 
}) {
  return (
    <section className="calendar-section slider-wrapper" style={{ '--slide-dur': `${slideDuration}ms` }}>
      
      {/* the page underneath that gets revealed when the top one slides away */}
      <div className="calendar-page static-bottom">
        {renderCalendarPane(targetDate ? targetDate.year : displayDate.year, targetDate ? targetDate.month : displayDate.month)}
      </div>

      {animating && (
        <>
          {/* kicking off dummy pages to make it look like we are thumbing through a stack */}
          {slideClass.includes('multi') && (
            <>
              <div className={`calendar-page dummy-page ${slideClass} delay-2`}></div>
              <div className={`calendar-page dummy-page ${slideClass} delay-1`}></div>
            </>
          )}
          
          <div className={`calendar-page sliding-top ${slideClass}`}>
            {renderCalendarPane(displayDate.year, displayDate.month)}
          </div>
        </>
      )}

      {(rangeStart || rangeEnd) && (
        <div className="range-indicator">
          <div className="range-pills">
            {rangeStart && <span className="pill">{formatDisplayDate(rangeStart)}</span>}
            {rangeStart && rangeEnd && <span className="arrow">→</span>}
            {rangeEnd && <span className="pill">{formatDisplayDate(rangeEnd)}</span>}
          </div>
          <button className="clear-btn" onClick={() => { setRangeStart(null); setRangeEnd(null); }}>Clear Selection</button>
        </div>
      )}
    </section>
  );
}