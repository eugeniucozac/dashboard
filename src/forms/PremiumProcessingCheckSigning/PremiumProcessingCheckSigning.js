import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

// app
import {
  selectRefDataMarketTypes,
  selectRefDataXbInstances,
  premiumProcessingCheckSigningCase,
  getPremiumProcessingTasksDetails,
  selectCaseTaskTypeView,
} from 'stores';
import styles from './PremiumProcessingCheckSigning.styles';
import { PremiumProcessingCheckSigningView } from './PremiumProcessingCheckSigning.view';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';

PremiumProcessingCheckSigning.prototypes = {
  handleClose: PropTypes.func.isRequired,
  caseDetails: PropTypes.array,
};

export default function PremiumProcessingCheckSigning({ handleClose, caseDetails }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCheckSigning' })();
  const dispatch = useDispatch();
  const selectedCase = caseDetails;
  const caseDetail = caseDetails?.caseTeamData;
  const BureauNameData = useSelector(selectRefDataMarketTypes);
  const xbInstanceList = useSelector(selectRefDataXbInstances);
  const caseTaskTypeView = useSelector(selectCaseTaskTypeView);
  let xbInstanceName = null;
  const optionsBureauList =
    utils.generic.isValidArray(BureauNameData, true) &&
    BureauNameData.filter((item) => item.marketTypeID !== 4).map((type) => ({
      id: type.marketTypeID,
      name: type.marketTypeDescription,
    }));

  const xbName = utils.generic.isValidArray(xbInstanceList, true) && xbInstanceList.filter((a) => a.sourceID === caseDetail?.xbInstanceId);
  xbInstanceName = xbName?.length > 0 && xbName[0]?.sourceName;

  const handleSubmit = (checkSignData) => {
    dispatch(premiumProcessingCheckSigningCase({ checkSignData, selectedCase }));
    dispatch(getPremiumProcessingTasksDetails({ requestType: 'search', taskType: caseTaskTypeView, filterTerm: [] }));
    dispatch(getPremiumProcessingTasksDetails({ requestType: 'filter', taskType: caseTaskTypeView, filterTerm: [] }));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const packageSubmitted = caseDetail.packageSubmittedOn;
  const packageSubmittedOn = utils.string.t('format.date', { value: { date: packageSubmitted, format: config.ui.format.date.iso } });

  const fields = [
    {
      name: 'workPackageReference',
      label: utils.string.t('premiumProcessing.checkSigningCase.workPackageReference'),
      value: '',
      type: 'text',
      validation: Yup.string().matches(/^[a-zA-Z0-9]*$/, utils.string.t('validation.string.alphaNumericOnly')).required(utils.string.t('validation.required')),
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
      validation: Yup.array().required(utils.string.t('validation.required')),
    },
    {
      name: 'riskReferenceId',
      label: utils.string.t('premiumProcessing.checkSigningCase.riskReferenceId'),
      value: selectedCase.policyRef || '',
      type: 'text',
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'packageSubmittedOn',
      label: utils.string.t('premiumProcessing.checkSigningCase.packageSubmittedOn'),
      type: 'datepicker',
      value: packageSubmittedOn,
      outputFormat: '',
      placeholder: utils.string.t('app.selectDate'),
      icon: 'TodayIcon',
      validation: Yup.string().nullable().required(utils.string.t('validation.required')),
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.datepicker,
        },
      },
    },
    {
      name: 'department',
      label: utils.string.t('premiumProcessing.checkSigningCase.department'),
      value: caseDetail?.department || '',
      type: 'text',
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'gxbInstance',
      label: utils.string.t('premiumProcessing.checkSigningCase.gxbInstance'),
      value: xbInstanceName || '',
      type: 'text',
      muiComponentProps: {
        disabled: true,
      },
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.create'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <PremiumProcessingCheckSigningView actions={actions} fields={fields} />;
}
