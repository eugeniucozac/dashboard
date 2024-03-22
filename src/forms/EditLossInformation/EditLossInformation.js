import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';
import PropTypes from 'prop-types';

//app
import styles from './EditLossInformation.styles';
import { EditLossInformationView } from './EditLossInformation.view';
import { hideModal, showModal, selectLossInformation, selectCatCodes, postEditLossInformation } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

EditLossInformation.propTypes = {
  submitHandler: PropTypes.func,
};

EditLossInformation.defaultProps = {
  submitHandler: () => {},
};

export default function EditLossInformation({ submitHandler }) {
  const classes = makeStyles(styles, { name: 'EditLossInformation' })();
  const dispatch = useDispatch();
  const lossInformation = useSelector(selectLossInformation);
  const catCodes = useSelector(selectCatCodes);
  const formattedCatCodes = catCodes.map((list) => {
    const name = `${list.name} - ${list.description.substring(0, 99)}`;
    return { id: list.id, name };
  });

  const isAnyClaimSubmitted = lossInformation?.isAnyClaimSubmitted ?? false;
  const fields = [
    {
      name: 'lossRef',
      type: 'text',
      muiComponentProps: {
        disabled: true,
      },
      value: lossInformation?.lossRef || '',
    },
    {
      name: 'catCodesID',
      type: 'autocompletemui',
      options: formattedCatCodes,
      optionKey: 'id',
      optionLabel: 'name',
      value: formattedCatCodes?.find((c) => c.id?.toString() === lossInformation?.catCodesID?.toString()) || null,
      muiComponentProps: {
        'data-testid': 'catCodes',
        disabled: isAnyClaimSubmitted,

        classes: {
          root: classes.catCodeSelect,
        },
      },
    },
    {
      type: 'datepicker',
      name: 'fromDate',
      value: lossInformation?.fromDate || null,
      icon: 'TodayIcon',
      muiComponentProps: {
        fullWidth: true,
        disabled: isAnyClaimSubmitted,

        classes: {
          root: classes.datepicker,
        },
      },
      validation: Yup.date()
        .test('from', utils.string.t('claims.lossInformation.validation.greaterThenDate'), function (value) {
          return value && this.options.parent.toDate ? moment(value).isSameOrBefore(this.options.parent.toDate) : true;
        })
        .when('catCodesID', {
          is: (val) => val !== null && val?.id !== '0',
          then: Yup.date().nullable().required(utils.string.t('claims.lossInformation.validation.fromDate')),
          otherwise: Yup.date().nullable(),
        }),
      outputFormat: 'iso',
    },
    {
      type: 'datepicker',
      name: 'toDate',
      value: lossInformation?.toDate || null,
      icon: 'TodayIcon',
      muiComponentProps: {
        fullWidth: true,
        disabled: isAnyClaimSubmitted,

        classes: {
          root: classes.datepicker,
        },
      },
      validation: Yup.date()
        .test('from', utils.string.t('claims.lossInformation.validation.lesserThenDate'), function (value) {
          return value && this.options.parent.fromDate ? moment(value).isSameOrAfter(this.options.parent.fromDate) : true;
        })
        .when('catCodesID', {
          is: (val) => val !== null && val?.id !== '0',
          then: Yup.date().nullable().required(utils.string.t('claims.lossInformation.validation.toDate')),
          otherwise: Yup.date().nullable(),
        }),
      outputFormat: 'iso',
    },
    {
      name: 'lossName',
      type: 'text',
      value: lossInformation?.lossName || '',
      validation: Yup.string()
        .min(20, utils.string.t('claims.lossInformation.validation.minLossName'))
        .max(50, utils.string.t('claims.lossInformation.validation.maxLossName'))
        .required(utils.string.t('claims.lossInformation.validation.lossName')),
      'data-testid': 'lossName',
      muiComponentProps: {
        disabled: isAnyClaimSubmitted,
      },
    },
    {
      name: 'lossDescription',
      type: 'textarea',
      value: lossInformation?.lossDescription || '',
      validation: Yup.string()
        .max(350, utils.string.t('claims.lossInformation.validation.maxLossDescription'))
        .required(utils.string.t('claims.lossInformation.validation.lossDescription')),
      muiComponentProps: {
        inputProps: { maxLength: 350 },
        disabled: isAnyClaimSubmitted,

        multiline: true,
        rows: 8,
        rowsMax: 8,
        'data-testid': 'details',
      },
    },
    {
      type: 'datepicker',
      name: 'firstContactDate',
      icon: 'TodayIcon',
      value: utils.string.t('format.date', { value: { date: lossInformation?.firstContactDate || null, format: 'YYYY-MM-DD' } }),
      muiComponentProps: {
        fullWidth: true,
        disabled: isAnyClaimSubmitted,
      },
      validation: Yup.date().max(new Date(), utils.string.t('claims.lossInformation.validation.futureDate')),
      outputFormat: 'iso',
    },
    {
      type: 'time',
      name: 'firstContactTime',
      icon: 'AccessTimeIcon',
      value: utils.string.t('format.date', { value: { date: lossInformation?.firstContactDate || null, format: 'HH:mm' } }),
      muiComponentProps: {
        fullWidth: true,
        disabled: isAnyClaimSubmitted,
      },
    },
  ];

  const actions = [
    {
      name: 'secondary',
      label: utils.string.t('app.cancel'),
      handler: (values) => {
        const currentValues = Object.fromEntries(
          Object.entries({
            catCodesID: values.catCodesID,
            firstContactDate: moment(values.firstContactDate).format('YYYY-MM-DD'),
            isActive: 1,
            lossDescription: values.lossDescription,
            lossDetailID: lossInformation.lossDetailID,
            lossName: values.lossName,
          }).sort()
        );

        const latestValues = Object.fromEntries(
          Object.entries({
            ...lossInformation,
            firstContactDate: moment(lossInformation.firstContactDate).format('YYYY-MM-DD'),
          }).sort()
        );

        JSON.stringify(currentValues) !== JSON.stringify(latestValues)
          ? dispatch(
              showModal({
                component: 'CONFIRM',
                props: {
                  title: utils.string.t('navigation.alert'),
                  fullWidth: true,
                  maxWidth: 'sm',
                  componentProps: {
                    cancelLabel: utils.string.t('app.no'),
                    confirmLabel: utils.string.t('app.yes'),
                    confirmMessage: (
                      <Typography variant="h5" color="secondary">
                        {utils.string.t('claims.modals.confirm.subtitle')}
                      </Typography>
                    ),
                    submitHandler: () => {
                      submitHandler();
                      dispatch(hideModal());
                    },
                    cancelHandler: () => {
                      dispatch(hideModal('CONFIRM'));
                    },
                  },
                },
              })
            )
          : dispatch(hideModal());
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: (values) => {
        dispatch(postEditLossInformation(values));
        submitHandler();
      },
    },
  ];

  const onClosingUploadModal = () => {
    dispatch(hideModal('DMS_UPLOAD_FILES'));
  };

  return (
    <EditLossInformationView
      actions={actions}
      fields={fields}
      lossInformation={lossInformation}
      handlers={{
        onClosingUploadModal,
      }}
    />
  );
}
