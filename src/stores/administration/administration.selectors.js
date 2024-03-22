import get from 'lodash/get';
import config from 'config';

export const selectAdministrationUsers = (state) => get(state, 'administration.userList.items') || [];
export const selectAdministrationUsersQuery = (state) => get(state, 'administration.userList.query') || '';
export const selectAdministrationUsersFilters = (state) => get(state, 'administration.userList.filters') || {};
export const selectAdministrationUsersPagination = (state) => {
  const userList = get(state, 'administration.userList');

  return {
    page: userList?.page - 1 || 0,
    rowsTotal: userList?.itemsTotal || 0,
    rowsPerPage: userList?.pageSize || config.ui.pagination.default,
  };
};
export const selectAdministrationUsersSort = (state) => {
  const userList = get(state, 'administration.userList');

  return {
    by: userList?.sortBy || '',
    type: userList?.sortType || '',
    direction: userList?.sortDirection || 'asc',
  };
};
export const selectAdministrationRefDataDepartments = (state) => get(state, 'administration.refData.departments') || [];
export const selectAdministrationRefDataGroups = (state) => get(state, 'administration.refData.groups') || [];
export const selectAdministrationRefDataRoles = (state) => get(state, 'administration.refData.roles') || [];
export const selectAdministrationRefDataOrganisations = (state) => get(state, 'administration.refData.organisations') || [];
