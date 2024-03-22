import { React, useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { ClaimsManageDocumentsView } from './ClaimsManageDocuments.view';
import {
  selectorDmsViewFiles,
  getViewTableDocuments,
  selectClaimIdFromGrid,
  selectLossInformation,
  unlinkDmsViewDocuments,
  viewDocumentsDelete,
  showModal,
  viewDocumentsDownload,
  postClaimAndLossDocumentsToGxb,
  selectDmsDocDetails,
  selectDmsFileViewGridDataLoader,
  getDmsDocumentList,
  enqueueNotification,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

ClaimsManageDocuments.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleFormStatus: PropTypes.func.isRequired,
};

export default function ClaimsManageDocuments(props) {
  const { activeStep, isAllStepsCompleted, handleBack, handleNext, index, handleSave, handleFormStatus } = props;

  const dispatch = useDispatch();
  const claimDetails = useSelector(selectClaimIdFromGrid);
  const lossDetails = useSelector(selectLossInformation);
  const sectionType = constants.DMS_CONTEXT_CLAIM;

  const viewDocumentsList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);
  const DmsFileViewGridDataLoading = useSelector(selectDmsFileViewGridDataLoader);

  const [isDmsFileViewGridDataLoading, setIsDmsFileViewGridDataLoading] = useState(DmsFileViewGridDataLoading);

  const claimDocuments = [];
  const lossDocuments = [];

  const { lossDocumentDetails, claimDocumentDetails } = savedDmsDocList?.manageDocument;

  const updateClaimFileListAfterLinking = () => {
    dispatch(getViewTableDocuments({ referenceId: lossDetails?.lossRef, sectionType: constants.DMS_CONTEXT_LOSS}));
    dispatch(getViewTableDocuments({ referenceId: claimDetails?.claimReference, sectionType, parentLossRef: lossDetails?.lossRef }));
  };

  const sendDocumentToGXB = (documents) => {
    const lossDoc = [...lossDocumentDetails];
    const claimDoc = [...claimDocumentDetails];
    updateGxbIndex(documents, lossDoc);
    updateGxbIndex(documents, claimDoc);
    dispatch(getDmsDocumentList('MANAGE_DOCUMENT_LOSS_INFORMATION', lossDoc));
    dispatch(getDmsDocumentList('MANAGE_DOCUMENT_CLAIM_INFORMATION', claimDoc));
    dispatch(postClaimAndLossDocumentsToGxb({ referenceId: claimDetails?.claimReference, sectionType: sectionType, documents: documents }));
  };

  const updateGxbIndex = (documentList, docsToUpdate) => {
    const checkedDocuments = Object.keys(Object.fromEntries(Object.entries(documentList)?.filter(([key, value]) => value)));
    docsToUpdate.forEach((item) => {
      item.isSendToGxb = checkedDocuments.includes(item?.documentId?.toString()) ? 1 : 0;
    });
  };

  useEffect(
    () => {
      updateClaimFileListAfterLinking();

      return () => {
        utils.dms.resetDmsFiles(dispatch);
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const existedDocumentList = useMemo(() =>
    !utils.generic.isInvalidOrEmptyArray(viewDocumentsList) ? viewDocumentsList : [...lossDocumentDetails, ...claimDocumentDetails]
  );

  const originalTableData = useRef(existedDocumentList);

  const [search, setSearch] = useState('');
  const [filteredTableData, setFilteredTableData] = useState(originalTableData.current);
  const searchIndexedTableData = utils.dmsSearch.constructSearchableData(filteredTableData);

  const fields = utils.generic.isValidArray(existedDocumentList, true)
    ? existedDocumentList?.map((eachCheck) => ({
        name: eachCheck?.documentId.toString(),
        type: 'checkbox',
        defaultValue: eachCheck.isSendToGxb,
      }))
    : [];

  const validationSchema = utils.form.getValidationSchema(fields);
  const checkListForm = useForm({
    ...(validationSchema && { resolver: yupResolver(validationSchema), context: { validation: true } }),
  });

  const defaultCheckValues = existedDocumentList?.filter((item) => !!item.isSendToGxb === true).length;
  const [selectAll, setSelectAll] = useState(defaultCheckValues === existedDocumentList.length);

  filteredTableData?.forEach((item) => {
    if (item?.isLinkedFromLoss) {
      lossDocuments.push(item);
    } else {
      claimDocuments.push(item);
    }
  });

  const columns = [
    {
      id: 'gxb',
      label: utils.string.t('claims.manageDocumentLabels.gxb'),
      visible: true,
      compact: true,
      align: 'left',
    },
    {
      id: 'filename',
      label: utils.string.t('claims.manageDocumentLabels.filename'),
      visible: true,
      compact: true,
      align: 'left',
      width: '25px',
    },
    {
      id: 'uploadedby',
      label: utils.string.t('claims.manageDocumentLabels.uploadedby'),
      visible: true,
      compact: true,
      align: 'left',
    },
    {
      id: 'uploadedon',
      label: utils.string.t('claims.manageDocumentLabels.uploadedon'),
      visible: true,
      compact: true,
      align: 'left',
    },
  ];

  const popoverActions = [
    {
      id: 'download',
      label: utils.string.t('dms.view.popOverMenuItems.download'),
      callback: ({ doc }) => dispatch(viewDocumentsDownload(doc)),
    },
    {
      id: 'unlink',
      label: utils.string.t('dms.view.popOverMenuItems.unlink'),
      callback: ({ doc }) => confirmDocumentUnlink([doc]),
    },
    {
      id: 'delete',
      label: utils.string.t('dms.view.popOverMenuItems.delete'),
      callback: ({ doc }) => confirmDocumentDelete([doc]),
    },
    {
      id: 'versionHistory',
      label: utils.string.t('dms.view.popOverMenuItems.versionHistory'),
      callback: ({ doc }) => showVersionHistoryModal(doc),
    },
    {
      id: 'copyLink',
      label: utils.string.t('dms.view.popOverMenuItems.copylink'),
      callback: ({ doc }) => copyLinkToClipboard(doc),
    },
  ];

  const searchFields = [
    {
      name: 'query',
      type: 'text',
      placeholder: utils.string.t('claims.manageDocumentLabels.searchPlaceholder'),
      defaultValue: '',
      gridSize: { xs: 12 },
      muiComponentProps: {
        autoComplete: 'off',
      },
    },
  ];

  const searchActions = [
    {
      name: 'filter',
      label: utils.string.t('app.searchLabel'),
      handler: ({ query }) => setSearch(query),
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => setSearch(''),
    },
  ];

  const confirmDocumentUnlink = (docs) => {
    const requestParams = [];
    docs?.forEach((doc) => {
      if (doc?.isLinkedFromLoss) {
        requestParams.push(
          {
            documentId: doc.documentId,
            referenceId: claimDetails?.claimReference,
            sectionType: sectionType,
          },
          {
            documentId: doc.documentId,
            referenceId: lossDetails?.lossRef,
            sectionType: constants.DMS_CONTEXT_LOSS,
          }
        );
      } else {
        requestParams.push({
          documentId: doc.documentId,
          referenceId: claimDetails?.claimReference,
          sectionType: sectionType,
        });
      }
    });
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.unlinkDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.unlinkDocument.confirmLabel'),
            confirmMessage: utils.string.t('dms.view.unlinkDocument.confirmMessage'),
            submitHandler: () =>
              dispatch(unlinkDmsViewDocuments(requestParams)).then((response) => {
                if (response?.status === constants.API_RESPONSE_OK) {
                  updateClaimFileListAfterLinking();
                }
              }),
          },
        },
      })
    );
  };

  const confirmDocumentDelete = (docs) => {
    const documentIds = docs?.map((doc) => doc.documentId);

    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.deleteDocument.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('dms.view.deleteDocument.confirmLabel'),
            confirmMessage: utils.string.t('dms.view.deleteDocument.confirmMessage'),
            submitHandler: () =>
              dispatch(viewDocumentsDelete(documentIds)).then((response) => {
                if (response?.status === constants.API_RESPONSE_OK) {
                  updateClaimFileListAfterLinking();
                }
              }),
          },
        },
      })
    );
  };

  const showVersionHistoryModal = (docData) => {
    dispatch(
      showModal({
        component: 'DMS_VERSION_HISTORY',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.view.versionHistory.title'),
          maxWidth: 'xs',
          componentProps: {
            docData: docData,
          },
        },
      })
    );
  };

  const viewDocLauncher = (e, doc) => {
    e.preventDefault();
    const { documentId, documentName } = doc;
    utils.dms.dmsDocumentViewLauncher(documentId, documentName);
  };

  const copyLinkToClipboard = (doc) => {
    if (navigator?.clipboard !== undefined) {
      //Chrome and other
      navigator?.clipboard?.writeText(doc?.documentPath).then(
        function () {
          dispatch(enqueueNotification(utils.string.t('claims.manageDocumentLabels.copyToClipBoardMessage'), 'success'));
        },
        function (err) {
          dispatch(enqueueNotification(err, 'error'));
        }
      );
    } else if (window?.clipboardData) {
      // Internet Explorer
      window?.clipboardData?.setData('Text', doc?.documentPath);
      dispatch(enqueueNotification(utils.string.t('claims.manageDocumentLabels.copyToClipBoardMessage'), 'success'));
    }
  };

  useEffect(() => {
    if (search) {
      setFilteredTableData(utils.dmsSearch.getFilteredTableData(searchIndexedTableData, search, originalTableData));
    } else setFilteredTableData(originalTableData.current);
  }, [search]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    originalTableData.current = !utils.generic.isInvalidOrEmptyArray(viewDocumentsList)
      ? viewDocumentsList
      : [...lossDocumentDetails, ...claimDocumentDetails];
    setFilteredTableData(originalTableData.current);
  }, [viewDocumentsList?.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsDmsFileViewGridDataLoading(DmsFileViewGridDataLoading);
  }, [DmsFileViewGridDataLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimsManageDocumentsView
      activeStep={activeStep}
      isAllStepsCompleted={isAllStepsCompleted}
      index={index}
      cols={columns}
      fields={fields}
      formControls={checkListForm}
      popoverActions={popoverActions}
      searchFields={searchFields}
      searchActions={searchActions}
      claimDocuments={claimDocuments}
      lossDocuments={lossDocuments}
      selectAll={selectAll}
      isDmsFileViewGridDataLoading={isDmsFileViewGridDataLoading}
      handlers={{
        back: handleBack,
        next: handleNext,
        save: handleSave,
        formStatus: handleFormStatus,
        sendDocumentToGXB,
        setSelectAll,
        updateClaimFileListAfterLinking,
        viewDocLauncher,
      }}
    />
  );
}
