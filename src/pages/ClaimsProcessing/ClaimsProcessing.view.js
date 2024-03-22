import React from 'react';
import PropTypes from 'prop-types';

// app
import { AccessControl, Layout, SectionHeader, Tabs, Translate, PreventNavigation } from 'components';
import { ClaimsManagement, TasksManagement, TaskSummary, ClaimSummary, ClaimsTasksReporting } from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';

ClaimsProcessingView.propTypes = {
  claimsSelected: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  hasUnsavedChanges: PropTypes.bool.isRequired,
  allowedNavigationUrls: PropTypes.array.isRequired,
  handlers: PropTypes.shape({
    selectTab: PropTypes.func.isRequired,
    allowNavigation: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsProcessingView({ claimsSelected, tabs, selectedTab, handlers, hasUnsavedChanges, allowedNavigationUrls }) {
  const hasOneClaim = claimsSelected?.length === 1;

  return (
    <>
      <Layout showDesktopControls disableDesktopControls={!hasOneClaim} testid="claims-processing">
        <Layout main>
          <SectionHeader
            title={<Translate label={utils.string.t('claims.processing.title')} />}
            icon={AssignmentTurnedInIcon}
            testid="claims-processing-header"
          />
          <AccessControl feature="claimsProcessing.myTasks" permissions={['read', 'create', 'update']}>
            <ClaimsTasksReporting />
          </AccessControl>

          <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handlers.selectTab(tabName)} />
          {selectedTab === constants.RFI_ON_CLAIMS && <ClaimsManagement />}
          {selectedTab === constants.RFI_ON_TASKS && <TasksManagement />}
        </Layout>
        <Layout sidebar padding={false}>
          {selectedTab === constants.RFI_ON_CLAIMS && (
            <ClaimSummary claim={claimsSelected?.[0]} allowNavigation={handlers.allowNavigation} />
          )}
          {selectedTab === constants.RFI_ON_TASKS && <TaskSummary claim={claimsSelected?.[0]} allowNavigation={handlers.allowNavigation} />}
        </Layout>
      </Layout>
      {hasUnsavedChanges && (
        <PreventNavigation
          dirty={true}
          allowedUrls={allowedNavigationUrls}
          title={hasUnsavedChanges ? 'navigation.page.subtitle' : 'status.alert'}
          subtitle={''}
          hint={hasUnsavedChanges ? 'navigation.page.title' : 'claims.notes.notifications.alertPopup'}
          maxWidth={'xs'}
          confirmLabel={'form.options.yesNoNa.yes'}
          cancelLabel={'form.options.yesNoNa.no'}
        />
      )}
    </>
  );
}
