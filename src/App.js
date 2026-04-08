import React, { useState, useEffect } from 'react';
import NoteModal from './components/NoteModal';
import { 
  MONTHS, SHORT_MONTHS, DAYS, HERO_IMAGES, 
  getDaysInMonth, getFirstDayOfMonth, dateKey, parseKey, 
  compareDates, formatDisplayDate, loadNotes, saveNotesToLocal 
} from './utils/helpers';
import './assets/App.css';

export default function App() {
  const today = new Date();
  const todayStr = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('wall-cal-theme') || 'light');

  // Animation & Rendering State
  const [displayDate, setDisplayDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [targetDate, setTargetDate] = useState(null); 
  const [animating, setAnimating] = useState(false);
  const [flipClass, setFlipClass] = useState(''); 
  const [flipDuration, setFlipDuration] = useState(800); 

  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [notes, setNotes] = useState(loadNotes);
  const [modal, setModal] = useState(null);
  
  const [noteFilter, setNoteFilter] = useState('selected'); 
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const currentMonth = animating && targetDate ? targetDate.month : displayDate.month;
  const currentYear = animating && targetDate ? targetDate.year : displayDate.year;
  const heroImg = HERO_IMAGES[currentMonth];

  // Persist theme and apply class to body
  useEffect(() => {
    localStorage.setItem('wall-cal-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  useEffect(() => { 
    saveNotesToLocal(notes); 
  }, [notes]);

  useEffect(() => {
    const closeDropdowns = () => {
      setShowYearPicker(false);
      setShowMonthPicker(false);
    };
    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  // --- Dynamic Animation Logic ---
  const triggerFlip = (newYear, newMonth) => {
    if (animating) return; 
    if (newYear === displayDate.year && newMonth === displayDate.month) return;

    const monthDiff = (newYear - displayDate.year) * 12 + (newMonth - displayDate.month);
    const isMulti = Math.abs(monthDiff) > 1;
    const duration = isMulti ? 2000 : 800; 
    
    let type = '';
    if (monthDiff > 1) type = 'multi-next';
    else if (monthDiff === 1) type = 'next';
    else if (monthDiff < -1) type = 'multi-prev';
    else if (monthDiff === -1) type = 'prev';

    setTargetDate({ year: newYear, month: newMonth });
    setFlipClass(`flip-${type}`);
    setFlipDuration(duration);
    setAnimating(true);

    setTimeout(() => {
      setDisplayDate({ year: newYear, month: newMonth });
      setTargetDate(null);
      setAnimating(false);
      setFlipClass('');
    }, duration); 
  };

  const handlePrevMonth = () => {
    const newMonth = displayDate.month === 0 ? 11 : displayDate.month - 1;
    const newYear = displayDate.month === 0 ? displayDate.year - 1 : displayDate.year;
    triggerFlip(newYear, newMonth);
  };
  
  const handleNextMonth = () => {
    const newMonth = displayDate.month === 11 ? 0 : displayDate.month + 1;
    const newYear = displayDate.month === 11 ? displayDate.year + 1 : displayDate.year;
    triggerFlip(newYear, newMonth);
  };

  const jumpToDate = (y, m) => triggerFlip(y, m);

  // Jump to Current Real-World Date
  const handleGoToCurrent = () => {
    jumpToDate(today.getFullYear(), today.getMonth());
  };

  // --- Day Handling ---
  const handleDayClick = (y, m, d) => {
    if (animating) return; 
    const k = dateKey(y, m, d);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(k); setRangeEnd(null);
    } else {
      if (compareDates(k, rangeStart) < 0) {
        setRangeEnd(rangeStart); setRangeStart(k);
      } else {
        setRangeEnd(k);
      }
    }
    setNoteFilter('selected'); 
  };

  const isInRange = (k) => {
    if (!rangeStart || !rangeEnd) return false;
    return compareDates(k, rangeStart) > 0 && compareDates(k, rangeEnd) < 0;
  };

  const getDayClasses = (k, dayOfWeek, isOtherMonth) => {
    const cls = ['day-cell'];
    if (!k) { cls.push('empty'); return cls.join(' '); }
    if (isOtherMonth) cls.push('other-month');
    if (dayOfWeek === 0 || dayOfWeek === 6) cls.push('weekend');
    if (k === todayStr) cls.push('today');
    if (k === rangeStart) { cls.push('selected-start'); if (rangeEnd) cls.push('range-start-edge'); }
    else if (k === rangeEnd) { cls.push('selected-end'); if (rangeStart) cls.push('range-end-edge'); }
    else if (isInRange(k)) cls.push('in-range');
    if (notes[k]) cls.push('has-note');
    return cls.join(' ');
  };

  const buildCellsFor = (year, month) => {
    const firstDay = getFirstDayOfMonth(year, month);
    const daysInMonth = getDaysInMonth(year, month);
    const prevMonthDays = getDaysInMonth(year, month - 1 < 0 ? 11 : month - 1);
    const cells = [];
    
    for (let i = 0; i < firstDay; i++) {
      const d = prevMonthDays - firstDay + i + 1;
      const pm = month === 0 ? 11 : month - 1;
      const py = month === 0 ? year - 1 : year;
      cells.push({ k: dateKey(py, pm, d), d, dayOfWeek: i, isOtherMonth: true });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = (firstDay + d - 1) % 7;
      cells.push({ k: dateKey(year, month, d), d, dayOfWeek: dow, isOtherMonth: false });
    }
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const nm = month === 11 ? 0 : month + 1;
      const ny = month === 11 ? year + 1 : year;
      const dow = (cells.length) % 7;
      cells.push({ k: dateKey(ny, nm, d), d, dayOfWeek: dow, isOtherMonth: true });
    }
    return cells;
  };

  const openNote = (noteId) => {
    const n = notes[noteId];
    setModal({ id: noteId, title: n.title, content: n.content, date: n.date || noteId, isNew: false });
  };

  const openNewNote = () => {
    const defaultDate = rangeStart || todayStr;
    setModal({ id: null, title: '', content: '', date: defaultDate, isNew: true });
  };

  const saveNote = () => {
    if (!modal) return;
    const id = modal.id || modal.date || todayStr;
    const updated = { ...notes, [id]: { title: modal.title || 'Untitled', content: modal.content, date: modal.date } };
    setNotes(updated);
    setModal(null);
  };

  const deleteNote = (id) => {
    const updated = { ...notes };
    delete updated[id];
    setNotes(updated);
    setModal(null);
  };

  const getDisplayNotes = () => {
    const all = Object.entries(notes).map(([k, v]) => ({ key: k, ...v }));
    all.sort((a, b) => compareDates(a.key, b.key));

    if (noteFilter === 'all') return all;
    if (noteFilter === 'year') return all.filter(n => parseKey(n.key).y === currentYear);
    if (noteFilter === 'month') {
      return all.filter(n => {
        const p = parseKey(n.key);
        return p.y === currentYear && p.m === currentMonth;
      });
    }
    if (rangeStart && rangeEnd) {
      return all.filter(n => compareDates(n.key, rangeStart) >= 0 && compareDates(n.key, rangeEnd) <= 0);
    } else if (rangeStart) {
      return all.filter(n => n.key === rangeStart);
    } else {
      return all.filter(n => n.key === todayStr);
    }
  };

  const renderCalendarPane = (year, month) => {
    const cells = buildCellsFor(year, month);
    return (
      <div className="cal-pane-content">
        <div className="cal-nav-bar">
          <h2 className="cal-month-title">{MONTHS[month]} {year}</h2>
          <div className="cal-controls">
            <button className="current-btn" onClick={handleGoToCurrent}>Current</button>
            <button className="nav-arrow" onClick={handlePrevMonth}>←</button>
            <button className="nav-arrow" onClick={handleNextMonth}>→</button>
          </div>
        </div>

        <div className="cal-grid-container">
          <div className="day-headers">
            {DAYS.map((d, i) => (
              <div key={d} className={`day-hdr ${i===0||i===6?'weekend':''}`}>{d}</div>
            ))}
          </div>
          <div className="days-grid">
            {cells.map((cell, i) => (
              <div
                key={i}
                className={getDayClasses(cell.k, cell.dayOfWeek, cell.isOtherMonth)}
                onClick={() => !cell.isOtherMonth && handleDayClick(...cell.k.split('-').map((v,j) => j===1?parseInt(v)-1:parseInt(v)))}
                title={notes[cell.k] ? notes[cell.k].title : ''}
              >
                <span className="day-number">{cell.d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const displayNotes = getDisplayNotes();

  return (
    <div className="app-container">
      
      {/* Theme Toggle Button */}
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

      <main className="main-content">
        <section className="notes-section">
          <div className="section-header">
            <h2 className="section-title">Notes</h2>
            <button className="icon-btn-add" onClick={openNewNote}>+ New</button>
          </div>

          <div className="notes-filters">
            {['selected', 'month', 'year', 'all'].map(filter => (
              <button 
                key={filter} 
                className={`filter-btn ${noteFilter === filter ? 'active' : ''}`}
                onClick={() => setNoteFilter(filter)}
              >
                {filter === 'selected' ? 'Selection' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="notes-list">
            {displayNotes.length === 0 ? (
              <div className="empty-state">
                No notes found.<br/>
                <span>Click + New to add one.</span>
              </div>
            ) : (
              displayNotes.map(note => {
                const isToday = note.key === todayStr;
                return (
                  <div key={note.key} className={`note-card ${isToday ? 'current-day-note' : ''}`} onClick={() => openNote(note.key)}>
                    {isToday && <div className="today-badge">Today</div>}
                    <div className="note-card-title">{note.title || 'Untitled'}</div>
                    <div className="note-card-date">{formatDisplayDate(note.key)}</div>
                    {note.content && <div className="note-card-preview">{note.content}</div>}
                  </div>
                );
              })
            )}
          </div>
        </section>

        <section className="calendar-section perspective-wrapper" style={{ '--flip-dur': `${flipDuration}ms` }}>
          
          <div className="calendar-page static-bottom">
            {renderCalendarPane(targetDate ? targetDate.year : displayDate.year, targetDate ? targetDate.month : displayDate.month)}
          </div>

          {animating && (
            <>
              {flipClass.includes('multi') && (
                <>
                  <div className={`calendar-page dummy-page ${flipClass} delay-2`}></div>
                  <div className={`calendar-page dummy-page ${flipClass} delay-1`}></div>
                </>
              )}
              
              <div className={`calendar-page flipping-top ${flipClass}`}>
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

      </main>

      <NoteModal modal={modal} setModal={setModal} saveNote={saveNote} deleteNote={deleteNote} />
    </div>
  );
}