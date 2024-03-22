import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { ClaimsComplexityRulesView } from './ClaimsComplexityRules.view';
import { setComplexityManagementTab, showModal } from 'stores';
import * as utils from 'utils';

export default function ClaimsComplexityRules() {
  const dispatch = useDispatch();
  const brand = useSelector((state) => state.ui.brand);

  const [selectedTab, setSelectedTab] = useState('contractPolicyRef');

  const [isSelectedTabDirty, setIsSelectedTabDirty] = useState(false);

  const handleSelectTab = (tabName) => {
    if (tabName !== selectedTab) {
      dispatch(setComplexityManagementTab(tabName));
      if (isSelectedTabDirty) {
        dispatch(
          showModal({
            component: 'CONFIRM',
            props: {
              fullWidth: true,
              title: utils.string.t('claims.complexityRulesManagementDetails.alertModal.title'),
              maxWidth: 'xs',
              componentProps: {
                confirmLabel: utils.string.t('app.yes'),
                cancelLabel: utils.string.t('app.no'),
                confirmMessage: utils.string.t('claims.complexityRulesManagementDetails.alertModal.subTitle'),
                buttonColors: { confirm: 'secondary', cancel: 'primary' },
                submitHandler: () => {
                  setSelectedTab(tabName);
                  dispatch(setComplexityManagementTab(tabName));
                  setIsSelectedTabDirty(false);
                },
                cancelHandler: () => {},
                handleClose: () => {},
              },
            },
          })
        );
      } else {
        setSelectedTab(tabName);
      }
    }
  };

  const tabs = [
    { value: 'contractPolicyRef', label: utils.string.t('claims.complexityRulesManagementDetails.contractPolicyRef') },
    { value: 'insured', label: utils.string.t('claims.complexityRulesManagementDetails.insured') },
    { value: 'division', label: utils.string.t('claims.complexityRulesManagementDetails.division') },
    { value: 'complexityValues', label: utils.string.t('claims.complexityRulesManagementDetails.complexityValues') },
    { value: 'referralValues', label: utils.string.t('claims.complexityRulesManagementDetails.referralValues') },
  ];

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('claims.actions.complexityRulesManagement')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ClaimsComplexityRulesView
        tabs={tabs}
        selectedTab={selectedTab}
        handleSelectTab={handleSelectTab}
        setIsSelectedTabDirty={setIsSelectedTabDirty}
      />
    </>
  );
}
