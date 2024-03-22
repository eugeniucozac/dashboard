import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//app
import { RfiDetailsView } from './RfiDetails.view';
import {
  setDmsTaskContextType,
  resetDmsTaskTypeContext,
  selectLossInformation,
  selectLossInfoIsLoading,
  selectClaimsInformation,
  selectClaimsTabRows,
  selectClaimsTabSelectedClaimData,
  selectClaimInfoIsLoading,
  selectTaskDashboardTaskDetails,
  selectIsTaskDashboardTaskDetailsLoading,
  selectRfiHistoryListLoader,
  selectRefDataCatCodesList,
  selectQueryCodes,
  selectRefDataQueryCodes,
  selectLossQualifiers,
  selectSanctionsCheckStatus,
  getSanctionsCheckStatus,
  getLossInformation,
  getClaimsTabDetails,
  getSelectedClaimDetails,
  getClaimsTaskDashboardDetail,
  getRfiHistory,
  getRfiHistoryDocuments,
  setClaimsTabSelectedItem,
  selectRfiHistoryDocumentListLoader,
} from 'stores';
import { DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE } from 'consts';
import * as utils from 'utils';
import * as constants from 'consts';

export default function RfiDetails(props) {
  const { rfiTask } = props;
  const dispatch = useDispatch();

  const lossInformation = useSelector(selectLossInformation);
  const isLossInfoLoading = useSelector(selectLossInfoIsLoading);
  const claimsInformation = useSelector(selectClaimsInformation);
  const claimBasicDetail = useSelector(selectClaimsTabSelectedClaimData);
  const isClaimInfoLoading = useSelector(selectClaimInfoIsLoading);
  const associatedTaskInformation = useSelector(selectTaskDashboardTaskDetails);
  const isAssociatedTaskInfoLoading = useSelector(selectIsTaskDashboardTaskDetailsLoading);

  const catCodes = useSelector(selectRefDataCatCodesList);
  const claimsQueryCodes = useSelector(selectQueryCodes);
  const refDataQueryCodes = useSelector(selectRefDataQueryCodes);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const sanctionCheckStatus = useSelector(selectSanctionsCheckStatus);
  const rfiHistoryLoader = useSelector(selectRfiHistoryListLoader);
  const claimsTabRowsData = useSelector(selectClaimsTabRows);
  const rfiHistoryDocumentsLoader = useSelector(selectRfiHistoryDocumentListLoader);

  const rfiOriginType = utils.claimsRfi.checkRfiOriginType(rfiTask?.refType);
  const isInflightLoss = lossInformation?.isInflighLoss === 1 || true; // Defaulting to true as invalid loss id is present in RFI task created on Inflight Loss
  const claimDetail = claimsInformation?.claimReference ? claimsInformation : claimBasicDetail;
  const claimDashboardDisplayData = utils.generic.isValidArray(claimsTabRowsData, true) ? claimsTabRowsData[0] : {};

  useEffect(() => {
    getRfiHistoryDetails();
    dispatch(setDmsTaskContextType({ type: DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE, refId: rfiTask?.taskId }));

    dispatch(
      getLossInformation({
        lossDetailsId: rfiTask?.lossDetailID,
        sourceIdParams: rfiTask?.sourceID,
        divisionIdParam: rfiTask?.departmentID,
        claimRefParam: rfiTask?.claimRef || rfiTask?.processRef,
        viewLoader: false,
      })
    );
    dispatch(
      getClaimsTabDetails({
        requestType: constants.CLAIMS_TAB_REQ_TYPES.search,
        claimsType: constants.CLAIM_TEAM_TYPE.allClaims,
        searchBy: constants.CLAIMS_TAB_SEARCH_OPTION_CLAIM_REF,
        firstTimeSort: 'processRef',
        term: rfiTask?.claimRef,
      })
    );
    dispatch(
      getSelectedClaimDetails({
        claimId: rfiTask?.businessProcessID,
        claimRefParams: rfiTask?.claimRef,
        sourceIdParams: rfiTask?.sourceID,
        divisionIDParams: rfiTask?.departmentID,
        viewLoader: false,
      })
    );
    dispatch(getClaimsTaskDashboardDetail({ query: rfiTask?.parentTaskRef, claimID: rfiTask?.businessProcessID, viewLoader: false }));

    if (rfiTask?.taskDefKey === constants.SANCTIONS_CHECK_KEY) {
      dispatch(getSanctionsCheckStatus(rfiTask?.rootProcessId, false));
    }

    return () => {
      dispatch(resetDmsTaskTypeContext());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      utils.generic.isValidObject(claimDashboardDisplayData) &&
      (claimDashboardDisplayData?.claimRef || claimDashboardDisplayData?.claimReference)
    ) {
      dispatch(setClaimsTabSelectedItem(claimDashboardDisplayData, true));
    }
  }, [claimDashboardDisplayData]); // eslint-disable-line react-hooks/exhaustive-deps

  //Sections Data
  const lossInfo = utils.claimsAdditionalDetails.getLossCardInfo(lossInformation, catCodes, isInflightLoss, isLossInfoLoading);
  const claimInfo = utils.claimsAdditionalDetails.getClaimCardInfo(claimDetail, lossQualifiers, isClaimInfoLoading);
  const taskInfo = utils.claimsAdditionalDetails.getTaskCardInfo(
    associatedTaskInformation,
    sanctionCheckStatus,
    isAssociatedTaskInfoLoading
  );

  const getRfiHistoryDetails = () => {
    dispatch(getRfiHistory(rfiTask?.taskId))?.then((data) => {
      if (data.status === constants.API_RESPONSE_OK) {
        const rfihistoryList = [...data?.data];
        if (!utils.generic.isInvalidOrEmptyArray(rfihistoryList)) {
          const caseIncidentNotesList = [];
          rfihistoryList?.forEach((item) => {
            caseIncidentNotesList.push({
              referenceId: `${rfiTask?.taskId}-${item?.caseIncidentNotesID?.toString()}`,
              sectionType: constants.DMS_CONTEXT_TASK,
            });
          });
          dispatch(getRfiHistoryDocuments({ caseIncidentNotesList, taskId: rfiTask?.taskId }));
        }
      }
    });
  };

  const openDocViewer = (event, doc) => {
    event.preventDefault();
    const { documentId, documentName } = doc;
    utils.dms.dmsDocumentViewLauncher(documentId, documentName);
  };

  return (
    <RfiDetailsView
      {...props}
      rfiOriginType={rfiOriginType}
      lossInfo={lossInfo}
      claimInfo={claimInfo}
      taskInfo={taskInfo}
      claimsQueryCodes={claimsQueryCodes}
      refDataQueryCodes={refDataQueryCodes}
      rfiHistoryLoader={rfiHistoryLoader}
      rfiHistoryDocumentsLoader={rfiHistoryDocumentsLoader}
      handlers={{ openDocViewer: openDocViewer, getRfiHistoryDetails: getRfiHistoryDetails }}
    />
  );
}
