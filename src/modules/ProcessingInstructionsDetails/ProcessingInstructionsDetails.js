import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import uniqBy from 'lodash/uniqBy';

// app
import ProcessingInstructionsDetailsView from './ProcessingInstructionsDetails.view';
import {
  selectUser,
  showModal,
  updateProcessingInstruction,
  removePremiumTaxSignedLinesDocument,
  storeRetainedBrokerageAmountForPdf,
  storeTotalAmountForPdf,
  addLoader,
  storeProcessingInstructionDocuments,
  viewDocumentsDownload,
  enqueueNotification,
  selectRefDataThirdPartyList,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

ProcessingInstructionsDetails.propTypes = {
  instruction: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
  }).isRequired,
  childRef: PropTypes.object.isRequired,
};

export default function ProcessingInstructionsDetails({ instruction, handlers, childRef, checkListMandatoryDataStatus }) {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const refDataCurrencies = useSelector((state) => get(state, 'referenceData.currencyCodes')) || [];
  const optionsDepartments = useSelector((state) => state.processingInstructions.departmentList) || [];
  const departments = utils.generic.isValidArray(optionsDepartments, true)
    ? uniqBy(optionsDepartments, 'deptName')
        ?.map((d) => ({ id: d.id, deptName: d.deptName }))
        ?.sort((a, b) => (a.deptName > b.deptName ? 1 : b.deptName > a.deptName ? -1 : 0))
    : [];
  const warrantyTypes = useSelector((state) => get(state, 'referenceData.warrantyTypes')) || [];

  const optionsThirdParty = useSelector(selectRefDataThirdPartyList) || [];
  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isSubmittedAuthorisedSignatory = utils.processingInstructions.status.isSubmittedAuthorisedSignatory(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const userHasApproverAccess = utils.app.access.feature('processingInstructions.approverChecklist', ['create', 'update'], user);
  const isCheckboxesEditable = userHasApproverAccess && isSubmittedAuthorisedSignatory;

  const isEditable = userHasWritePermission && (isDraft || isRejectedDraft || isReopened);
  const isReadOnly = !isEditable;
  const selectedRiskRef = instruction?.riskReferences?.find((r) => r.leadPolicy);
  const gxbWarrantyDetails = selectedRiskRef?.gxbAttributeDefaultValues?.warrantyDetails;

  let warrantyListOptions = utils.generic.isValidArray(warrantyTypes, true)
    ? uniqBy(warrantyTypes, 'code')?.sort((a, b) => (a.code > b.code ? 1 : b.code > a.code ? -1 : 0))
    : [];
  warrantyListOptions = [...warrantyListOptions, { code: 'NA', warrantyName: 'NA' }];

  const paymentBasisOptions = [
    { id: '1', code: 'cash', name: 'Cash' },
    { id: '2', code: 'quaterly', name: 'Quaterly' },
    { id: '3', code: 'otherDeferred', name: 'Other Deferred' },
  ];

  const toggleOptions = [
    { label: utils.string.t('app.yes'), value: 1 },
    { label: utils.string.t('app.no'), value: 0 },
    { label: utils.string.t('app.na'), value: -1 },
  ];

  const getToggleValue = (value) => {
    return toggleOptions.map((o) => o.value).includes(value) ? value : null;
  };

  const selectedThirdParty = () => {
    const thirdvalue = utils.generic.isValidArray(instruction?.financialChecklist, true)
      ? instruction.financialChecklist?.find((a) => a.name === 'thirdParty')?.stringValue
      : null;
    return utils.generic.isValidArray(optionsThirdParty, true) && thirdvalue
      ? optionsThirdParty.find((value) => value?.partnerName === thirdvalue)?.id || null
      : null;
  };
  const validateWarrantyListValue = () => {
    const isFinancialListAvailable = utils.generic.isValidArray(instruction?.financialChecklist, true)
      ? instruction?.financialChecklist?.find((a) => a.name === 'ppwOrPpc')?.stringValue
        ? true
        : false
      : false;
    if (!isFinancialListAvailable) {
      if (gxbWarrantyDetails?.isInvalidData === 0 && utils.generic.isValidArray(gxbWarrantyDetails?.warrantyList, true)) {
        return gxbWarrantyDetails?.warrantyList?.find((a) => a.isSelected) || null;
      } else if (
        (gxbWarrantyDetails?.isInvalidData === 0 || gxbWarrantyDetails?.isInvalidData === 1) &&
        !utils.generic.isValidArray(gxbWarrantyDetails?.warrantyList, true)
      ) {
        return {
          warrantyCode: 'NA',
          warrantyDate: null,
          displayError: gxbWarrantyDetails?.isInvalidData === 1,
        };
      }
    }
    return null;
  };
  const highPriority = instruction?.details?.highPriority || !!selectedRiskRef?.gxbAttributeDefaultValues?.highPriority;
  const frontEndSendDocs = instruction?.details?.frontEndSendDocs || !!selectedRiskRef?.gxbAttributeDefaultValues?.frontEndSendDocs;

  const fields = [
    {
      name: 'highPriority',
      type: 'checkbox',
      value: highPriority,
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.highPriority'),
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'frontEndSendDocs',
      type: 'checkbox',
      value: frontEndSendDocs,
      label: utils.string.t('processingInstructions.processingInstructionsForEndFaBorder.fields.frontEndSendDocuments'),
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'premiumTaxCalculationSheetAttachedNumber',
      type: 'toggle',
      value: getToggleValue(utils.processingInstructions.getFinancialField(instruction, 'premiumTaxCalculationSheetAttached')?.numberValue),
      options: toggleOptions,
      buttonGroupProps: {
        exclusive: true,
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'premiumTaxCalculationSheetAttachedCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'premiumTaxCalculationSheetAttached')
        ?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'signedLinesCalculationSheetAttachedNumber',
      type: 'toggle',
      value: getToggleValue(
        utils.processingInstructions.getFinancialField(instruction, 'signedLinesCalculationSheetAttached')?.numberValue
      ),
      options: toggleOptions,
      buttonGroupProps: {
        exclusive: true,
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'signedLinesCalculationSheetAttachedCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'signedLinesCalculationSheetAttached')
        ?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'grossPremiumAmountNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'grossPremiumAmount')?.numberValue || '',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'grossPremiumAmountCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'grossPremiumAmount')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'slipOrderNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'slipOrder')?.numberValue || '',
      muiComponentProps: {
        autoComplete: 'off',
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'slipOrderCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'slipOrder')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'totalBrokerageNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'totalBrokerage')?.numberValue || '',
      muiComponentProps: {
        autoComplete: 'off',
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'totalBrokerageCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'totalBrokerage')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'clientDiscountNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'clientDiscount')?.numberValue || '',
      muiComponentProps: {
        autoComplete: 'off',
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'clientDiscountCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'clientDiscount')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'thirdPartyNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'thirdParty')?.numberValue || '',
      muiComponentProps: {
        autoComplete: 'off',
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'thirdPartyString',
      type: 'select',
      value: selectedThirdParty() || utils.processingInstructions.getFinancialField(instruction, 'thirdParty')?.stringValue || '',
      options:
        optionsThirdParty?.map((option) => ({
          value: option?.id,
          label: option?.partnerName,
        })) || [],
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'thirdPartyCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'thirdParty')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'pfinternalNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'pfinternal')?.numberValue || '',
      muiComponentProps: {
        autoComplete: 'off',
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'pfinternalString',
      type: 'select',
      value: utils.processingInstructions.getFinancialField(instruction, 'pfinternal')?.stringValue || '',
      options: departments,
      optionKey: 'id',
      optionLabel: 'deptName',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'pfinternalCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'pfinternal')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'retainedBrokerageNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'retainedBrokerage')?.numberValue || '',
      muiComponentProps: {
        autoComplete: 'off',
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'retainedBrokerageCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'retainedBrokerage')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'retainedBrokerageCurrencyCodeString',
      value:
        utils.processingInstructions.getFinancialField(instruction, 'retainedBrokerageCurrencyCode')?.stringValue || constants.CURRENCY_USD,
      optionsKey: 'premiumCurrency',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'retainedBrokerageCurrencyCodeCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'retainedBrokerageCurrencyCode')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'feesNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'fees')?.numberValue || '',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'feesCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'fees')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'otherDeductionsNumber',
      type: 'number',
      value: utils.processingInstructions.getFinancialField(instruction, 'otherDeductions')?.numberValue || '',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'otherDeductionsCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'otherDeductions')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'settlementCurrencyCodeIdNumber',
      type: 'select',
      value: utils.processingInstructions.getFinancialField(instruction, 'settlementCurrencyCodeId')?.numberValue || '',
      options: refDataCurrencies,
      optionKey: 'currencyCodeID',
      optionLabel: 'currencyCd',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'settlementCurrencyCodeIdCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'settlementCurrencyCodeId')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'paymentBasisNumber',
      type: 'select',
      value: utils.processingInstructions.getFinancialField(instruction, 'paymentBasis')?.numberValue || '',
      options: paymentBasisOptions,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'paymentBasisCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'paymentBasis')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
    },
    {
      name: 'ppwOrPpcString',
      type: 'select',
      value:
        validateWarrantyListValue()?.warrantyCode ||
        utils.processingInstructions.getFinancialField(instruction, 'ppwOrPpc')?.stringValue ||
        '',
      options: warrantyListOptions,
      optionKey: 'code',
      optionLabel: 'warrantyName',
      displayError: validateWarrantyListValue()?.displayError || false,
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
    {
      name: 'ppwOrPpcDate',
      type: 'datepicker',
      value: validateWarrantyListValue()?.warrantyDate
        ? moment(validateWarrantyListValue()?.warrantyDate)
        : null || utils.processingInstructions.getFinancialField(instruction, 'ppwOrPpc')?.dateValue
        ? moment(utils.processingInstructions.getFinancialField(instruction, 'ppwOrPpc')?.dateValue)
        : null,
      outputFormat: 'iso',
      placeholder: utils.string.t('app.selectDate'),
      muiComponentProps: {
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
      muiPickerProps: {
        format: config.ui.format.date.text,
        clearable: true,
      },
    },
    {
      name: 'ppwOrPpcCheckbox',
      type: 'checkbox',
      value: utils.processingInstructions.getFinancialField(instruction, 'ppwOrPpc')?.approvedByAuthorisedSignatory,
      disabled: !isCheckboxesEditable || checkListMandatoryDataStatus,
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
        disabled: isReadOnly || checkListMandatoryDataStatus,
      },
    },
  ];
  const retainedBrokerageCurrencyCodeField = utils.form.getFieldProps(fields, 'retainedBrokerageCurrencyCodeString');

  const [defaultValues, setDefaultValues] = useState();
  const [retainedBrokerageAmount, setRetainedBrokerageAmount] = useState('');
  const [convertedBrokerage, setConvertedBrokerage] = useState();
  const [totalAmount, setTotalAmount] = useState('');
  const [documentNotUploadedError, setDocumentNotUploadedError] = useState({ premiumTaxDocument: false, signedLinesDocument: false });

  const formValues = childRef?.current?.props?.values;
  const retainedBrokerageCurrencyCode =
    formValues?.retainedBrokerageCurrencyCodeString ||
    retainedBrokerageCurrencyCodeField?.defaultValue ||
    retainedBrokerageCurrencyCodeField?.value;

  const getRetainedBrokerageAmount = ({
    grossPremiumAmount,
    slipOrder,
    retainedBrokerage,
    retainedBrokerageCurrencyCode,
    retainedBrokerageAmount,
  }) => {
    const amount = utils.processingInstructions.getRetainedBrokerageValue(grossPremiumAmount, slipOrder, retainedBrokerage);
    const brokerage = utils.processingInstructions.getRetainedBrokerageConvertedValue(
      retainedBrokerageCurrencyCode,
      retainedBrokerageAmount
    );

    setRetainedBrokerageAmount(amount);
    setConvertedBrokerage(brokerage);
    dispatch(
      storeRetainedBrokerageAmountForPdf({
        retBrokerageAmt: amount,
        convertedBrokerageAmt: brokerage,
      })
    );
  };

  const getTotalAmount = ({ clientDiscount, thirdPartyCommissionSharing, pfinternalCommissionSharing, retainedBrokerage }) => {
    if (clientDiscount && thirdPartyCommissionSharing && pfinternalCommissionSharing && retainedBrokerage) {
      const sumValuesArray = [clientDiscount, thirdPartyCommissionSharing, pfinternalCommissionSharing, retainedBrokerage];

      setTotalAmount(utils.generic.getSumOfArray(sumValuesArray, config.ui.format.percent.decimal));
      dispatch(storeTotalAmountForPdf(utils.generic.getSumOfArray(sumValuesArray, config.ui.format.percent.decimal)));
    } else {
      setTotalAmount('');
    }
  };

  const checkPremiumTaxDocumentAndSignedLinesDocument = () => {
    const formValues = childRef?.current?.props?.values || {};
    if (
      (formValues.premiumTaxCalculationSheetAttachedNumber === 1 && !documents.premiumTaxDocument) ||
      (formValues.signedLinesCalculationSheetAttachedNumber === 1 && !documents.signedLinesDocument)
    ) {
      if (
        formValues.premiumTaxCalculationSheetAttachedNumber === 1 &&
        !documents.premiumTaxDocument &&
        formValues.signedLinesCalculationSheetAttachedNumber === 1 &&
        !documents.signedLinesDocument
      ) {
        dispatch(enqueueNotification('processingInstructions.details.missingPremiumTaxAndSignedLines', 'warning'));
      } else if (formValues.premiumTaxCalculationSheetAttachedNumber === 1 && !documents.premiumTaxDocument) {
        dispatch(enqueueNotification('processingInstructions.details.missingPremiumTaxCalculationSheet', 'warning'));
      } else if (formValues.signedLinesCalculationSheetAttachedNumber === 1 && !documents.signedLinesDocument) {
        dispatch(enqueueNotification('processingInstructions.details.missingSignedLinesCalculation', 'warning'));
      }

      setDocumentNotUploadedError({
        premiumTaxDocument: formValues.premiumTaxCalculationSheetAttachedNumber === 1 && !documents.premiumTaxDocumen,
        signedLinesDocument: formValues.signedLinesCalculationSheetAttachedNumber === 1 && !documents.signedLinesDocument,
      });
      return true;
    }
    setDocumentNotUploadedError({
      premiumTaxDocument: false,
      signedLinesDocument: false,
    });
    return false;
  };

  const handleNext = () => {
    if (checkPremiumTaxDocumentAndSignedLinesDocument()) {
      return;
    }
    handlers.next();
  };

  const handleSave = (type) => {
    if (type === constants.SAVE_NEXT && checkPremiumTaxDocumentAndSignedLinesDocument()) {
      return;
    }
    setDocumentNotUploadedError({
      premiumTaxDocument: false,
      signedLinesDocument: false,
    });
    const formValues = childRef?.current?.props?.values || {};
    const financialChecklistBlank = [
      { name: 'signedLinesCalculationSheetAttached', types: ['Number'] },
      { name: 'premiumTaxCalculationSheetAttached', types: ['Number'] },
      { name: 'grossPremiumAmount', types: ['Number'] },
      { name: 'slipOrder', types: ['Number'] },
      { name: 'totalBrokerage', types: ['Number'] },
      { name: 'fees', types: ['Number'] },
      { name: 'otherDeductions', types: ['Number'] },
      { name: 'settlementCurrencyCodeId', types: ['Number'] },
      { name: 'paymentBasis', types: ['Number'] },
      { name: 'ppwOrPpc', types: ['String', 'Date'] },
      { name: 'clientDiscount', types: ['Number'] },
      { name: 'thirdParty', types: ['Number', 'String'] },
      { name: 'pfinternal', types: ['Number', 'String'] },
      { name: 'retainedBrokerage', types: ['Number'] },
      { name: 'retainedBrokerageCurrencyCode', types: ['String'] },
    ];
    let defaultWarrantyDetails = utils.generic.isValidArray(gxbWarrantyDetails?.warrantyList, true)
      ? isNumber(formValues['ppwOrPpcString'])
        ? gxbWarrantyDetails?.warrantyList?.find((a) => a.warrantyTypeId === formValues['ppwOrPpcString'])
        : gxbWarrantyDetails?.warrantyList?.find((a) => a.warrantyCode?.toLowerCase() === formValues['ppwOrPpcString']?.toLowerCase())
      : null;
    if (!defaultWarrantyDetails) {
      defaultWarrantyDetails = utils.generic.isValidArray(warrantyListOptions, true)
        ? warrantyListOptions.find((a) => a.code?.toLowerCase() === formValues['ppwOrPpcString']?.toLowerCase())
        : null;
    }
    const updatedInstruction = {
      ...instruction,
      details: {
        ...instruction.details,
        highPriority: formValues.highPriority,
        frontEndSendDocs: formValues.frontEndSendDocs,
        notes: formValues.notes,
        retainedBrokerageCurrencyCode,

        warrantyDescription: defaultWarrantyDetails?.warrantyName || defaultWarrantyDetails?.warrantyDescription || 'NA',
        warrantyTypeId: defaultWarrantyDetails?.warrantyTypeId || defaultWarrantyDetails?.warrantyTypeID || 'NA',
        warrantyDate: defaultWarrantyDetails?.warrantyDate || null,
        warrantyCode: defaultWarrantyDetails?.warrantyCode || defaultWarrantyDetails?.code || formValues['ppwOrPpcString'] || 'NA',
      },
      financialChecklist: financialChecklistBlank.map(({ name, types }) => {
        return types.reduce(
          (acc, type) => {
            const valueKey = `${name}${type}`;
            const isWarrantyType = valueKey === 'ppwOrPpcString';
            const warrantyType = isWarrantyType ? formValues['ppwOrPpcString'] : '';

            const isThirdPartyString = valueKey === 'thirdPartyString';
            const thirdPartyNumberValue = formValues['thirdPartyNumber'];
            const thirdPartyStringValue =
              Boolean(thirdPartyNumberValue) && formValues[valueKey]
                ? optionsThirdParty?.find((val) => val.id === formValues[valueKey])
                : null || {};

            const isPfInternalString = valueKey === 'pfinternalString';
            const pfInternalNumberValue = formValues['pfinternalNumber'];
            const pfInternalStringValue = Boolean(pfInternalNumberValue) ? formValues[valueKey] : '';

            const value = isWarrantyType
              ? warrantyType
              : isThirdPartyString
              ? thirdPartyStringValue?.partnerName
              : isPfInternalString
              ? pfInternalStringValue
              : formValues[valueKey];
            const isDate = type === 'Date';
            const isValidDate = isDate && moment(value).isValid();

            return {
              ...acc,
              [`${type.toLowerCase()}Value`]: isDate ? (isValidDate ? moment(value).format('YYYY-MM-DD') : '') : value,
              approvedByAuthorisedSignatory: formValues[`${name}Checkbox`],
            };
          },
          { name }
        );
      }),
    };

    dispatch(updateProcessingInstruction(updatedInstruction, formValues)).then((response) => {
      if (response?.status === constants.API_RESPONSE_OK) {
        if (type === constants.SAVE_NEXT) {
          handlers.next();
        }
      }
    });
  };

  const handleCancel = () => {
    const reset = childRef?.current?.props?.resetFunc;

    if (utils.generic.isFunction(reset)) {
      reset(defaultValues, { keepDirty: false });
    }
    setDocumentNotUploadedError({
      premiumTaxDocument: false,
      signedLinesDocument: false,
    });
  };

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
            sourceId: Number(selectedRiskRef?.xbInstanceId),
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

  // abort if data is not ready/available
  if (!defaultValues || !instruction) return null;

  return (
    <ProcessingInstructionsDetailsView
      instructionId={instruction?.id}
      documents={documents}
      fields={fields}
      defaultValues={defaultValues}
      retainedBrokerageAmount={retainedBrokerageAmount}
      convertedBrokerage={convertedBrokerage}
      premiumCurrency={retainedBrokerageCurrencyCode}
      sumTotal={totalAmount}
      riskRefId={selectedRiskRef?.riskRefId}
      isEditable={isEditable}
      isReadOnly={isReadOnly}
      documentNotUploadedError={documentNotUploadedError}
      checkListMandatoryDataStatus={checkListMandatoryDataStatus}
      handlers={{
        ...handlers,
        next: handleNext,
        save: handleSave,
        cancel: handleCancel,
        getRetainedBrokerageAmount,
        getTotalAmount,
        uploadPremiumTaxSignedLinesModal,
        confirmRemoveDocumentModal,
        download: handleLinkDownload,
      }}
      ref={childRef}
    />
  );
}
