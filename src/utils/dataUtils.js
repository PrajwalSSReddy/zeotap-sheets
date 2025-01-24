export const trim = (str) => {
    if(typeof str !== 'string') return str;
    return str.trim();
  };

  export const upper = (str) => {
    if(typeof str !== 'string') return str;
    return str.toUpperCase();
  };

  export const lower = (str) => {
      if(typeof str !== 'string') return str;
    return str.toLowerCase();
  };

  export const isNumeric = (value) => {
      return !isNaN(parseFloat(value)) && isFinite(value);
  }