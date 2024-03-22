import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// app
import { ProductsAdminFacilitiesView } from './ProductsAdminFacilities.view';
import {
  selectPartyCarriersSorted,
  selectProductsSorted,
  selectPricerModuleSorted,
  getRiskFacilities,
  getCarriers,
  getRiskProducts,
  getPricerModule,
  selectFacilitiesListItems,
  selectFacilitiesPagination,
  selectPartyNotifiedUsersSorted,
  showModal,
  getProgramUsers,
} from 'stores';
import { productAdminSchema } from 'schemas';
import { usePagination } from 'hooks';
import * as utils from 'utils';

export default function ProductsAdminFacilities() {
  const dispatch = useDispatch();
  const [schema, setSchema] = useState({});
  const [options, setOptions] = useState({});
  const facilities = useSelector(selectFacilitiesListItems);
  const facilitiesLoading = useSelector((state) => state.risk.facilities.loading);
  const facilitiesPagination = useSelector(selectFacilitiesPagination);
  const carriers = useSelector(selectPartyCarriersSorted);
  const products = useSelector(selectProductsSorted);
  const pricerModule = useSelector(selectPricerModuleSorted);
  const notifiedUsers = useSelector(selectPartyNotifiedUsersSorted);
  const hydrateLabels = (fields) => fields.map((field) => ({ ...field, label: utils.string.t(field.label) }));

  useEffect(
    () => {
      dispatch(getRiskFacilities());
      dispatch(getCarriers());
      dispatch(getRiskProducts());
      dispatch(getPricerModule());
      dispatch(getProgramUsers());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!facilities) return;

      const { fields, ...rest } = productAdminSchema.getSchema('facilities');

      setSchema({
        ...rest,
        fields: hydrateLabels(fields),
        items: facilities,
        pagination: facilitiesPagination,
      });
    },
    [facilities] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!products) return;
      setOptions({ ...options, products });
    },
    [products] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!carriers) return;
      setOptions({ ...options, carriers });
    },
    [carriers] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!pricerModule) return;
      setOptions({ ...options, pricerModule });
    },
    [pricerModule] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!notifiedUsers) return;
      setOptions({ ...options, notifiedUsers });
    },
    [notifiedUsers] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getRiskFacilities({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getRiskFacilities({ size: rowsPerPage }));
  };

  const handleAddFacility = (fields) => (event) => {
    dispatch(
      showModal({
        component: 'ADD_PRODUCTS_FACILITY',
        props: {
          title: 'products.admin.facilities.add',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps: {
            fields,
            options,
          },
        },
      })
    );
  };

  const handleEditFacility = (componentProps) => {
    dispatch(
      showModal({
        component: 'EDIT_PRODUCTS_FACILITY',
        props: {
          title: componentProps?.isRateField ? 'products.admin.facilities.editRate' : 'products.admin.facilities.edit',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps,
        },
      })
    );
  };

  const handleEditFacilityLimits = (componentProps) => {
    dispatch(
      showModal({
        component: 'EDIT_PRODUCTS_FACILITY_LIMITS',
        props: {
          title: 'products.admin.facilities.editLimits',
          fullWidth: true,
          maxWidth: 'lg',
          componentProps,
        },
      })
    );
  };

  const popoverActions = [
    {
      id: 'products-admin-edit-facility-limits',
      label: 'products.admin.facilities.editLimits',
      callback: (facility) => handleEditFacilityLimits({ ...facility }),
    },
    {
      id: 'products-admin-edit-facility-rate',
      label: 'products.admin.facilities.editRate',
      callback: (facility) => handleEditFacility({ ...facility, isRateField: true }),
    },
    {
      id: 'products-admin-edit-facility',
      label: 'products.admin.facilities.edit',
      callback: (facility) => handleEditFacility({ ...facility, isRateField: false }),
    },
  ];

  const pagination = usePagination(schema.items, schema.pagination, handleChangePage, handleChangeRowsPerPage);

  // abort
  if (!schema || !schema.items) return null;

  return (
    <ProductsAdminFacilitiesView
      schema={schema}
      options={options}
      loading={facilitiesLoading}
      pagination={pagination.obj}
      popoverActions={popoverActions}
      handlers={{
        addFacility: handleAddFacility,
        changePage: pagination.handlers.handleChangePage,
        changeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
      }}
    />
  );
}
