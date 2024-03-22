export const setRiskSelected = (risk) => {
  return {
    type: 'RISK_SELECTED_SET',
    payload: risk,
  };
};

export const resetRiskSelected = () => {
  return {
    type: 'RISK_SELECTED_RESET',
  };
};

export const selectRiskProduct = (type) => {
  return {
    type: 'RISK_PRODUCTS_SELECT',
    payload: type,
  };
};

export const resetRiskProduct = () => {
  return {
    type: 'RISK_PRODUCTS_RESET',
  };
};

export const resetRiskFacilities = () => {
  return {
    type: 'RISK_FACILITIES_RESET',
  };
};
