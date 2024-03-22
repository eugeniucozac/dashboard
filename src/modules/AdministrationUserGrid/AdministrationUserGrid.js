//react/redux
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import AdministrationUserGridView from './AdministrationUserGrid.view';
import { usePagination } from 'hooks';
import { selectUser } from 'stores';
import * as utils from 'utils';

AdministrationUserGrid.propTypes = {
  onCreateUser: PropTypes.func,
  confirmUserDelete: PropTypes.func,
  users: PropTypes.array.isRequired,
  usersPagination: PropTypes.object.isRequired,
  usersSort: PropTypes.object.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  onSortColumn: PropTypes.func.isRequired,
  refDataXbInstances: PropTypes.arrayOf(
    PropTypes.shape({
      sourceID: PropTypes.number.isRequired,
      sourceName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function AdministrationUserGrid({
  onCreateUser,
  confirmUserDelete,
  users,
  usersPagination,
  usersSort,
  handleChangePage,
  handleChangeRowsPerPage,
  onSortColumn,
  refDataXbInstances,
}) {
  const user = useSelector(selectUser);
  const pagination = usePagination(users, usersPagination, handleChangePage, handleChangeRowsPerPage);

  const popoverActions = [
    ...(utils.app.access.feature('admin.user', 'update', user)
      ? [
          {
            id: 'admin-edit-user',
            label: 'administration.users.edit.title',
            callback: ({ user }) => onCreateUser(user),
          },
        ]
      : []),
    ...(utils.app.access.feature('admin.user', 'delete', user)
      ? [
          {
            id: 'admin-delete-user',
            label: 'administration.users.delete.title',
            callback: ({ user }) => confirmUserDelete(user),
          },
        ]
      : []),
  ];

  return (
    <AdministrationUserGridView
      users={users}
      pagination={pagination.obj}
      sort={usersSort}
      handleChangePage={pagination.handlers.handleChangePage}
      handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
      handleSortColumn={onSortColumn}
      popoverActions={popoverActions}
      refDataXbInstances={refDataXbInstances}
    />
  );
}
