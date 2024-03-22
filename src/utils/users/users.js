import get from 'lodash/get';

// app
import * as utils from 'utils';

const usersUtils = {
  getWithName: (users) => {
    if (!utils.generic.isValidArray(users)) return [];

    return users.filter((userObj) => {
      const id = (userObj && get(userObj, 'id')) || '';
      const fullName = (userObj && get(userObj, 'fullName')) || '';
      const firstName = (userObj && get(userObj, 'firstName')) || '';
      const lastName = (userObj && get(userObj, 'lastName')) || '';

      const hasFullName = fullName && fullName.trim();
      const hasFirstName = firstName && firstName.trim();
      const hasLastName = lastName && lastName.trim();

      return Boolean(userObj) && Boolean(id) && (hasFullName || hasFirstName || hasLastName);
    });
  },

  getBrokers: (users, { gxbUsersIncluded, gxbUsersOnly } = {}) => {
    if (!utils.generic.isValidArray(users)) return [];

    return users.filter((userObj) => {
      const isGxb = !userObj.role;

      if (gxbUsersOnly) {
        return isGxb;
      } else if (gxbUsersIncluded) {
        return utils.user.isBroker(userObj) || (gxbUsersIncluded && isGxb);
      }

      return utils.user.isBroker(userObj);
    });
  },

  getCobrokers: (users = {}) => {
    if (!utils.generic.isValidArray(users)) return [];

    return users.filter((userObj) => utils.user.isCobroker(userObj));
  },
  filterUserList: (userList, serachVal) => {
    if ((userList && userList.length < 0) || serachVal.length < 0) return;
    else {
      return userList.filter((user) => {
        if (serachVal.length === 1 || serachVal.length === 2) {
          const isFirstName = user.firstName && user.firstName.substring(0, serachVal.length).toLowerCase() === serachVal.toLowerCase();
          const isLastName = user.lastName && user.lastName.substring(0, serachVal.length).toLowerCase() === serachVal.toLowerCase();
          const isFullName =
            user.fullName &&
            user.fullName.split(' ').find((name) => name.substring(0, serachVal.length).toLowerCase() === serachVal.toLowerCase());

          return isFirstName || isLastName || isFullName;
        } else {
          const isFirstName = user.firstName && user.firstName.toLowerCase().includes(serachVal.toLowerCase());
          const isLastName = user.lastName && user.lastName.toLowerCase().includes(serachVal.toLowerCase());
          const isFullName = user.fullName && user.fullName.toLowerCase().includes(serachVal.toLowerCase());
          return isFirstName || isLastName || isFullName;
        }
      });
    }
  },
};

export default usersUtils;
