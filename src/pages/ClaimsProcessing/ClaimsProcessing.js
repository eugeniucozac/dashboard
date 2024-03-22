import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { ClaimsProcessingView } from './ClaimsProcessing.view';
import {
  selectClaimsProcessingSelected,
  hideModal,
  showModal,
  getQueryCodeList,
  selectClaimNavigation,
  processingNavigation,
  resetPolicyInformation,
} from 'stores';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

export default function ClaimsProcessing() {
  const dispatch = useDispatch();

  const brand = useSelector((state) => state.ui.brand);
  const claimsProcessingSelected = useSelector(selectClaimsProcessingSelected);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
    { value: constants.RFI_ON_CLAIMS, label: utils.string.t('claims.processing.tabs.claims') },
    { value: constants.RFI_ON_TASKS, label: utils.string.t('claims.processing.tabs.tasks') },
  ];

  const selectedTab = useSelector(selectClaimNavigation);

  const handleSelectTab = (tabName) => {
    if (hasUnsavedChanges) {
      confirmNavigation(tabName);
    } else {
      dispatch(processingNavigation(tabName));
    }
  };

  const allowedNavigationUrls = hasUnsavedChanges
    ? []
    : [config.routes.claimsProcessing.root, `${config.routes.claimsProcessing.claim}/**`, `${config.routes.claimsProcessing.task}/**`];

  const allowNavigation = (isAllowed) => {
    setHasUnsavedChanges(!isAllowed);
  };

  const confirmNavigation = (tabName) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('navigation.page.subtitle'),
          hint: utils.string.t('navigation.page.title'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              dispatch(hideModal());
              dispatch(processingNavigation(tabName));
              setHasUnsavedChanges(false);
            },
            cancelHandler: () => {},
          },
        },
      })
    );
  };
  useEffect(() => {
    dispatch(getQueryCodeList());
    dispatch(resetPolicyInformation());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('claims.processing.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ClaimsProcessingView
        claimsSelected={claimsProcessingSelected}
        tabs={tabs}
        selectedTab={selectedTab}
        hasUnsavedChanges={hasUnsavedChanges}
        allowedNavigationUrls={allowedNavigationUrls}
        handleSelectTab={handleSelectTab}
        handlers={{
          selectTab: handleSelectTab,
          allowNavigation,
        }}
      />
    </>
  );
}
