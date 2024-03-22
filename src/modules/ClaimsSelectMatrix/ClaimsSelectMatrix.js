import React from 'react';
import PropTypes from 'prop-types';

//app
import { ClaimsSelectMatrixView } from './ClaimsSelectMatrix.view';
import * as utils from 'utils';

ClaimsSelectMatrix.prototypes = {
  initMatrixData: PropTypes.array.isRequired,
  matrixPrimaryKey: PropTypes.string.isRequired,
  matrixCheckboxValueKey: PropTypes.string.isRequired,
  matrixPrimaryKeyId: PropTypes.string.isRequired,
  matrixExceptionColumns: PropTypes.array.isRequired,
  resetMatrix: PropTypes.func.isRequired,
  saveMatrix: PropTypes.func.isRequired,
  saveEachMatrixChange: PropTypes.func.isRequired,
  matrixDataDiff: PropTypes.object.isRequired,
};
export default function ClaimsSelectMatrix({
  initMatrixData,
  matrixPrimaryKey,
  matrixCheckboxValueKey,
  matrixPrimaryKeyId,
  matrixExceptionColumns,
  resetMatrix,
  saveMatrix,
  saveEachMatrixChange,
  matrixDataDiff,
}) {
  const columns = [
    { id: 'division', label: utils.string.t('claims.complexityRulesManagementDetails.division') },
    ...Object.keys(initMatrixData[0])
      .filter((key) => key !== matrixPrimaryKey)
      .map((ins) => ({
        id: ins,
        label: !matrixExceptionColumns.includes(ins.toUpperCase()) ? utils.string.capitalise(ins) : ins.toUpperCase(),
      })),
  ];

  const matrixRowKeys = initMatrixData.map((div) => {
    let uniqId = '';
    Object.keys(div).every((item) => {
      if (uniqId) return false;
      if (div[item] && div[item] !== matrixPrimaryKey) {
        uniqId = div[item][matrixPrimaryKeyId];
      }
      return true;
    });
    return div[matrixPrimaryKey].replaceAll(' ', '') + '-' + uniqId;
  });
  const matrixValues =
    initMatrixData.length &&
    initMatrixData.map((div) => {
      const newData = { ...div };
      delete newData[matrixPrimaryKey];
      return newData;
    });

  const fields =
    matrixValues.length &&
    matrixValues.map((matrixRow, ind) => {
      const rowValues = Object.entries(matrixRow).map((data) => ({ instance: data[0], instanceVal: data[1] }));
      return rowValues.map((eachField, idx) => {
        return {
          name: matrixRowKeys[ind] + '-' + eachField.instance + '-' + idx,
          type: 'checkbox',
          disabled: !eachField?.instanceVal,
          defaultValue: eachField?.instanceVal ? !!eachField.instanceVal[matrixCheckboxValueKey] : false,
          muiComponentProps: {
            onChange: (name, value) => {
              saveEachMatrixChange({ [name]: value });
            },
          },
        };
      });
    });

  const saveStateMatrix = (matrixValues) => {
    const saveMatrixValues = constructSaveMatrix(matrixDataDiff, initMatrixData);
    saveMatrix(saveMatrixValues);
  };

  const constructSaveMatrix = (dataDiff, matrixData) => {
    const result = [];
    const groupedMatrixValues = groupMatrixValues(dataDiff);
    groupedMatrixValues.forEach((item) => {
      const matchedVal = matrixData.filter((row) => {
        const rowCheck = row[matrixPrimaryKey].replaceAll(' ', '') === item.key;
        let rowIdCheck = false;
        if (rowCheck) {
          const refData = { ...row };
          delete refData[matrixPrimaryKey];
          const nonNullData = Object.values(refData).find((val) => val);
          rowIdCheck = nonNullData && nonNullData[matrixPrimaryKeyId] === item.id;
        }
        return rowCheck && rowIdCheck;
      })[0];
      item.values.forEach((col) => {
        const updatedVal = { ...matchedVal[col.id], [matrixCheckboxValueKey]: col.check };
        result.push(updatedVal);
      });
    });
    return result;
  };
  const groupMatrixValues = (dataDiff) => {
    let saveMatrixValues = [];
    const formatFieldsData = Object.entries(dataDiff).map((item) => ({ [item[0]]: item[1] }));
    formatFieldsData.forEach((item) => {
      const matCoords = Object.keys(item)[0].split('-');
      const currentRowLabel = matCoords[0];
      const currentRowLabelId = Number(matCoords[1]);
      const currentColLabel = matCoords[2];
      let existingEntryInd = -1;
      const currentMatrixVal = Object.values(item)[0] ? 1 : 0;
      if (saveMatrixValues.length) {
        saveMatrixValues.forEach((itr, idx) => {
          existingEntryInd = itr.key === currentRowLabel && itr.id === currentRowLabelId ? idx : existingEntryInd;
        });
      }
      const isExistingEntry = existingEntryInd > -1;
      if (isExistingEntry) {
        saveMatrixValues[existingEntryInd].values = [
          ...saveMatrixValues[existingEntryInd].values,
          { id: currentColLabel, check: currentMatrixVal },
        ];
      } else {
        saveMatrixValues.push({ id: currentRowLabelId, key: currentRowLabel, values: [{ id: currentColLabel, check: currentMatrixVal }] });
      }
    });
    return saveMatrixValues;
  };

  return (
    <ClaimsSelectMatrixView
      cols={columns}
      rows={initMatrixData}
      matrixRowKeys={matrixRowKeys}
      matrixPrimaryKey={matrixPrimaryKey}
      fields={fields}
      resetMatrix={resetMatrix}
      saveMatrix={saveStateMatrix}
      matrixDataDiff={matrixDataDiff}
    />
  );
}
