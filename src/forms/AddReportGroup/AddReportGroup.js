import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

// app
import { AddReportGroupView } from './AddReportGroup.view';
import * as utils from 'utils';
import { createReport } from 'stores';

AddReportGroup.propTypes = {
  report: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
};

export default function AddReportGroup({ report = {}, handleClose }) {
  const dispatch = useDispatch();
  const fields = [
    {
      name: 'report',
      type: 'text',
      value: report?.title || '',
      validation: Yup.string().required(utils.string.t('reporting.form.reportName.required')),
      label: utils.string.t('reporting.form.reportName.label'),
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
    {
      name: 'reportId',
      type: 'text',
      value: report?.id || '',
      validation: Yup.string().required(utils.string.t('reporting.form.reportId.required')),
      label: utils.string.t('reporting.form.reportId.label'),
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
        const newValues = { ...values, reportgroupId: report.groupId };
        return dispatch(createReport(newValues));
      },
    },
  ];

  return <AddReportGroupView fields={fields} actions={actions} />;
}
