import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { ClaimsEditComplexityRulesValueView } from './ClaimsEditComplexityRulesValue.view';
import * as constants from 'consts';
import { selectComplexityManagementTab } from 'stores';

ClaimsEditComplexityRulesValue.prototypes = {
  canLoadMatrix: PropTypes.bool.isRequired,
  initComplexityMatrixData: PropTypes.array.isRequired,
  matrixDataDiff: PropTypes.object.isRequired,
  resetMatrix: PropTypes.func.isRequired,
  saveMatrix: PropTypes.func.isRequired,
  saveEachMatrixChange: PropTypes.func.isRequired,
  handleUpdateComplexityRuleValue: PropTypes.func.isRequired,
};
export default function ClaimsEditComplexityRulesValue({
  canLoadMatrix,
  initComplexityMatrixData,
  matrixDataDiff,
  resetMatrix,
  saveMatrix,
  saveEachMatrixChange,
  handleUpdateComplexityRuleValue,
}) {
  const currentTab = useSelector(selectComplexityManagementTab);
  const isComplexityActive = currentTab === constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[3];

  const matrixPrimaryKey = constants.CLAIM_DIVISIONS_MATRIX_PRIMARY_KEY;
  const matrixCheckboxValueKey = constants.CLAIM_DIVISIONS_MATRIX_CHECKBOX_VALUE_KEY;
  const matrixPrimaryKeyId = constants.CLAIM_DIVISIONS_MATRIX_PRIMARY_KEY_ID;
  const matrixExceptionColumns = constants.CLAIM_DIVISIONS_MATRIX_COLUMN_EXCEPTIONS;

  const constructMatrixProps = {
    initMatrixData: initComplexityMatrixData,
    matrixPrimaryKey,
    matrixCheckboxValueKey,
    matrixPrimaryKeyId,
    matrixExceptionColumns,
    resetMatrix,
    saveMatrix,
    saveEachMatrixChange,
    matrixDataDiff,
  };

  return (
    <ClaimsEditComplexityRulesValueView
      isComplexityActive={isComplexityActive}
      canLoadMatrix={canLoadMatrix}
      constructMatrixProps={constructMatrixProps}
      handleEditValues={handleUpdateComplexityRuleValue}
    />
  );
}
