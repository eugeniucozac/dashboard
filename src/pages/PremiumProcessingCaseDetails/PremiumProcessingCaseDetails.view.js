import React from 'react';
import PropTypes from 'prop-types';

// app
import { Layout, Tabs, Breadcrumb } from 'components';
import {
  PremiumProcessingCaseTeamList,
  PremiumProcessingCaseTeamModuleDetails,
  PremiumProcessingCaseNotes,
  PremiumProcessingCaseIssueDocuments,
  PremiumProcessingCaseRFI,
  PremiumProcessingCaseQualityControl,
  PremiumProcessingCaseRejectDetails,
  PremiumProcessingCaseResubmissionDetails,
  ClaimsUploadViewSearchDocs,
  PremiumProcessingCaseHistory,
} from 'modules';
import * as constants from 'consts';

// mui
import { Divider, Box } from '@material-ui/core';

PremiumProcessingCaseDetailsView.propTypes = {
  hasDocumentSearchPermission: PropTypes.bool.isRequired,
  taskId: PropTypes.string,
  caseId: PropTypes.string,
  caseDetails: PropTypes.object,
  breadcrumbs: PropTypes.array.isRequired,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  isPageDirty: PropTypes.bool,
  handlers: PropTypes.shape({
    openUpdatingPopup: PropTypes.func.isRequired,
    confirmNavigation: PropTypes.func.isRequired,
    selectTab: PropTypes.func.isRequired,
    setIsPageDirty: PropTypes.func.isRequired,
  }).isRequired,
};

export function PremiumProcessingCaseDetailsView({
  hasDocumentSearchPermission,
  taskId,
  caseId,
  caseDetails,
  breadcrumbs,
  tabs,
  selectedTab,
  isPageDirty,
  handlers,
}) {
  const caseTeamData = caseDetails?.caseTeamData;

  return (
    <>
      <Breadcrumb links={breadcrumbs} />
      <Divider />
      <Layout extensiveScreen testid="premium-processing-case-details">
        <Layout main>
          <Tabs tabs={tabs} overrideTab={selectedTab} onChange={handlers.selectTab} />
          {selectedTab === constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS && (
            <Box mt={5}>
              <PremiumProcessingCaseTeamList
                caseInstructionId={caseDetails?.instructionId}
                caseTeamData={caseTeamData}
                openUpdatingPopup={handlers.openUpdatingPopup}
                caseInstructionStatusId={caseDetails?.instructionStatusId}
              />
              <PremiumProcessingCaseTeamModuleDetails />
              {!caseDetails?.isCheckSigning && (
                <>
                  <PremiumProcessingCaseQualityControl />
                  <PremiumProcessingCaseRejectDetails />
                  <PremiumProcessingCaseResubmissionDetails />
                </>
              )}
            </Box>
          )}
          {selectedTab === constants.PREMIUM_PROCESSING_TAB_NOTES && (
            <Box mt={5}>
              <PremiumProcessingCaseNotes taskId={taskId} caseDetailsObject={caseDetails} />
            </Box>
          )}
          {selectedTab === constants.PREMIUM_PROCESSING_TAB_DOCUMENTS && (
            <Box mt={5}>
              <ClaimsUploadViewSearchDocs
                refData={caseDetails}
                refIdName={constants.DMS_CONTEXT_CASE_ID}
                dmsContext={constants.DMS_CONTEXT_CASE}
                sourceId={caseTeamData?.xbInstanceId}
                viewOptions={{
                  unlink: false,
                  delete: false,
                }}
                searchOptions={{
                  disabled: !hasDocumentSearchPermission,
                }}
                documentTypeKey={constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy}
              />
            </Box>
          )}
          {selectedTab === constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS && (
            <Box mt={5}>
              <PremiumProcessingCaseIssueDocuments
                taskId={taskId}
                caseDetailsObject={caseDetails}
                isPageDirty={isPageDirty}
                handlers={{ setIsPageDirty: handlers.setIsPageDirty, confirmNavigation: handlers.confirmNavigation }}
              />
            </Box>
          )}
          {selectedTab === constants.PREMIUM_PROCESSING_TAB_RFI && (
            <Box mt={5}>
              <PremiumProcessingCaseRFI
                taskId={taskId}
                caseId={caseId}
                caseDetailsObject={caseDetails}
                isPageDirty={isPageDirty}
                handlers={{ setIsPageDirty: handlers.setIsPageDirty, confirmNavigation: handlers.confirmNavigation }}
              />
            </Box>
          )}
          {selectedTab === constants.PREMIUM_PROCESSING_TAB_HISTORY && (
            <Box mt={5}>
              <PremiumProcessingCaseHistory taskId={taskId} caseDetailsObject={caseDetails} />
            </Box>
          )}
        </Layout>
      </Layout>
    </>
  );
}
