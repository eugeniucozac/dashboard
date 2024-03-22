import * as utils from 'utils';
import camelCase from 'lodash/camelCase';

const utilsExcel = {
  removeLineBreaksWithinCell: (string) => {
    const output = [];

    string.split('"').forEach((s, i) => {
      if (utils.number.isOdd(i)) {
        output.push(s.split('\n').join(''));
      } else {
        output.push(s);
      }
    });

    return output.join('');
  },

  splitCellsByRow: (string) => {
    const rowArr = string.trim().split('\n');

    return rowArr.map((r) => r.split('\t'));
  },

  getColumns: (cellsByRow) => {
    if (!cellsByRow || !utils.generic.isValidArray(cellsByRow, true)) return [];

    const rowHeaders = cellsByRow[0];
    return utils.generic.isValidArray(rowHeaders, true) ? rowHeaders.map((h) => camelCase(h)) : [];
  },

  getObjects: (cellsByRow) => {
    if (!cellsByRow || !utils.generic.isValidArray(cellsByRow, true)) return [];

    const headers = cellsByRow[0] || [];

    return cellsByRow.slice(1).map((row) => {
      const obj = {};

      headers.forEach((h, i) => {
        obj[camelCase(headers[i])] = row[i];
      });

      return obj;
    });
  },
};

export default utilsExcel;
