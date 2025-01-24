import React, { useRef, useState, useEffect, useLayoutEffect, useMemo } from 'react';
import { evaluateFormula } from '../utils/formulaUtils';
import { trim, upper, lower } from '../utils/dataUtils';

const SpreadsheetCell = React.memo(({ row, col, cellData, onCellChange, isSelected, onSelect, sheetData, setSheetData, onFormulaChange }) => {
    const [cellValue, setCellValue] = useState(cellData?.value || "");
     const inputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
   const evaluatedValue = useMemo(() => {
      if (cellData?.formula) {
         return evaluateFormula(cellData.formula, sheetData);
     }
     return null;
   }, [cellData?.formula, sheetData]);
useEffect(()=>{
     if (cellData?.formula) {
         setCellValue(evaluatedValue == null ? '' : evaluatedValue)
       } else {
         setCellValue(cellData?.value)
       }
     }, [evaluatedValue, cellData?.value, cellData?.formula])
       useLayoutEffect(() => {
         if (isSelected && inputRef.current) {
              inputRef.current.focus();
         }
       }, [isSelected]);

   const handleInputChange = (e) => {
        let value = e.target.value;
          if (value.startsWith('=')) {
         }
       else{
          if(value.startsWith(' ')){
            value = trim(value);
         }
       if(value.startsWith('upper(') || value.startsWith('UPPER(')){
            value = upper(value.substring(6, value.length -1))
         }
        if(value.startsWith('lower(') || value.startsWith('LOWER(')){
             value = lower(value.substring(6, value.length -1))
         }
       }
        setCellValue(value);
     onCellChange(row, col, value, cellData.formula);
   };
const handleInputBlur = (e) => {
       let value = e.target.value;
       if (value.startsWith('=')) {
         onFormulaChange(row, col, value)
        } else {
            onCellChange(row, col, value);
        }
        setIsEditing(false);
  }

    const handleCellClick = () => {
     onSelect(row, col);
     setIsEditing(true);
    }

      const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
          onSelect(row + 1, col);
          if (inputRef.current) {
             inputRef.current.focus();
           }
         } else if (e.key === 'Tab') {
           e.preventDefault();
            const nextCol = e.shiftKey ? col - 1 : col + 1;
           if (nextCol > 0 && nextCol <= sheetData.cols){
              onSelect(row, nextCol);
                if (inputRef.current) {
                    inputRef.current.focus();
                }
             }

      } else if (e.key === 'ArrowUp') {
         e.preventDefault();
         if(row > 1){
           onSelect(row - 1, col);
           if (inputRef.current) {
             inputRef.current.focus();
            }
         }
      }else if (e.key === 'ArrowDown') {
          e.preventDefault();
           if(row < sheetData.rows){
                onSelect(row + 1, col);
                  if (inputRef.current) {
                        inputRef.current.focus();
                  }
            }
      }else if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if(col > 1){
            onSelect(row, col -1);
              if (inputRef.current) {
                 inputRef.current.focus();
             }
        }
     } else if (e.key === 'ArrowRight') {
           e.preventDefault();
           if(col < sheetData.cols){
              onSelect(row, col+ 1);
              if (inputRef.current) {
                   inputRef.current.focus();
              }
           }
       }
    };

    return (
        <td className={isSelected ? "selected-cell" : "" } onClick={handleCellClick}>
            <input
               ref = {inputRef}
               type="text"
              value={cellValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
               style = {{pointerEvents: isEditing ? "all" : "none"}}
               onKeyDown={handleKeyDown}
             />
        </td>
    );
});

export default SpreadsheetCell;