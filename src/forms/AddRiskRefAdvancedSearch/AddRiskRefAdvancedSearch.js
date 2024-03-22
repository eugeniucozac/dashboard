import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import AddRiskRefAdvancedSearchView from './AddRiskRefAdvancedSearch.view';
import * as utils from 'utils';
import * as constants from 'consts';
import {
  getAdvancedSearchResults,
  updateAdvancedSearchSelected,
  hideModal,
  enqueueNotification,
  getEndorsementValues,
  getAdvancedSearchResultsSuccess,
} from 'stores';
import DuplicateWarning from './DuplicateWarning';

export default function AddRiskRefAdvancedSearch({ props, instruction, selectedProcess, riskRefs, setRiskRefs }) {
  const dispatch = useDispatch();
  const searchedResults = useSelector((state) => get(state, 'processingInstructions.advancedSearchResults')) || [];
  const addedRiskReferences = useSelector((state) => get(state, 'processingInstructions.addedRiskRefDetailsFromAdvSearch')) || [];
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [duplicateRiskRefs, setDuplicateRiskRefs] = useState([]);
  const processRefineWarning = ['ENDORSEMENT', 'FEE AND AMENDMENT', 'BORDEREAU'];

  useEffect(() => {
    dispatch(getAdvancedSearchResults(props, selectedProcess)).then((response) => {
      if (response?.length === 0) {
        dispatch(getAdvancedSearchResultsSuccess([]));
      }
    });
    dispatch(updateAdvancedSearchSelected([]));
  }, [dispatch, props, selectedProcess]);

  const fields = [
    {
      name: 'insuredCoverHolderName',
      type: 'text',
      label: utils.string.t('processingInstructions.addRiskReference.fields.insuredCoverHolder'),
      value: props?.insuredName.name,
      options: [],
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
    {
      name: 'department',
      type: 'text',
      label: utils.string.t('processingInstructions.addRiskReference.fields.department.label'),
      value: props?.depart?.name ? props?.depart?.name : '',
      options: [],
      optionKey: 'id',
      optionLabel: 'value',
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
    {
      name: 'yearOfAccount',
      type: 'text',
      label: utils.string.t('processingInstructions.addRiskReference.fields.yearOfAccount'),
      placeholder: '',
      value: props?.yoa,
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
  ];

  const columns = [
    { id: 'addRiskRef', empty: true },
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
      narrow: true,
    },
    {
      id: 'clientName',
      label: utils.string.t('processingInstructions.gridUmrColumns.clientName'),
    },
    {
      id: 'Instruction Ids',
      label: utils.string.t('processingInstructions.gridUmrColumns.associatedPiRefs'),
      narrow: true,
    },
    {
      id: 'riskStatus',
      label: utils.string.t('processingInstructions.gridUmrColumns.riskStatus'),
      nowrap: true,
    },
    {
      id: 'riskDetails',
      label: utils.string.t('processingInstructions.gridUmrColumns.riskDetails'),
    },
  ];

  const actions = [
    {
      name: 'addRiskReference',
      label: utils.string.t('processingInstructions.addRiskReference.advancedSearchModalButton'),
      handler: () => {
        if (addedRiskReferences?.length > 0) {
          const alreadyAddedRiskRefs = addedRiskReferences.filter((rr) => rr.instructionIds);

          setDuplicateRiskRefs(alreadyAddedRiskRefs);

          if (alreadyAddedRiskRefs.length > 0 && !processRefineWarning.includes(selectedProcess)) {
            setWarningDialogOpen(true);
          } else {
            addRiskRefsToProcessingInstruction();
          }
        }
      },
    },
  ];

  const addRiskRefsToProcessingInstruction = () => {
    // TODO not sure this indexOf(risk) filters anything out...
    const uniqueRiskReferences = addedRiskReferences.filter((risk) => riskRefs.indexOf(risk) === -1);
    const isEndorsement = instruction?.processTypeId === 2;
    const isFeeAndAmendment = instruction?.processTypeId === 5;

    if (isEndorsement || isFeeAndAmendment) {
      dispatch(
        getEndorsementValues(
          uniqueRiskReferences.map((r) => r.xbPolicyId),
          uniqueRiskReferences.map((r) => r.xbInstanceId)
        )
      );
    }

    const appendAddedRiskRefs = [...riskRefs, ...uniqueRiskReferences];

    if (appendAddedRiskRefs?.length === 1) {
      uniqueRiskReferences.forEach((rr) => (rr.leadPolicy = true));
    }
    if (appendAddedRiskRefs?.length > constants.PI_MAX_RISK_REF_LIMIT) {
      dispatch(
        enqueueNotification('processingInstructions.maximumRiskRefAdded', 'error', {
          data: { maxRiskRefsLimit: constants.PI_MAX_RISK_REF_LIMIT },
        })
      );
      return;
    }

    if (appendAddedRiskRefs?.length === 1) {
      appendAddedRiskRefs[0].leadPolicy = true;
    }
    appendAddedRiskRefs?.sort((a, b) => (a?.riskRefId >= b?.riskRefId ? 1 : -1));

    setRiskRefs(appendAddedRiskRefs);
    dispatch(enqueueNotification('processingInstructions.successfulRiskRefAdded', 'success'));
    dispatch(hideModal());
  };

  const checkboxClick = (searchResult, riskId) => {
    let newRiskRefs = [...addedRiskReferences, searchResult];
    const existingRiskRefIds = [...riskRefs]?.map((risk) => risk.riskRefId);

    if (addedRiskReferences?.includes(searchResult)) {
      newRiskRefs = newRiskRefs.filter((risk) => risk !== searchResult);
    }

    if (existingRiskRefIds.includes(riskId)) {
      dispatch(enqueueNotification('processingInstructions.duplicateRiskRef', 'warning'));
      return;
    }

    dispatch(updateAdvancedSearchSelected(newRiskRefs));
  };

  const onCloseWarningDialog = () => {
    setWarningDialogOpen(false);
    setDuplicateRiskRefs([]);
  };

  const handleAddMultiple = () => {
    if (addedRiskReferences?.length > 0) {
      addRiskRefsToProcessingInstruction();
    }
  };

  return (
    <>
      <DuplicateWarning
        duplicateRiskRefs={duplicateRiskRefs}
        isOpen={warningDialogOpen}
        handleClose={onCloseWarningDialog}
        handleAdd={handleAddMultiple}
      />
      <AddRiskRefAdvancedSearchView
        fields={fields}
        columns={columns}
        actions={actions}
        searchedResults={searchedResults}
        addedRiskReferences={addedRiskReferences}
        handlers={{ checkboxClick }}
      />
    </>
  );
}
