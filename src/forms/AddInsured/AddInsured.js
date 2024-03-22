import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { AddInsuredView } from './AddInsured.view';
import { postInsured, getRiskCountries, getClients, selectRiskCountries, selectPartyClientsSorted } from 'stores';
import { productAdminSchema } from 'schemas';
import * as utils from 'utils';

AddInsured.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func,
  reInsured: PropTypes.bool,
};

AddInsured.defaultProps = {
  handleClose: () => {},
  reInsured: false,
};

export default function AddInsured({ submitHandler, handleClose, cancelHandler, reInsured }) {
  const dispatch = useDispatch();
  const countries = useSelector(selectRiskCountries);
  const clients = useSelector(selectPartyClientsSorted);

  const [options] = useState({ countries, clients });
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
      if (!utils.generic.isValidArray(options.clients, true)) {
        dispatch(getClients({ size: 1000 }));
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const hydrateFields = (fields) => {
    if (!fields) return [];

    return fields.map((field) => ({
      ...field,
      label: utils.string.t(field.label),
      ...(field.options && { options: field.options.map((option) => ({ ...option, label: utils.string.t(option.label) })) }),
      ...(field.optionsDynamicKey && {
        options: utils.form.getSelectOptions(field.optionsDynamicKey, {
          [field.optionsDynamicKey]: options[field.optionsDynamicKey],
        }),
      }),
    }));
  };

  const handleSubmit = (values) => {
    return dispatch(postInsured(values, true, reInsured)).then((response) => {
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

  const { fields } = productAdminSchema.getSchema('insureds');

  const hydratedFields = [hydrateFields(fields)];

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('app.submit'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  return <AddInsuredView actions={actions} fields={hydratedFields} />;
}
