import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { getParentOfficeList, showModal } from 'stores';
import { AdminOfficesView } from './AdminOffices.view';
import { usePagination } from 'hooks';
import * as utils from 'utils';

export function AdminOffices() {
  const [selectedId, setSelectedId] = useState();
  const parentList = useSelector((state) => state.parent.list) || [];
  const parentOfficeList = useSelector((state) => state.admin.parentOfficeList) || {};
  const [params, setParams] = useState({});
  const dispatch = useDispatch();

  const paginationObj = {
    page: parentOfficeList.page - 1,
    rowsTotal: parentOfficeList.itemsTotal,
    rowsPerPage: parentOfficeList.pageSize,
  };

  useEffect(
    () => {
      dispatch(getParentOfficeList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (parentOfficeList.items.length === 1) {
        setSelectedId(parentOfficeList.items[0].id);
      }
    },
    [parentOfficeList.items] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleClickRow = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleChangePage = (newPage) => {
    dispatch(getParentOfficeList({ ...params, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getParentOfficeList({ ...params, size: rowsPerPage }));
  };

  const pagination = usePagination(parentOfficeList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  const fields = [
    {
      gridSize: { xs: 12 },
      name: 'client',
      type: 'autocomplete',
      placeholder: utils.string.t('admin.searchByClient'),
      value: [],
      options: parentList,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        'data-testid': 'client',
      },
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.filter'),
      handler: (values) => {
        const { client } = values;
        if (!get(client, 'name')) return;

        const name = get(client, 'name').toLowerCase();
        setParams({ name });
        dispatch(getParentOfficeList({ name }));
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        dispatch(getParentOfficeList());
        setParams({});
      },
    },
  ];

  const handleCreateClientOffice = (office = {}) => {
    dispatch(
      showModal({
        component: 'ADD_EDIT_CLIENT_OFFICE',
        props: {
          title: office.id ? 'admin.editOffice' : 'admin.createOffice',
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            office,
          },
        },
      })
    );
  };

  const popoverActions = [
    {
      id: 'admin-edit-office',
      label: 'admin.editOffice',
      callback: ({ office }) => handleCreateClientOffice(office),
    },
  ];

  return (
    <AdminOfficesView
      parents={parentOfficeList.items}
      sort={{
        by: 'name',
        type: 'text',
        direction: 'asc',
      }}
      fields={fields}
      actions={actions}
      handleClickRow={handleClickRow}
      selectedId={selectedId}
      handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
      handleChangePage={pagination.handlers.handleChangePage}
      pagination={pagination.obj}
      handleCreateClientOffice={handleCreateClientOffice}
      popoverActions={popoverActions}
    />
  );
}

export default AdminOffices;
