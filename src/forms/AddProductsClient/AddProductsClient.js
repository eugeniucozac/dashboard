import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { AddProductsClientView } from './AddProductsClient.view';
import { getRiskCountries, selectRiskCountries, postClient } from 'stores';
import { productAdminSchema } from 'schemas';
import * as utils from 'utils';

AddProductsClient.propTypes = {
  fields: PropTypes.array,
  handleClose: PropTypes.func.isRequired,
};

AddProductsClient.defaultProps = {
  handleClose: () => {},
  productsAdmin: true,
};

export default function AddProductsClient({ fields, submitHandler, cancelHandler, handleClose, productsAdmin }) {
  const dispatch = useDispatch();
  const countriesLoading = useSelector((state) => state.risk.countries.loading);
  const countries = useSelector(selectRiskCountries);

  const [options, setOptions] = useState({ countries });

  useEffect(
    () => {
      if (!utils.generic.isValidArray(countries, true)) {
        dispatch(getRiskCountries());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (!countries) return;
    setOptions({ countries });
  }, [countries]);

  const hydrateOptions = (fields) => {
    if (!fields) return [];

    return fields.map((field) => ({
      ...field,
      label: utils.string.t(field.label),
      ...(field.optionsDynamicKey && {
        options: utils.form.getSelectOptions(field.optionsDynamicKey, {
          [field.optionsDynamicKey]: options[field.optionsDynamicKey],
        }),
      }),
    }));
  };

  const handleSubmit = (values) => {
    return dispatch(postClient(values, true)).then((response) => {
      const isSuccess = response && response.id && !response.ok;

      // success
      if (isSuccess && utils.generic.isFunction(submitHandler)) {
        if (utils.generic.isFunction(handleClose)) {
          handleClose();
        }
        return submitHandler(response);
      }

      // fail
      handleCancel();
    });
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(cancelHandler)) {
      cancelHandler();
    }
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const actions = [
    {
      name: 'submit',
      label: productsAdmin ? utils.string.t('products.admin.clients.create') : utils.string.t('app.submit'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  const hasFields = utils.generic.isValidArray(fields, true);

  const { fields: schemaFields } = productAdminSchema.getSchema('clients');

  const fieldsArray = hasFields ? [hydrateOptions(fields)] : [hydrateOptions(schemaFields)];

  const hasArrayFields = utils.generic.isValidArray(fieldsArray, true);

  // abort
  if (!hasArrayFields || utils.generic.isInvalidOrEmptyArray(options?.countries)) return null;

  return (
    <AddProductsClientView
      fields={fieldsArray}
      actions={actions}
      loading={countriesLoading}
      defaultValues={utils.form.getInitialValues(fieldsArray)}
      validationSchema={utils.form.getValidationSchema(fieldsArray)}
    />
  );
}
