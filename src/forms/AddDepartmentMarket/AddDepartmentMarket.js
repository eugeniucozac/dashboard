import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import get from 'lodash/get';

// app
import styles from './AddDepartmentMarket.styles';
import { AddDepartmentMarketView } from './AddDepartmentMarket.view';
import { StatusIcon, Restricted, OptionDetail } from 'components';
import {
  addDepartmentMarket,
  resetReferenceDataMarkets,
  getReferenceDataByType,
  selectFormattedAccountStatusList,
  selectRefDataCapacityTypes,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

AddDepartmentMarket.propTypes = {
  deptId: PropTypes.number.isRequired,
  markets: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function AddDepartmentMarket({ deptId, markets = [], handleClose }) {
  const classes = makeStyles(styles, { name: 'AddDepartmentMarket' })();

  const dispatch = useDispatch();

  const formattedAccountStatusList = useSelector(selectFormattedAccountStatusList);
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);

  const [underwritersVisible, setUnderwritersVisible] = useState(false);
  const [marketSelected, setMarketSelected] = useState(null);

  const marketsInUse = markets.map((market) => market.id);

  useEffect(
    () => {
      dispatch(resetReferenceDataMarkets());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filterMarketsInUse = (marketsInUse) => (list) => {
    return list.filter((item) => {
      return !marketsInUse.includes(item.id);
    });
  };

  const getOptions = async (...args) => {
    return await dispatch(getReferenceDataByType(...args));
  };

  const getMarketDetail = ({ gxbBeReference, address }) => {
    const addressStr = utils.market.getAddress(address);
    if (!gxbBeReference && !addressStr) return;

    return (
      <>
        {gxbBeReference && (
          <span>
            {utils.string.t('placement.generic.gxbBeReference')}: {gxbBeReference}
            <br />
          </span>
        )}
        {addressStr && (
          <span>
            {utils.string.t('app.address')}: {addressStr}
          </span>
        )}
      </>
    );
  };

  const renderOptions = async (type, searchTerm) => {
    const orderBy = formattedAccountStatusList.map((status) => status.id);
    const options = await getOptions(type, searchTerm);

    const optionsWithStatus = options.map((option) => {
      const marketDetail = getMarketDetail(option);

      return {
        ...option,
        label: (
          <OptionDetail label={option.edgeName} detail={marketDetail}>
            <Restricted include={[constants.ROLE_BROKER]}>
              <StatusIcon translationPath="statusMarket" list={formattedAccountStatusList} id={option.statusId} />
            </Restricted>
          </OptionDetail>
        ),
      };
    });

    return optionsWithStatus.sort((a, b) => orderBy.indexOf(a.statusId) - orderBy.indexOf(b.statusId));
  };

  const fields = [
    {
      name: 'departmentId',
      type: 'hidden',
      value: deptId,
    },
    {
      name: 'markets',
      type: 'autocomplete',
      label: utils.string.t('market.fields.market'),
      options: [],
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('validation.required')))
        .required(utils.string.t('validation.required')),
      innerComponentProps: {
        valueLabel: 'edgeName',
        allowEmpty: true,
        async: {
          handler: renderOptions,
          type: 'market',
          filter: filterMarketsInUse(marketsInUse),
        },
      },
      muiComponentProps: {
        autoFocus: true,
        'data-testid': 'market',
      },
      callback: (values, setValue) => {
        const value = values && get(values, '[0]');

        setMarketSelected(value ? value.id : null);
        setValue('markets', [value]);
        setValue('capacityTypeId', value ? value.capacityTypeId || '' : '');
      },
    },
    {
      name: 'capacityTypeId',
      type: 'select',
      value: '',
      options: refDataCapacityTypes,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        disabled: !marketSelected,
      },
      label: utils.string.t('market.fields.capacityType'),
      hint: utils.string.t('market.fields.capacityTypeHint'),
    },
    {
      name: 'underwriters',
      label: utils.string.t('market.legends.underwriters'),
      type: 'array',
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
          muiComponentProps: {
            InputProps: {
              classes: {
                input: classes.input,
              },
            },
          },
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
        return dispatch(addDepartmentMarket(...args));
      },
    },
  ];

  return (
    <AddDepartmentMarketView
      fields={fields}
      actions={actions}
      isUnderwritersVisible={underwritersVisible}
      handlers={{
        showUnderwriters: setUnderwritersVisible,
      }}
    />
  );
}
