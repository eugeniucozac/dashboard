import * as utils from 'utils';
import uniqBy from 'lodash/uniqBy';

const utilsTrip = {
  getDateFrom: (visits) => {
    if (!visits || !utils.generic.isValidArray(visits, true)) return 0;

    return visits.reduce((acc, visit) => {
      const date = utils.date.timestamp(visit.visitingDate);

      return Boolean(acc && date) ? Math.min(acc, date) : acc || date;
    }, 0);
  },

  getDateTo: (visits) => {
    if (!visits || !utils.generic.isValidArray(visits, true)) return 0;

    return visits.reduce((acc, visit) => {
      const date = utils.date.timestamp(visit.visitingDate);
      return Math.max(acc, date);
    }, 0);
  },

  getBrokers: (visits) => {
    if (!visits || !utils.generic.isValidArray(visits, true)) return [];

    const users = visits.reduce((acc, visit) => {
      return utils.generic.isValidArray(visit.users) ? [...acc, ...visit.users] : acc;
    }, []);

    return uniqBy(users, 'id');
  },
};

export default utilsTrip;
