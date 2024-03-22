import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { addEditMarkets, getReferenceDataByType, selectFormattedAccountStatusList } from 'stores';
import { AddEditMarketsView } from './AddEditMarkets.view';
import * as utils from 'utils';
import { StatusIcon, Restricted, OptionDetail } from 'components';
import * as constants from 'consts';

export default function AddEditMarkets({ handleClose, marketParent = {} }) {
  const dispatch = useDispatch();
  const formattedAccountStatusList = useSelector(selectFormattedAccountStatusList);

  const handleSubmit = ({ markets }) => {
    return dispatch(addEditMarkets({ ...marketParent, markets }));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

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
      name: 'parent',
      label: utils.string.t('admin.form.marketParent.label'),
      type: 'text',
      value: marketParent.name,
      muiComponentProps: {
        InputProps: {
          readOnly: true,
          disabled: true,
        },
      },
    },
    {
      name: 'markets',
      type: 'autocomplete',
      label: utils.string.t('admin.form.markets.label'),
      options: [],
      value: marketParent.markets || [],
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('validation.required')))
        .required(utils.string.t('validation.required')),
      innerComponentProps: {
        isCreatable: true,
        valueLabel: 'edgeName',
        allowEmpty: true,
        maxMenuHeight: 200,
        async: {
          handler: renderOptions,
          type: 'market',
          filter: filterMarketsInUse(marketParent.markets),
        },
        isMulti: true,
      },
      muiComponentProps: {
        autoFocus: true,
        'data-testid': 'markets',
      },
    },
  ];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.save'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <AddEditMarketsView actions={actions} fields={fields} />;
}
