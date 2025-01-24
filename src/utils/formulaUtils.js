import { isNumeric } from './dataUtils';

const parseCellReference = (reference, sheetData) => {
     const colRegex = /[A-Z]+/;
      const rowRegex = /\d+/;
      const colMatch = reference.match(colRegex);
      const rowMatch = reference.match(rowRegex);
       if (!colMatch || !rowMatch) {
           return null;
        }
       const colLabel = colMatch[0];
       const rowNumber = parseInt(rowMatch[0], 10);
        let colNumber = 0;
         for (let i = 0; i < colLabel.length; i++) {
             colNumber = colNumber * 26 + (colLabel.charCodeAt(i) - 64);
        }
   return sheetData.data?.[rowNumber]?.[colNumber]?.value;
};

const parseRange = (range, sheetData) => {
      const rangeRegex = /([A-Z]+\d+):([A-Z]+\d+)/; // Added regex for range (A1:B2)
        const match = range.match(rangeRegex);

    if(match) {
         const startCell = match[1];
         const endCell = match[2];
            const startColRegex = /[A-Z]+/;
            const startRowRegex = /\d+/;

            const startColMatch = startCell.match(startColRegex);
            const startRowMatch = startCell.match(startRowRegex);

              if (!startColMatch || !startRowMatch) {
                  return null;
               }

              const startColLabel = startColMatch[0];
              const startRowNumber = parseInt(startRowMatch[0], 10);
               let startColNumber = 0;

              for (let i = 0; i < startColLabel.length; i++) {
                 startColNumber = startColNumber * 26 + (startColLabel.charCodeAt(i) - 64);
               }

            const endColMatch = endCell.match(startColRegex);
            const endRowMatch = endCell.match(startRowRegex);

            if (!endColMatch || !endRowMatch) {
                   return null;
              }
              const endColLabel = endColMatch[0];
               const endRowNumber = parseInt(endRowMatch[0], 10);
               let endColNumber = 0;
              for (let i = 0; i < endColLabel.length; i++) {
                endColNumber = endColNumber * 26 + (endColLabel.charCodeAt(i) - 64);
              }
        const cellValues = [];
          for (let row = startRowNumber; row <= endRowNumber; row++){
              for(let col = startColNumber; col <= endColNumber; col++){
                 const cellValue = sheetData.data?.[row]?.[col]?.value;
                   if(isNumeric(cellValue))
                     cellValues.push(parseFloat(cellValue))
             }
           }
      return cellValues
    }
    const cellReferences = range.split(',').map(cell => cell.trim());
     const cellValues = cellReferences.map(ref => {
          const value = parseCellReference(ref, sheetData);
            if(isNumeric(value))
              return parseFloat(value);
              return null;
       }).filter(value => value != null);
      return cellValues;

}


const evaluateFunction = (formula, sheetData) => {
    const functionNameRegex = /([A-Z]+)\(/i; // case-insensitive
      const rangeRegex = /\(([^)]+)\)/; // Capture everything inside the parentheses

    const functionMatch = formula.match(functionNameRegex);
    const rangeMatch = formula.match(rangeRegex);
    if (!functionMatch || !rangeMatch) {
        return null;
    }

    const functionName = functionMatch[1].toUpperCase();
      const range = rangeMatch[1].trim();

      if (!range) return null;
       const values = parseRange(range, sheetData);

   switch (functionName) {
         case 'SUM':
            if (values) {
              return values.reduce((acc, curr) => acc + curr, 0);
             }
            return 0;
         case 'AVERAGE':
            if(values && values.length > 0){
                const sum = values.reduce((acc, curr) => acc + curr, 0);
                return sum / values.length;
             }
            return 0;
         case 'MAX':
            if(values && values.length > 0){
                return Math.max(...values);
            }
           return 0;
         case 'MIN':
            if(values && values.length > 0){
              return Math.min(...values);
             }
             return 0;
          case 'COUNT':
             if(values){
                 return values.length;
              }
              return 0;
       default:
           return null;
    }
};

export const evaluateFormula = (formula, sheetData) => {
    if (typeof formula !== 'string') {
        return "";
    }
     formula = formula.trim();
      if (!formula.startsWith('=')) {
          return formula;
     }
    formula = formula.substring(1);
      //check if formula contains a function.
     if (formula.includes('(')) {
         return evaluateFunction(formula, sheetData);
    }
   const additionRegex = /([A-Z]+\d+)\+([A-Z]+\d+)/;
      const additionMatch = formula.match(additionRegex);
    if(additionMatch) {
          const cell1 = parseCellReference(additionMatch[1], sheetData);
          const cell2 = parseCellReference(additionMatch[2], sheetData);
          if(cell1 && cell2 && isNumeric(cell1) && isNumeric(cell2)){
              return parseFloat(cell1) + parseFloat(cell2);
            }
         return null;
     }
     const multiplicationRegex = /([A-Z]+\d+)\*([A-Z]+\d+)/;
       const multiplicationMatch = formula.match(multiplicationRegex);
     if(multiplicationMatch) {
           const cell1 = parseCellReference(multiplicationMatch[1], sheetData);
           const cell2 = parseCellReference(multiplicationMatch[2], sheetData);
           if(cell1 && cell2 && isNumeric(cell1) && isNumeric(cell2)){
              return parseFloat(cell1) * parseFloat(cell2);
           }
         return null;
    }
    const value = parseCellReference(formula, sheetData)
    return value;
};