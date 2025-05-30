/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols1(string, size) {
  if (size === 0) {
    return '';
  }

  if (!size) {
    return string;
  }
  
  let result = '';
  const len = string.length;

  const isQuantitySmallerThanSize = (quantity) => quantity < size;

  function addSymbolToResult(symbol, quantity) {
    if (isQuantitySmallerThanSize(quantity)) {
      result += symbol;
    }
  }

  for (let i = 0; i < len; i++) {

    let quantity = 0;
    for (let j = i + 1; j <= len; j++) {

      if (string[i] !== string[j]) {
        addSymbolToResult(string[i], quantity);

        break;
      } 

      quantity++;
    }
    
  }

  return result;
}

export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }

  if (!size) {
    return string;
  }

  let result = '';
  let quantity = 0;
  let prevChar = string[0];

  const addSymbolToResult = (index, count) => {
    result += string[index];
    prevChar = string[index];
    quantity = count;
  };

  for (let i = 0; i < string.length; i++) {
    if (quantity < size && prevChar === string[i]) {
      addSymbolToResult(i, quantity + 1);
    }

    if (prevChar !== string[i]) {
      addSymbolToResult(i, 1);
    }
  }

  return result;
}