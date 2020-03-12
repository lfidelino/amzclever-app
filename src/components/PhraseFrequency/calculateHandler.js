/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const XLSX = require('xlsx');
const moment = require('moment');

const getRows = (input) => {
  let rows = input.split('\n'); //* Split input by row
  rows = _.compact(rows); //* Remove empty elements from array, if any
  rows = _.map(rows, (curr) => curr.split('\t')); //* Split every element by column
  rows = _.drop(rows); //* Drop first element from array (headers)

  return rows;
};

const getPhrases = (words) => {
  const phrases = [];

  for (let i = 0; i < words.length; i += 1) { //* Iterate over each row
    let phrase = words[i].trim();
    phrases.push(phrase); //* Add current single word to phrase

    for (let j = i + 1; j < words.length; j += 1) {
      phrase += ` ${words[j]}`;
      phrases.push(phrase); //* Add each word until last word
    }
  }

  return phrases;
};

const getOutputObj = (headers, rows) => {
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

const addFormulas = (ws) => {
  const outputWS = ws;
  const range = XLSX.utils.decode_range(ws['!ref']);
  const colCount = range.e.c;

  for (let R = range.s.r; R <= range.e.r; R += 1) {
    let cellAddress = { c: colCount + 1, r: R }; //* CTR
    let cellRef = XLSX.utils.encode_cell(cellAddress);
    outputWS[cellRef] = {
      t: 'n',
      f: `IFERROR(D${R + 1}/C${R + 1}, "NA")`,
      z: '0.00%',
    };

    cellAddress = { c: colCount + 2, r: R }; //* 7 Day ACoS
    cellRef = XLSX.utils.encode_cell(cellAddress);
    outputWS[cellRef] = {
      t: 'n',
      f: `IFERROR(E${R + 1}/F${R + 1}, 9)`,
      z: '0.00%',
    };

    cellAddress = { c: colCount + 3, r: R }; //* CPC
    cellRef = XLSX.utils.encode_cell(cellAddress);
    outputWS[cellRef] = {
      t: 'n',
      f: `IFERROR(E${R + 1}/D${R + 1}, "NA")`,
      z: '$0.00',
    };

    cellAddress = { c: colCount + 4, r: R }; //* 7 Day CVR
    cellRef = XLSX.utils.encode_cell(cellAddress);
    outputWS[cellRef] = {
      t: 'n',
      f: `IFERROR(G${R + 1}/D${R + 1}, 0)`,
      z: '0.00%',
    };

    outputWS['!ref'] = `A1:${cellRef}`;
  }
  return outputWS;
};

const addHeaders = (ws) => {
  const outputWS = ws;
  const range = XLSX.utils.decode_range(ws['!ref']);
  const colCount = range.e.c;

  let cellAddress = { c: colCount - 3, r: 0 }; //* CTR
  let cellRef = XLSX.utils.encode_cell(cellAddress);
  outputWS[cellRef] = {
    t: 's',
    v: 'CTR',
  };

  cellAddress = { c: colCount - 2, r: 0 }; //* 7 Day ACoS
  cellRef = XLSX.utils.encode_cell(cellAddress);
  outputWS[cellRef] = {
    t: 's',
    v: 'ACoS',
  };

  cellAddress = { c: colCount - 1, r: 0 }; //* CPC
  cellRef = XLSX.utils.encode_cell(cellAddress);
  outputWS[cellRef] = {
    t: 's',
    v: 'CPC',
  };

  cellAddress = { c: colCount, r: 0 }; //* 7 Day CVR
  cellRef = XLSX.utils.encode_cell(cellAddress);
  outputWS[cellRef] = {
    t: 's',
    v: 'CVR',
  };

  return outputWS;
};

const calculateHandler = (input) => {
  const headers = _.map(input.split('\n')[0].split('\t'), (header) => _.replace(_.replace(_.replace(_.replace(header.trim(), 'Sum of ', ''), '7 Day', ''), '7 day ', ''), 'Total ', '')); //* Get headers
  headers.splice(1, 0, 'Length'); //* Add length to second column

  const rows = getRows(_.replace(input, / +/g, ' '));
  const outputObj = getOutputObj(headers, rows);

  const wb = XLSX.utils.book_new();
  let ws = XLSX.utils.json_to_sheet(outputObj);

  const objectMaxLength = [];
  for (let i = 0; i < outputObj.length; i += 1) {
    const value = Object.values(outputObj[i]);
    for (let j = 0; j < value.length; j += 1) {
      if (typeof value[j] === 'number') {
        objectMaxLength[j] = 15;
      } else {
        objectMaxLength[j] = objectMaxLength[j] >= value[j].length
          ? objectMaxLength[j]
          : value[j].length;
      }
    }
  }

  ws['!cols'] = [];
  for (const length of objectMaxLength) {
    ws['!cols'].push({ width: length });
  }

  ws = addFormulas(ws);
  ws = addHeaders(ws);

  ws['!autofilter'] = { ref: ws['!ref'] };

  XLSX.utils.book_append_sheet(wb, ws, 'Phrase Frequency');
  XLSX.writeFile(wb, `Phrase Frequency ${moment().format('MMDDYY')}.xlsx`);
};

export default calculateHandler;
