import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { Tabs, AccessControl, Empty } from 'components';
import { PremiumProcessingCaseRfiRespond, PremiumProcessingCaseRfiResolve, PremiumProcessingCaseRFIForm } from 'modules';
import {
  PREMIUM_PROCESSING_TAB_NEW_RFI,
  RFI_STATUS,
  AUTHORISED_SIGNATORY,
  WORKBASKET,
  ALL_CASES,
  RESOLVE_SENDTOFEC_YES,
  ROLE_TECHNICIAN_MANAGER,
} from 'consts';
import * as constants from 'consts';
import { selectUserRole, selectcaseRfiSubTabs } from 'stores';
import * as utils from 'utils';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';

PremiumProcessingCaseRFIView.propTypes = {
  caseDetails: PropTypes.object.isRequired,
  rfiDetails: PropTypes.object,
  newRfiUsers: PropTypes.array.isRequired,
  subTabs: PropTypes.array.isRequired,
  selectedSubTab: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  isCreatedByLoginUser: PropTypes.bool.isRequired,
  hasResponseRfiPermission: PropTypes.bool,
  isWorklist: PropTypes.bool,
  isHistoryCases: PropTypes.bool,
  isFrontEndContact: PropTypes.bool,
  isSeniorManager: PropTypes.bool,
  isOperationsLead: PropTypes.bool,
  notificationObj: PropTypes.array,
  loggedInUserEmail: PropTypes.string,
  handlers: PropTypes.shape({
    selectTab: PropTypes.func.isRequired,
    stayOnTab: PropTypes.func.isRequired,
    switchTab: PropTypes.func.isRequired,
    setIsPageDirty: PropTypes.func.isRequired,
  }),
};

export default function PremiumProcessingCaseRFIView({
  caseDetails,
  rfiDetails,
  newRfiUsers,
  subTabs,
  selectedSubTab,
  isPageDirty,
  isCreatedByLoginUser,
  handlers,
  hasRfiTabPermission,
  isWorklist,
  isHistoryCases,
  notificationObj,
  isFrontEndContact,
  isSeniorManager,
  isOperationsLead,
  loggedInUserEmail
}) {
  const currentUser = useSelector(selectUserRole);
  const isAuthorisedSignatory =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) => [AUTHORISED_SIGNATORY.toLowerCase()].includes(item.name.toLowerCase()));
  const isTechnicianManager =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) => [ROLE_TECHNICIAN_MANAGER.toLowerCase()].includes(item.name.toLowerCase()));
  const isWorkBasketOrAllCases = caseDetails?.taskView === WORKBASKET || caseDetails?.taskView === ALL_CASES;
  const isNotResolvedOrSendToFECValue =
    rfiDetails?.isNotResolvedOrSendToFEC === RESOLVE_SENDTOFEC_YES && rfiDetails?.status === RFI_STATUS.OPEN;
  const isQcFlag = caseDetails?.bpmFlag === constants.QC_BPM_FLAG ? true : false;
  if (isWorkBasketOrAllCases || isNotResolvedOrSendToFECValue || isTechnicianManager) {
    isCreatedByLoginUser = true;
  }
  const permissions = isSeniorManager || isFrontEndContact || isOperationsLead ? ['read'] : ['read', 'create', 'update', 'delete'];
  const isOpen = selectedSubTab.status === RFI_STATUS.OPEN;
  let isNewRfi = selectedSubTab.id === PREMIUM_PROCESSING_TAB_NEW_RFI;
  if (isSeniorManager && isOpen) {
    isNewRfi = true;
  }
  let showReadOnlyForm = isOpen && isCreatedByLoginUser;
  const isResponded = selectedSubTab.status === RFI_STATUS.RESPONSE_RECEIVED;
  const isResolved = selectedSubTab.status === RFI_STATUS.RESOLVED;
  const hasRfiTabPermissionValue = isAuthorisedSignatory ? !hasRfiTabPermission : hasRfiTabPermission;
  const respondRfiDisable = Boolean(loggedInUserEmail === rfiDetails?.sendTo) 
  const rfiSubTabs = useSelector(selectcaseRfiSubTabs);
  let isRfiNotification;
  rfiSubTabs.forEach((rfiSub) => {
    notificationObj.forEach((notify) => {
      const taskIdNotifiy = notify.refId.split('||')[1];
      if (taskIdNotifiy === rfiSub.taskId) {
        return (isRfiNotification = true);
      }
    });
  });
  isRfiNotification = isRfiNotification === true ? true : false;
  if ((!isRfiNotification && isFrontEndContact) || isSeniorManager || isOperationsLead) {
    isNewRfi = false;
  }
  if (!isNewRfi && isSeniorManager && isCreatedByLoginUser) {
    showReadOnlyForm = false;
  }

  return (
    <>
      {hasRfiTabPermissionValue && (
        <AccessControl feature="premiumProcessing.RFITab" permissions="read">
          <Tabs tabs={subTabs} overrideTab={selectedSubTab?.id} onChange={(tabName) => handlers.selectTab(tabName)} />
        </AccessControl>
      )}

      {(isNewRfi || showReadOnlyForm) && (
        <AccessControl feature="premiumProcessing.CreateRFI" permissions={permissions}>
          <PremiumProcessingCaseRFIForm
            caseDetails={caseDetails}
            rfiDetails={rfiDetails}
            newRfiUsers={newRfiUsers}
            isEditable={isFrontEndContact || isQcFlag ? !isNewRfi : isNewRfi}
            isPageDirty={isPageDirty}
            isWorklist={isWorklist}
            isSeniorManager={isSeniorManager}
            handlers={handlers}
          />
        </AccessControl>
      )}

      {!isNewRfi && isOpen && (
        <AccessControl feature="premiumProcessing.ResponseRFI" permissions={permissions}>
          <PremiumProcessingCaseRfiRespond
            caseDetails={caseDetails}
            rfiDetails={rfiDetails}
            isPageDirty={isPageDirty}
            isWorklist={isWorklist}
            handlers={handlers}
            respondRfiDisable={respondRfiDisable}
          />
        </AccessControl>
      )}

      {!isNewRfi && (isResponded || isResolved) && (
        <AccessControl feature="premiumProcessing.ResolveRFI" permissions={permissions}>
          <PremiumProcessingCaseRfiResolve
            rfiDetails={rfiDetails}
            isEditable={(isFrontEndContact && isResponded) || isQcFlag ? !isResponded : isResponded}
            isPageDirty={isPageDirty}
            isResolved={isResolved}
            handlers={handlers}
          />
        </AccessControl>
      )}

      {((!isRfiNotification && isFrontEndContact && !isNewRfi && !isResolved) ||
        ((subTabs.length === 0) && (isSeniorManager || isFrontEndContact || isHistoryCases))) && (
          <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
        )}
    </>
  );
}
