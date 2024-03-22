import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { AddProductsCarrierView } from './AddProductsCarrier.view';
import { postCarrier } from 'stores';
import { productAdminSchema } from 'schemas';
import * as utils from 'utils';

AddProductsCarrier.propTypes = {
  fields: PropTypes.array,
  handleClose: PropTypes.func.isRequired,
};

AddProductsCarrier.defaultProps = {
  handleClose: () => {},
};

export default function AddProductsCarrier({ fields, submitHandler, cancelHandler, handleClose }) {
  const dispatch = useDispatch();
  const carriersLoading = useSelector((state) => state.party.carriers.loading);
  const hydrateLabels = (fields) => fields.map((field) => ({ ...field, label: utils.string.t(field.label) }));

  const handleSubmit = (values) => {
    return dispatch(postCarrier(values, true)).then((response) => {
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
      label: utils.string.t('products.admin.carriers.create'),
      handler: handleSubmit,
    },
    {
      name: 'cancel',
      label: utils.string.t('app.cancel'),
      handler: handleCancel,
    },
  ];

  const hasFields = utils.generic.isValidArray(fields, true);

  const { fields: schemaFields } = productAdminSchema.getSchema('carriers');

  const fieldsArray = hasFields ? [fields] : [hydrateLabels(schemaFields)];

  const hasArrayFields = utils.generic.isValidArray(fieldsArray, true);

  // abort
  if (!hasArrayFields) return null;

  return (
    <AddProductsCarrierView
      fields={fieldsArray}
      actions={actions}
      loading={carriersLoading}
      defaultValues={utils.form.getInitialValues(fieldsArray)}
      validationSchema={utils.form.getValidationSchema(fieldsArray)}
    />
  );
}
