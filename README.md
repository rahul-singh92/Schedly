# Interactive Wall Calendar

A beautifully designed, interactive calendar application built with React. This project merges modern UI/UX principles with satisfying, physical-feeling interactions—including a custom 2D "page-tossing" animation engine, dynamic note-taking, and seamless dark/light mode support.

## Features

* **Custom Sliding Animation Engine:** Flipping through months mimics the physical action of tossing pages or counting banknotes, complete with staggered multi-page cascade effects for long jumps in time.
* **Persistent Note-Taking:** Click any date (or select a range) to add, edit, and manage notes. Data is saved locally so you never lose your thoughts.
* **Dynamic Filtering:** Easily filter notes by the currently selected date range, the active month, the active year, or view all notes at once.
* **Seamless Theming:** Includes a fully realized Bright Mode and a deep, eye-easing Night Mode, persisting to your preferences.
* **Contextual Desktop "Wall" View:** On desktop, the calendar rests on a subtle wall texture with a deep drop-shadow. On mobile, it smartly flattens and stacks for a native app feel.
* **Custom Geometry:** Utilizes inline SVGs and CSS `clip-path` for unique layouts, like the curved-bottom hero image and the diamond-shaped dropdowns.

---

## Technical & Design Choices

### 1. Zero-Dependency Animation
Instead of relying on heavy JavaScript animation libraries (like Framer Motion or GSAP), the sliding animation engine is built entirely using **native CSS keyframes and transitions**, orchestrated by React state. 
* **Why?** This ensures hardware-accelerated, buttery-smooth 60fps animations even on lower-end mobile devices, keeping the bundle size incredibly small.

### 2. CSS Variable Architecture
Theming is handled strictly through CSS Custom Properties (`:root` variables) toggled via a class on the `<body>` tag.
* **Why?** This allows the browser to repaint the theme instantly without requiring React to re-render the entire component tree, eliminating "flash of unstyled content" (FOUC) and making the codebase highly maintainable.

### 3. Component Modularity
The application is broken down into specific, single-responsibility components (`Header.jsx`, `NotesSection.jsx`, `CalendarSection.jsx`). 
* **Why?** The initial prototype was a single monolithic file. Separating concerns makes the code significantly easier to read, debug, and scale if new features (like backend syncing) are added later.

### 4. Local Storage Persistence
User notes and theme preferences are synced to the browser's `localStorage` via React's `useEffect` hook.
* **Why?** It provides an immediate, database-free way to ensure the app is fully functional and retains user data between sessions, keeping the architecture purely frontend for easy deployment.

---

## Project Structure

```text
/public
  └── images/                  # Store your 12 month images here (jan.jpg, feb.jpg...)

/src
  ├── assets/
  │   └── App.css              # Global styles, variables, and animation keyframes

  ├── components/
  │   ├── Header.jsx           # Hero image, theme toggle, and dropdowns
  │   ├── NotesSection.jsx     # Left-hand panel for managing and filtering notes
  │   ├── CalendarSection.jsx  # Right-hand panel with calendar grid and animations
  │   └── NoteModal.jsx        # Modal for creating and editing notes

  ├── utils/
  │   └── helpers.js           # Utility functions, date logic, and constants

  ├── App.js                   # Main app component (state + layout)
  ├── index.js                 # React entry point
  └── index.css                # Global base styles (optional)
```

---


## How to Run Locally

This project is built using **Create React App (CRA)**.

### 📋 Prerequisites

Make sure you have the following installed on your machine:

* **Node.js** (recommended version: LTS)
* **npm** (comes with Node.js)

---

### Step-by-Step Setup

1. **Create a new React app (if starting fresh):**
   Open your terminal and run:

   ```bash
   npx create-react-app schedly
   ```

2. **Navigate into the project directory:**

   ```bash
   cd schedly
   ```

3. **Install dependencies (if not already installed):**

   ```bash
   npm install
   ```

4. **Start the development server:**

   ```bash
   npm start
   ```

---

### Running the App

* After running `npm start`, your app will automatically open in your browser.
* If it doesn’t, open:

  ```
  http://localhost:3000
  ```
