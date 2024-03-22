import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { AddProductsFacilityView } from './AddProductsFacility.view';
import {
  postFacility,
  getCarriers,
  getRiskProducts,
  getPricerModule,
  getProgramUsers,
  selectPartyCarriersSorted,
  selectProductsSorted,
  selectPricerModuleSorted,
  selectPartyNotifiedUsersSorted,
} from 'stores';
import * as utils from 'utils';

AddProductsFacility.propTypes = {
  fields: PropTypes.array.isRequired,
  options: PropTypes.shape({
    products: PropTypes.array.isRequired,
    carriers: PropTypes.array.isRequired,
    clients: PropTypes.array.isRequired,
  }).isRequired,
  handleClose: PropTypes.func.isRequired,
};

AddProductsFacility.defaultProps = {
  handleClose: () => {},
};

export default function AddProductsFacility({ fields, options: optionsProps, handleClose }) {
  const dispatch = useDispatch();
  const products = useSelector(selectProductsSorted);
  const carriers = useSelector(selectPartyCarriersSorted);
  const pricerModule = useSelector(selectPricerModuleSorted);
  const notifiedUsers = useSelector(selectPartyNotifiedUsersSorted);
  const productsLoading = useSelector((state) => state.risk.products.loading);
  const carriersLoading = useSelector((state) => state.party.carriers.loading);
  const programUsersLoading = useSelector((state) => state.party.notifiedUsers.loading);
  const isLoading = productsLoading || carriersLoading || programUsersLoading;

  const optionsRef = useRef({ products, carriers, pricerModule, notifiedUsers });
  const [options, setOptions] = useState({ products, carriers, pricerModule, notifiedUsers });
  const [selectedProductCode, setSelectedProductCode] = useState(null);

  useEffect(
    () => {
      if (!utils.generic.isValidArray(options.products, true)) {
        dispatch(getRiskProducts());
      }

      dispatch(getCarriers({ size: 1000 }));
      if (!utils.generic.isValidArray(options.notifiedUsers, true)) {
        dispatch(getProgramUsers());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(() => {
    if (!products) return;
    updateOptions('products', products);
  }, [products]);

  useEffect(() => {
    if (!carriers) return;
    updateOptions('carriers', carriers);
  }, [carriers]);

  useEffect(() => {
    if (!pricerModule) return;
    updateOptions('pricerModule', pricerModule);
  }, [pricerModule]);

  useEffect(() => {
    if (!notifiedUsers) return;
    updateOptions('notifiedUsers', notifiedUsers);
  }, [notifiedUsers]);

  useEffect(() => {
    if (selectedProductCode) {
      dispatch(getPricerModule(selectedProductCode));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProductCode]);

  const updateOptions = (key, obj) => {
    optionsRef.current = { ...optionsRef.current, [key]: obj };
    setOptions({ ...optionsRef.current });
  };

  const hydrateOptions = (fields) => {
    if (!fields) return [];

    return fields.map((field) => {
      return {
        ...field,
        ...(field.name === 'productCode' && {
          handleUpdate: (name, value) => {
            setSelectedProductCode(value);
          },
        }),
        muiComponentProps: {
          ...field.muiComponentProps,
          ...(field.name === 'pricerCode' &&
            !selectedProductCode && {
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
    return dispatch(postFacility(values));
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(handleClose)) {
      handleClose();
    }
  };

  const actions = [
    {
      name: 'submit',
      label: utils.string.t('products.admin.facilities.create'),
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
  if (!hasFields) return null;

  return (
    <AddProductsFacilityView
      fields={hydratedFields}
      actions={actions}
      loading={isLoading}
      defaultValues={utils.form.getInitialValues(hydratedFields)}
      validationSchema={utils.form.getValidationSchema(hydratedFields)}
    />
  );
}
