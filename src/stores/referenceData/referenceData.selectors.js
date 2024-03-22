import * as constants from 'consts';
// app
import * as utils from 'utils';

import { createSelector } from 'reselect';
import { firstBy } from 'thenby';
import get from 'lodash/get';

export const selectRefDataLoaded = (state) => get(state, 'referenceData.loaded') || false;
export const selectRefDataLoadedExtended = (state) => get(state, 'referenceData.loadedExtended') || false;
export const selectRefDataBusinessTypes = (state) => get(state, 'referenceData.businessTypes') || [];
export const selectRefDataCapacityTypes = (state) => get(state, 'referenceData.capacityTypes') || [];
export const selectRefDataCurrencies = (state) => get(state, 'referenceData.currencies') || [];
export const selectRefDataDepartments = (state) => get(state, 'referenceData.departments') || [];
export const selectRefDataUnderwriters = (state) => get(state, 'referenceData.underwriters') || [];
export const selectRefDataMarkets = (state) => get(state, 'referenceData.markets') || [];
export const selectRefDataMarketTypes = (state) => get(state, 'referenceData.marketTypes') || [];
export const selectRefDataClients = (state) => get(state, 'referenceData.clients') || [];
export const selectRefDataInsureds = (state) => get(state, 'referenceData.insureds') || [];
export const selectRefDataStatusesPlacement = (state) => get(state, 'referenceData.statuses.placement') || [];
export const selectRefDataStatusesPolicy = (state) => get(state, 'referenceData.statuses.policy') || [];
export const selectRefDataStatusesMarketQuote = (state) => get(state, 'referenceData.statuses.policyMarketQuote') || [];
export const selectRefDataNewRenewalBusinesses = (state) => get(state, 'referenceData.newRenewalBusinesses') || [];
export const selectRefDataAccountStatuses = (state) => get(state, 'referenceData.statuses.account') || [];
export const selectRefDataRationales = (state) => get(state, 'referenceData.rationales') || [];
export const selectRefDataDeclinatures = (state) => get(state, 'referenceData.declinatures') || [];
export const selectRefDataXbInstances = (state) => get(state, 'referenceData.xbInstances') || [];
export const selectRefDataNewRfiType = (state) => get(state, 'referenceData.rfiTypes') || [];
export const selectRefDataNewProcessType = (state) => get(state, 'referenceData.processTypes') || [];
export const selectRefDataNewDocumentTypes = (state) => get(state, 'referenceData.documentTypes') || [];
export const selectRefDataNewDocumentTypeLookUp = (state) => get(state, 'referenceData.documentTypeLookUp') || [];
export const selectRefDataNewCurrencyCode = (state) => get(state, 'referenceData.currencyCodes') || [];
export const selectRefDataNewBusinessProcess = (state) => get(state, 'referenceData.businessProcesses') || [];
export const selectRefDataNewBpmStage = (state) => get(state, 'referenceData.bpmStages') || [];
export const selectRefDataNewBpmFlag = (state) => get(state, 'referenceData.bpmFlags') || [];
export const selectRefDataNewBordereauType = (state) => get(state, 'referenceData.bordereauType') || [];
export const selectRefDataNewBordereauPolicyType = (state) => get(state, 'referenceData.bordereauPolicyType') || [];
export const selectRefDataNewFacilityType = (state) => get(state, 'referenceData.facilityType') || [];
export const selectRefDataQueryCodes = (state) => get(state, 'referenceData.queryCodes') || [];
export const selectRefDataResolutionCode = (state) => get(state, 'referenceData.resolutionCode') || [];
export const selectRefDataNewCountriesList = (state) => get(state, 'referenceData.countriesList') || [];
export const selectRefDataCatCodesList = (state) => get(state, 'referenceData.catCodes') || [];
export const selectRefDataThirdPartyList = (state) => get(state, 'referenceData.thirdParty') || [];
export const selectRefDataSettlementCurrency = (state) => get(state, 'referenceData.settlementCurrency');
export const selectRefDataBaseCurrency = (state) => get(state, 'referenceData.baseCurrency');

export const selectRefDataXbInstancesDepartments = (id) => {
  return createSelector(selectRefDataXbInstances, (xbInstances) => {
    const xbInstance = xbInstances.find((xbi) => {
      return xbi.id === id;
    });

    return xbInstance?.departments || [];
  });
};

export const selectRefDataCountriesIso2 = (state) => {
  return utils.referenceData.countries.getOptionsIso2(get(state, 'referenceData.countries'));
};

// private
const _userDeptId = (state) => get(state, 'user.departmentSelected');

// private
const _userDepartment = createSelector(_userDeptId, selectRefDataDepartments, (departmentId, departments) => {
  if (!departmentId || !utils.generic.isValidArray(departments)) return;
  return departments.find((dept) => departmentId === dept.id);
});

