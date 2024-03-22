import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';

// app
import { getMarketParentList, showModal } from 'stores';
import { AdminMarketsView } from './AdminMarkets.view';
import { usePagination } from 'hooks';
import * as utils from 'utils';

export function AdminMarkets() {
  const [selectedId, setSelectedId] = useState();
  const parentList = useSelector((state) => state.marketParent.list) || [];
  const [params, setParams] = useState({});
  const dispatch = useDispatch();

  const paginationObj = {
    page: parentList.page - 1,
    rowsTotal: parentList.itemsTotal,
    rowsPerPage: parentList.pageSize,
  };

  useEffect(
    () => {
      dispatch(getMarketParentList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (parentList.items.length === 1) {
        setSelectedId(parentList.items[0].id);
      }
    },
    [parentList.items] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleClickRow = (id) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleChangePage = (newPage) => {
    dispatch(getMarketParentList({ ...params, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getMarketParentList({ ...params, size: rowsPerPage }));
  };

  const pagination = usePagination(parentList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  const fields = [
    {
      gridSize: { xs: 12 },
      name: 'marketParent',
      type: 'autocomplete',
      placeholder: utils.string.t('admin.searchByMarketParent'),
      value: [],
      options: parentList.items,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        'data-testid': 'marketParent',
      },
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.filter'),
      handler: (values) => {
        const { marketParent } = values;
        if (!get(marketParent, 'name')) return;

        const name = get(marketParent, 'name').toLowerCase();
        setParams({ name });
        dispatch(getMarketParentList({ name }));
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        dispatch(getMarketParentList());
        setParams({});
      },
    },
  ];

  const popoverActions = [
    {
      id: 'add-edit-markets',
      label: 'admin.addEditMarkets',
      callback: ({ parent }) => handleAddEditMarkets(parent),
    },
  ];

  const handleAddEditMarkets = (marketParent) => {
    dispatch(
      showModal({
        component: 'ADD_EDIT_MARKETS',
        props: {
          title: 'admin.addEditMarkets',
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            marketParent,
          },
        },
      })
    );
  };

  return (
    <AdminMarketsView
      parents={parentList.items}
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
      popoverActions={popoverActions}
    />
  );
}

export default AdminMarkets;
