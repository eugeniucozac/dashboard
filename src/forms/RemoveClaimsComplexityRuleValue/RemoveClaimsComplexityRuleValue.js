import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import { RemoveClaimsComplexityRuleValueView } from './RemoveClaimsComplexityRuleValue.view';
import {
  hideModal,
  selectComplexityManagementTab,
  selectComplexityBasisValueId,
  selectComplexityReferralValueId,
  removeComplexityBasisRuleValue,
  removeComplexityReferralRuleValue,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

export default function RemoveClaimsComplexityRuleValue() {
  const dispatch = useDispatch();
  const [complexityRuleData, setComplexityRuleData] = useState({});

  const currentTab = useSelector(selectComplexityManagementTab);
  const currentComplexity = useSelector(selectComplexityBasisValueId);
  const currentReferral = useSelector(selectComplexityReferralValueId);

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.yes'),
      handler: () => {
        if (currentTab === constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[3]) {
          dispatch(removeComplexityBasisRuleValue());
        } else if (currentTab === constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[4]) {
          dispatch(removeComplexityReferralRuleValue());
        }
        dispatch(hideModal());
      },
    },
    {
      name: 'cancel',
      label: utils.string.t('app.no'),
      handler: () => dispatch(hideModal()),
    },
  ];

  useEffect(() => {
    switch (currentTab) {
      case constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[3]:
        setComplexityRuleData(currentComplexity);
        break;
      case constants.CLAIM_COMPLEXITY_MANAGEMENT_TABS[4]:
        setComplexityRuleData(currentReferral);
        break;
      default:
        setComplexityRuleData(currentComplexity);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <RemoveClaimsComplexityRuleValueView actions={actions} complexityRuleData={complexityRuleData} />;
}
