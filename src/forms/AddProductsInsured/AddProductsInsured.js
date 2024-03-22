import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { AddProductsInsuredView } from './AddProductsInsured.view';
import { postInsured, getRiskCountries, getClients, selectRiskCountries, selectPartyClientsSorted } from 'stores';
import * as utils from 'utils';

AddProductsInsured.propTypes = {
  fields: PropTypes.array.isRequired,
  handleClose: PropTypes.func.isRequired,
  reInsured: PropTypes.bool.isRequired,
};

AddProductsInsured.defaultProps = {
  handleClose: () => {},
  reInsured: false,
};

export default function AddProductsInsured({ fields, handleClose, reInsured }) {
  const dispatch = useDispatch();
  const insuredsLoading = useSelector((state) => state.party.insureds.loading);
  const countries = useSelector(selectRiskCountries);
  const clients = useSelector(selectPartyClientsSorted);

  const optionsRef = useRef({ countries, clients });
  const [options, setOptions] = useState({ countries, clients });

  const submitLabel = reInsured ? 'products.admin.reInsureds.create' : 'products.admin.insureds.create';

  useEffect(
    () => {
      if (!utils.generic.isValidArray(options.countries, true)) {
        dispatch(getRiskCountries());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      dispatch(getClients({ size: 1000 }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (!clients) return;
    updateOptions('clients', clients);
  }, [clients]);

  useEffect(() => {
    if (!countries) return;
    updateOptions('countries', countries);
  }, [countries]);

  const updateOptions = (key, obj) => {
    optionsRef.current = { ...optionsRef.current, [key]: obj };
    setOptions({ ...optionsRef.current, [key]: obj });
  };

  const hydrateOptions = (fields) => {
    if (!fields) return [];

    return fields.map((field) => ({
      ...field,
      ...(field.optionsDynamicKey && {
        options: utils.form.getSelectOptions(field.optionsDynamicKey, {
          [field.optionsDynamicKey]: options[field.optionsDynamicKey],
        }),
      }),
    }));
  };

  const handleSubmit = (values) => {
    return dispatch(postInsured(values, false, reInsured));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const actions = [
    {
      name: 'submit',
      label: utils.string.t(submitLabel),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  const hasFields = utils.generic.isValidArray(fields, true);
  const hydratedFields = [hydrateOptions(fields)];

  // abort
  if (!hasFields || utils.generic.isInvalidOrEmptyArray(options?.clients) || utils.generic.isInvalidOrEmptyArray(options?.countries))
    return <div data-testid="empty-placeholder" style={{ minHeight: 400 }}></div>;

  return (
    <AddProductsInsuredView
      fields={hydratedFields}
      actions={actions}
      loading={insuredsLoading}
      defaultValues={utils.form.getInitialValues(hydratedFields)}
      validationSchema={utils.form.getValidationSchema(hydratedFields)}
    />
  );
}
