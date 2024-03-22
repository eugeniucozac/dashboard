export const updatePortfolioMapLevel = (payload) => {
  return {
    type: 'PORTFOLIO_MAP_UPDATE_LEVEL',
    payload,
  };
};

export const updatePortfolioMapLevelOverride = (payload) => {
  return {
    type: 'PORTFOLIO_MAP_UPDATE_LEVEL_OVERRIDE',
    payload,
  };
};
export const updatePortfolioMapDepartment = (payload) => {
  return {
    type: 'PORTFOLIO_MAP_UPDATE_DEPARTMENTS',
    payload,
  };
};

export const resetPortfolioMapLocations = () => {
  return {
    type: 'PORTFOLIO_MAP_RESET_LOCATIONS',
  };
};

export const resetPortfolioMapLevelOverride = () => {
  return {
    type: 'PORTFOLIO_MAP_RESET_LEVEL_OVERRIDE',
  };
};

export const resetPortfolioMapLevel = () => {
  return {
    type: 'PORTFOLIO_MAP_RESET_LEVEL',
  };
};

export const resetPortfolioMap = () => {
  return {
    type: 'PORTFOLIO_MAP_RESET',
  };
};
