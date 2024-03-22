import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import {
  getUsers,
  selectRefDataXbInstances,
  selectAdministrationUsers,
  selectAdministrationUsersPagination,
  selectAdministrationUsersSort,
  selectAdministrationUsersFilters,
  resetUsers,
  selectRefDataNewBusinessProcess,
} from 'stores';
import { AccessControl, Button, TableToolbar, TableActions, TableFilters, MultiSelect } from 'components';
import { AdministrationUserGrid } from 'modules';
import { showModal, userDelete } from 'stores';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import AddIcon from '@material-ui/icons/Add';

export default function AdministrationUser() {
  const dispatch = useDispatch();

  const users = useSelector(selectAdministrationUsers);
  const usersPagination = useSelector(selectAdministrationUsersPagination);
  const usersSort = useSelector(selectAdministrationUsersSort);
  const usersFilters = useSelector(selectAdministrationUsersFilters);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const refDataBusinessProcesses = useSelector(selectRefDataNewBusinessProcess);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(
    () => {
      dispatch(getUsers());

      return () => {
        dispatch(resetUsers());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getUsers({ page: newPage + 1 }));
    setCurrentPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getUsers({ size: rowsPerPage }));
  };

  const onSortColumn = (by, dir, type) => {
    dispatch(getUsers({ sortBy: by, direction: dir, sortType: type }));
  };

  const searchSubmit = ({ search, filters }) => {
    dispatch(getUsers({ searchBy: search, filters }));
  };

  const resetSubmit = () => {
    dispatch(getUsers({ filters: {} }));
  };

  const onCreateUserClick = (user = {}) => {
    dispatch(
      showModal({
        component: 'CREATE_EDIT_USER',
        props: {
          title: user.id ? 'administration.users.edit.title' : 'administration.users.create.title',
          fullWidth: true,
          maxWidth: 'md',
          componentProps: { user },
        },
      })
    );
  };

  const confirmUserDelete = (user) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: 'administration.users.delete.title',
          maxWidth: 'xs',
          componentProps: {
            confirmMessage: utils.string.t('administration.users.delete.confirmText', { name: user.fullName }),
            submitHandler: async () => {
              await dispatch(userDelete(user));
              dispatch(getUsers({ page: currentPage }));
            },
          },
        },
      })
    );
  };

  const optionsBusinessProcess = refDataBusinessProcesses.map((bp) => ({ id: bp.businessProcessID, name: bp.businessProcessName }));
  const optionsXbInstance = refDataXbInstances
    .filter((id) => id?.edgeSourceName?.toString()?.toLowerCase() !== constants.EDGE_XB_INSTANCE.toString().toLowerCase())
    .map((xbi) => ({ id: xbi.sourceID, name: xbi.sourceName }));

  const filters = [
    {
      id: 'businessProcessIds',
      type: 'multiSelect',
      label: utils.string.t('administration.users.table.cols.businessProcess'),
      value: usersFilters?.businessProcessIds || [],
      options: optionsBusinessProcess,
      content: <MultiSelect id="businessProcessIds" search options={optionsBusinessProcess} />,
    },
    {
      id: 'xbInstanceIds',
      type: 'multiSelect',
      label: utils.string.t('administration.users.table.cols.xbInstance'),
      value: usersFilters?.xbInstanceIds || [],
      options: optionsXbInstance,
      content: <MultiSelect id="xbInstanceIds" search options={optionsXbInstance} />,
    },
  ];

  return (
    <div data-testid="administration-user">
      <TableToolbar>
        <TableActions>
          <AccessControl feature="admin.user" permissions="create">
            <Button
              icon={AddIcon}
              color="primary"
              variant="contained"
              size="small"
              text={utils.string.t('administration.users.create.createButton')}
              data-testid="admin-create-button"
              onClick={onCreateUserClick}
            />
          </AccessControl>
        </TableActions>
        <TableFilters
          search
          searchPlaceholder={utils.string.t('administration.users.searchPlaceholder')}
          filters
          filtersArray={filters}
          handlers={{
            onSearch: searchSubmit,
            onFilter: searchSubmit,
            onResetFilter: resetSubmit,
          }}
        />
      </TableToolbar>

      <AdministrationUserGrid
        onCreateUser={onCreateUserClick}
        confirmUserDelete={confirmUserDelete}
        users={users}
        usersPagination={usersPagination}
        usersSort={usersSort}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        onSortColumn={onSortColumn}
        refDataXbInstances={refDataXbInstances}
      />
    </div>
  );
}
