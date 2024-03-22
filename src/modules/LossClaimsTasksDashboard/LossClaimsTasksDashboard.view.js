import React from 'react';
import PropTypes from 'prop-types';

//app
import { Layout, Tabs } from 'components';
import { LossesTab, ClaimsTab, TasksTab, ReportsTab, AdvanceSearchTab } from 'modules';

LossClaimsTasksDashboardView.propTypes = {
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  handleSelectTab: PropTypes.func,
};

export function LossClaimsTasksDashboardView({ tabs, selectedTab, handleSelectTab }) {
  return (
    <Layout main testid="LossesClaimsTasksDashboard">
      <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handleSelectTab(tabName)} />
      {selectedTab === 'losses' && <LossesTab />}
      {selectedTab === 'claims' && <ClaimsTab />}
      {selectedTab === 'tasks' && <TasksTab />}
      {selectedTab === 'reports' && <ReportsTab />}
      {selectedTab === 'advanceSearch' && <AdvanceSearchTab />}
    </Layout>
  );
}
