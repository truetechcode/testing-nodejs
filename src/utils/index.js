export function removeEmptyProps(obj) {
  const result = {};
  Object.keys(obj).forEach(key => {
    if (Boolean(obj[key])) {
      result[key] = obj[key];
    }
  });
  return result;
}

export function getRandomInteger(min = 0, max = Number.MAX_SAFE_INTEGER) {
  return Math.floor(Math.random() * max + min);
}
