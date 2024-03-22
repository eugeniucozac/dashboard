import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

// app
import { AddEditReportView } from './AddEditReport.view';
import * as utils from 'utils';
import { createReportingGroup, reportingGroupEdit } from 'stores';

AddEditReport.propTypes = {
  report: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  isEditReportGroup: PropTypes.bool.isRequired,
};

export default function AddEditReport({ report = {}, handleClose, isEditReportGroup }) {
  const dispatch = useDispatch();
  const fields = [
    {
      name: 'id',
      type: 'text',
      value: report?.id,
    },
    {
      name: 'name',
      type: 'text',
      value: report?.name || '',
      validation: Yup.string().required(utils.string.t('reporting.form.reportGroupName.required')),
      label: utils.string.t('reporting.form.reportGroupName.label'),
    },
    {
      name: 'description',
      type: 'textarea',
      label: utils.string.t('reporting.form.description'),
      value: report?.description || '',
      muiComponentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 6,
        'data-testid': 'description',
      },
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
        return isEditReportGroup ? dispatch(reportingGroupEdit(values)) : dispatch(createReportingGroup(values));
      },
    },
  ];

  return <AddEditReportView fields={fields} actions={actions} isEditReportGroup={isEditReportGroup} />;
}
