import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useHistory } from 'react-router';

// app

import PremiumProcessingCaseRfiResolveView from './PremiumProcessingCaseRfiResolve.view';
import {
  getRfiResolutionCodes,
  selectRfiResolutionCodes,
  selectAssignedToUsers,
  getAssignedToUsersList,
  premiumProcessingResolveRFI,
  selectorDmsViewFiles,
  selectRefDataQueryCodes,
  getViewTableDocuments,
  selectCaseDetails,
} from 'stores';
import { useConfirmNavigation } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

PremiumProcessingCaseRfiResolve.propTypes = {
  rfiDetails: PropTypes.object.isRequired,
  isEditable: PropTypes.bool.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  isResolved: PropTypes.bool,
  handlers: PropTypes.shape({
    setIsPageDirty: PropTypes.func.isRequired,
  }),
};
export default function PremiumProcessingCaseRfiResolve({ rfiDetails, isPageDirty, isEditable, isResolved, handlers }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const queryCodes = useSelector(selectRefDataQueryCodes);
  const caseDetails = useSelector(selectCaseDetails);
  const selectAssignees = useSelector(selectAssignedToUsers);
  const resolutionCodes = useSelector(selectRfiResolutionCodes);
  const dmsViewFiles = useSelector(selectorDmsViewFiles);

  const [selectedDmsTab, setSelectedDmsTab] = useState(constants.DMS_VIEW_TAB_VIEW);

  const queryCode = queryCodes.find((queryCode) => queryCode?.queryCodeDetails === rfiDetails?.queryCode);

  const { confirmNavigation } = useConfirmNavigation({
    title: utils.string.t('navigation.form.titleClear'),
    subtitle: utils.string.t('navigation.form.subtitle'),
  });

  const caseRFIBureau = rfiDetails?.rfiType === constants.BUREAU_RFITYPE;
  const tabDetails = caseDetails?.taskView === constants.WORKBASKET || caseDetails?.taskView === constants.ALL_CASES;

  const resolutionTypeInternals = utils.generic.isValidArray(resolutionCodes, true)
    ? resolutionCodes.filter((resolutionCodes) => resolutionCodes.rfiTypeID === constants.RFI_TYPE_FOR_QUERY_CODE)
    : [];

  const isAssignedToUserList = utils.generic.isValidArray(selectAssignees, true);

  const fetchDmsDocuments = (id) => {
    if (id) {
      dispatch(getViewTableDocuments({ referenceId: id, sectionType: constants.DMS_CONTEXT_RFI }));
    }
  };

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(resolutionCodes)) {
      dispatch(getRfiResolutionCodes());
    }

    if (!isAssignedToUserList) {
      dispatch(getAssignedToUsersList());
    }

    // fetch RFI documents
    fetchDmsDocuments(rfiDetails?.queryId);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchDmsDocuments(rfiDetails?.queryId);
  }, [rfiDetails?.queryId]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = (resetFn) => {
    if (utils.generic.isFunction(resetFn)) {
      resetFn(utils.form.getInitialValues(fields), { keepDirty: false });
    }
  };

  const handleCancel = (resetFn) => {
    if (isPageDirty) {
      confirmNavigation(() => resetForm(resetFn));
    } else {
      resetForm(resetFn);
    }
  };

  const selectDmsTab = (tabName) => {
    setSelectedDmsTab(tabName);
  };

  const fields = [
    {
      name: 'resolutionCode',
      type: 'autocompletemui',
      value:
        !isEditable && resolutionCodes
          ? resolutionCodes.find((option) => option?.resolutionCd === rfiDetails?.resolutionCode) || null
          : null,
      options: resolutionTypeInternals,
      optionKey: 'resolutionCodeID',
      optionLabel: 'resolutionCodeDescription',
      label: utils.string.t('premiumProcessing.rfi.resolutionCode'),
      validation: !caseRFIBureau ? Yup.object().nullable().required(utils.string.t('validation.required')) : '',
      muiComponentProps: {
        disabled: !isEditable || tabDetails,
      },
    },
    {
      name: 'typeYourResponse',
      type: 'textarea',
      value: !isEditable ? rfiDetails?.resolutionComments || '' : '',
      validation: Yup.string()
        .min(5, utils.string.t('validation.string.min'))
        .max(4000, utils.string.t('validation.string.max'))
        .required(utils.string.t('validation.required')),
      label: isEditable
        ? utils.string.t('premiumProcessing.rfi.resolutionNotes')
        : utils.string.t('premiumProcessing.rfi.typeYourResponse'),
      fullWidth: true,
      muiComponentProps: {
        inputProps: {
          maxLength: 4000,
        },
        multiline: true,
        rows: 5,
        rowsMax: 10,
        disabled: !isEditable || tabDetails,
      },
    },
    ...(rfiDetails.rfiType === constants.BUREAU_RFITYPE
      ? [
          {
            name: 'bureauQueryDescription',
            type: 'textarea',
            label: utils.string.t('premiumProcessing.rfi.bureauQuery'),
            value: rfiDetails?.bureauQuery,
            muiComponentProps: {
              inputProps: { maxLength: 4000 },
              multiline: true,
              rows: 5,
              rowsMax: 10,
              disabled: true,
            },
            validation: Yup.string().min(5, utils.string.t('validation.string.min')).max(4000, utils.string.t('validation.string.max')),
          },
        ]
      : []),
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: (reset) => handleCancel(reset),
    },
    {
      name: 'submit',
      label: utils.string.t('premiumProcessing.rfi.resolveRfi'),

      handler: (reset) => (values) => {
        if (values) {
          handlers.setIsPageDirty(false);
          dispatch(
            premiumProcessingResolveRFI({
              queryId: rfiDetails?.queryId,
              taskId: rfiDetails?.taskId,
              resolutionCode: values?.resolutionCode?.resolutionCd,
              resolutionComments: values?.typeYourResponse,
              documentId: [],
            })
          ).then((response) => {
            // success POST
            if (response?.status === constants.API_RESPONSE_OK) {
              reset();
              history.push(`${config.routes.premiumProcessing.root}`);
            }
          });
        }
      },
    },
  ];

  const dms = {
    context: constants.DMS_CONTEXT_CASE,
    referenceId: rfiDetails?.caseId?.toString(), // confirm with API which ID should be used for reference
  };

  const tabs = [
    {
      value: constants.DMS_VIEW_TAB_VIEW,
      label: utils.string.t('dms.wrapper.tabs.viewDocuments'),
    },
  ];

  // abort
  if (!rfiDetails.taskId || (!isResolved && utils.generic.isInvalidOrEmptyArray(resolutionCodes))) {
    return null;
  }

  return (
    <PremiumProcessingCaseRfiResolveView
      fields={fields}
      actions={actions}
      rfiDetails={rfiDetails}
      queryCode={queryCode}
      dms={dms}
      dmsTabs={tabs}
      documents={dmsViewFiles}
      selectedDmsTab={selectedDmsTab}
      isEditable={isEditable}
      isPageDirty={isPageDirty}
      handlers={{ ...handlers, selectDmsTab }}
    />
  );
}
