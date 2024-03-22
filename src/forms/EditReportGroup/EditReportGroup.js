import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

// app
import { EditReportGroupView } from './EditReportGroup.view';
import * as utils from 'utils';
import { reportingEdit } from 'stores';

EditReportGroup.propTypes = {
  report: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function EditReportGroup({ report = {}, handleClose }) {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'id',
      type: 'text',
      value: report?.id,
    },
    {
      name: 'report',
      type: 'text',
      value: report?.title || '',
      validation: Yup.string().required(utils.string.t('reporting.form.reportName.required')),
      label: utils.string.t('reporting.form.reportName.label'),
    },
    {
      name: 'powerbiReportId',
      type: 'text',
      value: report?.powerbiReportId || '',
      label: utils.string.t('reporting.form.powerbiReportId'),
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
      handler: (values) => dispatch(reportingEdit(values)),
    },
  ];
  return <EditReportGroupView fields={fields} actions={actions} />;
}
