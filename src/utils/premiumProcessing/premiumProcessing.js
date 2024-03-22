// app
import * as constants from 'consts';

const premiumProcessing = {
  isRfi: (selectedCase) => {
    return selectedCase?.type
      ?.split(',')
      ?.some((flag) => flag === constants.RFI_FLAG_R || flag === constants.RFI || flag === constants.RFI_STATUS_RESPONSE);
  },
};

export default premiumProcessing;
