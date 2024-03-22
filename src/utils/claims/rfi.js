// app
import * as constants from 'consts';

const utilsRfi = {
  checkRfiOriginType: (type) => {
    const refType = type?.toLowerCase() || '';
    return Object.values(constants.RFI_ORIGIN_TYPES_FROM_CAMUNDA).includes(refType) && refType;
  },

  isRfiTask: (taskRef) => {
    return taskRef.startsWith('Q') || taskRef.startsWith('q');
  },
};

export default utilsRfi;
