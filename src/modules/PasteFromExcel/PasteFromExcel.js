import React, { useState } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import startCase from 'lodash/startCase';
import merge from 'lodash/merge';

// app
import styles from './PasteFromExcel.styles';
import { PasteFromExcelView } from './PasteFromExcel.view';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

PasteFromExcel.propTypes = {
  name: PropTypes.string,
  headers: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ).isRequired,
  steps: PropTypes.number,
  labels: PropTypes.shape({
    step1: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
      label: PropTypes.string,
      required: PropTypes.string,
      placeholder: PropTypes.string,
    }),
    step2: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
      label: PropTypes.string,
      error: PropTypes.string,
    }),
    step3: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
    }),
    step4: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
    }),
  }),
  isValidateHeadersMapping: PropTypes.bool,
  handlers: PropTypes.shape({
    extract: PropTypes.func,
    match: PropTypes.func,
    submit: PropTypes.func.isRequired,
  }).isRequired,
};

PasteFromExcel.defaultProps = {
  steps: 3,
  headers: [],
  isValidateHeadersMapping: false,
  handlers: {},
};

export default function PasteFromExcel({ name, headers: headersMap, steps, labels, isValidateHeadersMapping, handlers, children }) {
  const classes = makeStyles(styles, { name: 'PasteFromExcel' })();

  const [step, setStep] = useState(1);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [headers, setHeaders] = useState(headersMap);
  const [isHeaderMappingMissing, setIsHeaderMappingMissing] = useState(false);

  const defaultLabels = {
    step1: {
      title: utils.string.html('products.pasteFromExcel.step1.title'),
      hint: utils.string.t('products.pasteFromExcel.step1.hint'),
      label: utils.string.t('products.pasteFromExcel.step1.label'),
      required: utils.string.t('products.pasteFromExcel.step1.required'),
      placeholder: utils.string.t('products.pasteFromExcel.step1.placeholder'),
    },
    step2: {
      title: utils.string.html('products.pasteFromExcel.step2.title'),
      hint: utils.string.t('products.pasteFromExcel.step2.hint'),
      label: utils.string.t('products.pasteFromExcel.step2.label'),
      error: utils.string.t('products.pasteFromExcel.step2.error'),
    },
    step3: {
      title: utils.string.html('products.pasteFromExcel.step3.title'),
      hint: utils.string.t('products.pasteFromExcel.step3.hint'),
    },
    step4: {
      title: utils.string.html('products.pasteFromExcel.step4.title'),
      hint: utils.string.t('products.pasteFromExcel.step4.hint'),
    },
  };

  const mergedLabels = merge(defaultLabels, labels);

  const handleExcelExtract = (values) => {
    const cleanString = utils.excel.removeLineBreaksWithinCell(values.excelExtract);
    const cellsByRow = utils.excel.splitCellsByRow(cleanString);
    const objectRows = utils.excel.getObjects(cellsByRow);
    const objectColumns = utils.excel.getColumns(cellsByRow);
    const newHeaders = [
      ...headers.map((h) => {
        return objectColumns.includes(h.key) ? { ...h, value: h.value === '' ? h.key : h.value } : h;
      }),
    ];

    if (utils.generic.isFunction(handlers.extract)) {
      handlers.extract({ headers: newHeaders, rows: objectRows, columns: objectColumns });
    }

    stepChangeValidations(2, newHeaders);
    setHeaders(newHeaders);
    setColumns(objectColumns);
    setRows(objectRows);
  };

  const handleColumnMatching = (form) => {
    const newHeaders = [...headers.map((h) => ({ ...h, value: form[h.key] === '__placeholder__' ? '' : form[h.key] }))];

    if (utils.generic.isFunction(handlers.match)) {
      handlers.match({ headers: newHeaders });
    }

    setHeaders(newHeaders);
    stepChangeValidations(3, newHeaders);
  };

  const handleSubmit = (data) => () => {
    if (utils.generic.isFunction(handlers.submit)) {
      handlers.submit(data);
    }
  };

  const fields = {
    excelExtract: [
      {
        name: 'excelExtract',
        type: 'text',
        label: mergedLabels.step1.label,
        placeholder: mergedLabels.step1.placeholder,
        value: '',
        validation: Yup.string().required(mergedLabels.step1.required),
        muiComponentProps: {
          autoFocus: true,
          multiline: true,
          minRows: 3,
          maxRows: 12,
          classes: {
            root: classes.textarea,
          },
        },
      },
    ],
    columnMatching: [
      headers.map(({ key, value, label }) => {
        return {
          name: key,
          type: 'select',
          gridSize: { xs: 12, sm: 6, md: 4 },
          label: label ? label : startCase(key),
          value: value || '__placeholder__',
          options: [
            {
              value: '__placeholder__',
              label: mergedLabels.step2.label,
              placeholder: true,
            },
            ...columns.map((col) => ({ value: col, label: startCase(col) })),
          ],
        };
      }),
    ],
  };

  const isReady = utils.generic.isValidArray(rows, true) && utils.generic.isValidArray(columns, true);

  const rowsFiltered = rows.map((row) => {
    return headers.reduce((acc, header) => {
      return { ...acc, [header.key]: row[header.value] };
    }, {});
  });

  const columnsFiltered = headers.map((h) => ({ id: h.key, label: startCase(h.key), compact: true }));

  const setSteps = (step) => {
    if (isValidateHeadersMapping && step === 3) setIsHeaderMappingMissing(headers.some((header) => header.value === ''));
    setStep(step);
  };
  const stepChangeValidations = (step, newHeaders) => {
    if (isValidateHeadersMapping && step === 3) setIsHeaderMappingMissing(newHeaders.some((header) => header.value === ''));
    setStep(step);
  };

  return (
    <PasteFromExcelView
      step={step}
      steps={steps}
      labels={mergedLabels}
      fields={fields}
      rows={rowsFiltered}
      columns={columnsFiltered}
      imported={isReady}
      testid={name}
      isHeaderMappingMissing={isHeaderMappingMissing}
      handlers={{
        setSteps,
        excelExtract: handleExcelExtract,
        columnMatching: handleColumnMatching,
        submit: handleSubmit,
      }}
      children={children}
    />
  );
}
