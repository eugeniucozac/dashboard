import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import classnames from 'classnames';

// app
import { PolicyDocumentsUploadView } from './PolicyDocumentsUpload.view';
import styles from './PolicyDocumentsUpload.styles';
import { OptionDetail } from 'components';
import {
  selectRefDataXbInstances,
  hideModal,
  fileUploadDocuments,
  selectFileUploadData,
  selectUser,
  searchRiskIds,
  getFileUploadPolicyDetails,
} from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

PolicyDocumentsUpload.propTypes = {
  files: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.object,
      name: PropTypes.string,
      type: PropTypes.object,
    })
  ).isRequired,
  rejectedFiles: PropTypes.array,
  multiple: PropTypes.bool,
  maxFiles: PropTypes.number,
  maxSize: PropTypes.number,
  accept: PropTypes.string,
};

PolicyDocumentsUpload.defaultProps = {
  multiple: constants.POLICY_FILE_UPLOAD_ALLOW_MULTIPLE,
  maxFiles: constants.POLICY_FILE_UPLOAD_MAX_FILES,
  maxSize: constants.POLICY_FILE_UPLOAD_MAX_FILE_SIZE,
  accept: constants.POLICY_FILE_UPLOAD_ALLOWED_FILE_EXT,
};

export default function PolicyDocumentsUpload({ files, rejectedFiles, multiple, maxFiles, maxSize, accept }) {
  const classes = makeStyles(styles, { name: 'PolicyDocumentsUpload' })();
  const dispatch = useDispatch();
  const riskFieldRef = useRef(null);
  const claimFieldRef = useRef(null);
  const user = useSelector(selectUser);
  const fileUploadData = useSelector(selectFileUploadData);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const [policyData, setPolicyData] = useState(null);
  const [searchReferenceValue, setSearchReferenceValue] = useState(null);
  const [searchReferenceType, setSearchReferenceType] = useState('risk');
  const [filesAttached, setFilesAttached] = useState(files);
  const [warnings, setWarnings] = useState({});

  const fetchPolicyRefs = useCallback(
    async (type, searchTerm) => {
      if (searchTerm.length >= 4) {
        const refs = await dispatch(searchRiskIds(searchTerm));

        if (utils.generic.isValidArray(refs)) {
          return refs;
        } else {
          return [];
        }
      }
    },
    [dispatch]
  );

  const fetchPolicyDetails = useCallback(
    async (riskRefObject) => {
      let response = await dispatch(getFileUploadPolicyDetails(searchReferenceType, riskRefObject));
      if (response) {
        setPolicyData(response);
      }
    },
    [dispatch, searchReferenceType]
  );

  const setWarningDuplicates = (hasDuplicates) => {
    return hasDuplicates
      ? { duplicates: { message: utils.string.t('fileUpload.messages.duplicates'), type: 'alert' } }
      : { duplicates: {} };
  };

  const setWarningTooManyFiles = (filesCurrentlyAttached) => {
    return filesCurrentlyAttached && filesCurrentlyAttached.length > maxFiles
      ? { tooManyFiles: { message: utils.string.t('fileUpload.messages.tooManyFiles', { max: maxFiles }), type: 'error' } }
      : { tooManyFiles: {} };
  };

  const setWarningMaxFileSize = (rejectedFiles) => {
    return rejectedFiles && rejectedFiles.length > 0 && rejectedFiles.some((f) => f.size > maxSize)
      ? {
          maxFileSize: {
            message: utils.string.t('fileUpload.messages.maxFileSize', {
              max: utils.string.t('format.number', {
                value: { number: maxSize, format: { output: 'byte', base: 'decimal', mantissa: 0 } },
              }),
              filename: rejectedFiles
                .map((f) => f.name)
                .filter(Boolean) // filter out empty array item, in case f.name is falsy or empty ''
                .join(', '),
            }),
            type: 'alert',
          },
        }
      : { maxFileSize: {} };
  };

  const setWarningForRejectedFile = (rejectedFiles) => {
    const acceptSplittedExtension = accept?.split(',');
    const slicedExtensionArray = acceptSplittedExtension?.map((s) => s?.slice(1));
    return rejectedFiles?.length > 0 && slicedExtensionArray?.indexOf(rejectedFiles?.[0]?.path.split('.').pop()) === -1
      ? { rejectedFormat: { message: utils.string.t('fileUpload.messages.rejectedFileFormat'), type: 'alert' } }
      : { rejectedFormat: {} };
  };

  useEffect(() => {
    setWarnings({
      ...warnings,
      ...setWarningTooManyFiles(filesAttached),
      ...setWarningMaxFileSize(rejectedFiles),
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getOptionTooltip = ({ xbInstance, xbInstanceId }) => {
    if (!xbInstance || !xbInstanceId) return;

    return (
      <span>
        {utils.string.t('fileUpload.xbInstance')}: {xbInstance}
      </span>
    );
  };

  const renderOption = (item) => {
    return <OptionDetail label={item.policyRef} sublabel={item.insuredName} detail={getOptionTooltip(item)} />;
  };

  const searchFields = [
    {
      name: 'riskReference',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.riskRef.label'),
      hint: utils.string.t('fileUpload.hint', { count: 4 }),
      value: searchReferenceValue || null,
      options: policyData?.policyID
        ? [
            {
              policyID: policyData.policyID,
              policyRef: policyData.policyRef,
              insuredID: policyData.insuredID,
              insuredName: policyData.insuredName,
              xbInstanceId: policyData.xbInstanceId,
              xbInstance: policyData.xbInstance,
            },
          ]
        : [],
      optionKey: 'policyID',
      optionLabel: 'policyRef',
      optionsFetch: {
        type: 'risk',
        handler: fetchPolicyRefs,
      },
      muiComponentProps: {
        ref: riskFieldRef,
        fullWidth: true,
        noOptionsText: utils.string.t('fileUpload.noRiskOptions'),
        disabled: searchReferenceType !== 'risk',
        renderOption,
        classes: {
          root: classes.searchField,
          inputRoot: classnames({
            [classes.searchFieldInput]: true,
            [classes.searchFieldInputDisabled]: searchReferenceType !== 'risk',
          }),
        },
        inputProps: {
          maxLength: 25,
          onFocus: () => {
            handleFieldFocus('risk');
          },
        },
      },
      callback: (event, data) => {
        if (!data) {
          setPolicyData(null);
        }

        setSearchReferenceValue(data);
      },
    },
    // {
    //   name: 'claimReference',
    //   type: 'text',
    //   label: utils.string.t('fileUpload.fields.claimRef.label'),
    //   hint: utils.string.t('fileUpload.hint', { count: 4 }),
    //   options: [],
    //   optionKey: 'id',
    //   optionLabel: 'name',
    //   optionsFetch: {
    //     type: 'claim',
    //     handler: fetchPolicyRefs,
    //   },
    //   muiComponentProps: {
    //     ref: claimFieldRef,
    //     disabled: searchReferenceType !== 'claim',
    //     fullWidth: true,
    //     noOptionsText: utils.string.t('fileUpload.noRiskOptions'),
    //     classes: {
    //       root: classes.searchField,
    //       inputRoot: classnames({
    //         [classes.searchFieldInput]: true,
    //         [classes.searchFieldInputDisabled]: searchReferenceType !== 'claim',
    //       }),
    //     },
    //     inputProps: {
    //       maxLength: 25,
    //       onFocus: () => {
    //         handleFieldFocus('claim');
    //       },
    //     },
    //   },
    // },
  ];

  const documentTypeField = {
    name: 'documentType',
    type: 'autocompletemui',
    value: null,
    // documentType options should be taken from new refData API instead of custom fileUpload GUI API
    // this can only happen once fileUpload is available for Extended Edge users
    options: fileUploadData?.DocumentType || [],
    optionKey: 'id',
    optionLabel: 'value',
    muiComponentProps: {
      size: 'small',
    },
    callback: (event, data, values) => {
      setFilesAttached(values?.files || []);
    },
  };

  const fields = [
    {
      name: 'sectionType',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.sectionType.label'),
      value: { value: 'policy', label: 'Policy' },
      options: [{ value: 'policy', label: 'Policy' }],
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'inceptionDate',
      type: 'datepicker',
      label: utils.string.t('fileUpload.fields.inceptionDate.label'),
      value: policyData?.inceptionDate || null,
      muiPickerProps: {
        disabled: true,
      },
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'expiryDate',
      type: 'datepicker',
      label: utils.string.t('fileUpload.fields.expiryDate.label'),
      value: policyData?.expiryDate || null,
      muiPickerProps: {
        disabled: true,
      },
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'department',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.department.label'),
      value:
        (policyData?.departmentID && policyData?.departmentName && { id: policyData.departmentID, value: policyData.departmentName }) ||
        null,
      options: fileUploadData?.Department || null,
      optionKey: 'id',
      optionLabel: 'value',
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'insuredName',
      type: 'text',
      value: policyData?.insuredName || '',
      label: utils.string.t('fileUpload.fields.insuredName.label'),
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
    {
      name: 'insuredID',
      type: 'hidden',
      value: policyData?.insuredID || '',
    },
    {
      name: 'policyID',
      type: 'hidden',
      value: policyData?.policyID || '',
    },
    {
      name: 'policyRef',
      type: 'text',
      value: policyData?.policyRef || '',
      label: utils.string.t('fileUpload.fields.policyRef.label'),
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
    {
      name: 'umr',
      type: 'text',
      value: policyData?.uniqueMarketRef || '',
      label: utils.string.t('fileUpload.fields.umr.label'),
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
    {
      name: 'xbInstance',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.xbInstance.label'),
      value:
        (policyData?.xbInstanceId && policyData?.xbInstance && refDataXbInstances.find((xbi) => xbi.id === policyData.xbInstanceId)) ||
        null,
      options: refDataXbInstances,
      optionKey: 'id',
      optionLabel: 'value',
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'sourceSystem',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.sourceSystem.label'),
      value: { value: 'edge', label: 'Edge' },
      options: [{ value: 'edge', label: 'Edge' }],
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'uploadDate',
      type: 'datepicker',
      label: utils.string.t('fileUpload.fields.uploadDate.label'),
      value: utils.date.today(),
      muiPickerProps: {
        disabled: true,
      },
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'uploadBy',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.uploadBy.label'),
      value: { value: user.id, label: utils.user.fullname(user) },
      options: [{ value: user.id, label: utils.user.fullname(user) }],
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      type: 'file',
      name: 'filesUpload',
      label: utils.string.t('app.file_plural'),
      value: null,
      showUploadPreview: false,
      showMaxFilesError: false,
      componentProps: {
        multiple,
        maxFiles,
        maxSize,
        accept,
      },
    },
    {
      type: 'hidden',
      name: 'files',
      value: utils.generic.isValidArray(filesAttached, true)
        ? filesAttached.map((f) => ({ file: f.file, name: f.name, type: f.type || null }))
        : [],
      validation: Yup.array()
        .of(
          Yup.object().shape({
            file: Yup.mixed(),
            name: Yup.string(),
            type: Yup.object().nullable().required(utils.string.t('validation.required')),
          })
        )
        .min(1, utils.string.t('validation.required'))
        .required(utils.string.t('validation.required')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'submit',
      label: utils.string.t('fileUpload.saveDocuments'),
      handler: (data) => {
        dispatch(fileUploadDocuments(data));
      },
    },
  ];

  const handleRadioClick = (e) => {
    const type = e.target?.value;
    const fieldRef = type === 'risk' ? riskFieldRef : type === 'claim' ? claimFieldRef : null;

    if (type) {
      setSearchReferenceType(type);
      fieldRef.current.focus();
    }
  };

  const handleFieldFocus = (type) => {
    if (type) {
      setSearchReferenceType(type);
    }
  };

  const handleFilesAdded = (filesCurrentlyAttached, rejectedFiles, hasDuplicates) => {
    setWarnings({
      ...warnings,
      ...setWarningDuplicates(hasDuplicates),
      ...setWarningTooManyFiles(filesCurrentlyAttached),
      ...setWarningMaxFileSize(rejectedFiles),
      ...setWarningForRejectedFile(rejectedFiles),
    });

    setFilesAttached(filesCurrentlyAttached);
  };

  const handleFilesRemoved = (filesCurrentlyAttached) => {
    setWarnings({
      ...warnings,
      ...setWarningDuplicates(false),
      ...setWarningTooManyFiles(filesCurrentlyAttached),
      ...setWarningMaxFileSize(false),
      ...setWarningForRejectedFile(false),
    });

    setFilesAttached(filesCurrentlyAttached);
  };

  const getFileKey = (file) => {
    return `${file.name}-${file.size}-${file.lastModified}`;
  };

  return (
    <PolicyDocumentsUploadView
      resetKey={`${policyData?.id}-${policyData?.policyRef}`}
      searchFields={searchFields}
      fields={fields}
      documentTypeField={documentTypeField}
      actions={actions}
      searchReferenceType={searchReferenceType}
      warnings={warnings}
      isPolicyDataLoaded={Boolean(policyData)}
      handlers={{
        getFileKey,
        onRadioClick: handleRadioClick,
        onFetchPolicy: fetchPolicyDetails,
        onFilesAdded: handleFilesAdded,
        onFilesRemoved: handleFilesRemoved,
      }}
    />
  );
}
