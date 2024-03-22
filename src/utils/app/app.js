import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// app
import * as constants from 'consts';
import * as utils from 'utils';

const utilsApp = {
  isProduction: () => {
    return !['localhost', 'edgedev1.azurewebsites.net', 'edgedev2.azurewebsites.net'].includes(window.location.hostname);
  },
  isPriceForbesProduction: () => {
    return ['edge.priceforbes.com'].includes(window.location.hostname);
  },
  isDevelopment: (vars) => {
    return vars && vars.type === 'development';
  },
  isLocalOrDev1: (vars) => {
    return vars && (vars.env === 'local' || vars.env === 'dev1');
  },

  isLocalhost: () =>
    Boolean(
      window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
    ),

  getCurrentYear: () => {
    return new Date().getFullYear();
  },

  getBrandName: (brand) => {
    if (!brand || !isString(brand)) return '';

    const defaultName = constants[`BRAND_PRICEFORBES_NAME`] || '';

    return constants[`BRAND_${brand.toUpperCase()}_NAME`] || defaultName;
  },

  getAppName: (brand) => {
    if (!brand || !isString(brand)) return '';

    const defaultName = constants[`BRAND_PRICEFORBES_APPNAME`];

    return constants[`BRAND_${brand.toUpperCase()}_APPNAME`] || defaultName;
  },

  getHostName: () => {
    return (window && get(window, 'location.hostname')) || '';
  },

  getElement: (id) => {
    if (!id || !isString(id)) return null;

    return document.body.querySelector(id);
  },
  hotjar: (id, sv) => {
    (function (h, o, t, j, a, r) {
      h.hj =
        h.hj ||
        function () {
          (h.hj.q = h.hj.q || []).push(arguments);
        };
      h._hjSettings = { hjid: id, hjsv: sv };
      h._scriptPath = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      if (!document.querySelector('script[src*="' + h._scriptPath + '"]')) {
        a = o.getElementsByTagName('head')[0];
        r = o.createElement('script');
        r.async = 1;
        r.src = h._scriptPath;
        a.appendChild(r);
      }
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');
  },

  scrollTo: (top = 0, id = null) => {
    if (!id || !isString(id)) return null;

    document.body.querySelector(id).scrollTop = top;
  },

  getEllipsisString: (fullString, ellipsisLength) => {
    if (!fullString || !ellipsisLength || isNaN(ellipsisLength) || typeof fullString !== 'string') return;
    if (fullString.length > ellipsisLength) return `${fullString && fullString.slice(0, ellipsisLength).trim()}...`;
    else return fullString;
  },

  access: {
    permissions: {
      requested: (permissions) => {
        return utils.generic.isValidArray(permissions) ? permissions : [permissions];
      },
      allowed: (feature, user) => {
        // abort
        if (!feature || !isString(feature) || !user) {
          return null;
        }

        const userPrivilege = utils.user.getPrivilege(user);

        // missing or empty privilege object
        if (!utils.generic.isValidObject(userPrivilege) || isEmpty(userPrivilege)) return null;

        return get(userPrivilege, feature);
      },
    },
    feature: (feature, permissions, user) => {
      const userPrivilege = utils.user.getPrivilege(user);

      // abort
      if (
        !user ||
        !feature ||
        !permissions ||
        !(isString(permissions) || utils.generic.isValidArray(permissions, true)) || // permissions must be a string or array
        !isString(feature) || // feature must be a string
        !utils.generic.isValidObject(userPrivilege) || // user must have privileges
        isEmpty(userPrivilege) // user must have privileges
      ) {
        return false;
      }

      // feature permissions
      const requestedPermissions = utilsApp.access.permissions.requested(permissions);
      const allowedPermissions = utilsApp.access.permissions.allowed(feature, user);

      // feature
      const isFeatureExist = Boolean(utils.generic.isValidArray(allowedPermissions));
      const isFeatureAllowed = Boolean(isFeatureExist && requestedPermissions.every((p) => allowedPermissions.includes(p)));

      return isFeatureAllowed;
    },
    route: (routeValue, user) => {
      const userRoutes = utils.user.getRoutes(user);

      // abort
      if (!user || !routeValue || !isString(routeValue) || utils.generic.isInvalidOrEmptyArray(userRoutes)) {
        return false;
      }

      // route
      const isRoute = Boolean(routeValue);
      const isRouteAllowed = Boolean(isRoute && userRoutes.includes(routeValue));

      return isRouteAllowed;
    },
  },
};

export default utilsApp;
