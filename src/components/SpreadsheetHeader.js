import React from 'react';

const SpreadsheetHeader = ({ cols }) => {
  const headerCells = Array.from({ length: cols }, (_, index) => {
    const colLabel = String.fromCharCode(65 + index); // A, B, C...
    return <div key={index} className="header-cell">{colLabel}</div>;
  });

  return (
    <div className="header-row">
      <div className='header-cell'></div>
      {headerCells}
    </div>
  );
};

export default SpreadsheetHeader;