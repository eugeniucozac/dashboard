import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// app
import { ProductsAdminCarriersView } from './ProductsAdminCarriers.view';
import { showModal, getCarriers, selectPartyCarriersSorted, selectPartyCarriersPagination } from 'stores';
import { productAdminSchema } from 'schemas';
import { usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

export default function ProductsAdminCarriers() {
  const dispatch = useDispatch();
  const [schema, setSchema] = useState({});
  const carriers = useSelector(selectPartyCarriersSorted);
  const carriersLoading = useSelector((state) => state.party.carriers.loading);
  const carriersPagination = useSelector(selectPartyCarriersPagination);
  const hydrateLabels = (fields) => fields.map((field) => ({ ...field, label: utils.string.t(field.label) }));

  useEffect(
    () => {
      dispatch(getCarriers({ size: config.ui.pagination.default }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!carriers) return;

      const { fields, ...rest } = productAdminSchema.getSchema('carriers');

      setSchema({
        ...rest,
        fields: hydrateLabels(fields),
        items: carriers,
        pagination: carriersPagination,
      });
    },
    [carriers] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getCarriers({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getCarriers({ size: rowsPerPage }));
  };

  const handleAddCarrier = (fields) => (event) => {
    dispatch(
      showModal({
        component: 'ADD_PRODUCTS_CARRIER',
        props: {
          title: 'products.admin.carriers.add',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            fields,
          },
        },
      })
    );
  };

  const pagination = usePagination(schema.items, schema.pagination, handleChangePage, handleChangeRowsPerPage);

  // abort
  if (!schema || !schema.items) return null;

  return (
    <ProductsAdminCarriersView
      schema={schema}
      loading={carriersLoading}
      pagination={pagination.obj}
      handlers={{
        addCarrier: handleAddCarrier,
        changePage: pagination.handlers.handleChangePage,
        changeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
      }}
    />
  );
}
