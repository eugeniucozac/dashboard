import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

// app
import { ReportsExtendedAddEditView } from './ReportsExtendedAddEdit.view';
import * as utils from 'utils';
import { createReportsExtended, editReportsExtended } from 'stores';
import * as constants from 'consts';

ReportsExtendedAddEdit.propTypes = {
  report: PropTypes.object,
  groupId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  handleClose: PropTypes.func.isRequired,
  isEditAddReport: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    onSuccessfulCreateOrEditOrDeleteReport: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ReportsExtendedAddEdit({ report = {}, groupId, handleClose, isEditAddReport, handlers }) {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'report',
      type: 'text',
      value: report?.title || '',
      validation: Yup.string().required(utils.string.t('reportingExtended.reporting.form.reportName.required')),
      label: utils.string.t('reportingExtended.reporting.form.reportName.label'),
    },
    {
      name: 'description',
      type: 'textarea',
      label: utils.string.t('reportingExtended.reporting.form.description'),
      value: report?.description || '',
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
        'data-testid': 'description',
      },
    },
    {
      name: 'reportId',
      type: 'text',
      value: report?.powerbiReportId || '',
      label: utils.string.t('reportingExtended.reporting.form.reportId.label'),
      muiComponentProps: {
        // Disabled for time being, this field might be required in the future.
        disabled: true,
      },
    },
    {
      name: 'workspaceId',
      type: 'text',
      value: report?.workspaceId || '',
      label: utils.string.t('reportingExtended.reporting.form.workspaceId.label'),
      muiComponentProps: {
        // Disabled for time being, this field might be required in the future.
        disabled: true,
      },
    },
    {
      name: 'sectionId',
      type: 'text',
      value: report?.sectionId || '',
      label: utils.string.t('reportingExtended.reporting.form.sectionId.label'),
      muiComponentProps: {
        // Disabled for time being, this field might be required in the future.
        disabled: true,
      },
    },
    {
      name: 'source',
      type: 'text',
      value: report?.src || '',
      label: utils.string.t('reportingExtended.reporting.form.source.label'),
      validation: Yup.string().required(utils.string.t('reportingExtended.reporting.form.source.required')),
    },
  ];

  const actions = [
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleClose,
    },
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: (values) => {
        const newValuesToCreate = { ...values, reportgroupId: groupId };
        const newValuesToEdit = { ...values, reportId: report?.id, powerbiReportId: report?.powerbiReportId, reportgroupId: groupId };
        return isEditAddReport
          ? dispatch(editReportsExtended(newValuesToEdit)).then((response) => {
              if (response?.status === constants.API_RESPONSE_OK) {
                handlers.onSuccessfulCreateOrEditOrDeleteReport();
              }
            })
          : dispatch(createReportsExtended(newValuesToCreate)).then((response) => {
              if (response?.status === constants.API_RESPONSE_OK) {
                handlers.onSuccessfulCreateOrEditOrDeleteReport();
              }
            });
      },
    },
  ];

  return <ReportsExtendedAddEditView fields={fields} actions={actions} />;
}
