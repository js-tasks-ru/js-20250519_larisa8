/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const parts = path.split('.');

  function getPropertyByPathIndex(obj, index) {
    if (!obj) {
      return;
    }

    const propertyName = parts[index];
    const last = parts.length - 1;

    if (index === last) {
      return getOwnProperty(obj, propertyName);

    } else {
      index++;
      obj = obj[propertyName];

      return getPropertyByPathIndex(obj, index);
    }
  }

  function getOwnProperty (obj, key) {
    if (Object.hasOwn(obj, key)) {
      return obj[key];  
    }
  }

  return function(obj) {
    let index = 0;
    return getPropertyByPathIndex(obj, index);
  };
}