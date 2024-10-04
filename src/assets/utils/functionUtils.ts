export const isFunction = (functionToCheck: any) => {
  return (
    functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
  );
};
