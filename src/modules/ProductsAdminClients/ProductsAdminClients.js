import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// app
import { ProductsAdminClientsView } from './ProductsAdminClients.view';
import { showModal, getClients, selectPartyClientsSorted, selectPartyClientsPagination, selectRiskCountries } from 'stores';
import { productAdminSchema } from 'schemas';
import { usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

export default function ProductsAdminClients() {
  const dispatch = useDispatch();
  const [schema, setSchema] = useState({});
  const clients = useSelector(selectPartyClientsSorted);
  const countries = useSelector(selectRiskCountries);
  const clientsLoading = useSelector((state) => state.party.clients.loading);
  const clientsPagination = useSelector(selectPartyClientsPagination);
  const hydrateLabels = (fields) => fields.map((field) => ({ ...field, label: utils.string.t(field.label) }));

  useEffect(
    () => {
      dispatch(getClients({ size: config.ui.pagination.default }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!clients) return;

      const { fields, ...rest } = productAdminSchema.getSchema('clients');

      setSchema({
        ...rest,
        fields: hydrateLabels(fields),
        items: clients,
        pagination: clientsPagination,
      });
    },
    [clients] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getClients({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getClients({ size: rowsPerPage }));
  };

  const handleAddClient = (fields) => (event) => {
    dispatch(
      showModal({
        component: 'ADD_PRODUCTS_CLIENT',
        props: {
          title: 'products.admin.clients.add',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            productsAdmin: true,
            fields,
          },
        },
      })
    );
  };

  const handleEditClient = (data) => {
    dispatch(
      showModal({
        component: 'EDIT_PRODUCTS_CLIENT',
        props: {
          title: 'products.admin.clients.edit',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            productsAdmin: true,
            id: data?.id,
          },
        },
      })
    );
  };

  const popoverActions = [
    {
      id: 'products-admin-edit-insured',
      label: 'products.admin.clients.edit',
      callback: (data) => handleEditClient(data),
    },
  ];

  const pagination = usePagination(schema.items, schema.pagination, handleChangePage, handleChangeRowsPerPage);

  // abort
  if (!schema || !schema.items) return null;

  return (
    <ProductsAdminClientsView
      schema={schema}
      countries={countries}
      loading={clientsLoading}
      pagination={pagination.obj}
      popoverActions={popoverActions}
      handlers={{
        addClient: handleAddClient,
        changePage: pagination.handlers.handleChangePage,
        changeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
      }}
    />
  );
}
