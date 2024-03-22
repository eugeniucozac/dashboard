import { React, useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './PremiumProcessingCaseRFI.styles';
import PremiumProcessingCaseRFIView from './PremiumProcessingCaseRFI.view';
import {
  getCaseRfiSubTabData,
  selectcaseRfiSubTabs,
  selectUser,
  selectCaseRfiDetails,
  hideModal,
  getCaseRFIDetails,
  selectUserEmail,
  selectUsersInRoles,
  getUsersForRole,
  selectRfiHistory,
  getViewTableDocuments,
  selectUserRole
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

PremiumProcessingCaseRFI.propTypes = {
  taskId: PropTypes.string.isRequired,
  caseId: PropTypes.string.isRequired,
  caseDetailsObject: PropTypes.object.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    setIsPageDirty: PropTypes.func.isRequired,
    confirmNavigation: PropTypes.func.isRequired,
  }),
};
function PremiumProcessingCaseRFI({ taskId, caseId, caseDetailsObject, isPageDirty, handlers }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseRFI' })();

  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  const isNewRfiUsersFetched = useRef(false);
  const rfiSubTabs = useSelector(selectcaseRfiSubTabs);
  const caseRfiDetails = useSelector(selectCaseRfiDetails);
  const userEmail = useSelector(selectUserEmail);
  const newRfiUsers = useSelector(selectUsersInRoles);
  const user = useSelector(selectUser);
  const caseRfiHistory = useSelector(selectRfiHistory);
  const currentUser = useSelector(selectUserRole);
  const rfiCaseId = caseRfiDetails?.caseId;
  const isWorklist = caseDetailsObject?.taskView === constants.WORKLIST;
  const hasRfiTabPermission = utils.app.access.feature('premiumProcessing.RFITab', ['read'], user);
  const newRfiTab = {
    value: constants.PREMIUM_PROCESSING_TAB_NEW_RFI,
    label: utils.string.t('premiumProcessing.rfi.newRfi'),
  };
  const isHistoryCases = caseDetailsObject?.taskView === constants.ALL_CASES;
  const isFrontEndContact =
  utils.generic.isValidArray(currentUser, true) &&
  currentUser.some((item) => [constants.FRONT_END_CONTACT.toLowerCase()].includes(item.name.toLowerCase()));
  const isSeniorManager =
  utils.generic.isValidArray(currentUser, true) &&
  currentUser.some((item) => [constants.SENIOR_MANAGER.toLowerCase()].includes(item.name.toLowerCase()));
  const isOperationsLead =
  utils.generic.isValidArray(currentUser, true) &&
  currentUser.some((item) => [constants.OPERATIONS_LEAD.toLowerCase()].includes(item.name.toLowerCase()));
  const notificationObj = useSelector((state) => get(state, 'notifications.notificationList'));
  const paramsRfiTab = params?.subtab?.toString();
  const isValidTab = rfiSubTabs.map((tab) => tab.taskId).includes(paramsRfiTab);
  const [selectedTab, setSelectedTab] = useState({ id: isValidTab ? paramsRfiTab : constants.PREMIUM_PROCESSING_TAB_NEW_RFI, status: '' });
  const subTabs = rfiSubTabs?.map((tab) => {
    return {
      value: tab.taskId,
      label: utils.string.t('premiumProcessing.rfi.tabName', { type: tab.rfiType, id: tab.queryId }),
      subLabel: (
        <>
          <FiberManualRecordIcon
            className={classnames({
              [classes.status]: true,
              [classes.open]: tab.status === constants.RFI_STATUS.OPEN,
              [classes.responseReceived]: tab.status === constants.RFI_STATUS.RESPONSE_RECEIVED,
              [classes.resolved]: tab.status === constants.RFI_STATUS.RESOLVED,
            })}
          />
          {tab.status}
        </>
      ),
    };
  });

  useEffect(() => {
    if (caseId || rfiCaseId) {
      const caseIdData = caseId || rfiCaseId;
      dispatch(getCaseRfiSubTabData(caseIdData));
    }
  }, [dispatch, caseId, rfiCaseId, caseRfiHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const selectedTabStatus = utils.generic.isValidArray(rfiSubTabs)
      ? rfiSubTabs.find((tab) => tab.taskId?.toString() === paramsRfiTab?.toString())?.status || ''
      : '';

    setSelectedTab({ id: isValidTab ? paramsRfiTab : constants.PREMIUM_PROCESSING_TAB_NEW_RFI, status: selectedTabStatus });
  }, [rfiSubTabs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (paramsRfiTab && paramsRfiTab !== constants.PREMIUM_PROCESSING_TAB_NEW_RFI) {
      dispatch(getCaseRFIDetails({ taskId: paramsRfiTab })).then((res) => {
        if (res?.taskId) {
          setSelectedTab({ id: res.taskId, status: res.status });
        }
      });
    }
  }, [paramsRfiTab, caseRfiHistory]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isNewRfiUsersFetched.current) {
      dispatch(getUsersForRole([constants.FRONT_END_CONTACT, constants.OPERATIONS_LEAD])).then((res) => {
        if (utils.generic.isValidArray(res, true)) {
          isNewRfiUsersFetched.current = true;
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const switchTab = (newTab) => {
    setSelectedTab({ id: newTab, status: '' });
    handlers.setIsPageDirty(false);
    if (newTab === constants.PREMIUM_PROCESSING_TAB_NEW_RFI) {
      rfiDocumentAttached();
    }
    history.replace(`${config.routes.premiumProcessing.case}/${taskId}/${constants.PREMIUM_PROCESSING_TAB_RFI}/${newTab}`);
    dispatch(hideModal('CONFIRM'));
    return;
  };

  const rfiDocumentAttached = () => {
    const paramsData = {
      referenceId: caseDetailsObject?.caseId,
      sectionType: constants.DMS_CONTEXT_CASE,
      instructionId: caseDetailsObject?.instructionId,
      policyRef: caseDetailsObject?.policyRef,
    };
    dispatch(getViewTableDocuments(paramsData));
  };

  const stayOnTab = () => {
    dispatch(hideModal('CONFIRM'));
    return;
  };

  const selectTab = (tabName) => {
    if (tabName === selectedTab?.id) return;
    if (isPageDirty) {
      handlers.confirmNavigation(() => switchTab(tabName), stayOnTab);
      return;
    } else {
      switchTab(tabName);
    }
  };

  return (
    <PremiumProcessingCaseRFIView
      hasRfiTabPermission={hasRfiTabPermission}
      caseDetails={caseDetailsObject}
      rfiDetails={caseRfiDetails}
      newRfiUsers={newRfiUsers}
      subTabs={isHistoryCases || isFrontEndContact || isSeniorManager || isOperationsLead ? [...subTabs] : [newRfiTab, ...subTabs]}
      selectedSubTab={selectedTab}
      isCreatedByLoginUser={caseRfiDetails.createdByEmail === userEmail}
      isPageDirty={isPageDirty}
      isWorklist={isWorklist}
      isHistoryCases={isHistoryCases}
      isFrontEndContact={isFrontEndContact}
      isSeniorManager={isSeniorManager}
      isOperationsLead={isOperationsLead}
      notificationObj={notificationObj}
      loggedInUserEmail={userEmail}
      handlers={{ ...handlers, selectTab, switchTab, stayOnTab }}
    />
  );
}
export default PremiumProcessingCaseRFI;
