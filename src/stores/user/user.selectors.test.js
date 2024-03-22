import {
  selectUser,
  selectUserAuthenticated,
  selectUserAuthInProgress,
  selectIsBroker,
  selectIsCobroker,
  selectIsUnderwriter,
  selectIsAdmin,
  selectUserIsExtended,
  selectUserOffices,
  selectUserDetails,
  selectUserRole,
  selectUserGroup,
  selectUserBusinessProcess,
  selectUserXbInstance,
  selectUserPrivilege,
  selectUserRoutes,
  selectUserDepartment,
  selectUserDepartmentId,
  selectUserDepartmentIds,
} from 'stores';

describe('STORES › SELECTORS › user', () => {
  it('selectUser', () => {
    // assert
    expect(selectUser({})).toEqual(undefined);
    expect(selectUser({ user: {} })).toEqual({});
    expect(selectUser({ user: { id: 1, role: 'BROKER' } })).toEqual({ id: 1, role: 'BROKER' });
  });

  it('selectUserAuthenticated', () => {
    // assert
    expect(selectUserAuthenticated({})).toBeFalsy();
    expect(selectUserAuthenticated({ user: {} })).toBeFalsy();
    expect(selectUserAuthenticated({ user: { auth: {} } })).toBeFalsy();
    expect(selectUserAuthenticated({ user: { auth: { accessToken: null } } })).toBeFalsy();
    expect(selectUserAuthenticated({ user: { auth: { accessToken: 1 } } })).toBeTruthy();
    expect(selectUserAuthenticated({ user: { auth: { accessToken: 'abc' } } })).toBeTruthy();
    expect(selectUserAuthenticated({ user: { auth: { accessToken: true } } })).toBeTruthy();
  });

  it('selectUserAuthInProgress', () => {
    // assert
    expect(selectUserAuthInProgress({})).toBeFalsy();
    expect(selectUserAuthInProgress({ user: {} })).toBeFalsy();
    expect(selectUserAuthInProgress({ user: { auth: {} } })).toBeFalsy();
    expect(selectUserAuthInProgress({ user: { auth: { inProgress: null } } })).toBeFalsy();
    expect(selectUserAuthInProgress({ user: { auth: { inProgress: 1 } } })).toBeTruthy();
    expect(selectUserAuthInProgress({ user: { auth: { inProgress: 'abc' } } })).toBeTruthy();
    expect(selectUserAuthInProgress({ user: { auth: { inProgress: true } } })).toBeTruthy();
  });

  it('selectIsBroker', () => {
    // assert
    expect(selectIsBroker({})).toBeFalsy();
    expect(selectIsBroker({ user: {} })).toBeFalsy();
    expect(selectIsBroker({ user: { role: null } })).toBeFalsy();
    expect(selectIsBroker({ user: { role: '' } })).toBeFalsy();
    expect(selectIsBroker({ user: { role: 'foo' } })).toBeFalsy();
    expect(selectIsBroker({ user: { role: 'broker' } })).toBeFalsy();
    expect(selectIsBroker({ user: { role: 'COBROKER' } })).toBeFalsy();
    expect(selectIsBroker({ user: { role: 'UNDERWRITER' } })).toBeFalsy();
    expect(selectIsBroker({ user: { role: 'BROKER' } })).toBeTruthy();
  });

  it('selectIsCobroker', () => {
    // assert
    expect(selectIsCobroker({})).toBeFalsy();
    expect(selectIsCobroker({ user: {} })).toBeFalsy();
    expect(selectIsCobroker({ user: { role: null } })).toBeFalsy();
    expect(selectIsCobroker({ user: { role: '' } })).toBeFalsy();
    expect(selectIsCobroker({ user: { role: 'foo' } })).toBeFalsy();
    expect(selectIsCobroker({ user: { role: 'cobroker' } })).toBeFalsy();
    expect(selectIsCobroker({ user: { role: 'BROKER' } })).toBeFalsy();
    expect(selectIsCobroker({ user: { role: 'COBROKER' } })).toBeTruthy();
    expect(selectIsCobroker({ user: { role: 'UNDERWRITER' } })).toBeFalsy();
  });

  it('selectIsUnderwriter', () => {
    // assert
    expect(selectIsUnderwriter({})).toBeFalsy();
    expect(selectIsUnderwriter({ user: {} })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: null } })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: '' } })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: 'foo' } })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: 'cobroker' } })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: 'BROKER' } })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: 'COBROKER' } })).toBeFalsy();
    expect(selectIsUnderwriter({ user: { role: 'UNDERWRITER' } })).toBeTruthy();
  });

  it('selectIsAdmin', () => {
    // assert
    expect(selectIsAdmin({})).toBeFalsy();
    expect(selectIsAdmin({ user: {} })).toBeFalsy();
    expect(selectIsAdmin({ user: { isAdmin: null } })).toBeFalsy();
    expect(selectIsAdmin({ user: { isAdmin: '' } })).toBeFalsy();
    expect(selectIsAdmin({ user: { isAdmin: 'foo' } })).toBeFalsy();
    expect(selectIsAdmin({ user: { isAdmin: 'true' } })).toBeFalsy();
    expect(selectIsAdmin({ user: { isAdmin: 'yes' } })).toBeFalsy();
    expect(selectIsAdmin({ user: { isAdmin: true } })).toBeTruthy();
  });

  it('selectUserIsExtended', () => {
    // assert
    expect(selectUserIsExtended({})).toBeFalsy();
    expect(selectUserIsExtended({ user: {} })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: null } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {} } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, userDetails: null } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, userDetails: {} } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, userDetails: { id: null } } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, userDetails: { id: 1 } } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, userDetails: { id: 1 }, routes: null } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, userDetails: { id: 1 }, routes: [] } })).toBeTruthy(); // valid
    expect(selectUserIsExtended({ user: { privilege: { id: 1 }, userDetails: { id: 1 } } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: { id: 1 }, userDetails: { id: 1 }, routes: null } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: { id: 1 }, userDetails: { id: 1 }, routes: [] } })).toBeTruthy(); // valid
    expect(selectUserIsExtended({ user: { privilege: { id: null }, userDetails: { id: 1 } } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: { id: null }, userDetails: { id: 1 }, routes: null } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: { id: null }, userDetails: { id: 1 }, routes: [] } })).toBeTruthy(); // valid
    expect(selectUserIsExtended({ user: { privilege: null, userDetails: { id: 1 }, routes: [] } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { userDetails: { id: 1 }, routes: [] } })).toBeFalsy();
    expect(selectUserIsExtended({ user: { privilege: {}, routes: [] } })).toBeFalsy();
  });

  it('selectUserOffices', () => {
    // assert
    expect(selectUserOffices({})).toEqual([]);
    expect(selectUserOffices({ user: {} })).toEqual([]);
    expect(selectUserOffices({ user: { offices: null } })).toEqual([]);
    expect(selectUserOffices({ user: { offices: [] } })).toEqual([]);
    expect(selectUserOffices({ user: { offices: [1, 2, 3] } })).toEqual([1, 2, 3]);
  });

  it('selectUserDetails', () => {
    // assert
    expect(selectUserDetails({})).toEqual({});
    expect(selectUserDetails({ user: {} })).toEqual({});
    expect(selectUserDetails({ user: { userDetails: null } })).toEqual({});
    expect(selectUserDetails({ user: { userDetails: {} } })).toEqual({});
    expect(selectUserDetails({ user: { userDetails: { id: 1 } } })).toEqual({ id: 1 });
  });

  it('selectUserRole', () => {
    // assert
    expect(selectUserRole({})).toEqual({});
    expect(selectUserRole({ user: {} })).toEqual({});
    expect(selectUserRole({ user: { userRole: null } })).toEqual({});
    expect(selectUserRole({ user: { userRole: {} } })).toEqual({});
    expect(selectUserRole({ user: { userRole: { id: 2 } } })).toEqual({ id: 2 });
  });

  it('selectUserGroup', () => {
    // assert
    expect(selectUserGroup({})).toEqual([]);
    expect(selectUserGroup({ user: {} })).toEqual([]);
    expect(selectUserGroup({ user: { group: null } })).toEqual([]);
    expect(selectUserGroup({ user: { group: [] } })).toEqual([]);
    expect(selectUserGroup({ user: { group: [1, 2] } })).toEqual([1, 2]);
  });

  it('selectUserBusinessProcess', () => {
    // assert
    expect(selectUserBusinessProcess({})).toEqual([]);
    expect(selectUserBusinessProcess({ user: {} })).toEqual([]);
    expect(selectUserBusinessProcess({ user: { businessProcess: null } })).toEqual([]);
    expect(selectUserBusinessProcess({ user: { businessProcess: [] } })).toEqual([]);
    expect(selectUserBusinessProcess({ user: { businessProcess: [1, 2, 3, 4] } })).toEqual([1, 2, 3, 4]);
  });

  it('selectUserXbInstance', () => {
    // assert
    expect(selectUserXbInstance({})).toEqual([]);
    expect(selectUserXbInstance({ user: {} })).toEqual([]);
    expect(selectUserXbInstance({ user: { xbInstance: null } })).toEqual([]);
    expect(selectUserXbInstance({ user: { xbInstance: [] } })).toEqual([]);
    expect(selectUserXbInstance({ user: { xbInstance: [1, 2, 3] } })).toEqual([1, 2, 3]);
  });

  it('selectUserPrivilege', () => {
    // assert
    expect(selectUserPrivilege({})).toEqual({});
    expect(selectUserPrivilege({ user: {} })).toEqual({});
    expect(selectUserPrivilege({ user: { privilege: null } })).toEqual({});
    expect(selectUserPrivilege({ user: { privilege: {} } })).toEqual({});
    expect(selectUserPrivilege({ user: { privilege: { id: 3 } } })).toEqual({ id: 3 });
  });

  it('selectUserRoutes', () => {
    // assert
    expect(selectUserRoutes({})).toEqual([]);
    expect(selectUserRoutes({ user: {} })).toEqual([]);
    expect(selectUserRoutes({ user: { routes: null } })).toEqual([]);
    expect(selectUserRoutes({ user: { routes: [] } })).toEqual([]);
    expect(selectUserRoutes({ user: { routes: [1, 2] } })).toEqual([1, 2]);
  });

  it('selectUserDepartmentId', () => {
    // assert
    expect(selectUserDepartmentId({})).toEqual(undefined);
    expect(selectUserDepartmentId({ user: {} })).toEqual(undefined);
    expect(selectUserDepartmentId({ user: { departmentSelected: null } })).toEqual(null);
    expect(selectUserDepartmentId({ user: { departmentSelected: 'foo' } })).toEqual('foo');
    expect(selectUserDepartmentId({ user: { departmentSelected: 1 } })).toEqual(1);
  });

  it('selectUserDepartmentIds', () => {
    // assert
    expect(selectUserDepartmentIds({})).toEqual([]);
    expect(selectUserDepartmentIds({ user: {} })).toEqual([]);
    expect(selectUserDepartmentIds({ user: { departmentIds: null } })).toEqual([]);
    expect(selectUserDepartmentIds({ user: { departmentIds: [] } })).toEqual([]);
    expect(selectUserDepartmentIds({ user: { departmentIds: [1, 2, 3] } })).toEqual([1, 2, 3]);
  });

  it('selectUserDepartment', () => {
    // arrange
    const user = { departmentSelected: 1 };
    const referenceData = {
      departments: [
        { id: 1, foo: 'bar' },
        { id: 2, foo: 'bar' },
      ],
    };

    // assert
    expect(selectUserDepartment({})).toEqual(undefined);
    expect(selectUserDepartment({ referenceData: {} })).toEqual(undefined);
    expect(selectUserDepartment({ referenceData: { departments: [{ id: 1, foo: 'bar' }] } })).toEqual(undefined);
    expect(selectUserDepartment({ user })).toEqual(undefined);
    expect(selectUserDepartment({ user, referenceData })).toEqual({ id: 1, foo: 'bar' });
  });
});
