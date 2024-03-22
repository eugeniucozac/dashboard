import React from 'react';
import PropTypes from 'prop-types';

//app
import * as constants from 'consts';
import { Tabs, ContentHeader } from 'components';
import * as utils from 'utils';
import { PremiumProcessingCaseClientTable, PremiumProcessingCaseNonBureau, PremiumProcessingCaseBureau } from 'modules';

PremiumProcessingCaseIssueDocumentsView.propTypes = {
  subTabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  handlers: PropTypes.shape({
    handleSelectTab: PropTypes.func.isRequired,
    setIsPageDirty: PropTypes.func.isRequired,
  }),
  caseDetailsObject: PropTypes.object,
  taskId: PropTypes.string.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  isNotMyTaskView: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseIssueDocumentsView({
  handlers,
  subTabs,
  selectedTab,
  caseDetailsObject = {},
  taskId,
  isPageDirty,
  isNotMyTaskView,
}) {
  return (
    <>
      <ContentHeader title={utils.string.t('premiumProcessing.issueDocuments.closingAdviceNotes')} />
      <Tabs tabs={subTabs} overrideTab={selectedTab} onChange={handlers.handleSelectTab} />
      {selectedTab === constants.PREMIUM_PROCESSING_TAB_CLIENT && (
        <PremiumProcessingCaseClientTable caseDetailsObject={caseDetailsObject} isNotMyTaskView={isNotMyTaskView} />
      )}
      {selectedTab === constants.PREMIUM_PROCESSING_TAB_NON_BUREAU && (
        <PremiumProcessingCaseNonBureau caseDetailsObject={caseDetailsObject} isNotMyTaskView={isNotMyTaskView} />
      )}
      {selectedTab === constants.PREMIUM_PROCESSING_TAB_BUREAU && (
        <PremiumProcessingCaseBureau
          caseDetailsObject={caseDetailsObject}
          handlers={{ ...handlers }}
          taskId={taskId}
          isPageDirty={isPageDirty}
          isNotMyTaskView={isNotMyTaskView}
        />
      )}
    </>
  );
}
