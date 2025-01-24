import React, { useState, useEffect, useRef } from 'react';

const FormulaInput = React.memo(({ selectedCell, sheetData, onFormulaChange, }) => {
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    useEffect(() => {
         if(selectedCell?.row != null && selectedCell?.col != null){
           const cell = sheetData.data?.[selectedCell.row]?.[selectedCell.col];
            setInputValue(cell?.formula || cell?.value || "");
        } else {
            setInputValue("");
        }
     }, [selectedCell, sheetData]);


    useEffect(() => {
     if(selectedCell?.row != null && selectedCell?.col != null && inputRef.current){
          inputRef.current.focus();
      }
     }, [selectedCell]);

 const handleChange = (e) => {
     setInputValue(e.target.value);
 };

const handleBlur = (e) => {
      onFormulaChange(e.target.value)
  };
return (
    <div className="formula-bar">
        <label htmlFor='formula'>Formula</label>
        <input
         type="text"
         ref = {inputRef}
        value={inputValue}
         onChange={handleChange}
          onBlur={handleBlur}
       />
      </div>
    );
});

export default FormulaInput;