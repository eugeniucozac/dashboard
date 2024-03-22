import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// app
import { ProductsAdminInsuredsView } from './ProductsAdminInsureds.view';
import {
  showModal,
  getRiskCountries,
  getInsureds,
  getReinsureds,
  getClients,
  selectRiskCountries,
  selectPartyInsuredsSorted,
  selectPartyInsuredsPagination,
  selectPartyReinsuredsSorted,
  selectPartyReInsuredsPagination,
  selectPartyClientsSorted,
} from 'stores';
import { productAdminSchema } from 'schemas';
import { usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

export default function ProductsAdminInsureds({ reInsured = false }) {
  const dispatch = useDispatch();
  const [schema, setSchema] = useState({});
  const [options, setOptions] = useState({});
  const insureds = useSelector(reInsured ? selectPartyReinsuredsSorted : selectPartyInsuredsSorted);
  const insuredsLoading = useSelector((state) => state.party.insureds.loading);
  const insuredsPagination = useSelector(reInsured ? selectPartyReInsuredsPagination : selectPartyInsuredsPagination);
  const countries = useSelector(selectRiskCountries);
  const clients = useSelector(selectPartyClientsSorted);

  const addLabel = reInsured ? 'products.admin.reInsureds.add' : 'products.admin.insureds.add';
  const editLabel = reInsured ? 'products.admin.reInsureds.edit' : 'products.admin.insureds.edit';
  const getData = reInsured ? getReinsureds : getInsureds;

  const hydrateLabels = (fields) =>
    fields.map((field) => {
      return {
        ...field,
        label: utils.string.t(field.label),
        ...(field.options && { options: field.options.map((option) => ({ ...option, label: utils.string.t(option.label) })) }),
      };
    });

  useEffect(
    () => {
      dispatch(getRiskCountries());
      dispatch(getClients({ size: 1000 }));
      dispatch(getData({ size: config.ui.pagination.default }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!clients) return;
      setOptions({ ...options, clients });
    },
    [clients] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!insureds) return;

      const { fields, ...rest } = productAdminSchema.getSchema('insureds');

      setSchema({
        ...rest,
        fields: hydrateLabels(fields),
        items: insureds,
        pagination: insuredsPagination,
      });
    },
    [insureds] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getData({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getData({ size: rowsPerPage }));
  };

  const handleAddInsured = (fields) => (event) => {
    dispatch(
      showModal({
        component: 'ADD_PRODUCTS_INSURED',
        props: {
          title: addLabel,
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            fields,
            reInsured,
          },
        },
      })
    );
  };

  const handleEditInsured = (data) => {
    const { fields, item } = data;
    const { address } = item;
    const insuredItem = { ...item, ...address };
    dispatch(
      showModal({
        component: 'EDIT_PRODUCTS_INSURED',
        props: {
          title: editLabel,
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            fields,
            item: insuredItem,
            id: insuredItem?.id,
            reInsured,
          },
        },
      })
    );
  };

  const popoverActions = [
    {
      id: 'products-admin-edit-insured',
      label: editLabel,
      callback: (data) => handleEditInsured(data),
    },
  ];

  const pagination = usePagination(schema.items, schema.pagination, handleChangePage, handleChangeRowsPerPage);

  // abort
  if (!schema || !schema.items) return null;

  return (
    <ProductsAdminInsuredsView
      schema={schema}
      loading={insuredsLoading}
      countries={countries}
      options={options}
      pagination={pagination.obj}
      buttonLabel={addLabel}
      reInsured={reInsured}
      popoverActions={popoverActions}
      handlers={{
        addInsured: handleAddInsured,
        changePage: pagination.handlers.handleChangePage,
        changeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
      }}
    />
  );
}
