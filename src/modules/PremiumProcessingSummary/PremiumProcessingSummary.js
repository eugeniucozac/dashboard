import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';

// app
import { PremiumProcessingSummaryView } from './PremiumProcessingSummary.view';
import {
  collapseSidebar,
  getCaseTeamDetails,
  selectCaseDetails,
  selectUserRole,
  showModal,
  selectCaseRfiDetails,
  selectPremiumProcessingCasesSelected,
  getCaseRFIDetails,
  selectRefDataNewFacilityType,
  selectRefDataNewProcessType,
  selectRefDataNewBordereauType,
  selectRefDataNewBordereauPolicyType,
  getCaseTeamDetailsSuccess,
  resetPremiumProcessingTaskSearch,
  resetPremiumProcessingTasksFilters,
  selectCaseTaskTypeView,
  getPremiumProcessingTasksDetails,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

PremiumProcessingSummary.propTypes = {
  type: PropTypes.string.isRequired,
};

export default function PremiumProcessingSummary({ type }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const cases = useSelector(selectPremiumProcessingCasesSelected);
  const caseDetails = useSelector(selectCaseDetails);
  const caseRfiDetails = useSelector(selectCaseRfiDetails);
  const currentUser = useSelector(selectUserRole);
  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  const isValidCaseDetails = Boolean(caseDetails?.caseId && !isEmpty(caseDetails?.caseTeamData));
  const isValidRFICaseDetails = Boolean(caseRfiDetails?.taskId && !isEmpty(caseRfiDetails));
  const caseStages = caseDetails?.caseStageDetails;
  const isAllCases = type === constants.ALL_CASES;
  const { caseId, taskId, bpmProcessId, processId } = utils.generic.isValidArray(cases, true) && cases[0];
  const isCheckSigningCase = caseDetails?.isCheckSigning;
  const getActiveStageIndex = utils.generic.isValidArray(caseStages, true) ? caseStages?.findIndex((cs) => cs.active) : 0;
  const findActiveStep =
    utils.generic.isValidArray(caseStages, true) && getActiveStageIndex >= 0
      ? caseStages[getActiveStageIndex]?.bpmStageCode === constants.BPM_STAGE_COMPLETED
        ? getActiveStageIndex + 1
        : getActiveStageIndex
      : 0;

  const facilityTypeRefData = useSelector(selectRefDataNewFacilityType) || [];
  const bordereauTypeRefData = useSelector(selectRefDataNewBordereauType) || [];
  const bordereauPolicyTypeRefData = useSelector(selectRefDataNewBordereauPolicyType) || [];
  const processTypeRefData = useSelector(selectRefDataNewProcessType) || [];
  const iscaseTeamLoading = useSelector((state) => state.premiumProcessing.isCaseTeamLoading) || false;

  const isTransactionCommitedRole =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) =>
      [constants.FRONT_END_CONTACT.toLowerCase(), constants.OPERATIONS_LEAD.toLowerCase()].includes(item.name.toLowerCase())
    );

  const isTransactionCommited =
    caseStages?.some((cs) => [constants.BPM_STAGE_COMMIT_TRANSACTION].includes(cs.bpmStageCode) && cs.active) &&
    !isAllCases &&
    !isTransactionCommitedRole;

  const isUnassignedStage = caseStages?.some((cs) => [constants.BPM_STAGE_UNASSIGNED].includes(cs.bpmStageCode) && cs.active);
  const isIssueDocumentStage = caseStages?.some((cs) => [constants.BPM_STAGE_ISSUE_DOCUMENTS].includes(cs.bpmStageCode) && cs.active);
  const isRfiCase = utils.generic.isValidArray(cases, true) && utils.premiumProcessing.isRfi(cases?.[0]);

  useEffect(() => {
    // cleanup
    return () => {
      dispatch(collapseSidebar());
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isRfiCase) {
      dispatch(getCaseRFIDetails({ taskId: cases[0]?.taskId }));
    } else {
      if (taskId || processId) {
        dispatch(getCaseTeamDetails({ taskId: cases[0]?.taskId || cases[0]?.processId, taskView: type })).then((response) => {
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
    }
    if (caseDetails) {
    }
  }, [taskId, caseId, cases[0]?.caseStage]); //eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (caseStages && caseStages.length > 0) {
      const caseSteps = caseStages?.map((cs) => {
        return {
          label: cs.bpmShortStageName,
          slug: cs.bpmStageCode,
          isIcon: cs.bpmStageCode === constants.BPM_STAGE_REJECTED || cs.bpmStageCode === constants.BPM_STAGE_CANCELLED ? true : false,
        };
      });
      setSteps(caseSteps);
      setActiveStep(findActiveStep === -1 ? 0 : findActiveStep);
    }
  }, [caseStages, findActiveStep]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const clickCaseTeam = () => {
    if (bpmProcessId) {
      dispatch(resetPremiumProcessingTaskSearch());
      dispatch(resetPremiumProcessingTasksFilters());
      dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
      dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
      history.push(
        `${config.routes.premiumProcessing.case}/${taskId ? taskId : bpmProcessId}/${constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS}`
      );
    }
  };

  const clickRfiDetails = () => {
    if (caseRfiDetails?.parentTaskId && caseRfiDetails?.taskId) {
      dispatch(resetPremiumProcessingTaskSearch());
      dispatch(resetPremiumProcessingTasksFilters());
      dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
      dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));

      history.push(
        `${config.routes.premiumProcessing.case}/${caseRfiDetails?.parentTaskId}/${constants.PREMIUM_PROCESSING_TAB_RFI}/${caseRfiDetails?.taskId}`
      );
    }
  };

  return (
    <PremiumProcessingSummaryView
      type={type}
      iscaseTeamLoading={iscaseTeamLoading}
      selectedCases={cases}
      caseDetails={caseDetails}
      caseRfiDetails={caseRfiDetails}
      steps={steps}
      activeStep={activeStep}
      currentUser={currentUser}
      isAllCases={isAllCases}
      isCheckSigningCase={isCheckSigningCase}
      isIssueDocumentStage={isIssueDocumentStage}
      isTransactionCommited={isTransactionCommited}
      isUnassignedStage={isUnassignedStage}
      isValid={isValidCaseDetails}
      isValidRFI={isValidRFICaseDetails}
      handlers={{ openUpdatingPopup, clickCaseTeam, clickRfiDetails }}
    />
  );
}
