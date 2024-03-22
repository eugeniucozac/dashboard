import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { ClaimsComplexityDivisionView } from './ClaimsComplexityDivision.view';
import * as utils from 'utils';
import {
  showModal,
  getComplexityDivisionMatrix,
  selectComplexityDivisionMatrixChanges,
  selectComplexityDivisionMatrix,
  saveComplexityDivisionMatrixChange,
  postComplexityDivisionMatrix,
} from 'stores';
import * as constants from 'consts';

ClaimsComplexityDivision.propTypes = {
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export default function ClaimsComplexityDivision({ setIsSelectedTabDirty }) {
  const dispatch = useDispatch();

  const initComplexityMatrixData = useSelector(selectComplexityDivisionMatrix);
  const matrixDataDiff = useSelector(selectComplexityDivisionMatrixChanges);

  const matrixPrimaryKey = constants.CLAIM_DIVISIONS_MATRIX_PRIMARY_KEY;
  const matrixCheckboxValueKey = constants.CLAIM_DIVISIONS_MATRIX_CHECKBOX_VALUE_KEY;
  const matrixPrimaryKeyId = constants.CLAIM_DIVISIONS_MATRIX_PRIMARY_KEY_ID;
  const matrixExceptionColumns = constants.CLAIM_DIVISIONS_MATRIX_COLUMN_EXCEPTIONS;

  useEffect(() => {
    const isDivisionMatrixUpdated = matrixDataDiff && Object.keys(matrixDataDiff).length !== 0;
    if (isDivisionMatrixUpdated) setIsSelectedTabDirty(true);
    else setIsSelectedTabDirty(false);
  }, [matrixDataDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetMatrix = () => {
    dispatch(
      showModal({
        component: 'COMPLEXITY_MANAGEMENT_DIVISION_RESET',
        props: {
          title: utils.string.t('status.alert'),
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
        },
      })
    );
  };
  const saveMatrix = async (saveMatrixData) => {
    await dispatch(postComplexityDivisionMatrix(saveMatrixData));
    dispatch(getComplexityDivisionMatrix());
  };
  const saveEachMatrixChange = (value) => {
    dispatch(saveComplexityDivisionMatrixChange(value));
  };

  useEffect(() => {
    if (!initComplexityMatrixData.length) {
      dispatch(getComplexityDivisionMatrix());
    }
  }, [initComplexityMatrixData]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimsComplexityDivisionView
      initMatrixData={initComplexityMatrixData}
      matrixPrimaryKey={matrixPrimaryKey}
      matrixCheckboxValueKey={matrixCheckboxValueKey}
      matrixPrimaryKeyId={matrixPrimaryKeyId}
      matrixExceptionColumns={matrixExceptionColumns}
      resetMatrix={resetMatrix}
      saveMatrix={saveMatrix}
      saveEachMatrixChange={saveEachMatrixChange}
      matrixDataDiff={matrixDataDiff}
    />
  );
}
