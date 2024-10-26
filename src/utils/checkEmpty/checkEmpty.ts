type valueType = any;

export const checkEmpty = (value: valueType) => {
  if (!value) {
    return true;
  } else if (typeof value === 'object') {
    if (Array.isArray(value)) return value.length === 0;
    else return Object.keys(value).length === 0;
  } else return false;
};
