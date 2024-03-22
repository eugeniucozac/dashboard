import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

// app
import { AddMarketView } from './AddMarket.view';
import styles from './AddMarket.styles';
import { StatusIcon, Restricted, OptionDetail } from 'components';
import {
  postPlacementAddPolicyMarket,
  filterReferenceDataUnderWritersByMarket,
  resetReferenceDataMarkets,
  resetReferenceDataUnderwriters,
  getReferenceDataByType,
  selectFormattedAccountStatusList,
  selectRefDataUnderwriters,
  selectRefDataStatusesMarketQuote,
  selectRefDataCapacityTypes,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, InputAdornment } from '@material-ui/core';
import GavelIcon from '@material-ui/icons/Gavel';

AddMarket.propTypes = {
  policy: PropTypes.object.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default function AddMarket({ policy = {}, handleClose }) {
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'AddMarket' })();
  const [quoteVisible, setQuoteVisible] = useState(false);
  const [nonPFMarket, setNonPFMarket] = useState();
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);
  const refDataUnderwriters = useSelector(selectRefDataUnderwriters);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const formattedAccountStatusList = useSelector(selectFormattedAccountStatusList);

  const currencyCode = get(policy, 'currency.code');
  const markets = get(policy, 'markets', []) || [];
  const marketsInUse = markets.map((marketObj) => marketObj.market.id);

  useEffect(
    () => {
      dispatch(resetReferenceDataMarkets());
      dispatch(resetReferenceDataUnderwriters());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const isAmountRequired = (form, value) => {
    if (isNumber(value)) return true;

    const statusQuotedId = utils.referenceData.status.getIdByCode(refDataStatusesMarketQuote, constants.STATUS_MARKET_QUOTED);
    return !form.status || form.status !== statusQuotedId.toString();
  };

  const isQuoteDirty = (form) => {
    return (
      !!form.status ||
      form.isLeader ||
      form.lineToStand ||
      !!form.premium ||
      form.premium === 0 ||
      !!form.writtenLinePercentage ||
      form.writtenLinePercentage === 0 ||
      !!form.subjectivities ||
      !!form.validUntilDate
    );
  };

  const filterMarketsInUse = (marketsInUse) => (list) => {
    return list.filter((item) => {
      return !marketsInUse.includes(item.id);
    });
  };

  const updateUnderwriters = (data) => {
    dispatch(filterReferenceDataUnderWritersByMarket(data));
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
      name: 'policy',
      type: 'hidden',
      value: policy.id,
    },
    {
      name: 'market',
      type: 'autocomplete',
      label: utils.string.t('placement.form.market.label'),
      options: [],
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array()
        .of(Yup.mixed().required(utils.string.t('validation.required')))
        .required(utils.string.t('validation.required')),
      innerComponentProps: {
        isCreatable: true,
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
    },
    {
      name: 'underwriter',
      type: 'autocomplete',
      label: utils.string.t('placement.form.underwriter.label'),
      hint: refDataUnderwriters.length > 0 ? '' : utils.string.t('placement.form.underwriter.hint'),
      value: [],
      options: refDataUnderwriters.map((uw) => {
        uw.label = utils.user.fullname(uw);
        return uw;
      }),
      optionKey: 'id',
      optionLabel: 'label',
      validation: Yup.array(),
      innerComponentProps: {
        isCreatable: true,
        allowEmpty: true,
      },
      muiComponentProps: {
        'data-testid': 'underwriter',
      },
    },
    {
      name: 'status',
      type: 'select',
      value: '',
      options: refDataStatusesMarketQuote,
      optionKey: 'id',
      optionLabel: 'code',
      validation: Yup.string().test('status', utils.string.t('validation.required'), function () {
        return quoteVisible && isQuoteDirty(this.options.parent) ? this.options.parent.status : true;
      }),
      label: utils.string.t('placement.form.status.label'),
      muiComponentProps: {
        autoFocus: quoteVisible,
      },
    },
    {
      name: 'quoteOptions',
      type: 'checkbox',
      options: [
        { label: utils.string.t('placement.form.lead.label'), name: 'isLeader', value: false },
        { label: utils.string.t('placement.form.lineToStand.label'), name: 'lineToStand', value: false },
      ],
    },
    {
      name: 'currency',
      type: 'text',
      value: currencyCode || '',
      label: utils.string.t('placement.form.currency.label'),
      muiComponentProps: {
        InputProps: {
          readOnly: true,
          disabled: true,
        },
      },
    },
    {
      name: 'premium',
      type: 'number',
      value: '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .currency()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        })
        .test('premium', utils.string.t('validation.required'), function (v) {
          return quoteVisible && isQuoteDirty(this.options.parent)
            ? isAmountRequired(this.options.parent, this.options.parent.premium)
            : true;
        }),
      label: utils.string.t('placement.form.premium.label'),
      muiComponentProps: {
        autoComplete: 'off',
      },
    },
    {
      name: 'writtenLinePercentage',
      type: 'number',
      value: '',
      validation: Yup.number()
        .nullable()
        .min(0)
        .max(100)
        .percent()
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        })
        .test('writtenLinePercentage', utils.string.t('validation.required'), function () {
          return quoteVisible && isQuoteDirty(this.options.parent)
            ? isAmountRequired(this.options.parent, this.options.parent.writtenLinePercentage)
            : true;
        }),
      label: utils.string.t('placement.form.written.label'),
      muiComponentProps: {
        autoComplete: 'off',
        fullWidth: false,
        InputProps: {
          startAdornment: (
            <InputAdornment position="start" className={classes.iconWritten}>
              <GavelIcon />
            </InputAdornment>
          ),
        },
      },
    },
    {
      name: 'subjectivities',
      type: 'textarea',
      value: '',
      validation: Yup.string().max(280),
      label: utils.string.t('placement.form.subjectivities.label'),
      muiComponentProps: {
        multiline: true,
        minRows: 2,
        maxRows: 6,
      },
    },
    {
      name: 'quoteDate',
      type: 'datepicker',
      icon: 'TodayIcon',
      label: utils.string.t('placement.form.dateFrom.label'),
      value: utils.date.today(),
      validation: Yup.string()
        .nullable()
        .test('quoteDate', utils.string.t('validation.required'), function () {
          return quoteVisible && isQuoteDirty(this.options.parent) ? this.options.parent.quoteDate : true;
        }),
      muiComponentProps: {
        fullWidth: true,
      },
    },
    {
      name: 'validUntilDate',
      type: 'datepicker',
      label: utils.string.t('placement.form.dateExpiry.label'),
      value: null,
      validation: Yup.string().nullable(),
      muiComponentProps: {
        fullWidth: true,
      },
      muiPickerProps: {
        clearable: true,
      },
    },
    {
      name: 'capacityTypeId',
      type: 'select',
      value: '',
      options: refDataCapacityTypes,
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('placement.form.capacityType.label'),
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
        if (nonPFMarket) {
          const { market, capacityTypeId, ...rest } = args[0];
          return dispatch(postPlacementAddPolicyMarket({ ...rest, nonPFMarket: { capacityTypeId, name: nonPFMarket.name } }));
        } else {
          return dispatch(postPlacementAddPolicyMarket(...args));
        }
      },
    },
  ];

  return (
    <AddMarketView
      fields={fields}
      actions={actions}
      nonPFMarket={nonPFMarket}
      setNonPFMarket={setNonPFMarket}
      isQuoteVisible={quoteVisible}
      handleShowQuote={setQuoteVisible}
      handleUpdateUnderwriters={updateUnderwriters}
    />
  );
}
