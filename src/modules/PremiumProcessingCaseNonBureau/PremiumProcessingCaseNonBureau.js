import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import PremiumProcessingCaseNonBureauView from './PremiumProcessingCaseNonBureau.view';
import * as utils from 'utils';
import { getNonBureauList, selectUser } from 'stores';
import * as constants from 'consts';

PremiumProcessingCaseNonBureau.propTypes = {
  caseDetailsObject: PropTypes.object.isRequired,
  isNotMyTaskView: PropTypes.bool.isRequired,
};
export default function PremiumProcessingCaseNonBureau({ caseDetailsObject, isNotMyTaskView }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [openEms, setOpenEms] = useState(false);
  const [nonBureauDetails, setNonBureauDetails] = useState({});
  const [accountName, setAccountName] = useState('');

  const hasEditPermission = utils.app.access.feature('premiumProcessing.issueDocumentNbi', ['read', 'create', 'update', 'delete'], user);
  const hasViewPermission = utils.app.access.feature('premiumProcessing.issueDocumentNbi', ['read'], user);
  const nonBureauInsurerList = caseDetailsObject?.caseIssueDocuments?.nonBureauList?.items;
  const policyId = caseDetailsObject?.policyId || '';
  const xbInstanceId = caseDetailsObject?.caseTeamData?.xbInstanceId || '';
  const caseIncidentID = caseDetailsObject?.caseId;
  const { caseStageDetails } = caseDetailsObject;
  const isCompletedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_COMPLETED].includes(cs.bpmStageCode) && cs.active);
  const isRejectedStage = caseStageDetails?.some((cs) => [constants.BPM_STAGE_REJECTED].includes(cs.bpmStageCode) && cs.active);

  useEffect(() => {
    dispatch(getNonBureauList({ caseIncidentID, policyId, xbInstanceId }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendEmail = (nonBureauData) => {
    setOpenEms(true);
    setNonBureauDetails(nonBureauData);
    setAccountName(nonBureauData?.underWriterAccountName);
  };

  const goBack = () => {
    dispatch(getNonBureauList({ caseIncidentID, policyId, xbInstanceId })).then((data) => {
      if (data?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
        setOpenEms(false);
        setNonBureauDetails({});
        setAccountName('');
      }
    });
  };

  const columnsData = [
    {
      id: 'nonBureauInsurer',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.nonBureauColumns.nonBureauInsurer'),
    },
    {
      id: 'status',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.nonBureauColumns.status'),
    },
    {
      id: 'sentDate',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.nonBureauColumns.sentDate'),
    },
    {
      id: 'emailDocument',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.nonBureauColumns.emailDocument'),
    },
  ];
  return (
    <PremiumProcessingCaseNonBureauView
      accountName={accountName}
      caseDetailsObject={caseDetailsObject}
      columnsData={columnsData}
      nonBureauDetails={nonBureauDetails}
      openEms={openEms}
      nonBureauInsurers={nonBureauInsurerList}
      isSendEmailAllowed={hasEditPermission && !isCompletedStage && !isRejectedStage}
      hasViewOrEditAccess={hasEditPermission || hasViewPermission}
      handlers={{ sendEmail, goBack }}
      isNotMyTaskView={isNotMyTaskView}
    />
  );
}
