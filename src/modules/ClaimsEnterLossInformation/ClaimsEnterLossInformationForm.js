import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';

// app
import styles from './ClaimsEnterLossInformation.styles';
import { ClaimsEnterLossInformationView } from './ClaimsEnterLossInformation.view';
import { selectLossInformation, selectUser, selectLossSelected } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

ClaimsEnterLossInformationForm.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
};

export function ClaimsEnterLossInformationForm({ formattedCatCodes, lossProperties, ...props }) {
  const classes = makeStyles(styles, { name: 'ClaimsEnterLossInformation' })();
  const lossInformation = useSelector(selectLossInformation);
  const loggedInUser = useSelector(selectUser);
  const lossSelected = useSelector(selectLossSelected);
  const hasLossRef = Boolean(lossInformation.lossRef);
  const isInflightLoss = lossInformation?.isInflighLoss === 1 || lossSelected?.isInflighLoss === 1;
  const [isWarningShow, setIsWarningShow] = useState(false);
  const assignedToUserName =
    lossInformation?.assignedToName === loggedInUser?.fullName ? loggedInUser?.fullName : lossInformation?.assignedToName;
  const assignedToUserId = lossInformation?.assignedTo === loggedInUser?.id ? loggedInUser?.id : lossInformation?.assignedTo;

  const concatDateAndTime = (contactDate, contactTime) => {
    let partDate = utils.string.t('format.date', { value: { date: contactDate || new Date(), format: 'D MMM YYYY' } });
    return utils.date.toISOString(partDate + ' ' + (contactTime ? contactTime + ':00' : '00:00:00'));
  };

  const fields = [
    {
      name: 'lossRef',
      label: utils.string.t('claims.lossInformation.ref'),
      type: 'text',
      value: lossInformation?.lossRef || '',
      muiComponentProps: {
        disabled: true,
      },
    },
    {
      name: 'assignedTo',
      type: 'hidden',
      value: isInflightLoss ? 'NA' : assignedToUserId || '',
    },
    {
      name: 'catCodesID',
      label: utils.string.t('claims.lossInformation.catCode'),
      type: 'autocompletemui',
      options: formattedCatCodes,
      optionKey: 'id',
      optionLabel: 'name',
      value: formattedCatCodes.find((c) => c.id?.toString() === lossInformation?.catCodesID?.toString()) || formattedCatCodes[0],
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        classes: {
          root: classes.catCodeSelect,
        },
      },
    },
    {
      type: 'datepicker',
      name: 'fromDate',
      label: `${utils.string.t('claims.lossInformation.fromDate')}`,
      value: lossInformation?.fromDate || null,
      icon: 'TodayIcon',
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        fullWidth: true,
        classes: {
          root: classes.datepicker,
        },
      },
      validation: Yup.date()
        .test('from', utils.string.t('claims.lossInformation.validation.greaterThenDate'), function (value) {
          return value && this.options.parent.toDate ? moment(value).isSameOrBefore(this.options.parent.toDate) : true;
        })
        .when('$validation', (validation, schema) =>
          validation
            ? schema.when('catCodesID', {
                is: (val) => val !== null && val?.id !== '0',
                then: Yup.date().nullable().required(utils.string.t('claims.lossInformation.validation.fromDate')),
                otherwise: Yup.date().nullable(),
              })
            : Yup.date().nullable()
        ),
    },
    {
      type: 'datepicker',
      name: 'toDate',
      label: `${utils.string.t('claims.lossInformation.toDate')}`,
      value: lossInformation?.toDate || null,
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        fullWidth: true,
        classes: {
          root: classes.datepicker,
        },
      },
      validation: Yup.date()
        .nullable()
        .test('from', utils.string.t('claims.lossInformation.validation.lesserThenDate'), function (value) {
          return value && this.options.parent.fromDate && value !== null ? moment(value).isSameOrAfter(this.options.parent.fromDate) : true;
        }),
    },
    {
      name: 'lossName',
      label: `${utils.string.t('claims.lossInformation.name')}`,
      type: 'text',
      value: lossInformation?.lossName || '',
      validation: Yup.string()
        .max(50, utils.string.t('claims.lossInformation.validation.maxLossName'))
        .required(utils.string.t('claims.lossInformation.validation.lossName'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.string())),
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        inputProps: { maxLength: 51 },
        multiline: true,
        rows: 1,
        rowsMax: 1,
      },
      onChange: (name) => {
        if (name.length > 20) {
          setIsWarningShow(true);
        } else {
          setIsWarningShow(false);
        }
        return name;
      },
    },
    {
      name: 'lossDescription',
      label: `${utils.string.t('claims.lossInformation.details')}`,
      type: 'textarea',
      value: lossInformation?.lossDescription || '',
      validation: Yup.string()
        .max(350, utils.string.t('claims.lossInformation.validation.maxLossDescription'))
        .required(utils.string.t('claims.lossInformation.validation.lossDescription'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.string())),
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        inputProps: { maxLength: 351 },
        multiline: true,
        minRows: 4,
        maxRows: 6,
      },
    },
    {
      type: 'datepicker',
      name: 'firstContactDate',
      value: lossInformation?.firstContactDate || null,
      icon: 'TodayIcon',
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        fullWidth: true,
      },
      validation: Yup.date()
        .nullable()
        .required(utils.string.t('claims.lossInformation.validation.firstContactDateTime'))
        .max(new Date(), utils.string.t('claims.lossInformation.validation.futureDateAndTime'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.date().nullable())),
    },
    {
      type: 'time',
      name: 'firstContactTime',
      icon: 'AccessTimeIcon',
      value: utils.string.t('format.date', { value: { date: lossInformation?.firstContactDate || null, format: 'HH:mm' } }),
      muiComponentProps: {
        disabled: lossProperties?.isClaimSubmitted || lossSelected?.isInflighLoss || false,
        fullWidth: true,
        InputProps: {
          classes: {
            input: classes.timeInput,
          },
        },
      },
      validation: Yup.string()
        .required(utils.string.t('claims.lossInformation.validation.firstContactDateTime'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.string().nullable()))
        .test('from', utils.string.t('claims.lossInformation.validation.futureDateAndTime'), function (value) {
          return !moment(new Date(concatDateAndTime(this?.options?.parent?.firstContactDate, value))).isAfter(new Date());
        }),
    },
  ];

  return (
    <ClaimsEnterLossInformationView
      {...props}
      fields={fields}
      hasLossRef={hasLossRef}
      isInflightLoss={isInflightLoss}
      lossInformation={lossInformation}
      assignedToUserName={assignedToUserName}
      isWarningShow={isWarningShow}
      lossProperties={lossProperties}
      lossSelected={lossSelected}
      formattedCatCodes={formattedCatCodes}
    />
  );
}
