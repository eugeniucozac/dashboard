import config from 'config';
import * as utils from 'utils';
import * as constants from 'consts';
import isEmpty from 'lodash/isEmpty';

// mui
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const utilsDmsFormatter = {
  formatDocumentMetaData: (data, context, refDataXbInstances, catCodesData) => ({
    commonInfo: [
      {
        id: 1,
        name: utils.string.t('dms.upload.commonInfoSection.gxbInstance'),
        value: data?.xbInstanceId
          ? refDataXbInstances?.find((xbInstance) => xbInstance?.sourceID.toString() === data?.xbInstanceId.toString())?.edgeSourceName
          : constants.DMS_DEFAULT_XB_INSTANCE,
      },
      {
        id: 2,
        name: utils.string.t('dms.upload.commonInfoSection.sectionType'),
        value: context,
      },
      {
        id: 3,
        name: utils.string.t('dms.upload.commonInfoSection.yearOfInception'),
        value: data?.year,
      },
      {
        id: 4,
        name: utils.string.t('dms.upload.commonInfoSection.department'),
        value: data?.departmentName,
      },
      {
        id: 5,
        name: utils.string.t('dms.upload.commonInfoSection.uploadOn'),
        value: `${utils.string.t('format.date', {
          value: { date: data?.createdDate, format: config.ui.format.date.text },
        })}`,
      },
    ],
    lossInfo: [
      {
        id: 6,
        name: utils.string.t('dms.upload.lossInfoSection.lossRef'),
        value: data?.lossRef,
      },
      {
        id: 7,
        name: utils.string.t('dms.upload.lossInfoSection.dateOfLoss'),
        value: `${utils.string.t('format.date', {
          value: { date: data?.lossCreatedDate, format: config.ui.format.date.text },
        })}`,
      },
      {
        id: 8,
        name: utils.string.t('dms.upload.lossInfoSection.lossDescription'),
        value: data?.lossDescription,
      },
      {
        id: 9,
        name: utils.string.t('dms.upload.lossInfoSection.catCode'),
        value: utils.generic.isValidArray(catCodesData)
          ? catCodesData?.find((catCode) => catCode?.catCodesID === data?.catCodesID)?.catCodeDisplay
          : data?.catCodesID,
      },
    ],
    claimInfo: [
      {
        id: 10,
        name: utils.string.t('dms.upload.claimInfoSection.claimRef'),
        value: data?.claimRef,
      },
      {
        id: 11,
        name: utils.string.t('dms.upload.claimInfoSection.policyId'),
        value: data?.policyId,
      },
      {
        id: 12,
        name: utils.string.t('dms.upload.claimInfoSection.umr'),
        value: data?.uniqueMarketRef,
      },
      {
        id: 13,
        name: utils.string.t('dms.upload.claimInfoSection.insuredName'),
        value: data?.insuredName,
      },
      {
        id: 14,
        name: utils.string.t('dms.upload.claimInfoSection.claimant'),
        value: data?.claimantName,
      },
      {
        id: 15,
        name: utils.string.t('dms.upload.claimInfoSection.ucr'),
        value: data?.ucr,
      },
    ],
    policyInfo: [
      {
        id: 16,
        name: utils.string.t('dms.upload.policyInfoSection.policyRef'),
        value: data?.policyRef,
      },
      {
        id: 17,
        name: utils.string.t('dms.upload.policyInfoSection.umr'),
        value: data?.uniqueMarketRef,
      },
      {
        id: 18,
        name: utils.string.t('dms.upload.policyInfoSection.insuredName'),
        value: data?.insuredName,
      },
      {
        id: 19,
        name: utils.string.t('dms.upload.policyInfoSection.inceptionDate'),
        value: data?.inceptionDate,
      },
    ],
  }),
  getDuplicateIndexes: (fieldsArray, documentDetails) => {
    //TODO - get rid of Combinator and procedural pattern. To replace with pure function
    const indexesArray = [];
    if (Boolean(documentDetails.length)) {
      for (let i = 0; i < documentDetails.length; i++) {
        fieldsArray.forEach((item, index) => {
          if (item.name === documentDetails[i].documentName) {
            indexesArray.push(index);
          }
        });
      }
      return indexesArray;
    }
  },
  getContextReferenceId: (state, context, subcontext) => {
    switch (context) {
      case constants.DMS_CONTEXT_LOSS:
        return state.claims.lossInformation?.lossRef;
      case constants.DMS_CONTEXT_CLAIM:
        return (
          state.claims.claimData?.claimRef ||
          state.claims.processing.selected[0]?.claimRef ||
          state.claims?.claimsInformation?.claimReference
        );
      case constants.DMS_CONTEXT_POLICY:
        return state.claims.policyInformation?.policyRef || state.processingInstructions?.selectedRiskRef?.riskRefId;
      case constants.DMS_CONTEXT_PROCESSING_INSTRUCTION:
        return Object.keys(state.processingInstructions?.instructions)?.[0] || '';
      case constants.DMS_CONTEXT_TASK:
        const taskDetail = state.claims?.tasksTab?.selected[0] || state.claims?.tasksProcessing?.selected[0];
        if (subcontext === constants.DMS_TASK_CONTEXT_TYPE_RFI_RESPONSE) {
          const refCond = state.dms.contextSubType;
          const respectiveRfiResponse = state.claims.rfiHistory.data?.find(
            (itr) => itr?.caseIncidentNotesID === refCond?.caseIncidentNotesID
          );
          return utils.generic.isValidObject(respectiveRfiResponse, 'caseIncidentNotesID')
            ? taskDetail?.taskId + '-' + respectiveRfiResponse?.caseIncidentNotesID
            : refCond?.caseIncidentNotesID
              ? taskDetail?.taskId + '-' + refCond?.caseIncidentNotesID
              : taskDetail?.taskId;
        } else if (subcontext === constants.DMS_TASK_CONTEXT_TYPE_RFI) {
          return state.claims?.rfiInfo?.data?.taskId;
        } else if (subcontext === constants.DMS_TASK_CONTEXT_TYPE_ADHOC) {
          return state.claims.adhocTask?.data?.id;
        } else {
          return taskDetail?.taskId;
        }

      case constants.DMS_CONTEXT_CASE:
        return state.premiumProcessing?.caseDetails?.caseId;
      default:
        return '';
    }
  },

  getActionDispatched: (isPending, isFulfilled, isRejected) => !isPending && !isFulfilled && !isRejected,
  getPaymentDocumentType: (selected) => selected.documentTypeDescription === constants.DMS_DOCUMENT_TYPE_PAYMENT,

  getDocumentTypeFilterKeys: (context, source, documentTypeKey) => {
    switch (context) {
      case constants.DMS_CONTEXT_LOSS:
      case constants.DMS_CONTEXT_CLAIM:
      case constants.DMS_CONTEXT_TASK:
        return {
          dmsSectionKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim,
          dmsSourceId: constants.DMS_CLAIM_SOURCE_ID,
          dmsDocTypeSource: constants.DMS_EDGE_DOC_TYPE_SOURCE,
        };
      case constants.DMS_CONTEXT_PROCESSING_INSTRUCTION:
        return {
          dmsSectionKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.instruction,
          dmsSourceId: 0,
          dmsDocTypeSource: constants.DMS_EDGE_DOC_TYPE_SOURCE,
        };
      case constants.DMS_CONTEXT_POLICY:
        if (
          [
            constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piClosingFdo,
            constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement,
            constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piFABorder,
            constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation,
            constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned,
          ].includes(documentTypeKey)
        ) {
          return {
            dmsSectionKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
            dmsSourceId: source,
            dmsDocTypeSource: constants.DMS_SHAREPATH_SOURCES.gxb,
          };
        } else {
          const isClaim = documentTypeKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim;
          return {
            dmsSectionKey: isClaim ? constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.claim : constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.instruction,
            dmsSourceId: constants.DMS_CLAIM_SOURCE_ID,
            dmsDocTypeSource: constants.DMS_EDGE_DOC_TYPE_SOURCE,
          };
        }
      case constants.DMS_CONTEXT_CASE:
        return {
          dmsSectionKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
          dmsSourceId: source,
          dmsDocTypeSource: constants.DMS_SHAREPATH_SOURCES.gxb,
        };
      default:
        return {
          dmsSectionKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
          dmsSourceId: 0,
          dmsDocTypeSource: constants.DMS_EDGE_DOC_TYPE_SOURCE,
        };
    }
  },

  getMetaDataParams: (state, context, sourceId, metaDataSectionRef, contextSubType) => {
    switch (context) {
      case constants.DMS_CONTEXT_LOSS:
        const lossInfoStore = state.claims?.lossInformation;
        return {
          sectionType: context,
          sourceId: 1,
          divisionId: null,
          referenceId: lossInfoStore?.lossDetailID,
          sectionRef: lossInfoStore?.lossRef,
        };
      case constants.DMS_CONTEXT_CLAIM:
        const claimData = state.claims?.claimData;
        const claimGridSelectionData = state.claims?.claimsTab?.tableDetails?.selected[0];
        const claimsInformation = state.claims?.claimsInformation;
        return {
          sectionType: context,
          sourceId:
            claimsInformation?.sourceID || state.claims?.claimDetailInformationSuccess?.sourceID || claimGridSelectionData?.sourceId,
          divisionId: state.claims?.policyInformation?.divisionID || claimGridSelectionData?.divisionId,
          referenceId: claimData?.claimId || claimGridSelectionData?.claimId,
          sectionRef: claimData?.claimRef || claimGridSelectionData?.claimReference || claimsInformation?.claimReference,
        };
      case constants.DMS_CONTEXT_TASK:
        const claimInfoStore = state.claims?.claimsInformation;
        const claimGridSelectedData = state.claims?.processing?.selected[0];
        const selectedClaimsDetails = state.claims?.selectedClaimsDetails;
        const rfiInfo = state.claims?.rfiInfo?.data;
        const caseIncidentRefType = rfiInfo?.caseIncidentRefType;
        if (contextSubType?.type === constants.DMS_TASK_CONTEXT_TYPE_RFI && utils.generic.isValidObject(rfiInfo, 'caseIncidentRefType')) {
          if (caseIncidentRefType === constants.RFI_ON_LOSS) {
            return {
              sectionType: constants.DMS_CONTEXT_LOSS,
              sourceId: 1,
              referenceId: rfiInfo?.lossId,
              sectionRef: rfiInfo?.lossRef,
            };
          } else if (caseIncidentRefType === constants.RFI_ON_TASKS) {
            return {
              sectionType: constants.DMS_CONTEXT_CLAIM,
              sourceId,
              divisionId: claimGridSelectedData?.departmentID || claimGridSelectedData?.divisionId || selectedClaimsDetails?.departmentID,
              referenceId: rfiInfo?.claimId,
              sectionRef: rfiInfo?.claimRef,
            };
          }
          else {
            return {
              sectionType: constants.DMS_CONTEXT_CLAIM,
              sourceId: claimInfoStore?.sourceID || state.claims?.claimDetailInformationSuccess?.sourceID || claimGridSelectedData?.sourceId || selectedClaimsDetails?.sourceID || 1,
              divisionId: state.claims?.policyInformation?.divisionID || claimGridSelectedData?.departmentID || claimGridSelectedData?.divisionId || selectedClaimsDetails?.departmentID,
              referenceId: rfiInfo?.claimId,
              sectionRef: rfiInfo?.claimRef,
            };
          }
        }
        return {
          sectionType: constants.DMS_CONTEXT_CLAIM,
          sourceId: claimInfoStore?.sourceID || state.claims?.claimDetailInformationSuccess?.sourceID || claimGridSelectedData?.sourceId || selectedClaimsDetails?.sourceID,
          divisionId: claimInfoStore?.departmentID || state.claims?.policyInformation?.divisionID || claimGridSelectedData?.divisionID || selectedClaimsDetails?.departmentID,
          referenceId: claimInfoStore?.claimID || claimGridSelectedData?.claimID || claimInfoStore?.policyID || selectedClaimsDetails?.claimID,
          sectionRef: claimInfoStore?.claimReference || claimInfoStore?.claimRef || claimGridSelectedData?.claimRef || claimInfoStore?.policyRef || selectedClaimsDetails?.claimReference,
        };
      case constants.DMS_CONTEXT_CASE:
        return {
          sectionType: constants.DMS_CONTEXT_POLICY,
          sourceId,
          divisionId: null,
          referenceId: state.premiumProcessing?.caseDetails?.policyId,
          sectionRef: state.premiumProcessing?.caseDetails?.policyRef,
        };
      case constants.DMS_CONTEXT_POLICY:
        return {
          sectionType: constants.DMS_CONTEXT_POLICY,
          sourceId,
          divisionId: null,
          referenceId: state.processingInstructions?.selectedRiskRef?.xbPolicyId,
          sectionRef: state.processingInstructions?.selectedRiskRef?.riskRefId,
        };
      case constants.DMS_CONTEXT_PROCESSING_INSTRUCTION:
        return {
          sectionType: constants.DMS_CONTEXT_POLICY,
          sourceId,
          divisionId: null,
          referenceId: state.processingInstructions?.instructions[metaDataSectionRef]?.riskReferences?.find((r) => r.leadPolicy)
            ?.xbPolicyId,
          sectionRef: metaDataSectionRef,
        };
      default:
        return null;
    }
  },

  getUploadMetaDataParams: (state, context, referenceId) => {
    // TODO refactor getContextReferenceId() into getUploadMetaDataParams()
    switch (context) {
      case constants.DMS_CONTEXT_LOSS:
        return { lossRef: referenceId, claimRef: '', uniqueMarketRef: null, ucr: null, expiryDate: null };
      case constants.DMS_CONTEXT_CLAIM:
        return {
          lossRef: state.claims?.lossInformation?.lossRef || '',
          claimRef: referenceId,
          uniqueMarketRef: state.dms?.upload?.metaData?.data?.data?.uniqueMarketRef || null,
          ucr: state.dms?.upload?.metaData?.data?.data?.ucr || null,
          expiryDate: state.claims?.policyInformation?.expiryDate || null,
        };
      case constants.DMS_CONTEXT_TASK:
        const selectedClaimDetails = state.claims?.selectedClaimsDetails;
        const selectedClaimRowDetails = state.claims?.processing?.selected[0];
        const contextSubType = state?.dms?.contextSubType;
        const selectedClaim = !isEmpty(selectedClaimRowDetails) ? selectedClaimRowDetails : selectedClaimDetails
        const selectedTaskDetails = state.claims?.tasksTab?.selected[0]
        const selectedTaskRowDetails = state.claims?.tasksProcessing?.selected[0];
        const selectedTask = !isEmpty(selectedTaskRowDetails) ? selectedTaskRowDetails : selectedTaskDetails;
        const rfiInfo = state?.claims?.rfiInfo?.data;
        const lossRef = contextSubType?.type === constants.DMS_TASK_CONTEXT_TYPE_RFI ? rfiInfo?.lossRef : selectedClaim?.lossRef || selectedTask?.lossRef || '';
        const claimRef = contextSubType?.type === constants.DMS_TASK_CONTEXT_TYPE_RFI
          ? rfiInfo?.claimRef
          : selectedClaim?.claimReference || selectedClaim?.claimRef || selectedTask?.claimRef || selectedTask?.claimReference || '';
        return {
          lossRef,
          claimRef,
          uniqueMarketRef: state.dms?.upload?.metaData?.data?.data?.uniqueMarketRef || null,
          ucr: state.dms?.upload?.metaData?.data?.data?.ucr || null,
          expiryDate: state.claims?.policyInformation?.expiryDate || null,
          rfiCreatedOn: rfiInfo?.caseIncidentRefType,
        };
      case constants.DMS_CONTEXT_CASE:
        return { lossRef: '', claimRef: '', uniqueMarketRef: null, ucr: null, expiryDate: null };
      default:
        return { lossRef: '', claimRef: '', uniqueMarketRef: null, ucr: null, expiryDate: null };
    }
  },
  getIcons: (isFulfilled, isRejected, hasPartialSuccess) => {
    if (isFulfilled && hasPartialSuccess) {
      return CheckCircleIcon;
    } else if (isRejected || (isFulfilled && !hasPartialSuccess)) {
      return ErrorOutlineIcon;
    } else {
      return HighlightOffIcon;
    }
  },
  getFileKey: function (file) {
    return `${file?.name}-${file?.size}-${file?.lastModified}`;
  },
  getUniqueFiles: (files, uploadedFiles) =>
    files
      ?.reduce((acc, cur) => {
        const isDuplicate =
          utils.generic.isValidArray(uploadedFiles, true) &&
          uploadedFiles?.find((f) => {
            return utils.generic.isValidObject(f.file, true) && utils.generic.isValidObject(cur, true)
              ? this.getFileKey(f.file) === this.getFileKey(cur)
              : false;
          });

        return isDuplicate ? acc : [...acc, cur];
      }, [])
      .map((f) => ({ file: f, name: f.name, type: null })),
  getSelectedDocumentType: (value, uploadedFiles) => {
    const unFilledIndex = [];
    Array.from(Array(uploadedFiles?.length).keys()).forEach((doc, index) => {
      if (value?.['files' + doc]?.documentTypeDescription === undefined) {
        unFilledIndex.push(index);
      }
    });
    return unFilledIndex;
  },
  getInvalidInputs: (fieldsArray, value, callback) => {
    fieldsArray.forEach((char, ind) => {
      Object.keys(value)
        .filter((item, index) => item.includes(`files${ind}name`))
        .forEach((field, i) => {
          if (constants.DMS_UPLOAD_FORBIDDEN_CHAR.test(value[field])) {
            callback(field, {
              type: 'manual',
              message: utils.string.t('dms.upload.warning.invalidInputWarning'),
            });
          }
        });
    });
  },
  setCurrentFieldValues: (index, getValues) => {
    const currentValues = {};

    currentValues[`files${index}`] = {
      documentTypeDescription: getValues(`files${index}`)?.documentTypeDescription,
      documentTypeID: getValues(`files${index}`)?.documentTypeID,
    };
    currentValues[`files${index}name`] = getValues(`files${index}name`);
    currentValues[`filesClassification${index}`] = getValues(`filesClassification${index}`);

    return currentValues;
  },
  getDocumentTypeInfo: (documentTypeKey, sourceId) => {
    switch (documentTypeKey) {
      case constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement:
        return {
          documentTypeDescription: constants.PI_ENDORSEMENT_TYPE_DOCUMENT.documentTypeDescription,
          sectionKey: constants.PI_ENDORSEMENT_TYPE_DOCUMENT.sectionKey,
          dmsSourceID: sourceId,
        };
      case constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piFABorder:
        return {
          documentTypeDescription: constants.PI_FABORDER_TYPE_DOCUMENT.documentTypeDescription,
          sectionKey: constants.PI_FABORDER_TYPE_DOCUMENT.sectionKey,
          dmsSourceID: sourceId,
        };
      case constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piClosingFdo:
        return {
          documentTypeDescription: constants.PI_CLOSING_FDO_TYPE_DOCUMENT.documentTypeDescription,
          sectionKey: constants.PI_CLOSING_FDO_TYPE_DOCUMENT.sectionKey,
          dmsSourceID: sourceId,
        };
      case constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation:
        return {
          documentTypeDescription: constants.PI_PREMIUM_CALCULATION_SHEET_TYPE_DOCUMENT.documentTypeDescription,
          sectionKey: constants.PI_PREMIUM_CALCULATION_SHEET_TYPE_DOCUMENT.sectionKey,
          dmsSourceID: constants.PI_PREMIUM_CALCULATION_SHEET_TYPE_DOCUMENT.sourceID,
        };
      case constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned:
        return {
          documentTypeDescription: constants.PI_MARKET_SIGNED_SLIP_TYPE_DOCUMENT.documentTypeDescription,
          sectionKey: constants.PI_MARKET_SIGNED_SLIP_TYPE_DOCUMENT.sectionKey,
          dmsSourceID: constants.PI_MARKET_SIGNED_SLIP_TYPE_DOCUMENT.sourceID,
        };
      case constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piGeneratePdfSubmit:
        return {
          documentTypeDescription: constants.PI_GENERATE_PDF_SUBMIT.documentTypeDescription,
          sectionKey: constants.PI_GENERATE_PDF_SUBMIT.sectionKey,
          dmsSourceID: constants.PI_GENERATE_PDF_SUBMIT.sourceID,
        };
      default:
        return null;
    }
  },
  isDmsFromPi: (documentTypeKey) => {
    return [
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piFABorder,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piClosingFdo,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned,
    ].includes(documentTypeKey);
  },
  isDmsFromPiRiskRef: (documentTypeKey) => {
    let isDmsFromRiskRef = [
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piEndorsement,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piFABorder,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piClosingFdo,
    ].includes(documentTypeKey);
    return isDmsFromRiskRef;
  },
  isDmsFromPiInstruction: (documentTypeKey) => {
    return [
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation,
      constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned,
    ].includes(documentTypeKey);
  },
  getDocumentClassificationList: () => {
    return [
      { id: 1, value: utils.string.t('dms.upload.modalItems.classificationType.low') },
      { id: 2, value: utils.string.t('dms.upload.modalItems.classificationType.guarded') },
      { id: 3, value: utils.string.t('dms.upload.modalItems.classificationType.high') },
      { id: 4, value: utils.string.t('dms.upload.modalItems.classificationType.severe') },
    ];
  },
};

export default utilsDmsFormatter;
