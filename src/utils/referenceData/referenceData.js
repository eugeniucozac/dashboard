// app
import * as utils from 'utils';

const utilsReferenceData = {
  departments: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((dept) => id === dept.id);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const deptObj = utilsReferenceData.departments.getById(arr, id);

      return (deptObj && deptObj.name) || '';
    },
    getBusinessTypes: (departmentArray, id) => {
      if (!id || !utils.generic.isValidArray(departmentArray)) return [];

      const dept = utilsReferenceData.departments.getById(departmentArray, id);
      return dept?.businessTypes || [];
    },
    getUsers: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return [];

      const dept = utilsReferenceData.departments.getById(arr, id);
      return dept && dept.users ? dept.users : [];
    },
  },
  businessTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((type) => id === type.id);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const obj = utilsReferenceData.businessTypes.getById(arr, id);
      return (obj && obj.id && obj.description) || '';
    },
  },
  markets: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((market) => id === market.id);
    },
  },
  underwriters: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((uw) => id === uw.underwriter.id);
    },
  },
  clients: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((client) => id === client.id);
    },
  },
  insureds: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((insured) => id === insured.id);
    },
  },
  newRenewalBusinesses: {
    getLabelById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';
      const obj = arr.find((business) => id === business.id);
      return (obj && obj.code && obj.description) || '';
    },
  },
  status: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((status) => id === status.id);
    },
    getByCode: (arr, code) => {
      if (!code || !utils.generic.isValidArray(arr)) return;
      return arr.find((status) => status.code === code);
    },
    getIdByCode: (arr, code) => {
      if (!code || !utils.generic.isValidArray(arr)) return;
      const obj = utilsReferenceData.status.getByCode(arr, code);
      return obj && obj.id;
    },
    getLabelById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      const obj = arr.find((status) => id === status.id);
      return obj && obj.code ? utils.string.replaceLowerCase(obj.code) : '';
    },
    getKey: (status) => {
      return status ? utils.string.replaceLowerCase(status.code) : '';
    },
  },
  countries: {
    getOptionsIso2: (countries) => {
      if (!utils.generic.isValidArray(countries)) return [];

      return countries.map((country) => ({
        value: country.codeAlpha2,
        label: country.name,
      }));
    },
  },
  currencies: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return {};
      return arr.find((currency) => id === currency.id) || {};
    },
    getByCode: (arr, code) => {
      if (!code || !utils.generic.isValidArray(arr)) return {};
      return arr.find((currency) => code === currency.code) || {};
    },
  },
  processTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((processType) => id === processType.processTypeID);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const processTypeObj = utilsReferenceData.processTypes.getById(arr, id);

      return (processTypeObj && processTypeObj.processTypeDetails) || '';
    },
  },
  facilityTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((facilityType) => id === facilityType.facilityTypeID);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const facilityTypeObj = utilsReferenceData.facilityTypes.getById(arr, id);

      return (facilityTypeObj && facilityTypeObj.facilityTypeDetails) || '';
    },
  },
  bordereauTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((bordereauType) => id === bordereauType.bordereauTypeID);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const bordereauTypeObj = utilsReferenceData.bordereauTypes.getById(arr, id);

      return (bordereauTypeObj && bordereauTypeObj.bordereauTypeDetails) || '';
    },
  },
  bordereauPolicyTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((bordereauPolicyType) => id === bordereauPolicyType.bordereauPolicyTypeID);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const bordereauPolicyTypeObj = utilsReferenceData.bordereauPolicyTypes.getById(arr, id);

      return (bordereauPolicyTypeObj && bordereauPolicyTypeObj.bordereauPolicyTypeDetails) || '';
    },
  },
  resolutionCodeTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((resolutionCodeType) => id === resolutionCodeType.resolutionCd);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const resolutionCodeTypeObj = utilsReferenceData.resolutionCodeTypes.getById(arr, id);

      return (resolutionCodeTypeObj && resolutionCodeTypeObj.resolutionCodeDescription) || '';
    },
  },
  queryCodeTypes: {
    getById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.find((queryCodeType) => id === queryCodeType.queryCodeDetails);
    },
    getNameById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return '';

      const queryCodeTypeObj = utilsReferenceData.queryCodeTypes.getById(arr, id);

      return (queryCodeTypeObj && queryCodeTypeObj.queryCodeDescription) || '';
    },
  },
  settlementCurrencyTypes: {
    getAllById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.filter((currency) => id === currency.instanceId) || [];
    },
  },
  catCodes: {
    getAllFormatted: (arr, len) => {
      if (!utils.generic.isValidArray(arr)) return;

      return arr.map((catCode) => ({
        ...catCode,
        catCodeDisplay: `${catCode?.catCode} - ${len ? catCode?.catCodeDescription?.substring(0, len) : catCode?.catCodeDescription}`,
      }));
    },
  },
  baseCurrenyTypes: {
    getAllById: (arr, id) => {
      if (!id || !utils.generic.isValidArray(arr)) return;
      return arr.filter((currency) => id === currency.instanceId) || [];
    },
  },
};

export default utilsReferenceData;
