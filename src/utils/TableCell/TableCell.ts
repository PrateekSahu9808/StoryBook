export const prepareData = (dataObj: any, columnObj: any) => {
  let cellData = dataObj[columnObj.accessor];
  if (columnObj.cell) {
    return columnObj.cell({
      value: cellData,
      row: dataObj,
      column: columnObj.accessor,
    });
  } else if (columnObj.accessor) {
    return cellData;
  } else if (cellData && typeof cellData !== 'object') {
    return cellData;
  } else {
    return '--';
  }
};
