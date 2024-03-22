import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import { ComplexityManagementDivisionResetView } from './ComplexityManagementDivisionReset.view';
import {
  hideModal,
  resetComplexityDivisionMatrix,
  resetComplexityDivisionMatrixByComplexId,
  resetComplexityDivisionMatrixByReferralId,
  selectComplexityManagementTab,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export default function ComplexityManagementDivisionReset(props) {
  const dispatch = useDispatch();
  const currentTab = useSelector(selectComplexityManagementTab);

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.yes'),
      handler: () => {
        switch (currentTab) {
          case constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[2]:
            dispatch(resetComplexityDivisionMatrix());
            break;
          case constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[3]:
            dispatch(resetComplexityDivisionMatrixByComplexId());
            break;
          case constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[4]:
            dispatch(resetComplexityDivisionMatrixByReferralId());
            break;
          default:
            dispatch(resetComplexityDivisionMatrix());
        }
        dispatch(hideModal());
      },
    },
    {
      name: 'cancel',
      label: utils.string.t('app.no'),
      handler: () => {
        dispatch(hideModal());
      },
    },
  ];

  return <ComplexityManagementDivisionResetView actions={actions} />;
}
