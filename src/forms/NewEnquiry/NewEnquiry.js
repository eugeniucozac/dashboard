import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import * as Yup from 'yup';
import sortBy from 'lodash/sortBy';

// app
import styles from './NewEnquiry.styles';
import { OptionDetail } from 'components';
import { NewEnquiryView } from './NewEnquiry.view';
import {
  selectUserDepartmentIds,
  selectRefDataDepartments,
  enqueueNotification,
  hideModal,
  postNewEnquiry,
  resetReferenceDataBusinessTypes,
  resetReferenceDataInsureds,
  getReferenceDataByType,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';

NewEnquiry.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default function NewEnquiry({ handleClose }) {
  const classes = makeStyles(styles, { name: 'NewEnquiry' })();

  const dispatch = useDispatch();
  const history = useHistory();
  const [placement, setPlacement] = useState();
  const userDepartments = useSelector(selectUserDepartmentIds);
  const refDataDepartments = useSelector(selectRefDataDepartments);

  useEffect(
    () => {
      dispatch(resetReferenceDataBusinessTypes());
      dispatch(resetReferenceDataInsureds());

      if (!refDataDepartments || !refDataDepartments.length > 0) {
        dispatch(hideModal());
        dispatch(enqueueNotification('notification.generic.reload', 'error'));
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const renderClientOptions = (options) => {
    if (!utils.generic.isValidArray(options)) return [];

    // orders clients with offices at the top
    // if client has office(s), show the parent logo and name
    // if client has multiple offices, split each office into its own entry
    const optionsSorted = sortBy(options, [
      (o) => {
        return !utils.generic.isValidArray(o.offices, true);
      },
    ]).reduce((acc, option) => {
      // no offices
      if (!option.offices || (option.offices && option.offices.length === 0)) {
        return [...acc, option];
      }

      // single office
      if (option.offices && option.offices.length === 1) {
        const officeName = utils.office.getName(option.offices[0]);
        const parent = utils.office.getParent(option.offices[0]);
        const parentName = utils.client.parent.getName(parent);

        return [...acc, { ...option, name: `${parentName} ${officeName}` }];
      }

      if (option.offices && option.offices.length > 1) {
        const newOptionsFromOffices = option.offices.reduce((newOptions, nestedOffice) => {
          const officeName = utils.office.getName(nestedOffice);
          const parent = utils.office.getParent(nestedOffice);
          const parentName = utils.client.parent.getName(parent);

          return [...newOptions, { ...option, name: `${parentName} ${officeName}`, offices: [nestedOffice] }];
        }, []);

        return [...acc, ...newOptionsFromOffices];
      }

      return acc;
    }, []);

    return optionsSorted.map((option) => {
      const clientDetail = utils.client.getClientDetail(option);
      const clientOffice = utils.office.getMainOffice(option.offices);
      const parent = utils.office.getParent(clientOffice);
      const parentName = utils.client.parent.getName(parent);
      const parentLogo = utils.client.parent.getLogoFilePath(parent);

      return {
        ...option,
        label: (
          <OptionDetail label={option.name} detail={clientDetail}>
            {parentLogo && <img src={parentLogo} alt={`logo ${parentName}`} className={classes.logo} />}
          </OptionDetail>
        ),
      };
    });
  };

  const redirectionCallback = (id) => {
    if (!id) return;
    history.push(`${config.routes.placement.overview}/${id}`);
  };

  const filteredDepts = refDataDepartments.filter((dept) => {
    return userDepartments.includes(dept.id);
  });

  const hasSingleDept = filteredDepts && filteredDepts.length === 1;

  const fields = [
    {
      name: 'department',
      type: 'autocomplete',
      label: utils.string.t('form.departments.label'),
      value: hasSingleDept ? [filteredDepts[0]] : [],
      options: filteredDepts,
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('form.departments.required')))
        .required(utils.string.t('form.departments.required')),
      muiComponentProps: {
        'data-testid': 'department',
        autoFocus: !hasSingleDept,
      },
      innerComponentProps: {
        isDisabled: hasSingleDept,
      },
    },
    {
      name: 'description',
      type: 'text',
      label: utils.string.t('form.description.label'),
      value: '',
      validation: Yup.string().required(utils.string.t('form.description.required')),
      muiComponentProps: {
        multiline: true,
        maxRows: 5,
        autoFocus: hasSingleDept,
        'data-testid': 'description',
      },
    },
    {
      name: 'clients',
      type: 'autocomplete',
      label: utils.string.t('form.clients.label'),
      value: [],
      options: [],
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('form.clients.required')))
        .required(utils.string.t('form.clients.required')),
      innerComponentProps: {
        valueLabel: 'name',
        isMulti: true,
        allowEmpty: true,
        displayUpArowIcon: false,
        maxMenuHeight: 205,
        async: {
          handler: async (...args) => {
            const options = await dispatch(getReferenceDataByType(...args));
            return renderClientOptions(options);
          },
          type: 'client',
        },
      },
      muiComponentProps: {
        'data-testid': 'clients',
      },
    },
    {
      name: 'insureds',
      type: 'autocomplete',
      label: utils.string.t('form.insureds.label'),
      hint: utils.string.t('form.insureds.hint'),
      value: [],
      options: [],
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('form.insureds.required')))
        .required(utils.string.t('form.insureds.required')),
      innerComponentProps: {
        isCreatable: true,
        isMulti: true,
        allowEmpty: true,
        displayUpArowIcon: false,
        maxMenuHeight: 200,
        async: {
          handler: (...args) => dispatch(getReferenceDataByType(...args)),
          type: 'insured',
        },
      },
      muiComponentProps: {
        'data-testid': 'insureds',
      },
    },
    {
      name: 'inceptionDate',
      type: 'datepicker',
      label: utils.string.t('form.inceptionDate.label'),
      value: null,
      validation: Yup.string().nullable().required(utils.string.t('form.inceptionDate.required')),
      muiComponentProps: {
        'data-testid': 'inceptionDate',
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
      name: 'secondary',
      type: 'submit',
      label: utils.string.t('placement.sheet.addDocument'),
      handler: async (formData) => {
        const newSubmission = await dispatch(postNewEnquiry({ formData, addDocuments: true }));
        setPlacement(newSubmission);
      },
    },
    {
      name: 'submit',
      label: utils.string.t('app.create'),
      handler: (formData) => dispatch(postNewEnquiry({ formData, redirectionCallback })),
    },
  ];

  return <NewEnquiryView fields={fields} actions={actions} placement={placement} handleRedirect={redirectionCallback} />;
}
