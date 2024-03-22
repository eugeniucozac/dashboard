import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { ClaimsComplexityReferralValuesView } from './ClaimsComplexityReferralValues.view';
import {
  showModal,
  hideModal,
  getComplexityReferralValues,
  selectComplexityReferralValues,
  selectComplexityReferralDivisionMatrix,
  selectComplexityReferralDivisionMatrixChanges,
  getComplexityDivisionMatrixByReferralId,
  postComplexityDivisionMatrixByReferralId,
  setComplexityReferralValueId,
  saveComplexityDivisionMatrixByReferralIdChange,
} from 'stores';
import * as utils from 'utils';

ClaimsComplexityReferralValues.propTypes = {
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export default function ClaimsComplexityReferralValues({ setIsSelectedTabDirty }) {
  const dispatch = useDispatch();
  const [currentComplexityRulesValue, setCurrentComplexityRulesValue] = useState({});

  const complexityReferralValues = useSelector(selectComplexityReferralValues);

  const initComplexityMatrixData = useSelector(selectComplexityReferralDivisionMatrix);
  const matrixDataDiff = useSelector(selectComplexityReferralDivisionMatrixChanges);

  useEffect(() => {
    const isComplexityBasicValuesUpdated = matrixDataDiff && Object.keys(matrixDataDiff).length !== 0;
    if (isComplexityBasicValuesUpdated) setIsSelectedTabDirty(true);
    else setIsSelectedTabDirty(false);
  }, [matrixDataDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddReferralValue = () => {
    dispatch(
      showModal({
        component: 'ADD_REFERRAL',
        props: {
          title: `${utils.string.t('claims.modals.addReferralValues.title')}`,
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
    dispatch(setComplexityReferralValueId(complexityRuleValue));
  };

  const handleUpdateComplexityRuleValue = (complexityRuleValue) => {
    const newValue = { ...currentComplexityRulesValue, ...complexityRuleValue };
    dispatch(setComplexityReferralValueId(newValue));
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
    dispatch(postComplexityDivisionMatrixByReferralId(saveMatrixData));
  };
  const saveEachMatrixChange = (value) => {
    dispatch(saveComplexityDivisionMatrixByReferralIdChange(value));
  };

  const constructMatrixProps = {
    initComplexityMatrixData,
    matrixDataDiff,
    resetMatrix,
    saveMatrix,
    saveEachMatrixChange,
  };
  const canDeleteRule = !currentComplexityRulesValue?.complexityRulesID;

  useEffect(() => {
    if (!complexityReferralValues.itemsTotal) {
      dispatch(getComplexityReferralValues());
    }
    if (currentComplexityRulesValue?.complexityRulesID > -1) {
      dispatch(getComplexityDivisionMatrixByReferralId(currentComplexityRulesValue.complexityRulesID));
    }
  }, [complexityReferralValues, currentComplexityRulesValue]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimsComplexityReferralValuesView
      canDeleteRule={canDeleteRule}
      constructMatrixProps={constructMatrixProps}
      complexityReferralValues={complexityReferralValues}
      handleAddReferralValue={handleAddReferralValue}
      handleRemoveComplexityValues={handleRemoveComplexityValues}
      handleEditComplexityRule={handleEditComplexityRule}
      handleUpdateComplexityRuleValue={handleUpdateComplexityRuleValue}
    />
  );
}
