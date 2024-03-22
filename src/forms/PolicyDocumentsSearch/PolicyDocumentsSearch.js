import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

// app
import { PolicyDocumentsSearchView } from './PolicyDocumentsSearch.view';
import styles from './PolicyDocumentsSearch.styles';
import { OptionDetail } from 'components';
import {
  hideModal,
  searchDepartmentsByXbInstance,
  selectFileUploadData,
  searchInsureds,
  searchRiskIds,
  getFileUploadDocuments,
  fileUploadLinkDownload,
  selectRefDataXbInstances,
  selectRefDataXbInstancesDepartments,
} from 'stores';
import { usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';

PolicyDocumentsSearch.propTypes = {
  maxResultsWarning: PropTypes.number,
};

PolicyDocumentsSearch.defaultProps = {
  maxResultsWarning: 100,
};

export default function PolicyDocumentsSearch({ maxResultsWarning }) {
  const classes = makeStyles(styles, { name: 'PolicyDocumentsSearch' })();
  const dispatch = useDispatch();
  const riskFieldRef = useRef(null);
  // const claimFieldRef = useRef(null);

  const defaultPagination = {
    page: 1,
    size: config.ui.pagination.default,
    direction: 'asc',
    orderBy: 'documentName',
    totalElements: 0,
    totalPages: 0,
  };

  const fileUploadData = useSelector(selectFileUploadData);
  const [filesFetched, setFilesFetched] = useState(false);
  const [filesList, setFilesList] = useState([]);
  const [filesPagination, setFilesPagination] = useState(defaultPagination);
  const [formData, setFormData] = useState();
  const [searchReferenceType] = useState('risk');
  const [resetKey, setResetKey] = useState();

  const [xbInstance, setXbInstance] = useState();
  const [xbInstanceDepartmentsLoading, setXbInstanceDepartmentsLoading] = useState(false);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const refDataXbInstanceDepartments = useSelector(selectRefDataXbInstancesDepartments(xbInstance));

  const handleChangePage = async (newPage) => {
    const json = await dispatch(getFileUploadDocuments(formData, { ...filesPagination, page: newPage + 1 }));
    updateState(json);
  };

  const handleChangeRowsPerPage = async (rowsPerPage) => {
    const json = await dispatch(getFileUploadDocuments(formData, { ...filesPagination, size: rowsPerPage, page: 1 }));
    updateState(json);
  };

  const handleLinkDownload = (file) => {
    dispatch(fileUploadLinkDownload(file));
  };

  const updateState = useCallback(
    (json) => {
      if (json) {
        setFilesList(json.data || []);
        setFilesPagination({ ...filesPagination, ...json.pagination });
      }
    },
    [filesPagination]
  );

  const paginationObj = {
    page: filesPagination.page - 1,
    rowsTotal: filesPagination.totalElements,
    rowsPerPage: filesPagination.size,
  };

  const pagination = usePagination(filesList, paginationObj, handleChangePage, handleChangeRowsPerPage);

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

  const fetchInsureds = useCallback(
    async (type, searchTerm) => {
      if (searchTerm.length >= 4) {
        return dispatch(searchInsureds(searchTerm));
      }
    },
    [dispatch]
  );

  const searchDocuments = useCallback(
    async (formData) => {
      const json = await dispatch(getFileUploadDocuments(formData, { ...filesPagination, page: 1 }));

      if (json) {
        updateState(json);
        setFilesFetched(true);
        setFormData(formData);
      }
    },
    [dispatch, filesPagination, updateState]
  );

  const searchXbInstanceDepartments = useCallback(
    async (xbInstance) => {
      await dispatch(searchDepartmentsByXbInstance(xbInstance));
      setXbInstanceDepartmentsLoading(false);
    },
    [dispatch]
  );

  const searchCancel = () => {
    dispatch(hideModal());
  };

  const searchReset = () => {
    setFilesFetched(false);
    setFilesList([]);
    setFilesPagination(defaultPagination);
    setFormData();
    setXbInstance(null);
    setResetKey(new Date().getTime());
  };

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

  const fields = [
    {
      name: 'riskReference',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.riskRef.label'),
      hint: utils.string.t('fileUpload.hint', { count: 4 }),
      value: null,
      options: [],
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
        // disabled: searchReferenceType !== 'risk',
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
          // onFocus: () => {
          //   handleFieldFocus('risk');
          // },
        },
      },
    },
    {
      name: 'insuredName',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.insuredName.label'),
      hint: utils.string.t('fileUpload.hint', { count: 4 }),
      value: null,
      options: [],
      optionKey: 'id',
      optionLabel: 'name',
      optionsFetch: {
        type: 'insured',
        handler: fetchInsureds,
      },
      muiComponentProps: {
        inputProps: {
          maxLength: 25,
        },
      },
    },
    {
      name: 'documentType',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.documentType.label'),
      value: null,
      // documentType options should be taken from new refData API instead of custom fileUpload GUI API
      // this can only happen once fileUpload is available for Extended Edge users
      options: fileUploadData?.DocumentType || [],
      optionKey: 'id',
      optionLabel: 'value',
    },
    {
      name: 'xbInstance',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.xbInstance.label'),
      value: null,
      options: refDataXbInstances,
      optionKey: 'id',
      optionLabel: 'value',
      callback: (event, data) => {
        const selectedXbInstance = refDataXbInstances.find((xbi) => {
          return data?.id === xbi?.id;
        });

        const xbInstanceHasDepts = selectedXbInstance?.departments?.length > 0;

        if (data && xbInstanceHasDepts) {
          setXbInstance(data.id);
        } else if (data && !xbInstanceHasDepts) {
          setXbInstanceDepartmentsLoading(true);
          searchXbInstanceDepartments(data);
          setXbInstance(data.id);
        } else if (data === null) {
          setXbInstance(null);
        }
      },
    },
    {
      name: 'department',
      type: 'autocompletemui',
      label: utils.string.t('fileUpload.fields.department.label'),
      placeholder: xbInstanceDepartmentsLoading ? utils.string.t('app.loading') : '',
      value: null,
      options: refDataXbInstanceDepartments,
      optionKey: 'id',
      optionLabel: 'value',
      muiComponentProps: {
        disabled: utils.generic.isInvalidOrEmptyArray(refDataXbInstanceDepartments),
      },
    },
    {
      name: 'inceptionYear',
      type: 'datepicker',
      label: utils.string.t('fileUpload.fields.inceptionYear.label'),
      placeholder: utils.string.t('fileUpload.fields.inceptionYear.placeholder'),
      value: null,
      muiComponentProps: {
        fullWidth: true,
        helperText: utils.string.t('fileUpload.fields.inceptionYear.helperText'),
      },
      muiPickerProps: {
        views: ['year'],
        format: 'YYYY',
        clearable: true,
      },
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t(filesFetched ? 'app.reset' : 'app.cancel'),
      handler: filesFetched ? () => searchReset() : () => searchCancel(),
    },
    {
      name: 'submit',
      label: utils.string.t('fileUpload.searchDocuments'),
      handler: (data) => {
        searchDocuments(data);
      },
    },
  ];

  return (
    <PolicyDocumentsSearchView
      key={resetKey}
      files={filesList}
      pagination={pagination.obj}
      maxResultsWarning={maxResultsWarning}
      fetched={filesFetched}
      fields={fields}
      actions={actions}
      searchReferenceType={searchReferenceType}
      handlers={{
        changeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
        changePage: pagination.handlers.handleChangePage,
        download: handleLinkDownload,
      }}
    />
  );
}
