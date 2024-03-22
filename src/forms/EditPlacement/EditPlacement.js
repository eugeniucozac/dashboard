import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import * as Yup from 'yup';
import get from 'lodash/get';
import differenceBy from 'lodash/differenceBy';
import sortBy from 'lodash/sortBy';

// mui
import { makeStyles } from '@material-ui/core';

// app
import { OptionDetail, Translate } from 'components';
import styles from './EditPlacement.styles';

import { EditPlacementView } from './EditPlacement.view';
import {
  postEditPlacement,
  selectRefDataDepartmentUsers,
  selectUserDepartmentIds,
  selectRefDataDepartments,
  getReferenceDataByType,
  selectRefDataStatusesPlacement,
} from 'stores';
import * as utils from 'utils';

EditPlacement.propTypes = {
  placement: PropTypes.object.isRequired,
  calendarView: PropTypes.bool,
  handleClose: PropTypes.func.isRequired,
};

export default function EditPlacement({ placement = {}, calendarView = false, handleClose }) {
  const classes = makeStyles(styles, { name: 'EditPlacement' })();
  const dispatch = useDispatch();
  const refDataDepartmentUsers = useSelector(selectRefDataDepartmentUsers);
  const userDepartments = useSelector(selectUserDepartmentIds);
  const refDataDepartments = useSelector(selectRefDataDepartments);
  const refDataStatusesPlacement = useSelector(selectRefDataStatusesPlacement);
  const users = get(placement, 'users', []);
  const usersOptionsFiltered = utils.users.getWithName(refDataDepartmentUsers);
  const selectedClients = placement?.clients?.map((client) => {
    return {
      ...client,
      id: client?.idClient ? client.idClient : client.id,
      name: client?.type === 'office' ? `${client.parent} ${client.name}` : client.name,
    };
  });

  const isDiabled = placement?.policies?.length > 0;

  const brokers = utils.users.getBrokers(users).map((user) => {
    return {
      ...user,
      label: utils.user.fullname(user),
    };
  });

  const brokersOptions = utils.users.getBrokers(usersOptionsFiltered).map((broker) => {
    return {
      ...broker,
      label: utils.user.fullname(broker),
    };
  });

  const gxbBrokers = utils.users.getBrokers(users, { gxbUsersOnly: true });

  const cobrokers = utils.users.getCobrokers(users).map((user) => {
    return {
      ...user,
      label: utils.user.fullname(user),
    };
  });

  const officeCoBrokers = utils.placement.getOfficeCobrokers(placement);

  const cobrokersOptions = utils.users.getCobrokers(usersOptionsFiltered).map((broker) => {
    return {
      ...broker,
      label: utils.user.fullname(broker),
    };
  });

  const cobrokersAvailableOptions = differenceBy(cobrokersOptions, officeCoBrokers, 'id');

  const filteredDepts = refDataDepartments.filter((dept) => {
    return userDepartments.includes(dept.id);
  });

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
      const officeName = utils.office.getName(clientOffice);
      const parent = utils.office.getParent(clientOffice);
      const parentName = utils.client.parent.getName(parent);
      const parentLogo = utils.client.parent.getLogoFilePath(parent);

      return {
        ...option,
        label: (
          <OptionDetail label={officeName || option.name} detail={clientDetail}>
            {parentLogo && <img src={parentLogo} alt={`logo ${parentName}`} className={classes.logo} />}
          </OptionDetail>
        ),
      };
    });
  };

  const renderInsuredOptions = (options) => {
    if (!utils.generic.isValidArray(options)) return [];
    return options.map((option) => {
      if (option.isProvisional) {
        return {
          ...option,
          name: (
            <OptionDetail
              label={option.name}
              detail={<Translate label="renewals.provisionalInsuredTooltip" />}
              type="primary"
            ></OptionDetail>
          ),
        };
      }
      return {
        ...option,
        name: <OptionDetail label={option.name}></OptionDetail>,
      };
    });
  };

  const fields = [
    {
      name: 'brokers',
      type: 'autocomplete',
      value: brokers || [],
      label: utils.string.t('form.brokers.label'),
      hint: utils.string.t('form.brokers.hint'),
      options: brokersOptions,
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array(),
      innerComponentProps: {
        isMulti: true,
        allowEmpty: true,
        maxMenuHeight: 200,
        'data-testid': 'brokers',
      },
    },
    {
      name: 'cobrokers',
      type: 'autocomplete',
      value: cobrokers || [],
      label: utils.string.t('placement.form.coBrokers.label'),
      hint: utils.string.t('placement.form.coBrokers.hint'),
      options: cobrokersAvailableOptions,
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array(),
      innerComponentProps: {
        isMulti: true,
        allowEmpty: true,
        maxMenuHeight: 200,
        'data-testid': 'cobrokers',
      },
    },
    {
      name: 'department',
      label: utils.string.t('form.departments.label'),
      value: placement?.departmentId?.toString() || '',
      type: 'select',
      options: filteredDepts.map((dept) => ({
        value: dept.id,
        label: dept.name,
      })),
      muiComponentProps: {
        disabled: isDiabled,
      },
      validation: !isDiabled && Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'description',
      type: 'textarea',
      label: utils.string.t('form.description.label'),
      value: placement.description || '',
      muiComponentProps: {
        multiline: true,
        minRows: 3,
        maxRows: 6,
        'data-testid': 'description',
      },
    },
    {
      name: 'clients',
      type: 'autocomplete',
      label: utils.string.t('form.clients.label'),
      value: selectedClients || [],
      options: [],
      optionKey: 'id',
      optionLabel: 'label',
      validation:
        !isDiabled &&
        Yup.array()
          .of(Yup.mixed().required(utils.string.t('form.clients.required')))
          .required(utils.string.t('form.clients.required')),
      muiComponentProps: {
        'data-testid': 'clients',
      },
      innerComponentProps: {
        valueLabel: 'name',
        isMulti: true,
        allowEmpty: true,
        displayUpArowIcon: false,
        maxMenuHeight: 205,
        async: {
          handler: async (...args) => {
            const options = await dispatch(getReferenceDataByType(...args));
            return renderClientOptions(options, classes);
          },
          type: 'client',
        },
        isDisabled: isDiabled,
      },
    },
    {
      name: 'insureds',
      type: 'autocomplete',
      label: utils.string.t('form.insureds.label'),
      hint: utils.string.t('form.insureds.hint'),
      value: placement?.insureds || [],
      options: [],
      optionKey: 'id',
      optionLabel: 'name',
      validation:
        !isDiabled &&
        Yup.array()
          .of(Yup.mixed().required(utils.string.t('form.insureds.required')))
          .required(utils.string.t('form.insureds.required')),
      muiComponentProps: {
        'data-testid': 'insureds',
      },
      innerComponentProps: {
        valueLabel: 'name',
        isCreatable: true,
        isMulti: true,
        displayUpArowIcon: false,
        allowEmpty: true,
        maxMenuHeight: 200,
        async: {
          handler: async (...args) => {
            const options = await dispatch(getReferenceDataByType(...args));
            return renderInsuredOptions(options);
          },
          type: 'insured',
        },
        isDisabled: isDiabled,
      },
    },
    {
      name: 'statusLabel',
      label: utils.string.t('app.status'),
      value: placement?.statusId?.toString() || '',
      type: 'select',
      options: refDataStatusesPlacement.map((status) => ({
        value: status.id,
        label: status.code,
      })),
      muiComponentProps: {
        disabled: isDiabled,
      },
      validation: !isDiabled && Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'inceptionDate',
      type: 'datepicker',
      label: utils.string.t('form.inceptionDate.label'),
      value: placement.inceptionDate || null,
      validation: Yup.string().nullable().required(utils.string.t('form.inceptionDate.required')),
      muiComponentProps: {
        'data-testid': 'inceptionDate',
      },
    },
    {
      name: 'placementId',
      type: 'hidden',
      value: placement.id,
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
        dispatch(postEditPlacement(values, calendarView));
      },
    },
  ];

  return <EditPlacementView fields={fields} actions={actions} gxbBrokers={gxbBrokers} officeCoBrokers={officeCoBrokers} />;
}
