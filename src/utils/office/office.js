import get from 'lodash/get';

// app
import * as utils from 'utils';

const utilsOffice = {
  withFullName: (offices) => {
    // method accepts Array of offices or a single office Object
    const isArray = Array.isArray(offices);
    const officesArray = isArray ? offices : [offices];

    const newArray = officesArray.map((office) => {
      const parts = [];
      const parentName = get(office, 'parent.name');
      const officeName = get(office, 'name');

      if (parentName) parts.push(parentName);
      if (officeName) parts.push(officeName);

      return {
        ...office,
        fullname: parts.join(' - '),
      };
    });

    return isArray ? newArray : newArray[0];
  },

  getMainOffice: (offices) => {
    if (!utils.generic.isValidArray(offices, true)) return;
    return offices[0];
  },

  getMainOfficeName: (offices) => {
    if (!utils.generic.isValidArray(offices, true)) return '';
    return utilsOffice.getName(utilsOffice.getMainOffice(offices));
  },

  getParent: (office) => {
    if (!office || !utils.generic.isValidObject(office)) return;
    return office.parent;
  },

  getName: (office) => {
    if (!office || !utils.generic.isValidObject(office)) return '';
    return office.name || '';
  },
};

export default utilsOffice;
