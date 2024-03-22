import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { firstBy } from 'thenby';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';

// app
import ProcessingInstructionsRiskRefsView from './ProcessingInstructionsRiskRefs.view';
import {
  searchRiskRefIds,
  enqueueNotification,
  searchInsuredCoverHolderNames,
  showModal,
  getRiskReferenceDetails,
  storeProcessingInstruction,
  saveRiskReferences,
  selectUser,
  getDocumentsInfo,
  storeProcessingInstructionDocuments,
  removeBulkDocumentsOnLeadRefChange,
} from 'stores';
import * as utils from 'utils';
import { TabularOptionDetail } from 'components';
import * as constants from 'consts';

ProcessingInstructionsRiskRefs.propTypes = {
  instruction: PropTypes.object,
  isStatusSubmittedProcessing: PropTypes.bool,
  isStatusReopened: PropTypes.bool,
  isAuthorizrdSignatory: PropTypes.bool,
  handlers: PropTypes.shape({
    next: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ProcessingInstructionsRiskRefs({
  instruction,
  handlers,
  isStatusSubmittedProcessing,
  isAuthorizrdSignatory,
  isStatusReopened,
}) {
  const dispatch = useDispatch();
  const riskFieldRef = useRef(null);
  const departmentList = useSelector((state) => get(state, 'processingInstructions.departmentList')) || [];
  const processTypes = useSelector((state) => get(state, 'referenceData.processTypes')) || [];

  const selectedProcess = processTypes.find((type) => type.processTypeID === instruction?.processTypeId)?.processTypeDetails;
  const user = useSelector(selectUser);
  const documents = useSelector(getDocumentsInfo);

  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);

  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const isEditable = userHasWritePermission && (isDraft || isRejectedDraft);
  const isReadOnly = !isEditable;

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isClosing = utils.processingInstructions.isClosing(instruction?.processTypeId);
  const isFdo = utils.processingInstructions.isFdo(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isFaBorderProcessType = isBordereau || isFeeAndAmendment;
  const isRiskRefMessageShown = isEndorsement || isClosing || isFdo || isFeeAndAmendment || isBordereau;
  const [riskRefs, setRiskRefs] = useState(instruction?.riskReferences || []);
  const [riskRefsForDocuments, setRiskRefsForDocuments] = useState(documents?.riskReferences || []);
  const [searchReferenceValue, setSearchReferenceValue] = useState(null);
  const [searchInsuredNames, setSearchInsuredNames] = useState(null);
  const [searchReferenceType] = useState('risk');
  const [searchInsuredType] = useState('insuredCoverHolder');
  const [selectedProcessRefinementColumns, setSelectedProcessRefinementColumns] = useState(false);

  const riskRefsHasLead = riskRefs?.some((r) => r.leadPolicy);
  const optionsDepartments = uniqBy(departmentList, 'deptName').map((d) => ({ id: d.id, name: d.deptName }));

  useEffect(() => {
    setRiskRefs(instruction?.riskReferences);
  }, [instruction?.riskReferences]);

  useEffect(() => {
    setRiskRefsForDocuments(documents?.riskReferences);
  }, [documents?.riskReferences]);

  useEffect(() => {
    setSelectedProcessRefinementColumns(isEndorsement || isFeeAndAmendment);
  }, [isEndorsement, isFeeAndAmendment]);

  const isPageEdited = () => {
    // we're sorting the refs
    // and only comparing only a subset of properties that are editable
    const savedRiskRefs = (instruction?.riskReferences || []).sort(firstBy(utils.sort.array('lexical', 'riskRefId'))).map((r) => {
      return {
        leadPolicy: Boolean(r.leadPolicy),
        riskRefId: r.riskRefId?.toString(),
        endorsementNumber: r.endorsementNumber?.toString(),
        isNonPremium: r.isNonPremium?.toString(),
      };
    });

    const currentRiskRefs = riskRefs?.sort(firstBy(utils.sort.array('lexical', 'riskRefId'))).map((r) => {
      return {
        leadPolicy: Boolean(r.leadPolicy),
        riskRefId: r.riskRefId?.toString(),
        endorsementNumber: r.endorsementNumber?.toString(),
        isNonPremium: r.isNonPremium?.toString(),
      };
    });

    return !isEqual(savedRiskRefs, currentRiskRefs);
  };

  const isLeadRiskRefChanged = () => {
    const savedLeadRiskRef = instruction?.riskReferences?.find((r) => Boolean(r.leadPolicy))?.riskRefId?.toString();

    const currentLeadRiskRef = riskRefs?.find((r) => Boolean(r.leadPolicy))?.riskRefId?.toString();

    return !isEqual(savedLeadRiskRef, currentLeadRiskRef);
  };

  const fetchPolicyRefs = useCallback(
    async (type, searchTerm) => {
      if (searchTerm.length >= 3) {
        return dispatch(searchRiskRefIds(searchTerm));
      }
    },
    [dispatch]
  );

  const fetchInsuredOrCoverHolderNames = useCallback(
    async (type, searchTerm) => {
      if (searchTerm.length >= 3) {
        return dispatch(searchInsuredCoverHolderNames(searchTerm));
      }
    },
    [dispatch]
  );

  const addRiskRef = async (riskRefId) => {
    if (riskRefs?.find((rr) => rr.riskRefId === riskRefId) && (!isEndorsement || !isFeeAndAmendment)) {
      return dispatch(enqueueNotification('processingInstructions.duplicateRiskRef', 'error'));
    }

    const response = await dispatch(getRiskReferenceDetails(riskRefId, selectedProcess));

    if (response && response?.response?.status !== 500) {
      if (riskRefs?.length === 0) {
        response['leadPolicy'] = true;
      }
      const updatedRiskRefs = [...riskRefs, response];
      setRiskRefs(updatedRiskRefs);
      const updatedRiskRefsForDocuments = [...riskRefsForDocuments, response];
      setRiskRefsForDocuments(updatedRiskRefsForDocuments);
    }
  };

  const onChangeLeadRiskRef = (event, riskRefId) => {
    setRiskRefs(
      riskRefs?.map((r) => {
        return { ...r, leadPolicy: r.riskRefId === riskRefId };
      })
    );
    setRiskRefsForDocuments(
      riskRefsForDocuments.map((r) => {
        return { ...r, leadPolicy: r.riskRefId === riskRefId };
      })
    );
  };

  const removeRiskReference = (riskRefId) => {
    const refsToKeep = riskRefs?.filter((ref) => ref.riskRefId !== riskRefId);
    setRiskRefs(refsToKeep);
    const refsForDocumentsToKeep = riskRefsForDocuments.filter((ref) => ref.riskRefId !== riskRefId);
    setRiskRefsForDocuments(refsForDocumentsToKeep);
  };

  const handleCancel = () => {
    setRiskRefs(instruction?.riskReferences || []);
    setRiskRefsForDocuments(documents?.riskReferences || []);
  };

  const handleRemove = (index, riskRefId) => {
    removeRiskReference(riskRefId);
  };

  const handleAdvancedSearch = (props) => {
    dispatch(
      showModal({
        component: 'ADD_RISK_REF_ADVANCED_SEARCH',
        props: {
          title: 'processingInstructions.addRiskReference.addRiskRefAdvancedSearch.label',
          fullWidth: true,
          maxWidth: 'xl',
          disableAutoFocus: true,
          componentProps: {
            props: props,
            instruction: instruction,
            selectedProcess: selectedProcess,
            riskRefs: riskRefs,
            setRiskRefs: setRiskRefs,
          },
        },
      })
    );
  };

  const handleSave = (type) => {
    const updatedInstruction = { ...instruction, riskReferences: riskRefs };
    const updatedDocuments = {
      ...documents,
      riskReferences: riskRefsForDocuments,
      ...(isLeadRiskRefChanged() && { premiumTaxDocument: null, signedLinesDocument: null }),
    };

    dispatch(storeProcessingInstructionDocuments(updatedDocuments));
    dispatch(storeProcessingInstruction(updatedInstruction));
    dispatch(saveRiskReferences(updatedInstruction)).then((response) => {
      if (response?.status === constants.API_RESPONSE_OK) {
        if (isPageEdited() && type === 'saveNext') {
          handlers.next();
        }
      }
    });
  };

  const confirmBeforeSave = (type) => {
    const updatedInstruction = { ...instruction, riskReferences: riskRefs };
    const endorsementSelected = updatedInstruction?.riskReferences?.every((r) => r.hasOwnProperty('endorsementNumber'));
    const endorsementValueNotPresent = updatedInstruction?.riskReferences?.some((r) => r.endorsementNumber === 0);
    const isEndorsement = utils.processingInstructions.isEndorsement(updatedInstruction?.processTypeId);
    const isEndorsementReferenceIdsAvailable = updatedInstruction?.riskReferences?.some((rr) => rr?.endorsement?.length === 0);
    const endorsementReference = updatedInstruction?.riskReferences?.find((rr) => rr?.endorsement?.length === 0);

    if (riskRefs?.length > 0 && !riskRefsHasLead) {
      dispatch(enqueueNotification('processingInstructions.addRiskReference.chooseLeadRiskRefToSave', 'warning'));
      return;
    } else if (isEndorsement && isEndorsementReferenceIdsAvailable) {
      dispatch(
        enqueueNotification(
          utils.string.t('processingInstructions.addRiskReference.noEndorsementValueAssociatedWithRiskRef', {
            riskRefId: endorsementReference ? endorsementReference.riskRefId : '',
          }),
          'warning'
        )
      );
      return;
    } else if (isEndorsement && riskRefs?.length > 0 && (!endorsementSelected || endorsementValueNotPresent)) {
      dispatch(enqueueNotification('processingInstructions.addRiskReference.noEndorsementValueSelected', 'warning'));
      return;
    } else if (riskRefs?.length === 0) {
      dispatch(enqueueNotification('processingInstructions.addRiskReference.noLeadRiskRefAddedToSave', 'warning'));
      return;
    }

    if (isLeadRiskRefChanged() && (documents?.premiumTaxDocument || documents?.signedLinesDocument)) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('app.confirm'),
            maxWidth: 'sm',
            fullWidth: true,
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              confirmMessage: utils.string.t('processingInstructions.addRiskReference.changeLeadRiskRefAlertMessage'),
              cancelHandler: () => {},
              submitHandler: () => {
                dispatch(removeBulkDocumentsOnLeadRefChange({ documents })).then((response) => {
                  if (response?.status?.toLowerCase() === constants.API_RESPONSE_OK.toLowerCase()) {
                    handleSave(type);
                  }
                });
              },
            },
          },
        })
      );
    } else {
      handleSave(type);
    }
  };

  const columns = [
    {
      id: 'chooseLead',
      label: utils.string.t('processingInstructions.gridUmrColumns.chooseLead'),
    },
    {
      id: 'riskReferenceId',
      label: utils.string.t('processingInstructions.gridUmrColumns.riskReferenceId'),
    },
    {
      id: 'gxbInstance',
      label: utils.string.t('processingInstructions.gridUmrColumns.gxbInstance'),
    },
    {
      id: 'insuredOrCoverHolder',
      label: utils.string.t('processingInstructions.gridUmrColumns.insuredOrCoverHolder'),
    },
    {
      id: 'yearOfAccounts',
      label: utils.string.t('processingInstructions.gridUmrColumns.yearOfAccounts'),
    },
    {
      id: 'clientName',
      label: utils.string.t('processingInstructions.gridUmrColumns.clientName'),
    },
    {
      id: 'riskStatus',
      label: utils.string.t('processingInstructions.gridUmrColumns.riskStatus'),
    },
    {
      id: 'riskDetails',
      label: utils.string.t('processingInstructions.gridUmrColumns.riskDetails'),
    },
    ...(selectedProcessRefinementColumns
      ? [
          {
            id: 'endorsementRef',
            label: `${utils.string.t('processingInstructions.gridUmrColumns.endorsementRef', {
              isMandatory: !isFaBorderProcessType ? '*' : '',
            })}`,
          },
          {
            id: 'checkbox',
            label: utils.string.t('processingInstructions.gridUmrColumns.nonPremium'),
            narrow: true,
            nowrap: true,
          },
        ]
      : []),
    ...(isEditable ? [{ id: 'removeUmrs', empty: true }] : []),
  ];

  const renderOption = (ref) => {
    const optionTooltip = (ref) => {
      if (!ref?.xbInstance) return;
      return (
        <span>
          {utils.string.t('fileUpload.xbInstance')}: {ref.xbInstance}
        </span>
      );
    };

    const instructionsListAsString = () => {
      if (ref.instructionId?.length === 1) return ref.instructionId[0];
      let joinedVals = ref.instructionId?.slice(0, 3)?.join(', ');
      if (ref.instructionId?.length > 3) joinedVals += '...';
      return joinedVals;
    };
    return (
      <TabularOptionDetail
        label={ref.policyReference}
        labelWidth={'20%'}
        sublabels={[ref.assuredName, ref.riskDetails, instructionsListAsString()]}
        sublabelWidths={['25%', '35%', '20%']}
        detail={optionTooltip(ref)}
      />
    );
  };

  const searchFields = [
    {
      name: 'riskReference',
      type: 'autocompletemui',
      label: utils.string.t('processingInstructions.addRiskReference.riskRefId'),
      value: searchReferenceValue || null,
      options: [],
      optionKey: 'policyReference',
      optionLabel: 'policyReference',
      optionsFetch: {
        type: 'risk',
        handler: fetchPolicyRefs,
      },
      muiComponentProps: {
        renderOption,
        ref: riskFieldRef,
        fullWidth: true,
        disabled: isStatusSubmittedProcessing || isStatusReopened,
        inputProps: {
          maxLength: 25,
        },
      },
      callback: (event, data) => {
        setSearchReferenceValue(data);
      },
      showLoading: true,
    },
    {
      name: 'insuredCoverHolderName',
      type: 'autocompletemui',
      label: utils.string.t('processingInstructions.addRiskReference.fields.insuredCoverHolder'),
      value: searchInsuredNames || null,
      options: [],
      optionKey: 'id',
      optionLabel: 'name',
      optionsFetch: {
        type: 'insuredCoverHolder',
        handler: fetchInsuredOrCoverHolderNames,
      },
      muiComponentProps: {
        inputProps: {
          maxLength: 25,
        },
        disabled: isStatusSubmittedProcessing || isStatusReopened,
      },
      callback: (event, data) => {
        setSearchInsuredNames(data);
      },
    },
    {
      name: 'department',
      type: 'autocompletemui',
      label: utils.string.t('processingInstructions.addRiskReference.fields.department.label'),
      value: null,
      options: optionsDepartments,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        disabled: isStatusSubmittedProcessing || isStatusReopened,
      },
    },
    {
      name: 'yearOfAccount',
      type: 'datepicker',
      label: utils.string.t('processingInstructions.addRiskReference.fields.yearOfAccount'),
      value: new Date().getFullYear().toString(),
      placeholder: 'YYYY',
      muiComponentProps: {
        fullWidth: true,
        helperText: utils.string.t('processingInstructions.addRiskReference.fields.helperTextYoa'),
        disabled: isStatusSubmittedProcessing || isStatusReopened,
      },
      muiPickerProps: {
        views: ['year'],
        format: 'YYYY',
        clearable: true,
      },
    },
  ];

  // abort
  if (!instruction) return;

  return (
    <ProcessingInstructionsRiskRefsView
      instructionId={instruction?.id}
      riskRefs={riskRefs}
      searchFields={searchFields}
      searchReferenceType={searchReferenceType}
      searchInsuredType={searchInsuredType}
      columns={columns}
      isStatusSubmittedProcessing={isStatusSubmittedProcessing}
      isStatusReopened={isStatusReopened}
      isAuthorizrdSignatory={isAuthorizrdSignatory}
      isPageEdited={isPageEdited()}
      isReadOnly={isReadOnly}
      isEditable={isEditable}
      isClosing={isClosing}
      isFdo={isFdo}
      isEndorsement={isEndorsement}
      isFeeAndAmendment={isFeeAndAmendment}
      isRiskRefMessageShown={isRiskRefMessageShown}
      handlers={{
        ...handlers,
        save: confirmBeforeSave,

        cancel: handleCancel,
        advancedSearch: handleAdvancedSearch,
        riskRefFetch: addRiskRef,
        riskRefChangeLead: onChangeLeadRiskRef,
        riskRefRemove: handleRemove,
        riskRefSet: setRiskRefs,
      }}
    />
  );
}
