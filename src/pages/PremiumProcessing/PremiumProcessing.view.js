import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { Layout, SectionHeader, Translate, Tabs } from 'components';
import { PremiumProcessingSummary, PremiumProcessingCases } from 'modules';
import { selectCasesListType } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { Box } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';

PremiumProcessingView.propTypes = {
  technicians: PropTypes.array,
  technicianAssigning: PropTypes.bool,
  handleSelectType: PropTypes.func.isRequired,
  userRoleDetails: PropTypes.array.isRequired,
};

export function PremiumProcessingView({ handleSelectType, technicians, technicianAssigning, userRoleDetails }) {
  const type = useSelector(selectCasesListType);
  const isCaseTableHidden = useSelector((state) => state.premiumProcessing.isCaseTableHidden) || false;
  let tabs = [
    { value: constants.WORKLIST, label: utils.string.t('premiumProcessing.tabs.workList') },
    { value: constants.WORKBASKET, label: utils.string.t('premiumProcessing.tabs.workBasket') },
    { value: constants.ALL_CASES, label: utils.string.t('premiumProcessing.tabs.allCases') },
  ];
  if (
    utils.user.isSeniorManager(userRoleDetails?.length > 0 && userRoleDetails[0]) ||
    utils.user.isAdminUser(userRoleDetails?.length > 0 && userRoleDetails[0])
  ) {
    tabs = [
      { value: constants.WORKBASKET, label: utils.string.t('premiumProcessing.tabs.workBasket') },
      { value: constants.ALL_CASES, label: utils.string.t('premiumProcessing.tabs.allCases') },
    ];
  }

  return (
    <Layout showDesktopControls testid="premium-processing">
      <Layout main>
        <SectionHeader title={<Translate label="Premium Processing" />} icon={StarIcon} testid="premium-processing" />
        <Tabs tabs={tabs} value={type} onChange={handleSelectType} />
        <Box pt={4}>
          <PremiumProcessingCases loggedUserDetails={userRoleDetails} />
        </Box>
      </Layout>

      <Layout sidebar padding>
        {!isCaseTableHidden && <PremiumProcessingSummary type={type} />}
      </Layout>
    </Layout>
  );
}
