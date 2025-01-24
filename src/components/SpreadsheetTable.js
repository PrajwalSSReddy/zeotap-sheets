import React, { useState, useEffect, useCallback, useRef } from 'react';
import SpreadsheetCell from './SpreadsheetCell';
 import { evaluateFormula } from '../utils/formulaUtils';
  import FormulaInput from './FormulaInput';
import * as XLSX from 'xlsx';

 const SpreadsheetTable = ({ sheetData, setSheetData, toggleTheme, theme }) => {
    const [selectedCell, setSelectedCell] = useState({ row: null, col: null });
    const [formulaValue, setFormulaValue] = useState('');
    const dragDropRef = useRef(null);
    const fileInputRef = useRef(null);
 useEffect(() => {
        if(selectedCell.row != null && selectedCell.col != null){
            const cell = sheetData.data?.[selectedCell.row]?.[selectedCell.col]
            setFormulaValue(cell?.formula || "");
        } else {
            setFormulaValue('');
        }
    }, [selectedCell, sheetData]);
    const handleFormulaUpdate = useCallback((row, col, formula) => {
      setSheetData(prevSheetData => {
        const updatedSheetData = { ...prevSheetData};
          if (!updatedSheetData.data[row]) {
               updatedSheetData.data[row] = {};
           }
            if(updatedSheetData.data[row][col]?.formula == formula ) {
              return updatedSheetData
            }
            updatedSheetData.data[row][col] = {
               value: updatedSheetData.data[row][col]?.value || '',
                formula: formula
             }
          return updatedSheetData
        })
   }, [setSheetData]);
     const handleCellChange = useCallback((row, col, value, formula) => {
        setSheetData(prevSheetData => {
            const updatedSheetData = { ...prevSheetData};
             if (!updatedSheetData.data[row]) {
               updatedSheetData.data[row] = {};
             }
           if(updatedSheetData.data[row][col]?.value == value && updatedSheetData.data[row][col]?.formula == formula ) {
                return updatedSheetData;
             }
             updatedSheetData.data[row][col] = { value, formula: formula || '' };
            return updatedSheetData;
      });
     }, [setSheetData]);

     const handleFormulaChange = useCallback((formula) => {
          if(selectedCell.row != null && selectedCell.col != null){
            handleFormulaUpdate(selectedCell.row, selectedCell.col, formula)
         }
     }, [selectedCell, handleFormulaUpdate]);

      const handleSelectCell = useCallback((row, col) => {
       setSelectedCell({row, col});
    }, [setSelectedCell]);
    const rows = Array.from({ length: sheetData.rows }, (_, rowIndex) => {
      const rowCells = Array.from({ length: sheetData.cols }, (_, colIndex) => {
        const cellData = sheetData.data?.[rowIndex + 1]?.[colIndex + 1] || {};
        return (
          <SpreadsheetCell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex + 1}
            col={colIndex + 1}
            cellData={cellData}
            onCellChange={handleCellChange}
            isSelected={selectedCell.row === rowIndex + 1 && selectedCell.col === colIndex + 1}
            onSelect={handleSelectCell}
            sheetData = {sheetData}
            setSheetData = {setSheetData}
            onFormulaChange = {handleFormulaUpdate}
          />
        );
     });
        return <tr key={rowIndex}><td className='header-cell'>{rowIndex + 1}</td> {rowCells}</tr>
     });
    const handleOpenFromFile =  (event)=>{
         const file = event.target.files[0];
         if(file){
           handleFile(file);
         }
     fileInputRef.current.value = "";
    }
   const handleDragOver = (e) => {
         e.preventDefault();
   };
   const handleDrop = (e) => {
       e.preventDefault();
      const file = e.dataTransfer.files[0]
         if(file){
            handleFile(file)
        }
    };
   const handleFile = (file) => {
      const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
           try{
              if (file.name.endsWith('.csv')) {
                  const sheetData =  parseCSV(data);
                    setSheetData(sheetData);
                } else if(file.name.endsWith('.xlsx')){
                   const sheetData = parseExcel(data);
                    setSheetData(sheetData);
               }
           } catch(e){
              console.error('Error parsing file', e)
          }
        }
        reader.readAsBinaryString(file);
 }
   const parseCSV = (csvData) => {
      const rows = csvData.split('\n');
         const sheetData = {
            rows: 0,
            cols: 0,
           data: {}
         }
       if(rows.length > 0){
           const headerRow = rows[0].split(',').filter(value => value != undefined && value != null && value != "").map(value => value.trim());
           sheetData.cols = headerRow.length;
        for(let i=1; i < rows.length; i++){
         const row = rows[i].split(',').filter(value => value != undefined && value != null && value != "").map(value => value.trim());
          if(row.length > 0){
            const rowNumber = i;
              sheetData.rows = i;
                sheetData.data[rowNumber] = {};
                for (let j = 0; j < headerRow.length; j++){
                  const colNumber = j + 1;
                sheetData.data[rowNumber][colNumber] = { value : row[j] || '', formula:''};
                }
             }
         }

        }
        return sheetData;
   }
 const parseExcel = (data) => {
        const workbook = XLSX.read(data, { type: 'binary' });
       const sheetName = workbook.SheetNames[0];
       const worksheet = workbook.Sheets[sheetName];
       const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval:""});
        const sheetData = {
            rows:0,
            cols:0,
            data:{}
        };
       if (jsonData.length > 0) {
        const headerRow = jsonData[0].filter(value => value != undefined && value != null && value != "").map(value => value.trim());
            sheetData.cols = headerRow.length;
          for(let i=1; i < jsonData.length; i++){
             const row = jsonData[i].filter(value => value != undefined && value != null && value != "").map(value => value.trim());
              if(row.length > 0){
                   const rowNumber = i;
                    sheetData.rows = i;
                    sheetData.data[rowNumber] = {};
                for (let j = 0; j < headerRow.length; j++){
                     const colNumber = j + 1;
                    sheetData.data[rowNumber][colNumber] = { value : row[j] || '', formula:''};
                    }
                }
          }
        }
     return sheetData;
    };

    const handleSaveToCSV = () => {
         const csvData = [];
        const headerRow =  [];
          for(let i=0; i < sheetData.cols; i++){
              headerRow.push(columnName(i))
           }
        csvData.push(headerRow);
        for (let row = 1; row <= sheetData.rows; row++) {
            const rowData = [];
           for (let col = 1; col <= sheetData.cols; col++) {
               const cell = sheetData.data?.[row]?.[col];
              let value = '';
              if(cell?.formula) {
                value =  evaluateFormula(cell?.formula, sheetData)
              } else {
                    value = cell?.value
                }
               rowData.push(value);
          }
            csvData.push(rowData);
        }
       const csv = csvData.map(row => row.join(',')).join('\n');
       const blob = new Blob([csv], { type: 'text/csv' });
       const url = URL.createObjectURL(blob);
         const link = document.createElement('a');
         link.href = url;
          link.download = 'spreadsheet.csv';
           document.body.appendChild(link);
          link.click();
        document.body.removeChild(link);
          URL.revokeObjectURL(url);

    }
    const handleSaveToExcel = () => {
        const wb = XLSX.utils.book_new();
         const wsData = [];
         const headerRow =  [];
          for(let i=0; i < sheetData.cols; i++){
              headerRow.push(columnName(i))
            }
          wsData.push(headerRow);
        for (let row = 1; row <= sheetData.rows; row++) {
              const rowData = [];
              for (let col = 1; col <= sheetData.cols; col++) {
                 const cell = sheetData.data?.[row]?.[col];
               let value = '';
               if(cell?.formula) {
                 value =  evaluateFormula(cell?.formula, sheetData)
                } else {
                     value = cell?.value
                  }
                rowData.push(value);
                }
         wsData.push(rowData)
        }
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
         XLSX.writeFile(wb, 'spreadsheet.xlsx');
     };

