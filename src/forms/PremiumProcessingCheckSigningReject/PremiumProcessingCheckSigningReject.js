import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// app
import {
  selectRefDataMarketTypes,
  premiumProcessingCheckSigningRejectCase,
  getPremiumProcessingTasksDetails,
  selectCaseTaskTypeView,
  premiumProcessingCheckSigningRejectCreateCase,
} from 'stores';
import styles from './PremiumProcessingCheckSigningReject.styles';
import { PremiumProcessingCheckSigningRejectView } from './PremiumProcessingCheckSigningReject.view';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingCheckSigningReject.prototypes = {
  handleClose: PropTypes.func.isRequired,
  selectedCases: PropTypes.array,
  notesFieldValue: PropTypes.string,
};

export default function PremiumProcessingCheckSigningReject({ handleClose, selectedCases, notesFieldValue }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCheckSigningReject' })();
  const dispatch = useDispatch();
  const BureauNameData = useSelector(selectRefDataMarketTypes);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  const optionsBureauList =
    utils.generic.isValidArray(BureauNameData, true) &&
    BureauNameData.filter((item) => item.marketTypeID !== 4).map((type) => ({
      id: type.marketTypeID,
      name: type.marketTypeDescription,
    }));

  const handleSubmit = (checkSignData) => {
    const rejectCase = async () => {
      const response = await dispatch(premiumProcessingCheckSigningRejectCase({ checkSignData, selectedCases, notesFieldValue }));
      if (response && response?.status === constants.API_RESPONSE_OK) {
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
      }
    };

    const rejectCreateCase = async () => {
      const response = await dispatch(premiumProcessingCheckSigningRejectCreateCase({ checkSignData, selectedCases, notesFieldValue }));
      if (response && response?.status === constants.API_RESPONSE_OK) {
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
        dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
      }
    };

    if (checkSignData?.checkBoxMessage) {
      rejectCreateCase();
    } else {
      rejectCase();
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 10);
  const packageSubmittedDate = utils.string.t('format.date', { value: { date: currentDate, format: config.ui.format.date.iso } });

  const fields = [
    {
      name: 'chooseReason',
      label: utils.string.t('premiumProcessing.checkSigningReject.chooseReason'),
      options: [
        { label: 'Reason code 1', value: 'RC1' },
        { label: 'Reason code 2', value: 'RC2' },
        { label: 'Reason code 3', value: 'RC3' },
      ],
      type: 'select',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'workPackageReference',
      label: utils.string.t('premiumProcessing.checkSigningReject.workPackageRef'),
      value: '',
      type: 'text',
      validation: Yup.string().when('checkBoxMessage', {
        is: true,
        then: Yup.string().matches(/^[a-zA-Z0-9]*$/, utils.string.t('validation.string.alphaNumericOnly')).required(utils.string.t('validation.required')),
      }),
      muiComponentProps: {
        inputProps: {
          maxLength: 30,
        },
        InputProps: {
          classes: {
            input: classes.upperCaseLetter,
          },
        },
      },
    },
    {
      name: 'bureauList',
      label: utils.string.t('premiumProcessing.checkSigningCase.bureauList'),
      value: optionsBureauList || [],
      type: 'autocomplete',
      options: optionsBureauList,
      optionKey: 'id',
      optionLabel: 'name',
      innerComponentProps: {
        isMulti: true,
        allowEmpty: true,
        maxMenuHeight: 200,
      },
      validation: Yup.array().when('checkBoxMessage', {
        is: true,
        then: Yup.array().required(utils.string.t('validation.required')),
      }),
    },
    {
      name: 'checkBoxMessage',
      type: 'checkbox',
      value: false,
      label: utils.string.t('premiumProcessing.checkSigningReject.checkBoxMessage'),
    },
    {
      name: 'packageSubmittedDate',
      label: utils.string.t('premiumProcessing.checkSigningCase.packageSubmittedOn'),
      type: 'datepicker',
      value: packageSubmittedDate,
      validation: Yup.string().when('checkBoxMessage', {
        is: true,
        then: Yup.string().nullable().required(utils.string.t('validation.required')),
      }),
      outputFormat: '',
      placeholder: utils.string.t('app.selectDate'),
      icon: 'TodayIcon',
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.datepicker,
        },
      },
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('premiumProcessing.checkSigningReject.rejectCreateNew'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('premiumProcessing.checkSigningReject.cancel'),
      handler: handleCancel,
    },
  ];

  return <PremiumProcessingCheckSigningRejectView actions={actions} fields={fields} />;
}
