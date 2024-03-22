import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// app
import get from 'lodash/get';
import { getUserList, selectRefDataDepartments, showModal, getParentOfficeListAll, sendVerificationEmail } from 'stores';
import { AdminUserView } from './AdminUser.view';
import { usePagination } from 'hooks';
import * as utils from 'utils';

export function AdminUser() {
  const userList = useSelector((state) => state.admin.userList) || {};
  const refDataDepartments = useSelector(selectRefDataDepartments);
  const [params, setParams] = useState({});
  const dispatch = useDispatch();

  const paginationObj = {
    page: userList.page - 1,
    rowsTotal: userList.itemsTotal,
    rowsPerPage: userList.pageSize,
  };

  useEffect(
    () => {
      dispatch(getUserList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      dispatch(getParentOfficeListAll());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getUserList({ ...params, page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getUserList({ ...params, size: rowsPerPage }));
  };

  const handleCreateUser = (user = {}) => {
    dispatch(
      showModal({
        component: 'ADD_EDIT_USER',
        props: {
          title: user.id ? 'admin.editUser' : 'admin.createUser',
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            user,
          },
        },
      })
    );
  };

  const handleVerifyUser = ({ id }) => {
    dispatch(sendVerificationEmail(id));
  };

  const pagination = usePagination(userList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  const fields = [
    {
      gridSize: { xs: 12, sm: 6, md: 8 },
      name: 'fullName',
      type: 'text',
      placeholder: utils.string.t('admin.searchByFullName'),
      value: '',
      muiComponentProps: {
        'data-testid': 'fullName',
      },
    },
    {
      gridSize: { xs: 12, sm: 6, md: 4 },
      name: 'department',
      type: 'autocomplete',
      placeholder: utils.string.t('admin.searchByDepartment'),
      value: [],
      options: refDataDepartments,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        'data-testid': 'department',
      },
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.filter'),
      handler: (values) => {
        const { department, ...rest } = values;
        const departmentId = get(department, 'id');
        setParams({ ...rest, ...(departmentId && { departmentId }) });
        dispatch(getUserList({ ...rest, ...(departmentId && { departmentId }) }));
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        dispatch(getUserList());
        setParams({});
      },
    },
  ];

  const popoverActions = [
    {
      id: 'admin-edit-user',
      label: 'admin.editUser',
      callback: ({ user }) => handleCreateUser(user),
    },
    {
      id: 'admin-verify-user',
      label: 'admin.sendVerificationEmail',
      callback: ({ user }) => handleVerifyUser(user),
    },
  ];

  return (
    <AdminUserView
      actions={actions}
      fields={fields}
      userList={userList.items}
      pagination={pagination.obj}
      sort={{
        by: userList.sortBy,
        type: userList.sortType,
        direction: userList.sortDirection,
      }}
      popoverActions={popoverActions}
      handleChangePage={pagination.handlers.handleChangePage}
      handleCreateUser={handleCreateUser}
      handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
      refDataDepartments={refDataDepartments}
    />
  );
}

export default AdminUser;
