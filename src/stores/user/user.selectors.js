import get from 'lodash/get';
import { createSelector } from 'reselect';
import { selectRefDataDepartments } from 'stores';
import * as utils from 'utils';

const getXbInstanceDepts = (xbInstances) => {
  if (utils.generic.isInvalidOrEmptyArray(xbInstances)) return [];

  return xbInstances.reduce((acc, cur) => {
    return [...acc, ...(cur.department || [])];
  }, []);
};

export const selectUser = (state) => state.user;
export const selectUserAuthenticated = (state) => Boolean(get(state, 'user.auth.accessToken'));
export const selectUserAuthInProgress = (state) => Boolean(get(state, 'user.auth.inProgress'));

export const selectIsBroker = createSelector(selectUser, (user) => utils.user.isBroker(user));
export const selectIsCobroker = createSelector(selectUser, (user) => utils.user.isCobroker(user));
export const selectIsUnderwriter = createSelector(selectUser, (user) => utils.user.isUnderwriter(user));
export const selectIsAdmin = createSelector(selectUser, (user) => utils.user.isAdmin(user));

export const selectUserIsExtended = createSelector(selectUser, (user) => utils.user.isExtended(user));
export const selectUserIsCurrent = createSelector(selectUser, (user) => utils.user.isCurrentEdge(user));

export const selectUserOffices = (state) => get(state, 'user.offices') || [];
export const selectUserDetails = (state) => get(state, 'user.userDetails') || {};
export const selectUserRole = (state) => get(state, 'user.userRole') || {};
export const selectUserGroup = (state) => get(state, 'user.group') || [];
export const selectUserBusinessProcess = (state) => get(state, 'user.businessProcess') || [];
export const selectUserXbInstance = (state) => get(state, 'user.xbInstance') || [];
export const selectUserPrivilege = (state) => get(state, 'user.privilege') || {};
export const selectUserRoutes = (state) => get(state, 'user.routes') || [];
export const selectIsReportAdmin = createSelector(selectUser, (user) => utils.user.isReportAdmin(user));
export const selectUserEmail = (state) => get(state, 'user.emailId') || '';
export const selectUserOrg = (state) => get(state, 'user.organisation.name') || '';
export const selectUserName = (state) => get(state, 'user.fullName') || '';

export const selectUserDepartmentId = (state) => get(state, 'user.departmentSelected');
export const selectUserDepartmentIds = (state) => get(state, 'user.departmentIds') || [];

export const selectUserDepartment = createSelector(
  selectUserIsExtended,
  selectUserXbInstance,
  selectUserDepartmentId,
  selectRefDataDepartments,
  (isExtended, xbInstances, departmentId, departments) => {
    let depts = departments;

    if (isExtended) {
      depts = getXbInstanceDepts(xbInstances);
    } else {
      if (!departmentId || !utils.generic.isValidArray(departments)) return;
    }

    return depts.find((dept) => departmentId.toString() === dept.id.toString());
  }
);

export const selectUserDepartments = createSelector(
  selectUserIsExtended,
  selectUserXbInstance,
  selectUserDepartmentIds,
  selectRefDataDepartments,
  (isExtended, xbInstances, deptIds, refDataDepts) => {
    let depts;

    if (isExtended) {
      depts = getXbInstanceDepts(xbInstances);
    } else {
      depts = deptIds
        .map((deptId) => {
          const department = utils.referenceData.departments.getById(refDataDepts, deptId) || {};

          if (!deptId || !department.name) return null;

          return {
            id: department.id,
            name: department.name,
          };
        })
        .filter((dept) => dept);
    }

    return depts ? depts.filter((d) => d && d.id && d.name) : [];
  }
);

export const selectUserOrganisation = (state) => ({
  id: get(state, 'user.organisation.id', ''),
  name: get(state, 'user.organisation.name', ''),
});

export const selectHasUserTokenExpired = (state) => get(state, 'user.hasTokenExpired') || false;
