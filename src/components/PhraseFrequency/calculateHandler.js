/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const _ = require('lodash');
const exceljs = require('exceljs');
const moment = require('moment');
const FileSaver = require('file-saver');

//* Create array of objects data
// #region
const getRows = (input) => {
  let rows = input.split('\n'); //* Split input by row
  rows = _.compact(rows); //* Remove empty elements from array, if any
  rows = _.map(rows, (curr) => curr.split('\t')); //* Split every element by column
  rows = _.drop(rows); //* Drop first element from array (headers)

  return rows;
};

const getPhrases = (words) => {
  const phrases = [];

  for (let i = 0; i < words.length; i += 1) {
    //* Iterate over each row
    let phrase = words[i].trim();
    phrases.push(phrase); //* Add current single word to phrase

    for (let j = i + 1; j < words.length; j += 1) {
      phrase += ` ${words[j]}`;
      phrases.push(phrase); //* Add each word until last word
    }
  }

  return phrases;
};

const getDataAOO = (headers, rows) => {
  const output = [];

  _.forEach(rows, (row) => {
    row.splice(1, 0, '');
    const words = row[0].split(' '); //* Split search term by word

    const rowObj = {}; //* Create row object
    for (const i in row) {
      rowObj[headers[i]] = row[i];
    }

    const phrases = getPhrases(words);

    _.forEach(phrases, (phrase) => {
      const index = _.findIndex(output, (curr) => curr[headers[0]] === phrase);

      if (index === -1) {
        //* If phrase isn't in output
        const obj = {};
        for (let i = 0; i < headers.length; i += 1) {
          if (i === 0) {
            obj[headers[i]] = phrase;
          } else if (i === 1) {
            obj[headers[i]] = phrase.split(' ').length;
          } else {
            obj[headers[i]] = parseFloat(rowObj[headers[i]]);
          }
        }

        output.push(obj);
      } else {
        //* If phrase is in output
        for (const prop in output[index]) {
          if (prop !== headers[0] && prop !== headers[1]) {
            output[index][prop] += parseFloat(rowObj[prop]);
          }
        }
      }
    });
  });

  return output;
};
// #endregion

//* Add rows to sheet
const addRows = (sheet, dataAOO) => {
  const newSheet = sheet;
  _.forEach(dataAOO, (obj, i) => {
    const row = [];
    _.forEach(obj, (val) => {
      row.push(val);
    });
    row.push({ formula: `=IFERROR(D${i + 2}/C${i + 2},"NA")`, numFmt: '0.00%' });
    row.push({ formula: `=IFERROR(E${i + 2}/F${i + 2},9)`, numFmt: '0.00%' });
    row.push({ formula: `=IFERROR(E${i + 2}/D${i + 2},"NA")`, numFmt: '$0.00' });
    row.push({ formula: `=IFERROR(G${i + 2}/D${i + 2},0)`, style: { numFmt: '0.00%' } });
    newSheet.addRow(row);
  });
  return newSheet;
};

const formatCells = (sheet) => {
  const newSheet = sheet;
  _.forEach(newSheet._rows, (row, i) => {
    _.forEach(row._cells, (cell, j) => {
      const currCell = cell;
      if (i === 0) {
        currCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        currCell.font = { bold: true };
        currCell.numFmt = '@';
        if (j === 0) {
          currCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD8E4BC' } };
          currCell.numFmt = '@';
        } else if (j < row._cells.length - 4) {
          currCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
        } else {
          currCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFB7DEE8' } };
        }
      } else if (j === 0) {
        currCell.numFmt = '@';
        currCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFEBF1DE' } };
      } else if (j === row._cells.length - 2) {
        currCell.numFmt = '0.00;(-[Red]0.00)';
        currCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdaeef3' } };
      } else if (j >= row._cells.length - 4) {
        currCell.numFmt = '0.00%;(-[Red]0.00%)';
        currCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFdaeef3' } };
      } else {
        currCell.value = parseFloat(cell.value.toString());
        if (cell.value % 1 !== 0) {
          currCell.numFmt = '0.00;(-[Red]0.00)';
        }
      }
    });
  });

  _.forEach(newSheet._columns, (col, i) => {
    const currCol = col;
    currCol.width = i === 0 ? 50 : 12;
  });


  newSheet.autoFilter = {
    from: 'A1',
    to: {
      row: 1,
      column: newSheet._rows[0]._cells.length,
    },
  };

  newSheet.views = [
    {
      state: 'frozen',
      ySplit: 1,
    },
  ];
  return newSheet;
};

const calculateHandler = (input, proxyText) => {
  const headers = _.map(
    input.split('\n')[0].split('\t'),
    (header) => header.trim(),
  ); //* Get headers
  headers.splice(1, 0, 'Length'); //* Add length to second column

  const rows = getRows(_.replace(_.replace(input, / +/g, ' '), /[^\w\s]/gi, proxyText));
  const dataAOO = getDataAOO(headers, rows);

  const workbook = new exceljs.Workbook();
  workbook.creator = 'AMZClever';
  workbook.calcProperties.fullCalcOnLoad = true;

  let sheet = workbook.addWorksheet('Phrase Frequency');
  sheet.addRow([...headers, 'CTR', '7 Day ACoS', 'CPC', '7 Day CVR']);
  sheet = addRows(sheet, dataAOO);
  sheet = formatCells(sheet);

  workbook.xlsx.writeBuffer().then((data) => {
    const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, `Phrase Frequency ${moment().format('MMDDYY')}.xlsx`);
  });
};

export default calculateHandler;
