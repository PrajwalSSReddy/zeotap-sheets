import React, { useState, useEffect } from 'react';
import SpreadsheetTable from './components/SpreadsheetTable';

const App = () => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('appTheme') || 'light';
  });
   const [sheetData, setSheetData] = useState({
        rows: 20,
        cols: 26,
        data: {},
     });

  useEffect(() => {
    localStorage.setItem('appTheme', theme);
  }, [theme]);

 const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app ${theme}`}>
     <SpreadsheetTable  toggleTheme = {toggleTheme} sheetData={sheetData} setSheetData={setSheetData} theme={theme} />
    </div>
  );
};


export default App;