import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import uniqBy from 'lodash/uniqBy';

// app
import styles from './PremiumProcessingCaseRfiRespond.styles';
import PremiumProcessingCaseRfiRespondView from './PremiumProcessingCaseRfiRespond.view';
import {
  premiumProcessingRespondRFI,
  selectAssignedToUsers,
  getAssignedToUsersList,
  selectorDmsViewFiles,
  selectRefDataQueryCodes,
  getViewTableDocuments,
  getDmsFilesUploaded,
  selectUserRole,
  linkMultipleDmsDocuments
} from 'stores';
import { useConfirmNavigation } from 'hooks';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingCaseRfiRespond.propTypes = {
  caseDetails: PropTypes.object.isRequired,
  rfiDetails: PropTypes.object.isRequired,
  isPageDirty: PropTypes.bool.isRequired,
  isWorklist: PropTypes.bool.isRequired,
  respondRfiDisable: PropTypes.bool,
  handlers: PropTypes.shape({
    setIsPageDirty: PropTypes.func.isRequired,
  }),
};
export default function PremiumProcessingCaseRfiRespond({ caseDetails, rfiDetails, isPageDirty, isWorklist, handlers, respondRfiDisable }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseRfiRespond' })();
  const dispatch = useDispatch();
  const history = useHistory();

  const selectAssignees = useSelector(selectAssignedToUsers);
  const dmsViewFiles = useSelector(selectorDmsViewFiles);
  const queryCodes = useSelector(selectRefDataQueryCodes);
  const currentUser = useSelector(selectUserRole);
  const uploadedFile = useSelector(getDmsFilesUploaded);
  const queryCodesRfi = queryCodes.find((queryCode) => queryCode?.queryCodeDetails === rfiDetails?.queryCode);
  const tabDetails = caseDetails?.taskView === constants.WORKBASKET || caseDetails?.taskView === constants.ALL_CASES;
  const isFrontEndContact =
  utils.generic.isValidArray(currentUser, true) &&
  currentUser.some((item) => [constants.FRONT_END_CONTACT.toLowerCase()].includes(item.name.toLowerCase()));
  const { confirmNavigation } = useConfirmNavigation({
    title: utils.string.t('navigation.form.titleClear'),
    subtitle: utils.string.t('navigation.form.subtitle'),
  });

  const [selectedDmsTab, setSelectedDmsTab] = useState(constants.DMS_VIEW_TAB_VIEW);
  const [selectedDmsFiles, setSelectedDmsFiles] = useState([]);

  const dmsLinkedUploadedFilesList = uniqBy([...dmsViewFiles, ...selectedDmsFiles], 'documentId');

  const isAssignedToUserList = utils.generic.isValidArray(selectAssignees, true);

  
  /* this api is used to link the attachment uploaded in FEC because api team is not linking the record
   internally so added this code to link the record after the upload is successfully */   
  useEffect(() => {
    if(isFrontEndContact && uploadedFile?.length){
      const uploadedFiles = uploadedFile?.map((d) => {
        return {
          documentId: d.documentId,
          referenceId: rfiDetails?.queryId,
          sectionType: constants.DMS_CONTEXT_RFI,
        };
      });
      dispatch(linkMultipleDmsDocuments(uploadedFiles));
    }
  },[isFrontEndContact, uploadedFile, rfiDetails?.queryId]);   // eslint-disable-line react-hooks/exhaustive-deps


  const fetchDmsDocuments = (id) => {
    if (id) {
      dispatch(getViewTableDocuments({ referenceId: id, sectionType: constants.DMS_CONTEXT_RFI }));
    }
  };

  useEffect(() => {
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

    // fetch latest linked RFI documents
    if (tabName === constants.DMS_VIEW_TAB_VIEW) {
      if (rfiDetails?.queryId) {
        dispatch(getViewTableDocuments({ referenceId: rfiDetails.queryId, sectionType: constants.DMS_CONTEXT_RFI }));
      }
    }
  };

  const onSelectDmsFile = (files) => {
    setSelectedDmsFiles(uniqBy([...selectedDmsFiles, ...files], 'documentId'));
  };

  const fields = [
    {
      name: 'rfiResponse',
      type: 'textarea',
      value: '',
      validation: Yup.string()
        .min(5, utils.string.t('validation.string.min'))
        .max(4000, utils.string.t('validation.string.max'))
        .required(utils.string.t('validation.required')),
      label: utils.string.t('premiumProcessing.rfi.rfiResponse'),
      fullWidth: true,
      muiComponentProps: {
        inputProps: {
          maxLength: 4000,
          classes: {
            root: classes.typeYourResponseTextWidth,
          },
        },
        multiline: true,
        rows: 5,
        rowsMax: 10,
        disabled: tabDetails || !respondRfiDisable,
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
              minRows: 5,
              maxRows: 10,
              readOnly: true,
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
      label: utils.string.t('premiumProcessing.rfi.respondRfi'),
      handler: (reset) => (values) => {
        if (values) {
          const rfiSendData = {
            assignedTo: rfiDetails?.createdByEmail?.toLowerCase(),
            bpmTaskID: rfiDetails?.taskId,
            caseIncidentID: rfiDetails?.caseId,
            notes: values?.rfiResponse,
            team: rfiDetails?.team,
            queryCodeDescription: rfiDetails?.queryCode,
            documentId: selectedDmsFiles?.map((doc) => doc.documentId),
          };

          handlers.setIsPageDirty(false);

          dispatch(premiumProcessingRespondRFI(rfiSendData)).then((response) => {
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

  const dmsObjTable = {
    context: constants.DMS_CONTEXT_CASE,
    referenceId: rfiDetails?.caseId?.toString(),
    sourceId: caseDetails?.caseTeamData?.xbInstanceId,
  };

  const dmsObjSearch = {
    context: constants.DMS_CONTEXT_RFI,
    referenceId: rfiDetails?.queryId?.toString(),
    source: '',
  };

  const tabs = [
    {
      value: constants.DMS_VIEW_TAB_VIEW,
      label: utils.string.t('dms.wrapper.tabs.viewDocuments'),
    },
    {
      value: constants.DMS_VIEW_TAB_SEARCH,
      label: utils.string.t('dms.wrapper.tabs.search'),
      disabled: !isWorklist,
    },
  ];

  // abort
  if (!rfiDetails?.taskId) {
    return null;
  }

  return (
    <PremiumProcessingCaseRfiRespondView
      fields={fields}
      actions={actions}
      caseDetails={caseDetails}
      rfiDetails={rfiDetails}
      queryCodesRfi={queryCodesRfi}
      dmsObjTable={dmsObjTable}
      dmsObjSearch={dmsObjSearch}
      dmsTabs={tabs}
      documents={dmsLinkedUploadedFilesList}
      selectedDmsTab={selectedDmsTab}
      isPageDirty={isPageDirty}
      handlers={{ ...handlers, selectDmsTab, onSelectDmsFile }}
    />
  );
}
