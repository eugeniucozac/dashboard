import * as utils from 'utils';

describe('UTILS › user', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initials', () => {
    describe('with firstName and lastName', () => {
      it('should return the initials', () => {
        const user0 = null;
        const user1 = { firstName: 'John', lastName: 'Smith' };
        const user2 = { firstName: 'John', lastName: '' };
        const user3 = { firstName: '', lastName: 'Smith' };
        const user4 = { firstName: 'John', lastName: 'Smith', fullName: 'John Smith' };
        const user5 = { firstName: 'John', lastName: '', fullName: 'John Smith' };
        const user6 = { firstName: '', lastName: 'Smith', fullName: 'John Smith' };
        const user7 = { firstName: 'John', lastName: 'Smith', emailId: 'johnsmith@abc.com' };
        const user8 = { firstName: 'John', lastName: '', emailId: 'johnsmith@abc.com' };
        const user9 = { firstName: '', lastName: 'Smith', emailId: 'johnsmith@abc.com' };
        const user10 = { firstName: 'John', lastName: 'Smith', fullName: 'John Smith', emailId: 'johnsmith@abc.com' };
        const user11 = { firstName: 'John', lastName: '', fullName: 'John Smith', emailId: 'johnsmith@abc.com' };
        const user12 = { firstName: '', lastName: 'Smith', fullName: 'John Smith', emailId: 'johnsmith@abc.com' };
        const user13 = { firstName: 'John', lastName: 'Smith', fullName: '', emailId: 'johnsmith@abc.com' };
        const user14 = { firstName: 'John', lastName: '', fullName: '', emailId: 'johnsmith@abc.com' };
        const user15 = { firstName: '', lastName: 'Smith', fullName: '', emailId: 'johnsmith@abc.com' };

        expect(utils.user.initials(user0)).toEqual('');
        expect(utils.user.initials(user1)).toEqual('JS');
        expect(utils.user.initials(user2)).toEqual('J');
        expect(utils.user.initials(user3)).toEqual('S');
        expect(utils.user.initials(user4)).toEqual('JS');
        expect(utils.user.initials(user5)).toEqual('JS');
        expect(utils.user.initials(user6)).toEqual('JS');
        expect(utils.user.initials(user7)).toEqual('JS');
        expect(utils.user.initials(user8)).toEqual('J');
        expect(utils.user.initials(user9)).toEqual('S');
        expect(utils.user.initials(user10)).toEqual('JS');
        expect(utils.user.initials(user11)).toEqual('JS');
        expect(utils.user.initials(user12)).toEqual('JS');
        expect(utils.user.initials(user13)).toEqual('JS');
        expect(utils.user.initials(user14)).toEqual('J');
        expect(utils.user.initials(user15)).toEqual('S');
      });
    });

    describe('with fullName', () => {
      it('should return the initials', () => {
        const user1 = { fullName: 'John Smith' };
        const user2 = { fullName: 'John' };
        const user3 = { fullName: 'Smith' };
        const user4 = { fullName: '' };
        const user5 = { fullName: 'John Smith', emailId: 'johnsmith@abc.com' };
        const user6 = { fullName: 'John', emailId: 'johnsmith@abc.com' };
        const user7 = { fullName: 'Smith', emailId: 'johnsmith@abc.com' };
        const user8 = { fullName: '', emailId: 'johnsmith@abc.com' };

        expect(utils.user.initials(user1)).toEqual('JS');
        expect(utils.user.initials(user2)).toEqual('J');
        expect(utils.user.initials(user3)).toEqual('S');
        expect(utils.user.initials(user4)).toEqual('');
        expect(utils.user.initials(user5)).toEqual('JS');
        expect(utils.user.initials(user6)).toEqual('J');
        expect(utils.user.initials(user7)).toEqual('S');
        expect(utils.user.initials(user8)).toEqual('J');
      });
    });

    describe('with email only', () => {
      it('should return the initials', () => {
        const user1 = { emailId: 'johnsmith@abc.com' };
        const user2 = { emailId: 'john.smith@abc.com' };
        const user3 = { emailId: 'john.smith.junior@abc.com' };
        const user4 = { emailId: 'john_smith@abc.com' };
        const user5 = { emailId: 'j@abc.com' };
        const user6 = { emailId: '' };
        const user7 = {};

        expect(utils.user.initials(user1)).toEqual('J');
        expect(utils.user.initials(user2)).toEqual('J');
        expect(utils.user.initials(user3)).toEqual('J');
        expect(utils.user.initials(user4)).toEqual('J');
        expect(utils.user.initials(user5)).toEqual('J');
        expect(utils.user.initials(user6)).toEqual('');
        expect(utils.user.initials(user7)).toEqual('');
      });
    });
  });

  describe('firstname', () => {
    it('should return the first name', () => {
      expect(utils.user.firstname()).toEqual('');
      expect(utils.user.firstname(null)).toEqual('');
      expect(utils.user.firstname([])).toEqual('');
      expect(utils.user.firstname({})).toEqual('');
      expect(utils.user.firstname({ firstName: 'John', lastName: '' })).toEqual('John');
      expect(utils.user.firstname({ firstName: '', lastName: 'Smith' })).toEqual('');
      expect(utils.user.firstname({ firstName: 'John', fullName: 'John Michael Smith' })).toEqual('John');
      expect(utils.user.firstname({ firstName: 'John', fullName: 'John Michael Smith' })).toEqual('John');
      expect(utils.user.firstname({ firstName: '', fullName: 'John Micheal Smith' })).toEqual('John');
    });
  });

  describe('fullname', () => {
    it('should return the full name', () => {
      const user0 = null;
      const user1 = { firstName: 'John', lastName: 'Smith', fullName: 'John Smith' };
      const user2 = { firstName: 'John', lastName: '', fullName: 'John Smith' };
      const user3 = { firstName: '', lastName: 'Smith', fullName: 'John Smith' };
      const user4 = { firstName: 'John', lastName: 'Smith' };
      const user5 = { firstName: 'John', lastName: '' };
      const user6 = { firstName: '', lastName: 'Smith' };
      const user7 = { firstName: 'John', lastName: 'Smith', fullName: 'John Something Smith' };
      const user8 = { firstName: '', lastName: 'Smith', fullName: 'John Something Smith' };
      const user9 = { firstName: 'John', lastName: '', fullName: 'John Something Smith' };
      const user10 = { firstName: '', lastName: '', fullName: 'John Something Smith' };

      expect(utils.user.fullname(user0)).toEqual('');
      expect(utils.user.fullname(user1)).toEqual('John Smith');
      expect(utils.user.fullname(user2)).toEqual('John Smith');
      expect(utils.user.fullname(user3)).toEqual('John Smith');
      expect(utils.user.fullname(user4)).toEqual('John Smith');
      expect(utils.user.fullname(user5)).toEqual('John');
      expect(utils.user.fullname(user6)).toEqual('Smith');
      expect(utils.user.fullname(user7)).toEqual('John Smith');
      expect(utils.user.fullname(user8)).toEqual('John Smith');
      expect(utils.user.fullname(user9)).toEqual('John Something');
      expect(utils.user.fullname(user10)).toEqual('John Something Smith');
    });
  });

  describe('isBroker', () => {
    it('should return true if user is a broker', () => {
      const user1 = { role: 'BROKER' };
      const user2 = { role: 'COBROKER' };
      const user3 = { role: 'UNDERWRITER' };
      const user4 = { role: 'FOO' };
      const user5 = { role: '' };
      const user6 = { role: ' ' };
      const user7 = { role: 1 };
      const user8 = { role: null };
      const user9 = {};

      expect(utils.user.isBroker(user1)).toBeTruthy();
      expect(utils.user.isBroker(user2)).toBeFalsy();
      expect(utils.user.isBroker(user3)).toBeFalsy();
      expect(utils.user.isBroker(user4)).toBeFalsy();
      expect(utils.user.isBroker(user5)).toBeFalsy();
      expect(utils.user.isBroker(user6)).toBeFalsy();
      expect(utils.user.isBroker(user7)).toBeFalsy();
      expect(utils.user.isBroker(user8)).toBeFalsy();
      expect(utils.user.isBroker(user9)).toBeFalsy();
    });
  });

  describe('isCobroker', () => {
    it('should return true if user is a cobroker', () => {
      const user1 = { role: 'BROKER' };
      const user2 = { role: 'COBROKER' };
      const user3 = { role: 'UNDERWRITER' };
      const user4 = { role: 'FOO' };
      const user5 = { role: '' };
      const user6 = { role: ' ' };
      const user7 = { role: 1 };
      const user8 = { role: null };
      const user9 = {};

      expect(utils.user.isCobroker(user1)).toBeFalsy();
      expect(utils.user.isCobroker(user2)).toBeTruthy();
      expect(utils.user.isCobroker(user3)).toBeFalsy();
      expect(utils.user.isCobroker(user4)).toBeFalsy();
      expect(utils.user.isCobroker(user5)).toBeFalsy();
      expect(utils.user.isCobroker(user6)).toBeFalsy();
      expect(utils.user.isCobroker(user7)).toBeFalsy();
      expect(utils.user.isCobroker(user8)).toBeFalsy();
      expect(utils.user.isCobroker(user9)).toBeFalsy();
    });
  });

  describe('isUnderwriter', () => {
    it('should return true if user is a Underwriter', () => {
      const user1 = { role: 'BROKER' };
      const user2 = { role: 'COBROKER' };
      const user3 = { role: 'UNDERWRITER' };
      const user4 = { role: 'FOO' };
      const user5 = { role: '' };
      const user6 = { role: ' ' };
      const user7 = { role: 1 };
      const user8 = { role: null };
      const user9 = {};

      expect(utils.user.isUnderwriter(user1)).toBeFalsy();
      expect(utils.user.isUnderwriter(user2)).toBeFalsy();
      expect(utils.user.isUnderwriter(user3)).toBeTruthy();
      expect(utils.user.isUnderwriter(user4)).toBeFalsy();
      expect(utils.user.isUnderwriter(user5)).toBeFalsy();
      expect(utils.user.isUnderwriter(user6)).toBeFalsy();
      expect(utils.user.isUnderwriter(user7)).toBeFalsy();
      expect(utils.user.isUnderwriter(user8)).toBeFalsy();
      expect(utils.user.isUnderwriter(user9)).toBeFalsy();
    });
  });

  describe('isAdmin', () => {
    it('should return true if user is a Admin', () => {
      const user1 = { isAdmin: 'FOO' };
      const user2 = { isAdmin: '' };
      const user3 = { isAdmin: ' ' };
      const user4 = { isAdmin: 1 };
      const user5 = { isAdmin: null };
      const user6 = { isAdmin: false };
      const user7 = { isAdmin: 'true' };

      const user8 = { isAdmin: true };

      expect(utils.user.isAdmin(user1)).toBeFalsy();
      expect(utils.user.isAdmin(user2)).toBeFalsy();
      expect(utils.user.isAdmin(user3)).toBeFalsy();
      expect(utils.user.isAdmin(user4)).toBeFalsy();
      expect(utils.user.isAdmin(user5)).toBeFalsy();
      expect(utils.user.isAdmin(user6)).toBeFalsy();
      expect(utils.user.isAdmin(user7)).toBeFalsy();
      expect(utils.user.isAdmin(user8)).toBeTruthy();
    });
  });

  describe('isExtended', () => {
    it('should return true if user is a new extended Edge user', () => {
      const user1 = {};
      const user2 = { privilege: null };
      const user3 = { privilege: {} };
      const user4 = { privilege: { id: null } };
      const user5 = { privilege: { id: 1 } };
      const user6 = { privilege: { id: 1 }, userDetails: null };
      const user7 = { privilege: { id: 1 }, userDetails: {} };
      const user8 = { privilege: { id: 1 }, userDetails: { id: null } };
      const user9 = { privilege: { id: 1 }, userDetails: { id: 1 } };
      const user10 = { privilege: { id: 1 }, routes: null, userDetails: { id: 1 } };
      const user11 = { privilege: { id: 1 }, routes: [], userDetails: { id: 1 } }; // valid
      const user12 = { privilege: { id: 1 }, routes: [1], userDetails: { id: 1 } }; // valid
      const user13 = { privilege: { id: null }, routes: null, userDetails: { id: 1 } };
      const user14 = { privilege: { id: null }, routes: [], userDetails: { id: 1 } }; // valid
      const user15 = { privilege: { id: null }, routes: [1], userDetails: { id: 1 } }; // valid
      const user16 = { privilege: {}, routes: null, userDetails: { id: 1 } };
      const user17 = { privilege: {}, routes: [], userDetails: { id: 1 } }; // valid
      const user18 = { privilege: {}, routes: [1], userDetails: { id: 1 } }; // valid
      const user19 = { privilege: {}, userDetails: { id: 1 } };
      const user20 = { privilege: null, routes: [], userDetails: { id: 1 } };

      expect(utils.user.isExtended(user1)).toBeFalsy();
      expect(utils.user.isExtended(user2)).toBeFalsy();
      expect(utils.user.isExtended(user3)).toBeFalsy();
      expect(utils.user.isExtended(user4)).toBeFalsy();
      expect(utils.user.isExtended(user5)).toBeFalsy();
      expect(utils.user.isExtended(user6)).toBeFalsy();
      expect(utils.user.isExtended(user7)).toBeFalsy();
      expect(utils.user.isExtended(user8)).toBeFalsy();
      expect(utils.user.isExtended(user9)).toBeFalsy();
      expect(utils.user.isExtended(user10)).toBeFalsy();
      expect(utils.user.isExtended(user11)).toBeTruthy(); // valid
      expect(utils.user.isExtended(user12)).toBeTruthy(); // valid
      expect(utils.user.isExtended(user13)).toBeFalsy();
      expect(utils.user.isExtended(user14)).toBeTruthy(); // valid
      expect(utils.user.isExtended(user15)).toBeTruthy(); // valid
      expect(utils.user.isExtended(user16)).toBeFalsy();
      expect(utils.user.isExtended(user17)).toBeTruthy(); // valid
      expect(utils.user.isExtended(user18)).toBeTruthy(); // valid
      expect(utils.user.isExtended(user19)).toBeFalsy();
      expect(utils.user.isExtended(user20)).toBeFalsy();
    });
  });

  describe('getLocalStorageAuth', () => {
    it('should return an empty object if "edge-auth" isn\'t found in localStorage', () => {
      expect(utils.user.getLocalStorageAuth()).toEqual({});
    });

    it('should return an empty object if "edge-auth" is empty', () => {
      localStorage.setItem('edge-auth', JSON.stringify({}));
      expect(utils.user.getLocalStorageAuth()).toEqual({});
    });

    it('should return the "edge-auth" Json object from localStorage', () => {
      localStorage.setItem('edge-auth', JSON.stringify({ foo: 1, bar: 2 }));
      expect(utils.user.getLocalStorageAuth()).toEqual({ foo: 1, bar: 2 });
    });
  });

  describe('isTokenValid', () => {
    it("should return false if token doesn't exist", () => {
      expect(utils.user.isTokenValid()).toBeFalsy();
    });

    it('should return false if token expiry date is in the past', () => {
      // arrange
      const pastTimestamp = new Date('2019').getTime();
      localStorage.setItem('edge-auth', JSON.stringify({ expiresAt: pastTimestamp }));

      // assert
      expect(utils.user.isTokenValid()).toBeFalsy();
    });

    it('should return true if token expiry date is in the future', () => {
      // arrange
      const futureTimestamp = new Date().getTime() + 60 * 60 * 1000;
      localStorage.setItem('edge-auth', JSON.stringify({ expiresAt: futureTimestamp }));

      // assert
      expect(utils.user.isTokenValid()).toBeTruthy();
    });
  });

  describe('hasToken', () => {
    it('should return false if "edge-auth" isn\'t found in localStorage', () => {
      expect(utils.user.hasToken()).toBeFalsy();
    });

    it('should return false if "edge-auth" object accessToken is not valid', () => {
      localStorage.setItem('edge-auth', JSON.stringify({}));
      expect(utils.user.hasToken()).toBeFalsy();

      localStorage.setItem('edge-auth', JSON.stringify({ foo: 123 }));
      expect(utils.user.hasToken()).toBeFalsy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 0 }));
      expect(utils.user.hasToken()).toBeFalsy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: null }));
      expect(utils.user.hasToken()).toBeFalsy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: false }));
      expect(utils.user.hasToken()).toBeFalsy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: '' }));
      expect(utils.user.hasToken()).toBeFalsy();
    });

    it('should return true if the "edge-auth" Json object has a valid token', () => {
      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 123 }));
      expect(utils.user.hasToken()).toBeTruthy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 123, foo: 456 }));
      expect(utils.user.hasToken()).toBeTruthy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 'abc' }));
      expect(utils.user.hasToken()).toBeTruthy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: true }));
      expect(utils.user.hasToken()).toBeTruthy();

      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 1 }));
      expect(utils.user.hasToken()).toBeTruthy();
    });
  });

  describe('getRoleString', () => {
    it('should return the role', () => {
      expect(utils.user.getRoleString('BROKER')).toBe('app.broker');
      expect(utils.user.getRoleString('COBROKER')).toBe('app.cobroker');
      expect(utils.user.getRoleString('UNDERWRITER')).toBe('app.underwriter');
      expect(utils.user.getRoleString('OTHER')).toBe('OTHER');
    });
  });

  describe('getRolesString', () => {
    it('should return list of roles', () => {
      expect(utils.user.getRolesString()).toEqual([
        { label: 'app.broker', value: 'BROKER' },
        { label: 'app.cobroker', value: 'COBROKER' },
        { label: 'app.underwriter', value: 'UNDERWRITER' },
      ]);
    });
  });

  describe('getLandingPage', () => {
    const user = { userDetails: { id: 2 }, privilege: {}, routes: [] };

    it('should return home page "/" for missing/invalid user object', () => {
      expect(utils.user.getLandingPage()).toEqual('/');
    });

    it('should return home page "/" for user without landingPage property', () => {
      expect(utils.user.getLandingPage({})).toEqual('/');
    });

    it('should return home page "/" for extended user without landingPage property', () => {
      expect(utils.user.getLandingPage({ userRole: { id: 1 }, userDetails: { id: 2 }, routes: [], privilege: {} })).toEqual('/');
    });

    it('should return the correct landing page for valid extended user', () => {
      expect(utils.user.getLandingPage({ ...user, landingPage: 'claimsFNOL' })).toEqual('/claims-fnol');
      expect(utils.user.getLandingPage({ ...user, landingPage: 'claimsProcessing' })).toEqual('/claims-processing');
      expect(utils.user.getLandingPage({ ...user, landingPage: 'premiumProcessing' })).toEqual('/premium-processing');
      expect(utils.user.getLandingPage({ ...user, landingPage: 'processingInstructions' })).toEqual('/processing-instructions');
      // expect(utils.user.getLandingPage({ ...user, landingPage: 'admin' })).toEqual('/admin');
    });

    it('should return home page "/" for valid extended user with invalid landing page property', () => {
      expect(utils.user.getLandingPage({ ...user, landingPage: 'foo' })).toEqual('/');
    });
  });

  describe('getRoutes', () => {
    it('should return the routes array', () => {
      expect(utils.user.getRoutes()).toEqual([]);
      expect(utils.user.getRoutes({})).toEqual([]);
      expect(utils.user.getRoutes({ routes: null })).toEqual([]);
      expect(utils.user.getRoutes({ routes: [] })).toEqual([]);
      expect(utils.user.getRoutes({ routes: [1, 2, 3] })).toEqual([1, 2, 3]);
    });
  });

  describe('getPrivilege', () => {
    it('should return the privilege object', () => {
      expect(utils.user.getPrivilege()).toEqual({});
      expect(utils.user.getPrivilege({})).toEqual({});
      expect(utils.user.getPrivilege({ privilege: null })).toEqual({});
      expect(utils.user.getPrivilege({ privilege: {} })).toEqual({});
      expect(utils.user.getPrivilege({ privilege: { id: 1 } })).toEqual({ id: 1 });
    });
  });

  // describe('department', () => {
  //   const basicUser1 = { departmentIds: [1, 2] };
  //   const basicUser2 = { departmentIds: [1] };
  //   const basicUser3 = { departmentIds: [] };
  //   const basicUser4 = {};

  //   const extendedUser = { userDetails: { id: 1 }, privilege: {}, routes: [] };

  //   describe('getAll', () => {
  //     describe('basic user', () => {
  //       it('should return all the department IDs', () => {
  //         expect(utils.user.department.getAll(basicUser1)).toEqual([1, 2]);
  //         expect(utils.user.department.getAll(basicUser2)).toEqual([1]);
  //         expect(utils.user.department.getAll(basicUser3)).toEqual([]);
  //         expect(utils.user.department.getAll(basicUser4)).toEqual([]);
  //       });
  //     });

  //     describe('extended user', () => {
  //       const extendedUser1 = {
  //         ...extendedUser,
  //         departmentIds: [1],
  //         xbInstance: [
  //           {
  //             id: 1,
  //             department: [
  //               { id: '4-1', name: 'four' },
  //               { id: '5-1', name: 'five' },
  //             ],
  //           },
  //           { id: 2, department: [{ id: '6-2', name: 'six' }] },
  //         ],
  //       };
  //       const extendedUser2 = {
  //         ...extendedUser,
  //         departmentIds: [1],
  //         xbInstance: [{ id: 1, department: [{ id: '4-1', name: 'four' }] }],
  //       };
  //       const extendedUser3 = {
  //         ...extendedUser,
  //         departmentIds: [1],
  //         xbInstance: [{ id: 1, department: [] }],
  //       };
  //       const extendedUser4 = { ...extendedUser, departmentIds: [1], xbInstance: [] };

  //       it('should return all the department IDs', () => {
  //         expect(utils.user.department.getAll(extendedUser1)).toEqual([
  //           { id: '4-1', name: 'four' },
  //           { id: '5-1', name: 'five' },
  //           { id: '6-2', name: 'six' },
  //         ]);
  //         expect(utils.user.department.getAll(extendedUser2)).toEqual([{ id: '4-1', name: 'four' }]);
  //         expect(utils.user.department.getAll(extendedUser3)).toEqual([]);
  //         expect(utils.user.department.getAll(extendedUser4)).toEqual([]);
  //       });
  //     });
  //   });

  //   describe('getDefault', () => {
  //     describe('basic user', () => {
  //       it('should return the user default department without localStorage', () => {
  //         expect(utils.user.department.getDefault(basicUser1)).toEqual(1);
  //         expect(utils.user.department.getDefault(basicUser2)).toEqual(1);
  //         expect(utils.user.department.getDefault(basicUser3)).toBeFalsy();
  //       });

  //       it('should return the user default department from localStorage if value is defined', () => {
  //         localStorage.setItem('edge-department', '5');
  //         expect(utils.user.department.getDefault(basicUser1)).toEqual(5);
  //         expect(utils.user.department.getDefault(basicUser2)).toEqual(5);
  //         expect(utils.user.department.getDefault(basicUser3)).toEqual(5);
  //         expect(utils.user.department.getDefault(basicUser4)).toEqual(5);
  //       });
  //     });

  //     describe('extended user', () => {
  //       const extendedUser1 = { ...extendedUser, departmentIds: ['4-1', '5-1', '6-2'] };
  //       const extendedUser2 = { ...extendedUser, departmentIds: ['4-1'] };
  //       const extendedUser3 = { ...extendedUser, departmentIds: [] };
  //       const extendedUser4 = { ...extendedUser };

  //       it('should return the user default department without localStorage', () => {
  //         expect(utils.user.department.getDefault(extendedUser1)).toEqual('4-1');
  //         expect(utils.user.department.getDefault(extendedUser2)).toEqual('4-1');
  //         expect(utils.user.department.getDefault(extendedUser3)).toBeFalsy();
  //         expect(utils.user.department.getDefault(extendedUser4)).toBeFalsy();
  //       });

  //       it('should return the user default department from localStorage if value is defined', () => {
  //         localStorage.setItem('edge-department', '5-1');
  //         expect(utils.user.department.getDefault(extendedUser1)).toEqual('5-1');
  //         expect(utils.user.department.getDefault(extendedUser2)).toEqual('5-1');
  //         expect(utils.user.department.getDefault(extendedUser3)).toEqual('5-1');
  //         expect(utils.user.department.getDefault(extendedUser4)).toEqual('5-1');
  //       });
  //     });
  //   });

  //   describe('getCurrent', () => {
  //     it('should return the selected department', () => {
  //       const user1 = { departmentSelected: 1 };
  //       const user2 = { departmentSelected: null };
  //       const user3 = {};

  //       expect(utils.user.department.getCurrent(user1)).toEqual(1);
  //       expect(utils.user.department.getCurrent(user2)).toBeFalsy();
  //       expect(utils.user.department.getCurrent(user3)).toBeFalsy();
  //     });
  //   });
  // });
});
