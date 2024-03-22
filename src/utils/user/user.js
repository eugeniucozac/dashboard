import get from 'lodash/get';
import isInteger from 'lodash/isInteger';

// app
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';

// private
const userRoleObj = () => {
  return {
    [constants.ROLE_BROKER]: utils.string.t('app.broker'),
    [constants.ROLE_COBROKER]: utils.string.t('app.cobroker'),
    [constants.ROLE_UNDERWRITER]: utils.string.t('app.underwriter'),
  };
};

const utilsUser = {
  initials: (userObj) => {
    if (!userObj) return '';

    const { firstName, lastName, fullName } = userObj;
    let first = '';
    let last = '';

    // as a fallback, we take the 1st letter of the email
    first = userObj.emailId ? userObj.emailId.slice(0, 1) : '';

    // then, we try to get 1 or both initials from the full name
    if (fullName) {
      const parts = fullName.split(' ');

      first = parts[0] ? parts[0].slice(0, 1) : first;
      last = parts[1] ? parts[1].slice(0, 1) : last;

      // if we have fullname AND first/last names (only overwrite missing values)
      if (firstName) {
        first = firstName.slice(0, 1);
      }

      if (lastName) {
        last = lastName.slice(0, 1);
      }
    } else {
      // if we have first/last names, we take those values (and overwrite email fallback)
      if (firstName || lastName) {
        first = firstName ? firstName.slice(0, 1) : '';
        last = lastName ? lastName.slice(0, 1) : '';
      }
    }

    return (first + last).toUpperCase();
  },

  firstname: (userObj) => {
    if (!userObj) return '';

    const { firstName, fullName } = userObj;

    // if there is a firstName, return that
    if (firstName) {
      return firstName;
    }

    // if there's no firstName, we try to get the 1st part of the fullName
    if (fullName) {
      const parts = fullName.split(' ');

      return parts[0] || '';
    }

    return '';
  },

  fullname: (userObj) => {
    if (!userObj) return '';

    const { firstName, lastName, fullName } = userObj;
    let first = '';
    let last = '';

    // as a fallback, we take parts from the fullname
    if (fullName) {
      const parts = fullName.split(' ');

      first = parts[0] ? parts[0] : first;
      last = parts[1] ? parts[1] : last;
    }

    // then we check if we have first and last name values
    if (firstName) first = firstName;
    if (lastName) last = lastName;

    // if there's no firstName AND no lastName, we take the whole fullName if present
    if (!firstName && !lastName) {
      return fullName || '';
    }

    return [first, last].filter(Boolean).join(' ');
  },

  isLoaded: (userObj) => {
    return Boolean(userObj && userObj.id);
  },

  isBroker: (userObj) => {
    return userObj && Boolean(userObj.role) && userObj.role === constants.ROLE_BROKER;
  },

  isSeniorManager: (userObj) => {
    return userObj && userObj.name && Boolean(userObj.name === constants.SENIOR_MANAGER);
  },

  isAdminUser: (userObj) => {
    return userObj && userObj.name && userObj.name === constants.ADMIN;
  },

  isCobroker: (userObj) => {
    return userObj && Boolean(userObj.role && userObj.role === constants.ROLE_COBROKER);
  },

  isUnderwriter: (userObj) => {
    return userObj && Boolean(userObj.role && userObj.role === constants.ROLE_UNDERWRITER);
  },

  isJuniorTechnician: (userObj) => {
    return userObj && userObj.name && Boolean(userObj.name === constants.ROLE_JUNIOR_TECHNICIAN);
  },

  isSeniorTechnician: (userObj) => {
    return userObj && userObj.name && Boolean(userObj.name === constants.ROLE_SENIOR_TECHNICIAN);
  },

  isTechnicianManager: (userObj) => {
    return userObj && userObj.name && Boolean(userObj.name === constants.ROLE_TECHNICIAN_MANAGER);
  },

  isTechnicianMphasis: (userObj) => {
    return userObj && userObj.name && Boolean(userObj.name === constants.TECHNICIAN_MPHASIS);
  },

  isTechnicianArdonagh: (userObj) => {
    return userObj && userObj.name && Boolean(userObj.name === constants.TECHNICIAN_ARDONAGH);
  },

  isAdmin: (userObj) => {
    return userObj && userObj.isAdmin === true;
  },

  isReportAdmin: (userObj) => {
    return userObj && userObj.isReportAdmin === true;
  },

  isExtended: (userObj) => {
    return Boolean(userObj?.privilege && userObj?.routes && userObj?.userDetails?.id);
  },

  isCurrentEdge: (userObj) => {
    return Boolean(userObj?.departmentIds && userObj?.role && userObj?.id);
  },

  getLocalStorageAuth: () => {
    const storage = localStorage && localStorage.getItem('edge-auth');
    return storage ? JSON.parse(storage) : {};
  },

  isTokenValid: () => {
    const { expiresAt } = utilsUser.getLocalStorageAuth();
    const now = new Date();

    return expiresAt && expiresAt > now.getTime();
  },

  hasToken: () => {
    const auth = utilsUser.getLocalStorageAuth();

    return Boolean(auth.accessToken);
  },

  getRolesString: () => {
    const roles = userRoleObj();
    return Object.keys(roles).map((key) => ({
      value: key,
      label: roles[key],
    }));
  },

  getRoleString: (role) => {
    return userRoleObj()[role] || role;
  },

  getLandingPage: (userObj) => {
    const routeHome = config.routes.home.root;

    // abort
    if (!userObj || !userObj.landingPage) return routeHome;

    const route = config.routes[userObj.landingPage]?.root || routeHome;
    const final = utilsUser.isExtended(userObj) ? route : routeHome;

    return final;
  },

  getRoutes: (userObj) => {
    return userObj?.routes || [];
  },

  getPrivilege: (userObj) => {
    return userObj?.privilege || {};
  },

  department: {
    getAll: (userObj) => {
      if (!userObj) return [];

      // load Extended user departments if it is EXTENDED user
      if (utilsUser.isExtended(userObj) && !utilsUser.isCurrentEdge(userObj)) {
        if (utils.generic.isInvalidOrEmptyArray(userObj.xbInstance)) return [];
        return userObj.xbInstance.reduce((acc, cur) => {
          return [...acc, ...(cur.department || [])];
        }, []);
      }

      if (
        (utilsUser.isCurrentEdge(userObj) && !utilsUser.isExtended(userObj)) || // load Current user departments if it is CURRENT user
        (utilsUser.isCurrentEdge(userObj) && utilsUser.isExtended(userObj)) // load Current user departments if it is both CURRENT & EXTENDED user
      ) {
        if (utils.generic.isInvalidOrEmptyArray(userObj.departmentIds)) return [];
        return get(userObj, 'departmentIds', []);
      }
    },

    getDefault: (userObj) => {
      if (utilsUser.isExtended(userObj) && !utilsUser.isCurrentEdge(userObj)) {
        const defaultDepartment = userObj && get(userObj, 'departmentIds[0]', '').toString();
        const savedDepartment = (localStorage.getItem('edge-department') || '').toString();
        const deptId = savedDepartment || defaultDepartment;

        return deptId || null;
      }
      if (
        (!utilsUser.isExtended(userObj) && utilsUser.isCurrentEdge(userObj)) ||
        (utilsUser.isExtended(userObj) && utilsUser.isCurrentEdge(userObj))
      ) {
        const currentEdgeDefaultDepartment = userObj && parseInt(get(userObj, 'departmentIds[0]'));
        const currentEdgeSavedDepartment = parseInt(localStorage.getItem('edge-department'));
        const currentEdgeDeptId = currentEdgeSavedDepartment || currentEdgeDefaultDepartment;

        return isInteger(currentEdgeDeptId) ? currentEdgeDeptId : null;
      }
    },

    getCurrent: (userObj) => {
      if (!userObj || !get(userObj, 'departmentSelected')) return;

      return get(userObj, 'departmentSelected');
    },
  },
};

export default utilsUser;
