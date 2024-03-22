import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { PremiumProcessingCaseDetailsView } from './PremiumProcessingCaseDetails.view';
import {
  getCaseTeamModule,
  getCheckSigningCaseHistory,
  getCaseHistoryDetails,
  getCaseTeamDetails,
  selectCaseDetails,
  selectCaseRfiDetails,
  hideModal,
  showModal,
  selectRefDataNewProcessType,
  selectRefDataNewFacilityType,
  selectRefDataNewBordereauType,
  selectRefDataNewBordereauPolicyType,
  getCaseTeamDetailsSuccess,
  selectCaseIsCheckSigning,
  selectUser,
  selectPremiumProcessingCasesSelected,
  getCaseRFIDetails,
  selectcaseRfiSubTabs,
  getCaseRfiSubTabData,
  selectUserRole,
} from 'stores';
import { useConfirmNavigation } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

const PremiumProcessingCaseDetails = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id, tab } = useParams();
  const { confirmNavigation } = useConfirmNavigation();

  const user = useSelector(selectUser);
  const caseDetails = useSelector(selectCaseDetails);
  const caseRfiDetails = useSelector(selectCaseRfiDetails);
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const processTypeRefData = useSelector(selectRefDataNewProcessType) || [];
  const facilityTypeRefData = useSelector(selectRefDataNewFacilityType) || [];
  const bordereauTypeRefData = useSelector(selectRefDataNewBordereauType) || [];
  const bordereauPolicyTypeRefData = useSelector(selectRefDataNewBordereauPolicyType) || [];
  const isCheckSigning = useSelector(selectCaseIsCheckSigning) || false;
  const cases = useSelector(selectPremiumProcessingCasesSelected);
  const rfiSubTabs = useSelector(selectcaseRfiSubTabs);
  const currentUser = useSelector(selectUserRole);
  const isHistoryCases = caseDetails?.taskView === constants.ALL_CASES;
  const isFrontEndContact =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) => [constants.FRONT_END_CONTACT.toLowerCase()].includes(item.name.toLowerCase()));
  const isSeniorManager =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) => [constants.SENIOR_MANAGER.toLowerCase()].includes(item.name.toLowerCase()));
  const isFCE = user?.userRole?.some((role) => role?.name === constants.ROLE_FRONT_END_CONTACT);
  const isOperationsLead = user?.userRole?.some((role) => role?.name === constants.ROLE_OPERATIONS_LEAD);
  const hasDocumentSearchPermission = isFCE || isOperationsLead;

  const taskId = id || '';
  const { processId, caseId, caseStageDetails } = caseDetails;
  const rfiCaseId = caseRfiDetails?.caseId;
  const rfiType = caseRfiDetails?.rfiType ? true : false;
  const rfiProcessId = caseRfiDetails?.processId;
  const isIssueDocumentStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_ISSUE_DOCUMENTS].includes(cs.bpmStageCode) && cs.active);
  const isCompletedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_COMPLETED].includes(cs.bpmStageCode) && cs.active);
  const isRejectedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_REJECTED].includes(cs.bpmStageCode) && cs.active);
  const isRfiCase = utils.generic.isValidArray(cases, true) && utils.premiumProcessing.isRfi(cases?.[0]);

  const breadcrumbs = [
    {
      name: 'premiumProcessing',
      label: utils.string.t('premiumProcessing.breadcrumbs.home'),
      link: config.routes.premiumProcessing.root,
    },
    ...(caseId || rfiCaseId
      ? [
          {
            name: 'caseId',
            label: utils.string.t('premiumProcessing.breadcrumbs.case', { id: caseId || rfiCaseId }),
            link: '#',
            active: true,
          },
        ]
      : []),
  ];

  const tabs = [
    { value: constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS, label: utils.string.t('premiumProcessing.tabs.caseDetails') },
    {
      value: constants.PREMIUM_PROCESSING_TAB_DOCUMENTS,
      label: utils.string.t('premiumProcessing.tabs.documents'),
    },
    {
      value: constants.PREMIUM_PROCESSING_TAB_RFI,
      label: utils.string.t('premiumProcessing.tabs.rfi'),
    },
    ...(!isCheckSigning
      ? [
          {
            value: constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS,
            label: utils.string.t('premiumProcessing.tabs.issueDocuments'),
            disabled: !isIssueDocumentStage && !isCompletedStage && !isRejectedStage,
          },
        ]
      : []),
    { value: constants.PREMIUM_PROCESSING_TAB_NOTES, label: utils.string.t('premiumProcessing.tabs.notes') },
    ...(isCheckSigning
      ? [{ value: constants.PREMIUM_PROCESSING_TAB_HISTORY, label: utils.string.t('premiumProcessing.tabs.history') }]
      : []),
  ];

  const isValidTab = tabs.map((item) => item.value).includes(tab);

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isPageDirty, setIsPageDirty] = useState(false);
  const [selectedTab, setSelectedTab] = useState(isValidTab ? tab : constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS);

  const openUpdatingPopup = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.alert'),
          maxWidth: 'xs',
          componentProps: {
            hideCancelButton: true,
            confirmLabel: utils.string.t('processingInstructions.authorisations.form.confirm'),
            confirmMessage: (
              <span
                dangerouslySetInnerHTML={{
                  __html: `${utils.string.t('premiumProcessing.piHyperLinkErrorMessage')}`,
                }}
              />
            ),
            buttonColors: { confirm: 'secondary' },
            submitHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const switchTab = (newTab) => {
    setSelectedTab(newTab);
    setIsPageDirty(false);
    history.replace(`${config.routes.premiumProcessing.case}${taskId ? `/${taskId}` : ''}${tab ? `/${newTab}` : ''}`);
    dispatch(hideModal());
  };

  const stayOnTab = () => {
    dispatch(hideModal());
  };

  useEffect(() => {
    if (caseId || rfiCaseId) {
      const caseIdData = caseId || rfiCaseId;
      dispatch(getCaseRfiSubTabData(caseIdData));
    }
  }, [dispatch, caseId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectTab = (tab) => {
    if (isPageDirty) {
      confirmNavigation(() => switchTab(tab), stayOnTab);
    } else {
      setIsPageDirty(false);
      setSelectedTab(tab);

      // history tab in PP rfi to land directly on the particular tab
      if ((isHistoryCases || isFrontEndContact || isSeniorManager) && rfiSubTabs.length >= 1) {
        const selectedList = rfiSubTabs.filter((item) => item, 'taskId');
        history.replace(
          `${config.routes.premiumProcessing.case}${taskId ? `/${taskId}` : ''}${tab ? `/${tab}` : ''}${
            tab === constants.PREMIUM_PROCESSING_TAB_RFI
              ? `/${selectedList[0]?.taskId}`
              : tab === constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS
              ? `/${constants.PREMIUM_PROCESSING_TAB_NON_BUREAU}`
              : ''
          }`
        );
      } else {
        history.replace(
          `${config.routes.premiumProcessing.case}${taskId ? `/${taskId}` : ''}${tab ? `/${tab}` : ''}${
            tab === constants.PREMIUM_PROCESSING_TAB_RFI
              ? `/${constants.PREMIUM_PROCESSING_TAB_NEW_RFI}`
              : tab === constants.PREMIUM_PROCESSING_TAB_ISSUE_DOCUMENTS
              ? `/${constants.PREMIUM_PROCESSING_TAB_NON_BUREAU}`
              : ''
          }`
        );
      }
    }
  };

  useEffect(() => {
    if (isRfiCase) {
      dispatch(getCaseRFIDetails({ taskId: cases[0]?.taskId }));
    }
    if (taskId && !isDataLoaded) {
      dispatch(getCaseTeamDetails({ taskId, taskView: caseDetails.taskView || constants.WORKLIST })).then((response) => {
        if (response?.message === constants.API_RESPONSE_SUCCESS) {
          if (response?.status?.toUpperCase() === constants.API_RESPONSE_OK) {
            response.data.caseDetails.processId =
              (response.data?.caseDetails?.processId &&
                utils.referenceData.processTypes.getNameById(processTypeRefData, response.data?.caseDetails?.processId)) ||
              '';
            if (response.data?.caseDetails?.processId === constants.FDO && response.data?.caseDetails?.facilityTypeId) {
              const facilityTypesName =
                (utils.generic.isValidArray(facilityTypeRefData, true) &&
                  response.data?.caseDetails?.facilityTypeId &&
                  utils.referenceData.facilityTypes.getNameById(facilityTypeRefData, response.data?.caseDetails?.facilityTypeId)) ||
                '';
              response.data.caseDetails.facilityTypeId = facilityTypesName;
            }
            if (response.data?.caseDetails?.processId === constants.BORDEREAU) {
              if (response.data?.caseDetails?.bordereauTypeId) {
                const bordereauTypeName =
                  (utils.generic.isValidArray(bordereauTypeRefData, true) &&
                    response.data?.caseDetails?.bordereauTypeId &&
                    utils.referenceData.bordereauTypes.getNameById(bordereauTypeRefData, response.data?.caseDetails?.bordereauTypeId)) ||
                  '';
                response.data.caseDetails.bordereauTypeId = bordereauTypeName;
              }
              if (response.data?.caseDetails?.policyTypeId) {
                const bordereauPolicyTypeName =
                  (utils.generic.isValidArray(bordereauPolicyTypeRefData, true) &&
                    response.data?.caseDetails?.policyTypeId &&
                    utils.referenceData.bordereauPolicyTypes.getNameById(
                      bordereauPolicyTypeRefData,
                      response.data?.caseDetails?.policyTypeId
                    )) ||
                  '';
                response.data.caseDetails.policyTypeId = bordereauPolicyTypeName;
              }
            }
            dispatch(getCaseTeamDetailsSuccess(response.data));
          }
        }
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const processIdData = processId ? processId : rfiProcessId;
    const getData = () => {
      const promises = [
        dispatch(getCaseTeamModule({ taskId, rfiCaseId, rfiType })),
        dispatch(getCaseHistoryDetails({ taskId, processId })),
        dispatch(getCheckSigningCaseHistory({ processIdData })),
      ];
      return Promise.allSettled(promises).then((results) => Promise.resolve(results));
    };

    if (processId || rfiCaseId) {
      getData().then((data) => {
        if (utils.generic.isValidArray(data, true)) {
          setIsDataLoaded(true);
        }
      });
    }
  }, [taskId, processId, rfiCaseId, rfiType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('premiumProcessing.title')} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>
      <PremiumProcessingCaseDetailsView
        hasDocumentSearchPermission={hasDocumentSearchPermission}
        taskId={taskId}
        caseId={caseId}
        caseDetails={caseDetails}
        breadcrumbs={breadcrumbs}
        tabs={tabs}
        selectedTab={selectedTab}
        isPageDirty={isPageDirty}
        handlers={{ confirmNavigation, openUpdatingPopup, selectTab, setIsPageDirty }}
      />
    </>
  );
};

export default PremiumProcessingCaseDetails;
