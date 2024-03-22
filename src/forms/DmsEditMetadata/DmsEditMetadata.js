import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import DmsEditMetadataView from './DmsEditMetadata.view';
import * as utils from 'utils';
import * as constants from 'consts';
import {
  selectRefDataXbInstances,
  getViewTableDocuments,
  selectRefDataNewDocumentTypesByContextSource,
  selectRefDataNewDocumentTypeLookUpByContextSource,
  selectCaseDetails,
  getDmsEditMetadataSelector,
  getDmsEditMetadata,
  selectSettlementCurrency,
  postEditedMetadataDetails,
  selectDmsMetaData,
  selectRefDataCatCodesList,
} from 'stores';

DmsEditMetadata.propTypes = {
  docData: PropTypes.object.isRequired,
  context: PropTypes.string.isRequired,
  selectedSourceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  referenceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  documentTypeKey: PropTypes.oneOf(Object.values(constants.DMS_DOCUMENT_TYPE_SECTION_KEYS)),
  searchParamsAfterUpload: PropTypes.shape({
    referenceId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    sectionType: PropTypes.string.isRequired,
  }),
  cancelHandler: PropTypes.func.isRequired,
};

DmsEditMetadata.defaultProps = {
  documentTypeKey: constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy,
};

export default function DmsEditMetadata({
  docData,
  context,
  selectedSourceId,
  referenceId,
  documentTypeKey,
  searchParamsAfterUpload,
  cancelHandler,
}) {
  const dispatch = useDispatch();
  const documentMetaData = useSelector(selectDmsMetaData);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const ppSelectCaseDetails = useSelector(selectCaseDetails);
  const existedMetaData = useSelector(getDmsEditMetadataSelector);
  const catCodesData = useSelector(selectRefDataCatCodesList);
  const currenciesList = useSelector(selectSettlementCurrency);

  const currencies = currenciesList?.map((currency) => ({ ...currency, name: `${currency.id} - ${currency.name}` }));
  const docInfo = utils.dmsFormatter.formatDocumentMetaData(
    documentMetaData,
    context,
    refDataXbInstances,
    utils.referenceData.catCodes.getAllFormatted(catCodesData)
  );

  const xbInstanceId = selectedSourceId ? selectedSourceId : constants.DMS_CLAIM_SOURCE_ID;

  const {
    dmsSectionKey,
    dmsSourceId,
    dmsDocTypeSource: documentTypeSource,
  } = utils.dmsFormatter.getDocumentTypeFilterKeys(context, xbInstanceId, documentTypeKey);

  const isDmsFromPi = utils.dmsFormatter.isDmsFromPi(documentTypeKey);
  const { documentTypeDescription, sectionKey, dmsSourceID } =
    isDmsFromPi && utils.dmsFormatter.getDocumentTypeInfo(documentTypeKey, dmsSourceId);
  const documentTypesBeforeFilter = useSelector(
    dmsSectionKey === constants.DMS_DOCUMENT_TYPE_SECTION_KEYS.policy
      ? selectRefDataNewDocumentTypeLookUpByContextSource(dmsSectionKey, dmsSourceId)
      : selectRefDataNewDocumentTypesByContextSource(dmsSectionKey, dmsSourceId, documentTypeSource)
  );
  const documentTypesAfterFilter =
    (context === constants.DMS_CONTEXT_POLICY || context === constants.DMS_CONTEXT_PROCESSING_INSTRUCTION) && isDmsFromPi
      ? documentTypesBeforeFilter?.filter(
          (type) =>
            type.documentTypeDescription === documentTypeDescription && type.sectionKey === sectionKey && type.sourceID === dmsSourceID
        )
      : documentTypesBeforeFilter;

  const { documentId, docClassification } = docData;
  const [isPaymentAllowed, setIsPaymentAllowed] = useState(existedMetaData?.documentTypeDescription === constants.DMS_EDIT_PAYMENT_TYPE);
  const isDmsFromPiInstruction = utils.dmsFormatter.isDmsFromPiInstruction(documentTypeKey);
  const { policyRef, instructionId } = ppSelectCaseDetails;

  //if api is added for this, please update this
  const docClassificationTypes = [
    { id: 1, value: utils.string.t('dms.upload.modalItems.classificationType.low') },
    { id: 2, value: utils.string.t('dms.upload.modalItems.classificationType.guarded') },
    { id: 3, value: utils.string.t('dms.upload.modalItems.classificationType.high') },
    { id: 4, value: utils.string.t('dms.upload.modalItems.classificationType.severe') },
  ];

  const fields = [
    {
      name: 'documentName',
      type: 'text',
      value: existedMetaData?.documentName || '',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'documentType',
      type: 'autocompletemui',
      options: documentTypesAfterFilter || [],
      optionKey: 'id',
      optionLabel: 'documentTypeDescription',
      value: documentTypesAfterFilter?.find((item) => item.documentTypeDescription === existedMetaData?.documentTypeDescription) || '',
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
    },
    {
      name: 'documentClassification',
      type: 'autocompletemui',
      options: docClassificationTypes || [],
      optionKey: 'id',
      optionLabel: 'value',
      value: docClassificationTypes?.find((item) => item.id === Number(docClassification)) || '',
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
    },
    {
      type: 'datepicker',
      name: 'payment.paymentDate',
      icon: 'TodayIcon',
      muiComponentProps: {
        fullWidth: true,
      },
      outputFormat: 'iso',
      value: existedMetaData?.metadataFields?.find((item) => item.prop === constants.DMS_EDIT_PAYMENT_DATE)?.value || '',
    },
    {
      name: 'payment.paymentReference',
      type: 'text',
      value: existedMetaData?.metadataFields?.find((item) => item.prop === constants.DMS_EDIT_PAYMENT_REFERENCE)?.value || '',
    },
    {
      name: 'payment.lossPayee',
      type: 'text',
      value: existedMetaData?.metadataFields?.find((item) => item.prop === constants.DMS_EDIT_PAYMENT_LOSS_PAYEE)?.value || '',
    },
    {
      name: 'payment.amount',
      type: 'number',
      value: existedMetaData?.metadataFields?.find((item) => item.prop === constants.DMS_EDIT_PAYMENT_AMOUNT)?.value || '',
    },
    {
      name: 'payment.currency',
      type: 'autocompletemui',
      options: currencies || [],
      optionKey: 'id',
      optionLabel: 'name',
      value:
        currencies?.find((item) => {
          return (
            item.id === existedMetaData?.metadataFields?.find((subItem) => subItem.prop === constants.DMS_EDIT_PAYMENT_CURRENCY)?.value
          );
        }) || '',
    },
  ];

  const actions = [
    {
      name: 'secondary',
      label: utils.string.t('app.cancel'),
      handler: () => {
        cancelHandler();
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (values) => {
        handleMetaDataSubmit(values);
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, reset, errors, handleSubmit, formState, watch } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const documentType = watch('documentType');

  useEffect(() => {
    !utils.generic.isValidObject(existedMetaData) && dispatch(getDmsEditMetadata(documentId, docClassification));
  }, [documentId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setIsPaymentAllowed(documentType?.documentTypeDescription === constants.DMS_EDIT_PAYMENT_TYPE);
  }, [documentType]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleMetaDataSubmit = (values) => {
    const metadataField =
      isPaymentAllowed &&
      Object.keys(values?.payment)?.map((item) => {
        const propVal = item === 'currency' ? values?.payment[item]?.id : values?.payment[item];
        return {
          prop: constants.DMS_EDIT_PAYMENT_PAYLOAD[item],
          value: (item === 'amount' ? parseInt(propVal) : propVal) || '',
        };
      });
    const editMetadata = {
      documentExtType: existedMetaData?.documentExtType || '',
      documentId: parseInt(existedMetaData?.documentId) || '',
      documentTypeId: values?.documentType?.documentTypeID || '',
      documentTypeDescription: values?.documentType?.documentTypeDescription || '',
      createdDate: docData?.createdDate || '',
      createdBy: existedMetaData?.createdBy || '',
      docClassificationId: values?.documentClassification?.id || '',
      newFileName: values?.documentName,
      metadataFields: metadataField || null,
    };

    dispatch(postEditedMetadataDetails(editMetadata)).then((response) => {
      if (response?.status === constants.API_RESPONSE_OK) {
        if (!isDmsFromPiInstruction) {
          dispatch(
            getViewTableDocuments({
              ...(searchParamsAfterUpload
                ? searchParamsAfterUpload
                : {
                    referenceId,
                    sectionType: context,
                    documentTypeKey,
                    ...(policyRef && instructionId && { policyRef, instructionId }),
                  }),
            })
          );
        }
        cancelHandler();
      }
    });
  };

  return (
    <DmsEditMetadataView
      fields={fields}
      control={control}
      errors={errors}
      actions={actions}
      reset={reset}
      handleSubmit={handleSubmit}
      formState={formState}
      dmsContext={context}
      docInfo={docInfo}
      documentData={docData}
      existedMetaData={existedMetaData}
      isPaymentAllowed={isPaymentAllowed}
    />
  );
}
