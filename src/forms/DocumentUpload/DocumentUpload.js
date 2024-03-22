import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import sortBy from 'lodash/sortBy';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

// app
import { DocumentUploadView } from './DocumentUpload.view';
import { hideModal, uploadDocument, getFolderList, uploadReportingDocument, getFolderListForReport, uploadReportingFolders } from 'stores';
import * as utils from 'utils';

DocumentUpload.propTypes = {
  documentType: PropTypes.string,
  placement: PropTypes.object,
  reportGroupId: PropTypes.string,
  isFolderCreatable: PropTypes.bool,
};

export default function DocumentUpload({ documentType, placement, documentTypeId, redirectionCallback, reportGroupId, isFolderCreatable }) {
  const dispatch = useDispatch();
  const [folders, setFolders] = useState([]);
  const reportingFolders = useSelector((state) => state.document.folders);
  const [clearOnBlur, setClearOnBlur] = useState(false);

  useEffect(
    () => {
      let mounted = true;
      const fetchFolders = async () => {
        const folders = documentType ? [{ id: documentType }] : await dispatch(getFolderList());

        if (folders && mounted) {
          setFolders(sortBy(folders, 'label'));
        }
      };
      if (!reportGroupId) fetchFolders();

      return () => (mounted = false);
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    let mounted = true;
    const fetchFolders = async () => {
      const folders = await dispatch(getFolderListForReport(reportGroupId));
      if (folders && mounted) {
        setFolders(sortBy(folders, 'label'));
      }
    };

    if (reportGroupId) fetchFolders();

    return () => (mounted = false);
  }, [reportingFolders, reportGroupId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fileField = {
    type: 'file',
    name: 'file',
    label: utils.string.t('app.file'),
    placeholder: 'Select File ...',
    validation: Yup.mixed().nullable().required(utils.string.t('form.dragDrop.required')),
  };

  const autocompleteField = {
    type: 'select',
    name: 'folder',
    label: utils.string.t('app.folder'),
    value: '',
    optionKey: 'id',
    optionLabel: 'label',
    validation: Yup.string().required(utils.string.t('form.folder.required')),
  };

  const autocompleteMuiField = {
    type: 'autocompletemui',
    name: 'reportingFolder',
    label: utils.string.t('app.folder'),
    value: null,
    optionKey: 'id',
    optionLabel: 'label',
    optionsCreatable: true,
    clearOnBlur: clearOnBlur,
    validation: Yup.object().nullable().required(utils.string.t('form.folder.required')),
    hint: utils.string.t('app.folderHintText'),
  };

  const folderField =
    folders.length > 1 && !isFolderCreatable
      ? { ...autocompleteField, options: folders.map((f) => ({ value: f.id, label: f.label, id: f.id })) }
      : isFolderCreatable
      ? {
          ...autocompleteMuiField,
          options: folders?.length > 0 ? folders?.map((f) => ({ value: f.id, label: f.label, id: f.id })) : [],

          muiComponentProps: {
            filterOptions: (options, params) => {
              const filtered = createFilterOptions()(options, params);

              if (params.inputValue !== '') {
                const exists = options?.some(({ label }) => label.toLowerCase() === params.inputValue.toLowerCase().trim());
                if (!exists) {
                  filtered.push({
                    id: params.inputValue,
                    value: params.inputValue,
                    label: `${utils.string.t('app.add')} "${params.inputValue}"`,
                  });
                }
              }

              return filtered;
            },
            onOpen: (event) => setClearOnBlur(false),
          },
          onSelect: (newInputValue) => {
            if (newInputValue?.label.includes(utils.string.t('app.add'))) {
              dispatch(
                uploadReportingFolders({
                  payload: newInputValue,
                  reportGroupId,
                })
              );
            }
          },
        }
      : { type: 'hidden', name: 'folder', value: folders?.[0] && folders?.[0].id };

  const fields = [fileField, folderField];
  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: () => dispatch(hideModal()),
    },
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: (data) => {
        if (reportGroupId) {
          const reportingFolder = folderField?.options.find(({ label }) => {
            return data?.reportingFolder
              ? label.toLowerCase() === data?.reportingFolder?.value?.toString().toLowerCase() ||
                  label.toLowerCase() === data?.reportingFolder?.label?.toString().toLowerCase()
              : label.toLowerCase() === data?.value?.toLowerCase() || label.toLowerCase() === data?.label?.toLowerCase();
          });

          dispatch(
            uploadReportingDocument({
              data,
              reportGroupId,
              reportingFolder,
            })
          );
          setClearOnBlur(true);
        } else {
          dispatch(
            uploadDocument({
              data,
              placement,
              documentType,
              documentTypeId,
              ...(utils.generic.isFunction(redirectionCallback) && { redirectionCallback: () => redirectionCallback(placement.id) }),
            })
          );
        }
      },
    },
  ];

  return folders.length > 0 || reportGroupId ? <DocumentUploadView fields={fields} actions={actions} /> : null;
}
