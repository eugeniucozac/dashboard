import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { EditProductsInsuredView } from './EditProductsInsured.view';
import { postInsured, getRiskCountries, getClients, getInsured, selectRiskCountries, selectPartyClientsSorted } from 'stores';
import * as utils from 'utils';

import { productAdminSchema } from 'schemas';

EditProductsInsured.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  reInsured: PropTypes.bool.isRequired,
};

EditProductsInsured.defaultProps = {
  handleClose: () => {},
  reInsured: false,
};

export default function EditProductsInsured({ id, submitHandler, handleClose, reInsured, isCreateInsuredModal = false }) {
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const countries = useSelector(selectRiskCountries);
  const clients = useSelector(selectPartyClientsSorted);

  const optionsRef = useRef({ countries, clients });
  const [options, setOptions] = useState({ countries, clients });

  const disabledFields = ['name', 'partyType', 'country'];
  const submitLabel = reInsured ? 'products.admin.reInsureds.update' : 'products.admin.insureds.update';
  const { fields } = productAdminSchema.getSchema('insureds');

  useEffect(
    () => {
      let isSubscribed = true;

      const fetchData = async (id, reInsured) => {
        const data = await dispatch(getInsured(id, reInsured));
        if (utils.generic.isValidObject(data)) {
          const { address, ...rest } = data;
          const insuredItem = { ...rest, ...address };
          isSubscribed && setItem(insuredItem);
        }
      };

      fetchData(id, reInsured);

      return () => (isSubscribed = false);
    },
    [id] // eslint-disable-line react-hooks/exhaustive-deps
  );

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

  const hydrateLabels = (fields) =>
    fields.map((field) => {
      return {
        ...field,
        label: utils.string.t(field.label),
        ...(field.options && { options: field.options.map((option) => ({ ...option, label: utils.string.t(option.label) })) }),
      };
    });

  const schema = { fields: hydrateLabels(fields) };

  const updateOptions = (key, obj) => {
    optionsRef.current = { ...optionsRef.current, [key]: obj };
    setOptions({ ...optionsRef.current, [key]: obj });
  };

  const hydrateOptions = (fields) => {
    if (!fields || !item) return [];

    const getOptionValue = (field, itemValue) => {
      const optionsList = field.optionsDynamicKey
        ? utils.form.getSelectOptions(field.optionsDynamicKey, {
            [field.optionsDynamicKey]: options[field.optionsDynamicKey],
          })
        : field?.options;
      const [result] = optionsList.filter((option) => option.value === itemValue);

      return result;
    };

    return fields?.map((field) => {
      return {
        ...field,
        value: field.type === 'autocompletemui' ? getOptionValue(field, item[field.name]) : item[field.name] || '',
        ...(field.type !== 'autocompletemui' && {
          muiComponentProps: {
            ...field.muiComponentProps,
            ...(disabledFields.includes(field.name) && {
              InputProps: {
                readOnly: true,
                disabled: true,
              },
            }),
            ...(disabledFields.includes(field.name) && {
              disabled: true,
            }),
          },
        }),
        ...(disabledFields.includes(field.name) && {
          disabled: true,
        }),
        ...(field.optionsDynamicKey && {
          options: utils.form.getSelectOptions(field.optionsDynamicKey, {
            [field.optionsDynamicKey]: options[field.optionsDynamicKey],
          }),
        }),
      };
    });
  };

  const handleSubmit = (values) => {
    const updateValues = { id: item?.id, ...values };

    return dispatch(postInsured(updateValues, isCreateInsuredModal, reInsured, true)).then((response) => {
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

  const hasFields = utils.generic.isValidArray(schema.fields);

  // abort
  if (
    !hasFields ||
    !utils.generic.isValidObject(item) ||
    utils.generic.isInvalidOrEmptyArray(options?.clients) ||
    utils.generic.isInvalidOrEmptyArray(options?.countries)
  ) {
    return <div data-testid="empty-placeholder" style={{ minHeight: 400 }}></div>;
  }
  const hydratedFields = [hydrateOptions(schema.fields)];

  const defaultValues = utils.form.getInitialValues(hydratedFields);

  return (
    <EditProductsInsuredView
      fields={hydratedFields}
      actions={actions}
      loading={false}
      defaultValues={defaultValues}
      validationSchema={utils.form.getValidationSchema(hydratedFields)}
    />
  );
}
