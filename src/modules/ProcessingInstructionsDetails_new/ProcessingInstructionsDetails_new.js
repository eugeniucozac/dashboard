import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import isEqual from 'lodash/isEqual';
import config from 'config';
import moment from 'moment';
import isNumber from 'lodash/isNumber';

// app
import ProcessingInstructionsDetailsView from './ProcessingInstructionsDetails_new.view';
import {
  selectUser,
  showModal,
  updateProcessingInstruction,
  removePremiumTaxSignedLinesDocument,
  addLoader,
  storeProcessingInstructionDocuments,
  viewDocumentsDownload,
  setRiskRefsUploadWizardExcelExtract,
  setRiskRefsUploadWizardHeaderMap,
  submitExcelUploadedRiskRefs,
  updatePiFinancialCheckList,
  savePIRetainedBrokerageAmountData,
  enqueueNotification,
  resetCopiedExcelData,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

ProcessingInstructionsDetails.propTypes = {
  instruction: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
  }).isRequired,
  childRef: PropTypes.object.isRequired,
};

export default function ProcessingInstructionsDetails({ instruction, handlers, childRef }) {
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const getFinancialCheckListTableDetails = useSelector((state) => get(state, 'processingInstructions.financialCheckList')) || [];
  const getRetainedBrokerageAmountList = useSelector((state) => get(state, 'processingInstructions.retainedBrokerageAmountList')) || [];
  const excelRiskRefs = useSelector((state) => get(state, 'processingInstructions.excelRiskRefs')) || [];
  const refDataCurrencies = useSelector((state) => get(state, 'referenceData.currencyCodes')) || [];
  const referenceData = useSelector((state) => state.referenceData);
  const headerMap = useSelector((state) => get(state, 'processingInstructions.headerMap')) || [];

  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isSubmittedAuthorisedSignatory = utils.processingInstructions.status.isSubmittedAuthorisedSignatory(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const userHasApproverAccess = utils.app.access.feature('processingInstructions.approverChecklist', ['create', 'update'], user);
  const retainedBrokerageAmountData = utils.form.getSelectOptions('premiumCurrency', {
    ...referenceData,
    premiumCurrency: utils.processingInstructions.getRetainedBrokerageCurrencies(),
  });

  const [financialCheckListTable, setFinancialCheckListTable] = useState(getFinancialCheckListTableDetails);
  const [retainedBrokerageAmountList, setRetainedBrokerageAmountList] = useState(getRetainedBrokerageAmountList);
  const [defaultValues, setDefaultValues] = useState();

  const fcDefaultTableData = instruction?.financialChecklistDetails || [];
  const isCheckboxesEditable = userHasApproverAccess && isSubmittedAuthorisedSignatory;
  const isEditable = userHasWritePermission && (isDraft || isRejectedDraft || isReopened);
  const isReadOnly = !isEditable;
  const leadRiskRef = instruction?.riskReferences?.find((r) => r.leadPolicy);
  const toggleOptions = [
    { label: utils.string.t('app.yes'), value: 1 },
    { label: utils.string.t('app.no'), value: 0 },
    { label: utils.string.t('app.na'), value: -1 },
  ];

  const fields = [
    {
      name: 'highPriority',
      type: 'checkbox',
      value: instruction?.details?.highPriority,
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.highPriority'),
      muiComponentProps: {
        disabled: isReadOnly,
      },
    },
    {
      name: 'frontEndSendDocs',
      type: 'checkbox',
      value: instruction?.details?.frontEndSendDocs,
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.frontEndSendDocuments'),
      muiComponentProps: {
        disabled: isReadOnly,
      },
    },
    {
      name: 'premiumTaxCalculationSheetAttachedNumber',
      type: 'toggle',
      value: instruction?.details?.premiumTaxCalculationSheetAttached,
      options: toggleOptions,
      buttonGroupProps: {
        exclusive: true,
        disabled: isReadOnly,
      },
    },
    {
      name: 'premiumTaxCalculationSheetAttachedCheckbox',
      type: 'checkbox',
      value: instruction?.details?.premiumTaxAuthorisedSignatory,
      disabled: !isCheckboxesEditable,
    },
    {
      name: 'signedLinesCalculationSheetAttachedNumber',
      type: 'toggle',
      value: instruction?.details?.signedLinesCalculationSheetAttached,
      options: toggleOptions,
      buttonGroupProps: {
        exclusive: true,
        disabled: isReadOnly,
      },
    },
    {
      name: 'signedLinesCalculationSheetAttachedCheckbox',
      type: 'checkbox',
      value: instruction?.details?.signedLinesAuthorisedSignatory,
      disabled: !isCheckboxesEditable,
    },
    {
      name: 'financialGridCheckbox',
      type: 'checkbox',
      value: instruction?.details?.riskReferencesAuthorisedSignatory,
      disabled: !isCheckboxesEditable,
    },
    {
      name: 'notes',
      label: utils.string.t('processingInstructions.details.notes'),
      type: 'textarea',
      value: instruction?.details?.notes || '',
      muiComponentProps: {
        inputProps: { maxLength: 4000 },
        multiline: true,
        minRows: 4,
        maxRows: 8,
        disabled: isReadOnly,
      },
    },
  ];

  const financialCheckListTableFields = {
    arrayItemDef: [
      { id: 'id', name: 'id', visible: false, type: 'label', value: '', width: 10, label: '', visable: false },
      {
        id: 'riskReference',
        name: 'riskReference',
        visible: true,
        type: 'text',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.facilityReference'),
        disabled: true,
      },
      {
        id: 'grossPremiumAmount',
        name: 'grossPremiumAmount',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.grossPremium'),
      },
      {
        id: 'slipOrder',
        name: 'slipOrder',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.slipOrder'),
      },
      {
        id: 'totalBrokerage',
        name: 'totalBrokerage',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 100,
        label: utils.string.t('processingInstructions.details.totalBrokerage'),
      },
      {
        id: 'clientDiscount',
        name: 'clientDiscount',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.clientDiscount'),
      },
      {
        id: 'thirdPartyCommissionSharing',
        visible: true,
        name: 'thirdPartyCommissionSharing',
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.thirdPartyCommissionSharing'),
      },
      {
        id: 'thirdPartyName',
        name: 'thirdPartyName',
        visible: true,
        ellipsis: true,
        nowrap: false,
        tooltip: `Please enter ${utils.string.t('processingInstructions.details.thirdPartyCommissionSharing')} to enable ${utils.string.t(
          'processingInstructions.details.thirdParty'
        )}`,
        type: 'customText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.thirdParty'),
      },
      {
        id: 'pfInternalCommissionSharing',
        name: 'pfInternalCommissionSharing',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.pfInternalCommissionSharing'),
      },
      {
        id: 'pfInternalDepartment',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'customText',
        tooltip: `Please enter ${utils.string.t('processingInstructions.details.pfInternalCommissionSharing')} to enable ${utils.string.t(
          'processingInstructions.details.pfInternalDepartment'
        )}`,
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.pfInternalDepartment'),
      },
      {
        id: 'retainedBrokerage',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.retainedBrokerage'),
      },
      {
        id: 'retainedBrokerageCurrencyCode',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'select',
        displayName: 'retainedBrokerageCurrencyCodeName',
        options: retainedBrokerageAmountList,
        optionKey: 'id',
        optionLabel: 'label',
        value: constants.CURRENCY_USD,
        width: 120,
        label: utils.string.t('processingInstructions.details.retainedBrokerageAmount'),
      },
      {
        id: 'retainedBrokerageValue',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'retainedBrokeragelabel',
        value: '',
        width: 180,
        label: '',
      },
      {
        id: 'total',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'label',
        value: '',
        width: 80,
        label: utils.string.t('processingInstructions.details.total'),
      },
      {
        id: 'fees',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 80,
        label: utils.string.t('processingInstructions.details.fees'),
      },
      {
        id: 'otherDeductions',
        name: 'otherDeductions',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'numericText',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.otherDeductions'),
      },
      {
        id: 'settlementCurrency',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'select',
        displayName: 'settlementCurrencyName',
        options: refDataCurrencies,
        optionKey: 'currencyCodeID',
        optionLabel: 'currencyCd',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.settlementCurrency'),
      },
      {
        id: 'paymentBasis',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'select',
        displayName: 'paymentBasisName',
        options: constants.PAYMENT_BASIS_OPTIONS,
        optionKey: 'code',
        optionLabel: 'name',
        value: '',
        width: 180,
        label: utils.string.t('processingInstructions.details.paymentBasis'),
      },
      {
        id: 'ppwOrPpc',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'select',
        displayName: 'ppwOrPpcName',
        options: constants.PPW_PPC_OPTIONS,
        optionKey: 'code',
        optionLabel: 'name',
        value: '',
        width: 120,
        label: utils.string.t('processingInstructions.details.ppwOrPPC'),
      },
      {
        id: 'ppwOrPpcDate',
        visible: true,
        ellipsis: true,
        nowrap: false,
        type: 'customDatepicker',
        tooltip: `Please select ${utils.string.t('processingInstructions.details.ppwOrPPC')} to enable ${utils.string.t(
          'processingInstructions.details.ppwOrPPCDate'
        )}`,
        value: '',
        width: 180,
        format: config.ui.format.date.text,
        label: utils.string.t('processingInstructions.details.ppwOrPPCDate'),
      },
      ...(!isReadOnly
        ? [
            {
              id: 'actions',
              visible: true,
              ellipsis: true,
              nowrap: false,
              type: 'actions',
              actions: ['copy', 'cancel'],
              value: '',
              width: 80,
              label: '',
            },
          ]
        : []),
    ],
    fieldData: [],
  };

  // Remove the unnecessary properties from both default and updated fc arrays before comparing
  const isTableGridEdited = !isEqual(
    fcDefaultTableData?.map(({ createdBy, createdDate, updatedBy, updatedDate, total, ...fcData }) =>
      Object.entries(fcData).reduce((acc, [key, value]) => {
        return {
          ...acc,
          [key]:
            key === 'ppwOrPpcDate'
              ? value
                ? moment(value?.toString())?.format('YYYY-MM-DD')
                : null
              : key === 'retainedBrokerageCurrencyCode'
              ? value ?? constants.CURRENCY_USD
              : value?.toString() || '',
        };
      }, {})
    ),
    financialCheckListTable?.map(
      ({
        convertedBrokerage,
        id,
        ppwOrPpcName,
        retainedBrokerageAmount,
        retainedBrokerageCurrencyCodeName,
        settlementCurrencyName,
        paymentBasisName,
        retainedBrokerageValue,
        ppwOrPpcDateValue,
        total,
        createdBy,
        createdDate,
        updatedBy,
        updatedDate,
        isRowSelected,
        ...fcData
      }) =>
        Object.entries(fcData).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]:
              key === 'ppwOrPpcDate'
                ? value
                  ? moment(value?.toString())?.format('YYYY-MM-DD')
                  : null
                : key === 'retainedBrokerageCurrencyCode'
                ? value ?? constants.CURRENCY_USD
                : value?.toString() || '',
          };
        }, {})
    )
  );

  const handleSave = () => {
    const formValues = childRef?.current?.props?.values || {};

    const updatedInstruction = {
      ...instruction,
      details: {
        ...instruction.details,
        highPriority: formValues.highPriority,
        frontEndSendDocs: formValues.frontEndSendDocs,
        notes: formValues.notes,
        premiumTaxCalculationSheetAttached: formValues.premiumTaxCalculationSheetAttachedNumber,
        premiumTaxAuthorisedSignatory: formValues.premiumTaxCalculationSheetAttachedCheckbox,
        signedLinesCalculationSheetAttached: formValues.signedLinesCalculationSheetAttachedNumber,
        signedLinesAuthorisedSignatory: formValues.signedLinesCalculationSheetAttachedCheckbox,
        riskReferencesAuthorisedSignatory: formValues.financialGridCheckbox,
      },
      financialChecklistDetails: financialCheckListTable?.map((riskRef) => {
        const isValidDate = moment(riskRef.ppwOrPpcDate).isValid();
        const ppwOrPpcDate = isValidDate ? moment(riskRef.ppwOrPpcDate).format('YYYY-MM-DD') : '';
        return {
          instructionBrokerageDetailsId: riskRef.instructionBrokerageDetailsId,
          riskReference: riskRef.riskReference,
          grossPremiumAmount: riskRef.grossPremiumAmount,
          slipOrder: riskRef.slipOrder,
          totalBrokerage: riskRef.totalBrokerage,
          clientDiscount: riskRef.clientDiscount,
          thirdPartyCommissionSharing: riskRef.thirdPartyCommissionSharing,
          thirdPartyName: riskRef.thirdPartyName,
          pfInternalCommissionSharing: riskRef.pfInternalCommissionSharing,
          pfInternalDepartment: riskRef.pfInternalDepartment,
          retainedBrokerage: riskRef.retainedBrokerage,
          retainedBrokerageCurrencyCode: riskRef.retainedBrokerageCurrencyCode,
          fees: riskRef.fees,
          otherDeductions: riskRef.otherDeductions,
          settlementCurrency: riskRef.settlementCurrency,
          paymentBasis: riskRef.paymentBasis,
          ppwOrPpc: riskRef.ppwOrPpc,
          ppwOrPpcDate: ppwOrPpcDate,
        };
      }),
    };
    setFinancialCheckListTable((prevState) => prevState.map((dd) => ({ ...dd, isRowSelected: false })));
    dispatch(updateProcessingInstruction(updatedInstruction, formValues));
  };

  const handleCancel = () => {
    const reset = childRef?.current?.props?.resetFunc;

    if (utils.generic.isFunction(reset)) {
      reset(defaultValues, { keepDirty: false });
    }
    const financialCheckListDBList = instruction?.financialChecklistDetails?.map((element, index) => ({ ...element, id: index }));
    dispatch(updatePiFinancialCheckList(financialCheckListDBList));
    setFinancialCheckListTable(financialCheckListDBList);
  };

  const handleUploadedDocument = (data, documentTypeKey) => {
    const newFiles = data?.data?.documentDto;
    if (!utils.generic.isValidArray(newFiles)) return;
    const newGxbDocs = newFiles.map((file) => {
      return {
        ...file,
        folderUuid: file?.folderUid,
        name: file?.documentName,
        path: file?.documentPath,
        source: file?.documentSource,
        typeId: file?.documentTypeId,
        uuid: file?.documentUid,
      };
    });

    const updatedDocuments = {
      ...documents,
      ...(documentTypeKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piPremiumCalculation && {
        premiumTaxDocument: newGxbDocs[0],
      }),
      ...(documentTypeKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.piMarketSigned && {
        signedLinesDocument: newGxbDocs[0],
      }),
    };
    dispatch(storeProcessingInstructionDocuments(updatedDocuments));
  };

  const uploadPremiumTaxSignedLinesModal = (documentTypeKey) => (files) => {
    dispatch(addLoader('DmsUploadFiles'));

    dispatch(
      showModal({
        component: 'DMS_UPLOAD_FILES',
        props: {
          fullWidth: true,
          title: utils.string.t('dms.upload.modalItems.uploadDocuments'),
          hideCompOnBlur: false,
          maxWidth: 'xl',
          componentProps: {
            files,
            context: constants.DMS_CONTEXT_PROCESSING_INSTRUCTION,
            referenceId: Number(instruction?.id),
            sourceId: Number(leadRiskRef?.xbInstanceId),
            documentTypeKey,
            postDmsDocumentsSuccess: (data) => handleUploadedDocument(data, documentTypeKey),
            confirmLabel: utils.string.t('app.ok'),
            cancelLabel: utils.string.t('app.goBack'),
            confirmMessage: utils.string.t('processingInstructions.documentsWillNotBeSaved'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
          },
        },
      })
    );
  };

  const confirmRemoveDocumentModal = (file, removeDocumentType) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('processingInstructions.checklist.warning.title'),
          maxWidth: 'xs',
          componentProps: {
            confirmLabel: utils.string.t('app.yes'),
            cancelLabel: utils.string.t('app.no'),
            confirmMessage: utils.string.t('processingInstructions.removeDocumentWarning'),
            buttonColors: { confirm: 'secondary', cancel: 'primary' },
            submitHandler: () => {
              dispatch(removePremiumTaxSignedLinesDocument({ docIds: file?.documentId, removeDocumentType, documents }));
            },
            cancelHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
  };

  const handleLinkDownload = (file) => {
    dispatch(viewDocumentsDownload({ documentId: file?.documentId, documentName: file?.name }));
  };

  const uploadExcelData = () => {
    dispatch(
      showModal({
        component: 'PASTE_FROM_EXCEL',
        props: {
          title: utils.string.t('processingInstructions.details.piDetailsExcelModal.title'),
          fullWidth: true,
          maxWidth: 'lg',
          hideCompOnBlur: false,
          componentProps: {
            name: 'placement-overview',
            headers: headerMap,
            steps: 3,
            isValidateHeadersMapping: true,
            labels: {
              step1: {
                title: utils.string.html('processingInstructions.details.piDetailsExcelModal.step1.title'),
                hint: utils.string.t('processingInstructions.details.piDetailsExcelModal.step1.hint'),
              },
              step2: {
                title: utils.string.html('processingInstructions.details.piDetailsExcelModal.step2.title'),
                hint: utils.string.t('processingInstructions.details.piDetailsExcelModal.step2.hint'),
              },
              step3: {
                title: utils.string.html('processingInstructions.details.piDetailsExcelModal.step3.title'),
                hint: utils.string.t(''),
              },
            },
            handlers: {
              extract: (data) => {
                dispatch(setRiskRefsUploadWizardExcelExtract(data));
              },
              match: (data) => {
                dispatch(setRiskRefsUploadWizardHeaderMap(data));
              },
              submit: () => {
                dispatch(submitExcelUploadedRiskRefs());
              },
            },
          },
        },
      })
    );
  };

  const handleTableTextboxChange = (e, column, row, name) => {
    let value = column.type === 'text' || column.type === 'customText' ? e?.target?.value || '' : e?.floatValue || '';
    if (column.type === 'text' || column.type === 'customText') {
      e.preventDefault();
    }

    if (column.id === 'thirdPartyCommissionSharing') {
      setFinancialCheckListTable((prevState) =>
        prevState.map((dd) =>
          dd.id === row.id
            ? {
                ...dd,
                [column?.id]: value,
                thirdPartyName: !value ? '' : dd.thirdPartyName,
              }
            : dd
        )
      );
    }
    if (column.id === 'pfInternalCommissionSharing') {
      setFinancialCheckListTable((prevState) =>
        prevState.map((dd) =>
          dd.id === row.id
            ? {
                ...dd,
                [column?.id]: value,
                pfInternalDepartment: !value ? '' : dd.pfInternalDepartment,
              }
            : dd
        )
      );
    }
    if (column.id !== 'pfInternalCommissionSharing' && column.id !== 'thirdPartyCommissionSharing') {
      setFinancialCheckListTable((prevState) => prevState.map((dd) => (dd.id === row.id ? { ...dd, [column?.id]: value } : dd)));
    }

    if (row.clientDiscount && row.thirdPartyCommissionSharing && row.pfInternalCommissionSharing && row.retainedBrokerage) {
      const sumValuesArray = [row.clientDiscount, row.thirdPartyCommissionSharing, row.pfInternalCommissionSharing, row.retainedBrokerage];
      const totalValue = utils.generic.getSumOfArray(sumValuesArray, config.ui.format.percent.decimal);
      setFinancialCheckListTable((prevState) => prevState.map((dd) => (dd.id === row.id ? { ...dd, total: totalValue } : dd)));
    } else {
      setFinancialCheckListTable((prevState) => prevState.map((dd) => (dd.id === row.id ? { ...dd, total: null } : dd)));
    }
    dispatch(updatePiFinancialCheckList(financialCheckListTable));
  };

  const handleTableSelectChange = (e, selectedValue, column, row) => {
    e.preventDefault();
    if (column.id === 'ppwOrPpc' && selectedValue?.name === 'N/A') {
      setFinancialCheckListTable((prevState) =>
        prevState.map((dd) =>
          dd.id === row.id
            ? {
                ...dd,
                [column?.id]: selectedValue?.value,
                [column?.displayName]: selectedValue?.name,
                ppwOrPpcDate: null,
              }
            : dd
        )
      );
    } else {
      setFinancialCheckListTable((prevState) =>
        prevState.map((dd) =>
          dd.id === row.id
            ? {
                ...dd,
                [column?.id]: selectedValue?.value,
                [column?.displayName]: selectedValue?.name,
              }
            : dd
        )
      );
    }
  };

  const handleTableRowClick = (e, row) => {
    e.preventDefault();
    if (!isReadOnly) {
      if (!row.isRowSelected) {
        setFinancialCheckListTable((prevState) =>
          prevState.map((dd) => (dd.id === row.id ? { ...dd, isRowSelected: true } : { ...dd, isRowSelected: false }))
        );
      }
    }
  };

  const handleTableDatePickerChange = (columnName, value, row) => {
    setFinancialCheckListTable((prevState) =>
      prevState.map((dd) => (dd.id === row.id ? { ...dd, [columnName]: value, ppwOrPpcDateValue: value } : dd))
    );
  };
  const handleTableUndoRowData = (row) => {
    const dbData = fcDefaultTableData.find((a) => a.riskReference === row.riskReference);

    setFinancialCheckListTable((prevState) =>
      prevState.map((dd) =>
        dd.id === row.id
          ? {
              ...dd,
              grossPremiumAmount: dbData?.grossPremiumAmount,
              slipOrder: dbData?.slipOrder,
              totalBrokerage: dbData?.totalBrokerage,
              clientDiscount: dbData?.clientDiscount,
              thirdPartyCommissionSharing: dbData?.thirdPartyCommissionSharing,
              thirdPartyName: dbData?.thirdPartyName,
              pfInternalCommissionSharing: dbData?.pfInternalCommissionSharing,
              pfInternalDepartment: dbData?.pfInternalDepartment,
              retainedBrokerage: dbData?.retainedBrokerage,
              retainedBrokerageCurrencyCode: dbData?.retainedBrokerageCurrencyCode,
              retainedBrokerageValue: dbData?.retainedBrokerageValue,
              total: dbData?.total,
              fees: dbData?.fees,
              otherDeductions: dbData?.otherDeductions,
              settlementCurrency: dbData?.settlementCurrency,
              paymentBasis: dbData?.paymentBasis,
              ppwOrPpc: dbData?.ppwOrPpc,
              ppwOrPpcDate: dbData?.ppwOrPpcDate,
              ppwOrPpcDateValue: dbData?.ppwOrPpcDateValue,
              isRowSelected: false,
            }
          : dd
      )
    );
  };

  const handleTableCopyRowData = (index) => {
    if (!isReadOnly) {
      const copyAboveRow = financialCheckListTable?.find((a) => a.id === index - 1);
      const currentRow = financialCheckListTable?.find((a) => a.id === index);
      setFinancialCheckListTable((prevState) =>
        prevState.map((dd) =>
          dd.id === index
            ? {
                ...dd,
                id: currentRow?.id,
                grossPremiumAmount: copyAboveRow?.grossPremiumAmount,
                slipOrder: copyAboveRow?.slipOrder,
                totalBrokerage: copyAboveRow?.totalBrokerage,
                clientDiscount: copyAboveRow?.clientDiscount,
                thirdPartyCommissionSharing: copyAboveRow?.thirdPartyCommissionSharing,
                thirdPartyName: copyAboveRow?.thirdPartyName,
                pfInternalCommissionSharing: copyAboveRow?.pfInternalCommissionSharing,
                pfInternalDepartment: copyAboveRow?.pfInternalDepartment,
                retainedBrokerage: copyAboveRow?.retainedBrokerage,
                retainedBrokerageCurrencyCode: copyAboveRow?.retainedBrokerageCurrencyCode,
                retainedBrokerageValue: copyAboveRow?.retainedBrokerageValue,
                total: copyAboveRow?.total,
                fees: copyAboveRow?.fees,
                otherDeductions: copyAboveRow?.otherDeductions,
                settlementCurrency: copyAboveRow?.settlementCurrency,
                paymentBasis: copyAboveRow?.paymentBasis,
                ppwOrPpc: copyAboveRow?.ppwOrPpc,
                ppwOrPpcDate: copyAboveRow?.ppwOrPpcDate,
                ppwOrPpcDateValue: copyAboveRow?.ppwOrPpcDateValue,
              }
            : dd
        )
      );
    }
  };

  const getDecimalNumberFormat = (value) => {
    const stringValue = value ? value?.toString() : '';
    return stringValue && isNumber(parseFloat(stringValue?.replace(',', ''))) && !isNaN(parseFloat(stringValue?.replace(',', '')))
      ? parseFloat(stringValue?.replace(',', ''))
      : null;
  };

  useEffect(() => {
    if (utils.generic.isValidArray(excelRiskRefs, true)) {
      let matchingRiskRefCount = 0;
      const updatedPiRiskRefsFromExcelRiskRefs = financialCheckListTable?.map((piRiskRef) => {
        const matchedRiskRef = excelRiskRefs?.find((exRiskRef) => exRiskRef?.riskReference === piRiskRef?.riskReference);
        if (matchedRiskRef) {
          matchingRiskRefCount = matchingRiskRefCount + 1;
          const updatedExcelData = matchedRiskRef;
          updatedExcelData.retainedBrokerageCurrencyCodeName = matchedRiskRef?.retainedBrokerageCurrencyCode || constants.CURRENCY_USD;
          updatedExcelData.settlementCurrencyName = matchedRiskRef?.settlementCurrency;
          updatedExcelData.paymentBasisName = matchedRiskRef?.paymentBasis;
          updatedExcelData.ppwOrPpcName = matchedRiskRef?.ppwOrPpc;

          //Converting Number Decimal Formats
          updatedExcelData.grossPremiumAmount = getDecimalNumberFormat(matchedRiskRef?.grossPremiumAmount);
          updatedExcelData.slipOrder = getDecimalNumberFormat(matchedRiskRef?.slipOrder);
          updatedExcelData.clientDiscount = getDecimalNumberFormat(matchedRiskRef?.clientDiscount);
          updatedExcelData.thirdPartyCommissionSharing = getDecimalNumberFormat(matchedRiskRef?.thirdPartyCommissionSharing);
          updatedExcelData.totalBrokerage = getDecimalNumberFormat(matchedRiskRef?.totalBrokerage);
          updatedExcelData.pfInternalCommissionSharing = getDecimalNumberFormat(matchedRiskRef?.pfInternalCommissionSharing);
          updatedExcelData.retainedBrokerage = getDecimalNumberFormat(matchedRiskRef?.retainedBrokerage);
          updatedExcelData.fees = getDecimalNumberFormat(matchedRiskRef?.fees);
          updatedExcelData.otherDeductions = getDecimalNumberFormat(matchedRiskRef?.otherDeductions);

          //Update for dropdown selected values
          updatedExcelData.retainedBrokerageCurrencyCode =
            retainedBrokerageAmountData.find(
              (a) => a.label.toLowerCase() === matchedRiskRef?.retainedBrokerageCurrencyCodeName?.toLowerCase()
            )?.id || constants.CURRENCY_USD;
          updatedExcelData.settlementCurrency =
            refDataCurrencies.find((a) => a.currencyCd.toLowerCase() === matchedRiskRef?.settlementCurrencyName?.toLowerCase())
              ?.currencyCodeID || '';
          updatedExcelData.paymentBasis =
            constants.PAYMENT_BASIS_OPTIONS.find((a) => a.name.toLowerCase() === matchedRiskRef?.paymentBasisName?.toLowerCase())?.code ||
            '';
          updatedExcelData.ppwOrPpc =
            constants.PPW_PPC_OPTIONS.find((a) => a.name.toLowerCase() === matchedRiskRef?.ppwOrPpcName?.toLowerCase())?.code || '';

          return {
            ...piRiskRef,
            ...updatedExcelData,
          };
        }
        return piRiskRef;
      });
      dispatch(
        enqueueNotification(
          utils.string.t('processingInstructions.excelCopyMatchingRiskReferences', {
            matchingCount: matchingRiskRefCount,
          }),
          'warning'
        )
      );
      setFinancialCheckListTable(updatedPiRiskRefsFromExcelRiskRefs);
    }
  }, [excelRiskRefs]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setRetainedBrokerageAmountList(retainedBrokerageAmountData);
    // Calculate Retain Brokerage value & Total column for every row
    financialCheckListTable?.map((element) => {
      const amount = utils.processingInstructions.getRetainedBrokerageValue(
        element.grossPremiumAmount,
        element.slipOrder,
        element.retainedBrokerage
      );
      const brokerage = utils.processingInstructions.getRetainedBrokerageConvertedValue(
        element.retainedBrokerageCurrencyCode || constants.CURRENCY_USD,
        amount
      );
      const totalValue =
        element.clientDiscount && element.thirdPartyCommissionSharing && element.pfInternalCommissionSharing && element.retainedBrokerage
          ? utils.generic.getSumOfArray(
              [element.clientDiscount, element.thirdPartyCommissionSharing, element.pfInternalCommissionSharing, element.retainedBrokerage],
              config.ui.format.percent.decimal
            )
          : null;
      return (
        (element.retainedBrokerageCurrencyCode = element.retainedBrokerageCurrencyCode
          ? element.retainedBrokerageCurrencyCode
          : constants.CURRENCY_USD),
        (element.retainedBrokerageAmount = amount),
        (element.convertedBrokerage = brokerage),
        (element.settlementCurrencyName =
          refDataCurrencies.find((a) => a.currencyCodeID === parseInt(element.settlementCurrency))?.currencyCd || ''),
        (element.paymentBasisName = constants.PAYMENT_BASIS_OPTIONS.find((a) => a.code === element.paymentBasis)?.name || ''),
        (element.ppwOrPpcName = constants.PPW_PPC_OPTIONS.find((a) => a.code === element.ppwOrPpc)?.name || ''),
        (element.retainedBrokerageCurrencyCodeName =
          retainedBrokerageAmountData.find((a) => a.id === element.retainedBrokerageCurrencyCode)?.label || constants.CURRENCY_USD),
        (element.total = totalValue)
      );
    });
    dispatch(updatePiFinancialCheckList(financialCheckListTable));
    dispatch(savePIRetainedBrokerageAmountData(retainedBrokerageAmountData));
  }, [financialCheckListTable]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      const reset = childRef?.current?.props?.resetFunc;
      const updatedDefaultValues = {
        ...utils.form.getInitialValues(fields),
      };

      setDefaultValues(updatedDefaultValues);

      if (utils.generic.isFunction(reset)) {
        reset(updatedDefaultValues, {
          keepDirty: false,
        });
      }
    },
    [instruction] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    //cleanup
    return () => {
      dispatch(resetCopiedExcelData());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // abort if data is not ready/available
  if (!defaultValues || !instruction) return null;

  return (
    <ProcessingInstructionsDetailsView
      instructionId={instruction?.id}
      documents={documents}
      fields={fields}
      defaultValues={defaultValues}
      isEditable={isEditable}
      isReadOnly={isReadOnly}
      tableRows={financialCheckListTable}
      tableFields={financialCheckListTableFields}
      isTableGridEdited={isTableGridEdited}
      ref={childRef}
      handlers={{
        ...handlers,
        cancel: handleCancel,
        confirmRemoveDocumentModal,
        download: handleLinkDownload,
        save: handleSave,
        uploadExcelData,
        uploadPremiumTaxSignedLinesModal,
        handleTableTextboxChange: handleTableTextboxChange,
        handleTableRowClick: handleTableRowClick,
        handleTableSelectChange: handleTableSelectChange,
        handleTableDatePickerChange: handleTableDatePickerChange,
        handleTableCopyRowData: handleTableCopyRowData,
        handleTableUndoRowData: handleTableUndoRowData,
      }}
    />
  );
}
