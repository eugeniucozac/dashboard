import React from 'react';
import PropTypes from 'prop-types';

//app
import { Layout, Tabs, SectionHeader, Translate } from 'components';
import {
  ClaimsComplexityContractPolicyRef,
  ClaimsComplexityDivision,
  ClaimsComplexityInsured,
  ClaimsComplexityReferralValues,
  ClaimsComplexityValues,
} from 'modules';
import * as utils from 'utils';

//mui
import { Box } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

ClaimsComplexityRulesView.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  handleSelectTab: PropTypes.func,
  setIsSelectedTabDirty: PropTypes.func.isRequired,
};

export function ClaimsComplexityRulesView({ tabs, selectedTab, handleSelectTab, setIsSelectedTabDirty }) {
  return (
    <Box>
      <Layout testid="complexityRulesManagement">
        <Layout main>
          <SectionHeader
            title={<Translate label={utils.string.t('claims.complexityRulesManagementDetails.title')} />}
            icon={SettingsIcon}
            testid="claims"
          />
          <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handleSelectTab(tabName)} />
          {selectedTab === 'contractPolicyRef' && <ClaimsComplexityContractPolicyRef setIsSelectedTabDirty={setIsSelectedTabDirty} />}
          {selectedTab === 'insured' && <ClaimsComplexityInsured setIsSelectedTabDirty={setIsSelectedTabDirty} />}
          {selectedTab === 'division' && <ClaimsComplexityDivision setIsSelectedTabDirty={setIsSelectedTabDirty} />}
          {selectedTab === 'complexityValues' && <ClaimsComplexityValues setIsSelectedTabDirty={setIsSelectedTabDirty} />}
          {selectedTab === 'referralValues' && <ClaimsComplexityReferralValues setIsSelectedTabDirty={setIsSelectedTabDirty} />}
        </Layout>
      </Layout>
    </Box>
  );
}
