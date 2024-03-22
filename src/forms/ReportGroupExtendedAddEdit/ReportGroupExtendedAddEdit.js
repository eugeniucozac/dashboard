import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';

// app
import { ReportGroupExtendedAddEditView } from './ReportGroupExtendedAddEdit.view';
import * as utils from 'utils';
import * as constants from 'consts';
import { createReportGroupExtended, editReportGroupExtended } from 'stores';

ReportGroupExtendedAddEdit.propTypes = {
  reportGrp: PropTypes.object.isRequired,
  handleClose: PropTypes.func,
  isEditReportGroup: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    onSuccessfulCreateOrEditOrDeleteReportGroup: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ReportGroupExtendedAddEdit({ reportGrp = {}, handleClose, isEditReportGroup, handlers }) {
  const dispatch = useDispatch();

  const fields = [
    {
      name: 'id',
      type: 'text',
      value: reportGrp?.id,
    },
    {
      name: 'name',
      type: 'text',
      value: reportGrp?.name || '',
      validation: Yup.string().required(utils.string.t('reportingExtended.reportingGroup.reportGroupName.required')),
      label: utils.string.t('reportingExtended.reportingGroup.reportGroupName.label'),
    },
    {
      name: 'description',
      type: 'textarea',
      label: utils.string.t('reportingExtended.reportingGroup.description'),
      value: reportGrp?.description || '',
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
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
        return isEditReportGroup
          ? dispatch(editReportGroupExtended(values)).then((response) => {
              if (response?.status === constants.API_RESPONSE_OK) {
                handlers.onSuccessfulCreateOrEditOrDeleteReportGroup();
              }
            })
          : dispatch(createReportGroupExtended(values)).then((response) => {
              if (response?.status === constants.API_RESPONSE_OK) {
                handlers.onSuccessfulCreateOrEditOrDeleteReportGroup();
              }
            });
      },
    },
  ];

  return <ReportGroupExtendedAddEditView fields={fields} actions={actions} />;
}
