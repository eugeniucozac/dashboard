import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import styles from './EditDepartmentMarket.styles';
import { EditDepartmentMarketView } from './EditDepartmentMarket.view';
import { editDepartmentMarket, resetReferenceDataMarkets, selectRefDataCapacityTypes } from 'stores';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

EditDepartmentMarket.propTypes = {
  market: PropTypes.object.isRequired,
  deptId: PropTypes.number.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function EditDepartmentMarket({ market, deptId, handleClose }) {
  const classes = makeStyles(styles, { name: 'EditDepartmentMarket' })();
  const dispatch = useDispatch();

  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);

  useEffect(
    () => {
      dispatch(resetReferenceDataMarkets());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const previousUnderwriters = get(market, 'underwriters', []).map((m) => ({
    ...m,
    mktId: m.id,
    firstName: m.firstName || '',
    lastName: m.lastName || '',
    emailId: m.emailId || '',
    isOrigin: true,
  }));

  const fields = [
    {
      name: 'departmentId',
      type: 'hidden',
      value: deptId,
    },
    {
      name: 'departmentMarketId',
      type: 'hidden',
      value: get(market, 'id'),
    },
    {
      name: 'marketId',
      type: 'hidden',
      value: get(market, 'market.id'),
    },
    {
      name: 'previousUnderwriters',
      type: 'hidden',
      value: previousUnderwriters,
    },
    {
      name: 'market',
      type: 'text',
      label: utils.string.t('market.cols.name'),
      value: utils.market.getName(market),
      muiComponentProps: {
        readOnly: true,
        disabled: true,
      },
    },
    {
      name: 'capacityTypeId',
      type: 'select',
      value: get(market, 'market.capacityTypeId') || '',
      options: refDataCapacityTypes,
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('market.fields.capacityType'),
    },
    {
      name: 'underwriters',
      label: utils.string.t('market.legends.underwriters'),
      type: 'array',
      arrayDefaultValues: previousUnderwriters,
      arrayItemDef: [
        {
          name: 'firstName',
          type: 'text',
          label: utils.string.t('market.fields.firstName'),
          value: '',
          muiComponentProps: {
            InputProps: {
              classes: {
                input: classes.input,
              },
            },
          },
        },
        {
          name: 'lastName',
          type: 'text',
          label: utils.string.t('market.fields.lastName'),
          value: '',
          muiComponentProps: {
            InputProps: {
              classes: {
                input: classes.input,
              },
            },
          },
        },
        {
          name: 'emailId',
          type: 'text',
          label: utils.string.t('market.fields.email'),
          value: '',
          width: 40,
          muiComponentProps: {
            InputProps: {
              classes: {
                input: classes.input,
              },
            },
          },
        },
        {
          name: 'mktId',
          type: 'hidden',
          value: '',
        },
      ],
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
      handler: (...args) => {
        return dispatch(editDepartmentMarket(...args));
      },
    },
  ];

  return <EditDepartmentMarketView fields={fields} actions={actions} />;
}
