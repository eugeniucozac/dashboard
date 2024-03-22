import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import PremiumProcessingCaseClientTableView from './PremiumProcessingCaseClientTable.view';
import * as utils from 'utils';
import { getCaseClientTable, selectUser } from 'stores';
import * as constants from 'consts';

PremiumProcessingCaseClientTable.propTypes = {
  caseDetailsObject: PropTypes.object.isRequired,
  isNotMyTaskView: PropTypes.bool.isRequired,
};

export default function PremiumProcessingCaseClientTable({ caseDetailsObject, isNotMyTaskView }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);

  const clientList = caseDetailsObject?.caseIssueDocuments?.caseClientList?.items;
  const frontEndSendDocs = caseDetailsObject?.frontEndSendDocs || false;
  const policyId = caseDetailsObject?.policyId || '';
  const sourceId = caseDetailsObject?.caseTeamData?.xbInstanceId || '';
  const caseIncidentID = caseDetailsObject?.caseId;
  const { caseStageDetails } = caseDetailsObject;
  const [openEms, setOpenEms] = useState(false);
  const [clientDetails, setClientDetails] = useState({});
  const [isSendEmailAllowed, setIsSendEmailAllowed] = useState(false);
  const [isFecSendEmailAllowed, setIsFecSendEmailAllowed] = useState(false);
  const [accountName, setAccountName] = useState('');
  const [clientListData, setClientListData] = useState([]);
  const hasSendEmailPermission = utils.app.access.feature(
    'premiumProcessing.issueDocumentClient',
    ['read', 'create', 'update', 'delete'],
    user
  );
  const isFecToClientSendEmail = utils.app.access.feature(
    'issueDocumentClient.fecToClientSendEmail',
    ['read', 'create', 'update', 'delete'],
    user
  );
  const hasEditPermission = utils.app.access.feature('premiumProcessing.issueDocumentClient', ['read', 'create', 'update', 'delete'], user);
  const hasViewPermission = utils.app.access.feature('premiumProcessing.issueDocumentClient', ['read'], user);
  const isCompletedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_COMPLETED].includes(cs.bpmStageCode) && cs.active);
  const isRejectedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_REJECTED].includes(cs.bpmStageCode) && cs.active);
  const setEmailPermission = () => {
    if (!isCompletedStage && !isRejectedStage) {
      // for junior and senior technician role
      if (hasSendEmailPermission && !isFecToClientSendEmail) {
        setIsSendEmailAllowed(true);
      }
      // for FEC and OL role
      else if (!hasSendEmailPermission && isFecToClientSendEmail) {
        setIsFecSendEmailAllowed(true);
      }
      // for other role
      else {
        setIsSendEmailAllowed(false);
        setIsFecSendEmailAllowed(false);
      }
    } else {
      setIsSendEmailAllowed(false);
      setIsFecSendEmailAllowed(false);
    }
  };

  useEffect(() => {
    if (utils.generic.isValidArray(clientList, true)) {
      clientList.forEach((data, index) => {
        const isNotBackOfficeToFecMailSent =
          ([utils.string.t('premiumProcessing.processingClientTable.tableColumns.backOfficeToFEC').toLowerCase()].includes(
            data.documentsSend.toLowerCase()
          ) &&
            !data.sendDate) ||
          false;
        if (isNotBackOfficeToFecMailSent) {
          clientList.splice(index, 1, { ...data, isNotBackOfficeToFecMailSent });
        }
      });
    }
    setClientListData(clientList);
  }, [clientList]);

  useEffect(() => {
    dispatch(getCaseClientTable({ caseIncidentID, policyId, sourceId }));
  }, [dispatch, policyId, sourceId, caseIncidentID]);

  useEffect(
    () => {
      setEmailPermission();
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const sendEmail = (clientData) => {
    setOpenEms(true);
    setClientDetails(clientData);
    setAccountName(clientData?.accountName);
  };

  const goBack = () => {
    dispatch(getCaseClientTable({ caseIncidentID, policyId, sourceId })).then((data) => {
      if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
        setOpenEms(false);
        setClientDetails({});
        setAccountName('');
      }
    });
  };

  const columnsData = [
    {
      id: 'client',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.processingClientTable.tableColumns.client'),
    },
    {
      id: 'documentSent',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.processingClientTable.tableColumns.documentSent'),
    },
    {
      id: 'status',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.processingClientTable.tableColumns.status'),
    },
    {
      id: 'sentDate',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.processingClientTable.tableColumns.sentDate'),
    },
    {
      id: 'emailDocument',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.processingClientTable.tableColumns.emailDocument'),
    },
  ];

  return (
    <PremiumProcessingCaseClientTableView
      accountName={accountName}
      caseDetailsObject={caseDetailsObject}
      caseIncidentID={caseIncidentID}
      frontEndSendDocs={frontEndSendDocs}
      openEms={openEms}
      clientDetails={clientDetails}
      columnsData={columnsData}
      clientTable={clientListData}
      isSendEmailAllowed={isSendEmailAllowed}
      isFecSendEmailAllowed={isFecSendEmailAllowed}
      hasViewOrEditAccess={hasEditPermission || hasViewPermission}
      handlers={{ sendEmail, goBack }}
      isNotMyTaskView={isNotMyTaskView}
    />
  );
}
