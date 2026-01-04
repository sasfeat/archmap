# ArchMap

A React application that displays architectural data on an interactive map. Each entry from `data.json` is shown as a point on the map with detailed information available in popups.

## Features

- Interactive map using Leaflet and React-Leaflet
- All architectural locations from `data.json` displayed as markers
- Clickable markers with popups showing:
  - Title
  - Author(s)
  - City
  - Country
  - Date
- Automatic map bounds adjustment to show all markers
- Responsive design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure `data.json` is in the `public` folder (it should already be there)

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to the URL shown in the terminal (usually `http://localhost:5173`)

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
archmap/
├── public/
│   └── data.json          # Architectural data
├── src/
│   ├── App.jsx            # Main app component
│   ├── App.css            # App styles
│   ├── Map.jsx            # Map component with markers
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── package.json           # Dependencies
└── vite.config.js         # Vite configuration
```

## Technologies Used

- React 18
- Vite
- React-Leaflet
- Leaflet
- OpenStreetMap tiles

