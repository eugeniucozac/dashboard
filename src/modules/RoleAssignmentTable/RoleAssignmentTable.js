import React from 'react';

//app
import { RoleAssignmentTableView } from './RoleAssignmentTable.view';
import { Translate } from 'components';

export default function RoleAssignmentTable() {
  // From here remove this static code once redux and api calls setup done
  const columns = [
    { id: 'user', label: <Translate label="admin.user" /> },
    { id: 'role', label: <Translate label="admin.role" /> },
  ];

  const usersList = [
    {
      id: 1,
      name: 'Harry Taylor',
      roles: [],
    },
    {
      id: 2,
      name: 'Oliver Smith',
      roles: [
        { id: 1, role: 'Ardonagh Sr. Claims Handler' },
        { id: 2, role: 'Ardonagh Manager' },
      ],
    },
    {
      id: 3,
      name: 'Noah Samon',
      roles: [{ id: 1, role: 'Ardonagh Jr. Claims Handler' }],
    },
    {
      id: 4,
      name: 'George Tayor',
      roles: [{ id: 1, role: 'Mphasis Jr. Claims Handler' }],
    },
    {
      id: 5,
      name: 'Thomas Smith',
      roles: [{ id: 1, role: 'Mphasis Manager' }],
    },
    {
      id: 6,
      name: 'Henry Ardwitz',
      roles: [],
    },
    {
      id: 7,
      name: 'Lily Wood',
      roles: [{ id: 1, role: 'Mphasis Manager' }],
    },
    {
      id: 8,
      name: 'Thomas Smith',
      roles: [],
    },
  ];

  const selectedUser = {
    id: 1,
    name: 'Harry Taylor',
    roles: [],
  };

  const searchSubmit = () => {};

  const searchReset = () => {};

  const handleChangePage = () => {};

  const handleChangeRowsPerPage = () => {};

  const handleCasesFilter = () => {};

  const handleCasesSort = () => {};

  const handleChoseOneCase = () => {};

  const handleRemoveRole = () => {};

  const handleAddUser = () => {};

  return (
    <RoleAssignmentTableView
      columns={columns}
      usersList={usersList}
      selectedUser={selectedUser}
      handlers={{
        searchSubmit,
        searchReset,
        handleChangePage,
        handleChangeRowsPerPage,
        handleCasesFilter,
        handleCasesSort,
        handleChoseOneCase,
        handleRemoveRole,
        handleAddUser,
      }}
      pagination={{
        page: usersList.page - 1,
        rowsTotal: usersList.itemsTotal,
        rowsPerPage: usersList.pageSize,
      }}
    />
  );
}