export const selectRefDataDepartmentUsers = createSelector(_userDepartment, (department) => {
  return department && department.users ? department.users : [];
});

export const selectRefDataDepartmentBrokers = createSelector(selectRefDataDepartmentUsers, (users) => {
  return users.filter((user) => user.role === constants.ROLE_BROKER);
});

export const selectRefDataDepartmentById = (id) => {
  return createSelector(selectRefDataDepartments, (departments) => {
    return departments.find((dept) => {
      return dept.id === id;
    });
  });
};

export const selectRefDataBusinessTypeById = (deptId, businessTypeId) => {
  return createSelector(selectRefDataDepartments, (departments) => {
    const department = departments.find((dept) => {
      return dept.id === deptId;
    });

    if (department && department.businessTypes) {
      return department.businessTypes.find((bt) => bt.id === businessTypeId);
    }

    return null;
  });
};

export const selectRefDataStatusIdByCode = (type, code) => {
  let statusArray;

  switch (type) {
    case 'market':
      statusArray = selectRefDataStatusesMarketQuote;
      break;
    case 'policy':
      statusArray = selectRefDataStatusesPolicy;
      break;
    case 'placement':
      statusArray = selectRefDataStatusesPlacement;
      break;
    default:
      statusArray = () => [];
      break;
  }

  return createSelector(statusArray, (statuses) => {
    const status = statuses.find((status) => {
      return status.code === code;
    });

    return status && status.id;
  });
};

export const selectRefDataStatusKeyByCode = (type, code) => {
  let statusArray;

  switch (type) {
    case 'market':
      statusArray = selectRefDataStatusesMarketQuote;
      break;
    case 'policy':
      statusArray = selectRefDataStatusesPolicy;
      break;
    case 'placement':
      statusArray = selectRefDataStatusesPlacement;
      break;
    default:
      statusArray = () => [];
      break;
  }

  return createSelector(statusArray, (statuses) => {
    const status = statuses.find((status) => {
      return status.code === code;
    });

    return status && status.code ? utils.string.replaceLowerCase(status.code) : undefined;
  });
};

export const selectRefDataStatusKeyById = (type, id) => {
  let statusArray;

  switch (type) {
    case 'market':
      statusArray = selectRefDataStatusesMarketQuote;
      break;
    case 'policy':
      statusArray = selectRefDataStatusesPolicy;
      break;
    case 'placement':
      statusArray = selectRefDataStatusesPlacement;
      break;
    default:
      statusArray = () => [];
      break;
  }

  return createSelector(statusArray, (statuses) => {
    const status = statuses.find((status) => {
      return status.id === id;
    });

    return status && status.code ? utils.string.replaceLowerCase(status.code) : undefined;
  });
};

export const selectRefDataCurrencyById = (id) => {
  return createSelector(selectRefDataCurrencies, (currencies) => {
    return currencies.find((currency) => {
      return currency.id === id;
    });
  });
};

export const selectFormattedAccountStatusList = createSelector(selectRefDataAccountStatuses, (statusList) => {
  const mappings = {
    live: 'success',
    livee: 'success',
    livef: 'success',
    liveg: 'success',
    runoff: 'alert',
    longtermrunoff: 'alert',
    restrictedc: 'alert',
    restrictedd: 'alert',
    restrictedh: 'alert',
    restrictedj: 'alert',
    restrictedk: 'alert',
    closed: 'error',
    closedp: 'error',
    closedt: 'error',
    donotuse: 'error',
    liquidated: 'error',
    provisional: 'alert',
  };
  const statusOrder = ['success', 'alert', 'error'];
  const statusWithType = statusList.map((status) => ({
    id: status.id,
    type: mappings[utils.string.replaceLowerCase(status.code, 'withDash')],
    code: utils.string.replaceLowerCase(status.code, 'withDash'),
  }));
  return statusWithType.sort((a, b) => statusOrder.indexOf(a.type) - statusOrder.indexOf(b.type));
});

const getDocumentTypes = (docTypeSelector, context, source, docTypeSource) => {
  return createSelector(docTypeSelector, (documentTypes) =>
    documentTypes
      ?.sort(firstBy(utils.sort.array('lexical', 'documentTypeDescription')))
      ?.filter(
        (type) =>
          type?.sectionKey?.toLowerCase() === context?.toLowerCase() &&
          type?.sourceID?.toString() === source?.toString() &&
          (docTypeSource ? type?.documentTypeSource?.toString() === docTypeSource?.toString() : true)
      )
  );
};

export const selectRefDataNewDocumentTypesByContextSource = (context = '', source = 1, docTypeSource) =>
  getDocumentTypes(selectRefDataNewDocumentTypes, context, source, docTypeSource);

export const selectRefDataNewDocumentTypeLookUpByContextSource = (context = '', source = 1) =>
  getDocumentTypes(selectRefDataNewDocumentTypeLookUp, context, source);
