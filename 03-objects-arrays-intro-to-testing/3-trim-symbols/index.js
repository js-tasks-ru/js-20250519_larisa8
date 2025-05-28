/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
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