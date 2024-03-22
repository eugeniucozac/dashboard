import get from 'lodash/get';

export const filterReferenceDataBusinessTypes = (deptId) => (dispatch, getState) => {
  if (deptId) {
    dispatch(filterReferenceDataBusinessTypesByDeptId(deptId));
  } else {
    const state = getState();
    const placementDept = get(state, 'referenceData.departments', []).find((dept) => {
      return dept.id === get(state, 'placement.selected.departmentId');
    });

    if (placementDept) {
      dispatch(filterReferenceDataBusinessTypesByDeptId(placementDept.id));
    }
  }
};

export const filterReferenceDataBusinessTypesByDeptId = (deptId) => {
  return {
    type: 'REFERENCE_DATA_FILTER_BUSINESSTYPES_BY_DEPTID',
    payload: deptId,
  };
};

export const filterReferenceDataUnderWritersByMarket = (market) => {
  return {
    type: 'REFERENCE_DATA_FILTER_UNDERWRITERS_BY_MARKET',
    payload: market,
  };
};

export const getReferenceDataXbInstances = (xbInstances) => {
  return {
    type: 'REFERENCE_DATA_GET_XB_INSTANCES_SUCCESS',
    payload: xbInstances,
  };
};

export const getReferenceDataXbInstanceDepartments = (id, departments) => {
  return {
    type: 'REFERENCE_DATA_GET_XB_INSTANCES_DEPARTMENTS_SUCCESS',
    payload: { id, departments },
  };
};

export const resetReferenceDataBusinessTypes = () => {
  return {
    type: 'REFERENCE_DATA_RESET_BUSINESS_TYPES',
  };
};

export const resetReferenceDataMarkets = () => {
  return {
    type: 'REFERENCE_DATA_RESET_MARKETS',
  };
};

export const resetReferenceDataUnderwriters = () => {
  return {
    type: 'REFERENCE_DATA_RESET_UNDERWRITERS',
  };
};

export const resetReferenceDataInsureds = () => {
  return {
    type: 'REFERENCE_DATA_RESET_INSUREDS',
  };
};
