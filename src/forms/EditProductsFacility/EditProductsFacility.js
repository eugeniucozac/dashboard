import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';

// app
import { EditProductsFacilityView } from './EditProductsFacility.view';
import { Loader } from 'components';
import {
  getFacilityRates,
  getProgramUsers,
  postFacilityRates,
  selectFacilitiesById,
  selectFacilitiesRatesLoaded,
  getRiskCountries,
  selectRiskCountries,
  selectPartyNotifiedUsersSorted,
  putFacilityDetails,
} from 'stores';
import * as utils from 'utils';

// mui
import { Box } from '@material-ui/core';

EditProductsFacility.propTypes = {
  facility: PropTypes.object.isRequired,
  fields: PropTypes.array.isRequired,
  options: PropTypes.shape({
    products: PropTypes.array.isRequired,
    carriers: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

EditProductsFacility.defaultProps = {
  handleClose: () => {},
};

export default function EditProductsFacility({ facility: facilityItem = {}, fields = [], options, handleClose, isRateField }) {
  const dispatch = useDispatch();
  const countryCode = useSelector(selectRiskCountries);
  const notifiedUsers = useSelector(selectPartyNotifiedUsersSorted);
  const facility = useSelector(selectFacilitiesById(facilityItem.id));
  const facilityRates = facility && facility.rates ? facility.rates : {};
  const facilityRatesLoaded = useSelector(selectFacilitiesRatesLoaded);
  const isRatesLoaded = facilityRatesLoaded && facilityRatesLoaded[facilityItem.id] && utils.generic.isValidArray(countryCode, true);

  useEffect(() => {
    if (isRateField) {
      dispatch(getFacilityRates(facilityItem.id));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      if (!utils.generic.isValidArray(countryCode, true) && isRateField) {
        dispatch(getRiskCountries());
      }
      if (!utils.generic.isValidArray(notifiedUsers, true)) {
        dispatch(getProgramUsers());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const hydrateOptions = (fields) => {
    if (!fields) return [];

    return fields.map((field) => {
      let value = facilityItem[field.name] || '';
      if (field.id === 'permissionToBindGroups' || field.id === 'permissionToDismissIssuesGroups') {
        value = value?.map((item) => {
          return field.options.find((option) => option.value === item);
        });
      }

      return {
        ...field,
        value: value,
        defaultValue: value,
        muiComponentProps: {
          ...field.muiComponentProps,
          ...(['text', 'textarea', 'number'].includes(field.type) && {
            InputProps: {
              readOnly: true,
              disabled: true,
            },
          }),
          ...(['select'].includes(field.type) && {
            disabled: true,
          }),
        },
        muiPickerProps: {
          ...field.muiPickerProps,
          ...(['date', 'datepicker'].includes(field.type) && {
            readOnly: true,
            disabled: true,
          }),
        },
        ...(field.optionsDynamicKey && {
          options: utils.form.getSelectOptions(field.optionsDynamicKey, {
            [field.optionsDynamicKey]: options[field.optionsDynamicKey],
          }),
        }),
      };
    });
  };

  const handleSubmit = (values) => {
    if (isRateField) {
      dispatch(postFacilityRates(values, facilityItem.id, facilityRates.id));
    } else {
      dispatch(putFacilityDetails(values, facilityItem.id));
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('products.admin.facilities.update'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  const validationRate = Yup.number()
    .nullable()
    .min(0)
    .max(100)
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required(utils.string.t('validation.required'));

  // show loader until rates object is loaded
  // we put this here instead of inside <EditProductsFacilityView />
  // this is to prevent the defaultValues from being initialised without necessary rates data

  if (isRateField && !isRatesLoaded)
    return (
      <Box height={300}>
        <Loader visible absolute />
      </Box>
    );

  const hasRates = facilityRates && facilityRates?.countryRates?.length;

  const ratesCountries = hasRates
    ? facilityRates?.countryRates.map((countryRate) => {
        return {
          countryCode: utils.risk.countryDetail(countryCode, countryRate.country),
          rate: countryRate.value,
          refer: countryRate.refer,
        };
      })
    : undefined;

  const ratesFields = [
    {
      id: 'brokerageFee',
      name: 'brokerageFee',
      type: 'number',
      value: facilityRates?.brokerageFee,
      label: utils.string.t('products.admin.facilities.brokerageFee'),
      validation: Yup.number()
        .nullable()
        .min(0)
        .max(100)
        .transform((value) => (Number.isNaN(value) ? null : value))
        .required(() => utils.form.getValidationLabel('products.admin.facilities.brokerageFee', 'required')),
    },
    {
      name: 'clientCommissionRate',
      type: 'number',
      label: utils.string.t('products.admin.facilities.clientCommissionRate'),
      value: facilityRates?.clientCommissionRate,
      validation: validationRate,
    },
    {
      name: 'brokerCommissionRate',
      type: 'number',
      label: utils.string.t('products.admin.facilities.brokerCommissionRate'),
      value: facilityRates?.brokerCommissionRate,
      validation: validationRate,
    },
    {
      name: 'reinsuranceRate',
      type: 'number',
      label: utils.string.t('products.admin.facilities.reinsuranceRate'),
      value: facilityRates.reinsuranceRate || 0,
      validation: validationRate,
    },
    {
      name: 'countries',
      type: 'array',
      arrayDefaultValues: ratesCountries,
      arrayItemDef: [
        {
          name: 'countryCode',
          type: 'autocompletemui',
          label: utils.string.t('app.country'),
          options: countryCode,
          value: null,
          width: 70,
        },
        {
          name: 'rate',
          type: 'number',
          label: utils.string.t('products.admin.facilities.countryRate'),
          value: 0,
          defaultValue: 0,
        },
        {
          name: 'refer',
          type: 'checkbox',
          label: utils.string.t('products.admin.facilities.referred'),
          value: false,
          defaultValue: false,
          alignCenter: true,
        },
      ],
      validation: Yup.array().of(
        Yup.object().shape({
          countryCode: Yup.object().typeError(utils.string.t('validation.required')).required(utils.string.t('validation.required')),
          rate: validationRate,
        })
      ),
    },
  ];

  return (
    <EditProductsFacilityView
      fields={{
        details: hydrateOptions([...fields]),
        rates: ratesFields,
      }}
      isRateField={isRateField}
      isRatesLoaded={isRatesLoaded}
      ratesCountries={ratesCountries}
      actions={actions}
    />
  );
}
