import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NotesSection from './components/NotesSection';
import CalendarSection from './components/CalendarSection';
import NoteModal from './components/NoteModal';
import { 
  MONTHS, DAYS, HERO_IMAGES, getDaysInMonth, getFirstDayOfMonth, 
  dateKey, parseKey, compareDates, loadNotes, saveNotesToLocal 
} from './utils/helpers';
import './assets/App.css';

export default function App() {
  const today = new Date();
  const todayStr = dateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const [theme, setTheme] = useState(() => localStorage.getItem('wall-cal-theme') || 'light');

  // animation engine states
  const [displayDate, setDisplayDate] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [targetDate, setTargetDate] = useState(null); 
  const [animating, setAnimating] = useState(false);
  const [slideClass, setSlideClass] = useState(''); 
  const [slideDuration, setSlideDuration] = useState(800); 

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

  useEffect(() => {
    localStorage.setItem('wall-cal-theme', theme);
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [theme]);

  useEffect(() => { saveNotesToLocal(notes); }, [notes]);

  // clean up dropdowns if user clicks randomly on the screen
  useEffect(() => {
    const closeDropdowns = () => {
      setShowYearPicker(false);
      setShowMonthPicker(false);
    };
    document.addEventListener('click', closeDropdowns);
    return () => document.removeEventListener('click', closeDropdowns);
  }, []);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  const triggerSlide = (newYear, newMonth) => {
    if (animating) return; 
    if (newYear === displayDate.year && newMonth === displayDate.month) return;

    const monthDiff = (newYear - displayDate.year) * 12 + (newMonth - displayDate.month);
    const isMulti = Math.abs(monthDiff) > 1;
    const duration = isMulti ? 2000 : 750; 
    
    let type = '';
    if (monthDiff > 1) type = 'multi-next';
    else if (monthDiff === 1) type = 'next';
    else if (monthDiff < -1) type = 'multi-prev';
    else if (monthDiff === -1) type = 'prev';

    setTargetDate({ year: newYear, month: newMonth });
    setSlideClass(`slide-${type}`);
    setSlideDuration(duration);
    setAnimating(true);

    setTimeout(() => {
      setDisplayDate({ year: newYear, month: newMonth });
      setTargetDate(null);
      setAnimating(false);
      setSlideClass('');
    }, duration); 
  };

  const handlePrevMonth = () => {
    const newMonth = displayDate.month === 0 ? 11 : displayDate.month - 1;
    const newYear = displayDate.month === 0 ? displayDate.year - 1 : displayDate.year;
    triggerSlide(newYear, newMonth);
  };
  
  const handleNextMonth = () => {
    const newMonth = displayDate.month === 11 ? 0 : displayDate.month + 1;
    const newYear = displayDate.month === 11 ? displayDate.year + 1 : displayDate.year;
    triggerSlide(newYear, newMonth);
  };

  const jumpToDate = (y, m) => triggerSlide(y, m);
  const handleGoToCurrent = () => jumpToDate(today.getFullYear(), today.getMonth());

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

  // rendering the actual grid layout
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

  return (
    <div className="app-container">
      <Header 
        theme={theme} toggleTheme={toggleTheme} heroImg={heroImg} 
        currentYear={currentYear} currentMonth={currentMonth}
        showYearPicker={showYearPicker} setShowYearPicker={setShowYearPicker}
        showMonthPicker={showMonthPicker} setShowMonthPicker={setShowMonthPicker}
        jumpToDate={jumpToDate}
      />

      <main className="main-content">
        <NotesSection 
          openNewNote={openNewNote} noteFilter={noteFilter} setNoteFilter={setNoteFilter}
          displayNotes={getDisplayNotes()} todayStr={todayStr} openNote={openNote}
        />

        <CalendarSection 
          slideDuration={slideDuration} targetDate={targetDate} displayDate={displayDate}
          animating={animating} slideClass={slideClass} renderCalendarPane={renderCalendarPane}
          rangeStart={rangeStart} rangeEnd={rangeEnd} setRangeStart={setRangeStart} setRangeEnd={setRangeEnd}
        />
      </main>

      <NoteModal modal={modal} setModal={setModal} saveNote={saveNote} deleteNote={deleteNote} />
    </div>
  );
}