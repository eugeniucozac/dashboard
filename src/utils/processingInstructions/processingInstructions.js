import moment from 'moment';
import isEmpty from 'lodash/isEmpty';

// app
import config from 'config';
import * as utils from 'utils';
import * as constants from 'consts';

const utilsProcessingInstructions = {
  getRetainedBrokerageValue: (grossPremium, slipOrder, totalRetainedBrokerage) => {
    const total =
      Number(utils.string.stripNonNumeric(grossPremium || 0)) *
      Number(utils.string.stripNonNumeric(slipOrder || 0) / 100) *
      Number(utils.string.stripNonNumeric(totalRetainedBrokerage || 0) / 100);

    return parseInt(total * 100) / 100;
  },

  getRetainedBrokerageCurrencies: () => {
    const currentYear = utils.date.today('YYYY');
    let originalBrokerage = config.processingInstructions.originalBrokerage[currentYear];

    // try to get previous year if current year is not yet available
    if (!originalBrokerage) {
      const previousYear = moment(currentYear, 'YYYY').subtract(1, 'year').format('YYYY');
      originalBrokerage = config.processingInstructions.originalBrokerage[previousYear];
    }

    if (!originalBrokerage || !originalBrokerage.length) return [];

    return originalBrokerage;
  },

  getRetainedBrokerageConvertedValue: (currencyCode, total = 0) => {
    if (!currencyCode) return;
    const currencies = utilsProcessingInstructions.getRetainedBrokerageCurrencies();

    const currencyObj = currencies.find((item) => item.currency === currencyCode);
    if (isEmpty(currencyObj)) return;

    return {
      value: parseInt((total / currencyObj.rate) * 100) / 100,
      rate: currencyObj.rate,
    };
  },

  getProcessTypeName: (id) => {
    if (!id) return '';
    if (id === constants.PROCESS_TYPE_ID_CLOSING) return 'closing';
    if (id === constants.PROCESS_TYPE_ID_ENDORSEMENT) return 'endorsement';
    if (id === constants.PROCESS_TYPE_ID_FDO) return 'fdo';
    if (id === constants.PROCESS_TYPE_ID_BORDEREAU) return 'bordereau';
    if (id === constants.PROCESS_TYPE_ID_FEE_AND_AMENDMENT) return 'feeAmendment';
    return '';
  },

  isApproved: (processingInstructions) => {
    if (!processingInstructions || !utils.generic.isValidObject(processingInstructions)) return false;

    return processingInstructions.isAccountHandlerApproved && processingInstructions.isAuthorisedSignatoryApproved;
  },

  isClosing: (type) => {
    if (!type) return false;
    return type === constants.PROCESS_TYPE_ID_CLOSING;
  },

  isEndorsement: (type) => {
    if (!type) return false;
    return type === constants.PROCESS_TYPE_ID_ENDORSEMENT;
  },

  isFdo: (type) => {
    if (!type) return false;
    return type === constants.PROCESS_TYPE_ID_FDO;
  },

  isBordereau: (type) => {
    if (!type) return false;
    return type === constants.PROCESS_TYPE_ID_BORDEREAU;
  },

  isFeeAndAmendment: (type) => {
    if (!type) return false;
    return type === constants.PROCESS_TYPE_ID_FEE_AND_AMENDMENT;
  },

  status: {
    isDraft: (statusId) => {
      if (!statusId) return false;
      return statusId === constants.PI_STATUS_DRAFT;
    },

    isRejectedDraft: (statusId) => {
      if (!statusId) return false;
      return statusId === constants.PI_STATUS_REJECTED_DRAFT;
    },

    isSubmittedAuthorisedSignatory: (statusId) => {
      if (!statusId) return false;
      return statusId === constants.PI_STATUS_SUBMITTED_AUTHORISED_SIGNATORY;
    },

    isSubmittedProcessing: (statusId) => {
      if (!statusId) return false;
      return statusId === constants.PI_STATUS_SUBMITTED_PROCESSING;
    },

    isReopened: (statusId) => {
      if (!statusId) return false;
      return statusId === constants.PI_STATUS_DRAFT_POST_SUBMISSION;
    },
  },

  getFinancialField: (instruction, name) => {
    if (!instruction || !name || utils.generic.isInvalidOrEmptyArray(instruction.financialChecklist)) return null;

    return instruction.financialChecklist.find((field) => field.name === name);
  },
  detailsDataList: (isFDO) => {
    return { clientEmail: true, contactName: true, producingBrokerName: true, accountExecutive: true, facilityTypeId: isFDO };
  },
  // fields = {checklist:{quotesPutUp:true,dutyOfDisclosure:false},details:{contactName:true},financialChecklist:{retainedBrokerage:true},riskReference:{documentCount:true}};
  // dataObj = {checkList: [], details:{}, financialChecklist: [], riskReference: []}
  checkProcessingInstructionMandatoryData: (fields, dataObj) => {
    let flag = true;
    Object.keys(fields).every((field) => {
      const fieldObj = fields[field];
      const mandatoryKeys = Object.keys(fieldObj).filter((mandatoryKey) => fieldObj[mandatoryKey]);
      if (utils.generic.isValidArray(mandatoryKeys, true)) {
        const obj = dataObj[field];
        if (!obj) {
          flag = false;
          return flag;
        }
        let count = mandatoryKeys.length;
        if (obj && field === constants.CHECKLIST) {
          obj.every((data) => {
            if (
              constants.CHECKLIST_WITH_SIGNED_DATE.includes(data.checkListDetails) &&
              mandatoryKeys.includes(data.checkListDetails) &&
              data.accountHandler === 'YES'
            ) {
              flag = !!data.signedDate;
              count--;
            } else if (mandatoryKeys.includes(data.checkListDetails)) {
              flag = !!data.accountHandler;
              count--;
            }
            if (!count) {
              return false;
            }
            return flag;
          });
        } else if (obj && field === constants.DETAILS) {
          mandatoryKeys.every((key) => {
            flag = obj[key] === 0 || !!obj[key];
            return flag;
          });
        } else if (obj && field === constants.FINANCIAL_CHECKLIST) {
          obj.every((data) => {
            if (mandatoryKeys.includes(data.name) && data?.numberValue === 1) {
              flag =
                (data.name === 'signedLinesCalculationSheetAttached' && dataObj.signedLinesDocument) ||
                (data.name === 'premiumTaxCalculationSheetAttached' && dataObj.premiumTaxDocument);
              count--;
            }
            if (!count) {
              return false;
            }
            return flag;
          });
        } else if (obj && field === constants.RISK_REFERENCE) {
          obj.every((data) => {
            flag = !!data.documentCount;
            return flag;
          });
        }
      }
      return flag;
    });
    return flag;
  },
};

export default utilsProcessingInstructions;
