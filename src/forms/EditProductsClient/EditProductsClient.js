import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { EditProductsClientView } from './EditProductsClient.view';
import { postClient, getRiskCountries, getClient, selectRiskCountries } from 'stores';
import * as utils from 'utils';

import { productAdminSchema } from 'schemas';

EditProductsClient.propTypes = {
  handleClose: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  submitHandler: PropTypes.func,
};

EditProductsClient.defaultProps = {
  handleClose: () => {},
};

export default function EditProductsClient({ id, submitHandler, handleClose, isCreateClientModal = false }) {
  const dispatch = useDispatch();
  const [item, setItem] = useState(null);
  const countries = useSelector(selectRiskCountries);

  const [options, setOptions] = useState({ countries });

  const submitLabel = 'products.admin.clients.update';

  const { fields } = productAdminSchema.getSchema('clients');

  const hydrateLabels = (fields) =>
    fields.map((field) => {
      return {
        ...field,
        label: utils.string.t(field.label),
        ...(field.options && { options: field.options.map((option) => ({ ...option, label: utils.string.t(option.label) })) }),
      };
    });

  const schema = { fields: hydrateLabels(fields) };

  useEffect(
    () => {
      let isSubscribed = true;

      const fetchData = async (id) => {
        const data = await dispatch(getClient(id));
        if (data) {
          const { address, ...rest } = data;
          const insuredItem = { ...rest, ...address };

          isSubscribed && setItem(insuredItem);
        }
      };

      fetchData(id);

      return () => (isSubscribed = false);
    },
    [id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (utils.generic.isInvalidOrEmptyArray(options.countries)) {
        dispatch(getRiskCountries());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      setOptions({ countries });
    },
    [countries] // eslint-disable-line react-hooks/exhaustive-deps
  );

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
          },
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

    return dispatch(postClient(updateValues, isCreateClientModal, true)).then((response) => {
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

  const hasFields = utils.generic.isValidArray(schema.fields, true);

  // abort
  if (!hasFields || !item || utils.generic.isInvalidOrEmptyArray(options?.countries))
    return <div data-testid="empty-placeholder" style={{ minHeight: 400 }}></div>;

  const hydratedFields = [hydrateOptions(schema.fields)];

  const defaultValues = utils.form.getInitialValues(hydratedFields);

  return (
    <EditProductsClientView
      fields={hydratedFields}
      actions={actions}
      loading={false}
      defaultValues={defaultValues}
      validationSchema={utils.form.getValidationSchema(hydratedFields)}
    />
  );
}
