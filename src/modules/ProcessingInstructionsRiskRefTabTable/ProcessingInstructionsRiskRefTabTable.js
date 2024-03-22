import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import ProcessingInstructionsRiskRefTabTableView from './ProcessingInstructionsRiskRefTabTable.view';
import {
  showModal,
  selectUser,
  setSelectedRiskRef,
  resetSelectedRiskRef,
  getRiskReferenceDocumentsCount,
  getRiskReferencesDocumentsCountList,
  getIsRiskReferenceDocumentCountLoading,
  updateReferenceDocumentCountLoading,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

ProcessingInstructionsRiskRefTabTable.propTypes = {
  instruction: PropTypes.object.isRequired,
  documentTypeKey: PropTypes.string.isRequired,
};

export default function ProcessingInstructionsRiskRefTabTable({ instruction, documentTypeKey }) {
  const dispatch = useDispatch();

  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const user = useSelector(selectUser);
  const riskReferencesDocumentsCountList = useSelector(getRiskReferencesDocumentsCountList);
  const isRiskReferenceDocumentCountLoading = useSelector(getIsRiskReferenceDocumentCountLoading);

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isFaBorderProcessType = isBordereau || isFeeAndAmendment;
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);

  const userHasManageDocumentsPermission = utils.app.access.feature(
    'processingInstructions.manageDocuments',
    ['create', 'update', 'delete'],
    user
  );
  const isDocumentsEditable = userHasManageDocumentsPermission && (isDraft || isRejectedDraft || isReopened);

  const i18nPath = 'processingInstructions.checklist.tabs.riskRefs.table';

  const columns = [
    { id: 'isLead', label: utils.string.t(i18nPath + '.lead') },
    { id: 'riskRef', label: utils.string.t(i18nPath + '.riskRef') },
    { id: 'insured', label: utils.string.t(i18nPath + '.insured') },
    { id: 'yoa', label: utils.string.t(i18nPath + '.yoa') },
    { id: 'gxbInstance', label: utils.string.t(i18nPath + '.gxbInstance') },
    { id: 'client', label: utils.string.t(i18nPath + '.client') },
    { id: 'riskStatus', label: utils.string.t(i18nPath + '.riskStatus') },
    { id: 'riskDetails', label: utils.string.t(i18nPath + '.riskDetails') },
    ...(isEndorsement || isFeeAndAmendment
      ? [
          { id: 'endorsementRef', label: utils.string.t(i18nPath + '.endorsementRef') },
          { id: 'endorsementNonPremium', label: utils.string.t(i18nPath + '.nonPremium') },
        ]
      : []),
    { id: 'documentsCount', label: utils.string.t(i18nPath + '.documentsCount') },
    { id: 'manageDocuments', label: `${utils.string.t(i18nPath + '.manageDocuments')}${!isFaBorderProcessType ? '*' : ''}`, menu: true },
  ];

  const getRiskReferenceDocumentCount = () => {
    if (utils.generic.isValidArray(documents?.riskReferences, true)) {
      dispatch(updateReferenceDocumentCountLoading(true));
      const referenceList = documents?.riskReferences?.map((refData) => {
        return {
          endorsementId: refData.endorsementId,
          endorsementNumber: refData.endorsementNumber,
          riskRefId: refData.riskRefId,
          xbInstanceId: refData.xbInstanceId,
          xbPolicyId: refData.xbPolicyId,
        };
      });
      const documentTypeValue = isEndorsement
        ? constants.PI_ENDORSEMENT_TYPE_DOCUMENT.documentTypeDescription
        : isFaBorderProcessType
        ? constants.PI_FABORDER_TYPE_DOCUMENT.documentTypeDescription
        : constants.PI_CLOSING_FDO_TYPE_DOCUMENT.documentTypeDescription;
      dispatch(getRiskReferenceDocumentsCount(referenceList, documentTypeValue));
    }
  };

  const manageSetting = ({ riskRef }) => {
    dispatch(setSelectedRiskRef(riskRef));
    dispatch(
      showModal({
        component: 'PI_MANAGE_DOCUMENTS',
        props: {
          title: utils.string.t('processingInstructions.manageDocuments.label') + ' - ' + riskRef.riskRefId,
          fullWidth: true,
          maxWidth: 'xl',
          disableAutoFocus: true,
          componentProps: {
            riskRef,
            documentTypeKey,
            isDocumentsEditable,
            cancelHandler: () => {
              dispatch(resetSelectedRiskRef());
              getRiskReferenceDocumentCount();
            },
          },
        },
      })
    );
  };

  return (
    <ProcessingInstructionsRiskRefTabTableView
      columns={columns}
      documents={documents}
      isFaBorderProcessType={isFaBorderProcessType}
      isRiskReferenceDocumentCountLoading={isRiskReferenceDocumentCountLoading}
      riskReferencesDocumentsCountList={riskReferencesDocumentsCountList}
      selectedRefinementColumns={isEndorsement || isFeeAndAmendment}
      handlers={{
        manageSetting,
      }}
    />
  );
}