const columnName = (n) => {
    let name = "";
      while (n >= 0) {
          name = String.fromCharCode(65 + (n % 26)) + name;
          n = Math.floor(n / 26) - 1;
            if(n < 0){
                break;
           }
      }
    return name;
    }

  return (
      <div className={`spreadsheet-container ${theme}`}
       ref = {dragDropRef}
       onDragOver={handleDragOver}
        onDrop = {handleDrop}
    >
         <div style={{marginTop: "10px"}}>
            <button onClick={handleSaveToCSV}>Save as CSV</button>
             <button onClick={handleSaveToExcel}>Save as Excel</button>
              <button style = {{marginLeft : "10px"}} onClick = {() => {fileInputRef.current.click()}} >Open</button>
               <input
                    type="file"
                     ref = {fileInputRef}
                     style = {{display: "none"}}
                      onChange = {handleOpenFromFile}
                    accept = ".csv, .xlsx"
                />
             <button  style = {{marginLeft : "10px"}}onClick={toggleTheme}>
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
             </button>
           </div>
          <FormulaInput
            selectedCell = {selectedCell}
            sheetData = {sheetData}
            onFormulaChange={handleFormulaChange}
          />
        <div className='sheet-container'>
            <table className="sheet">
            <thead>
              <tr>
                <th className='header-cell'></th>
                {Array.from({ length: sheetData.cols }, (_, index) => (
                    <th key={index} className="header-cell">{columnName(index)}</th>
                 ))}
             </tr>
           </thead>
            <tbody>
               {rows}
              </tbody>
           </table>
        </div>
     </div>
  );
};

export default SpreadsheetTable;