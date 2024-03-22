import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { ClaimsComplexityValuesView } from './ClaimsComplexityValues.view';
import {
  showModal,
  hideModal,
  selectComplexityBasisValues,
  getComplexityBasisValue,
  getComplexityDivisionMatrixByComplexId,
  postComplexityDivisionMatrixByComplexId,
  selectComplexityBasisDivisionMatrix,
  selectComplexityBasisDivisionMatrixChanges,
  saveComplexityDivisionMatrixByComplexIdChange,
  setComplexityBasisValueId,
} from 'stores';
import * as utils from 'utils';

ClaimsComplexityValues.propTypes = {
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export default function ClaimsComplexityValues({ setIsSelectedTabDirty }) {
  const dispatch = useDispatch();
  const [currentComplexityRulesValue, setCurrentComplexityRulesValue] = useState({});

  const complexityBasisValueData = useSelector(selectComplexityBasisValues);

  const initComplexityMatrixData = useSelector(selectComplexityBasisDivisionMatrix);
  const matrixDataDiff = useSelector(selectComplexityBasisDivisionMatrixChanges);

  useEffect(() => {
    const isComplexityVaulesUpdated = matrixDataDiff && Object.keys(matrixDataDiff).length !== 0;
    if (isComplexityVaulesUpdated) setIsSelectedTabDirty(true);
    else setIsSelectedTabDirty(false);
  }, [matrixDataDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddComplexityValues = () => {
    dispatch(
      showModal({
        component: 'ADD_COMPLEXITY',
        props: {
          title: `${utils.string.t('claims.modals.addComplexity.title')}`,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          hideCompOnBlur: false,
          componentProps: {
            clickOutSideHandler: () => clickOutSideHandler(),
          },
        },
      })
    );
  };
  const clickOutSideHandler = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          hint: utils.string.t('navigation.title'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleRemoveComplexityValues = () => {
    setCurrentComplexityRulesValue({});
    dispatch(
      showModal({
        component: 'COMPLEXITY_MANAGEMENT_REMOVE_RULE_VALUE',
        props: {
          title: utils.string.t('status.alert'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
        },
      })
    );
  };

  const handleEditComplexityRule = (complexityRuleValue) => {
    setCurrentComplexityRulesValue({ ...complexityRuleValue });
    dispatch(setComplexityBasisValueId(complexityRuleValue));
  };

  const handleUpdateComplexityRuleValue = (complexityRuleValue) => {
    const newValue = { ...currentComplexityRulesValue, ...complexityRuleValue };
    dispatch(setComplexityBasisValueId(newValue));
  };

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
  const saveMatrix = (saveMatrixData) => {
    dispatch(postComplexityDivisionMatrixByComplexId(saveMatrixData));
  };
  const saveEachMatrixChange = (value) => {
    dispatch(saveComplexityDivisionMatrixByComplexIdChange(value));
  };

  const constructMatrixProps = {
    initComplexityMatrixData,
    matrixDataDiff,
    resetMatrix,
    saveMatrix,
    saveEachMatrixChange,
  };
  const canLoadTable = complexityBasisValueData?.itemsTotal > 0;
  const canLoadEditMatrix = initComplexityMatrixData?.length > 0;
  const canDeleteRule = !currentComplexityRulesValue?.complexityRulesID;

  useEffect(() => {
    if (!complexityBasisValueData.itemsTotal) {
      dispatch(getComplexityBasisValue());
    }
    if (currentComplexityRulesValue?.complexityRulesID > -1) {
      dispatch(getComplexityDivisionMatrixByComplexId(currentComplexityRulesValue.complexityRulesID));
    }
  }, [complexityBasisValueData, currentComplexityRulesValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimsComplexityValuesView
      canLoadTable={canLoadTable}
      canLoadEditMatrix={canLoadEditMatrix}
      canDeleteRule={canDeleteRule}
      constructMatrixProps={constructMatrixProps}
      complexityBasisValueData={complexityBasisValueData}
      handleAddComplexityValues={handleAddComplexityValues}
      handleRemoveComplexityValues={handleRemoveComplexityValues}
      handleEditComplexityRule={handleEditComplexityRule}
      handleUpdateComplexityRuleValue={handleUpdateComplexityRuleValue}
    />
  );
}
