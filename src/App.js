import React from 'react';
import logo from './logo.svg';
import './App.css';
import CovaChart from './charts/CovaChart';
import ChartNotes from './ChartNotes/ChartNotes';
import WorldMapChart from './charts/WorldMapChart';
import data from './GeoJson/GeoJson.json'

function App() {
  return (
    <div className="App">
      {/* <ChartNotes /> */}
      <WorldMapChart data={data} />
      {/* <CovaChart /> */}
    </div>
  );
}

export default App;
