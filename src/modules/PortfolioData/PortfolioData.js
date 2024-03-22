import React from 'react';
import propTypes from 'prop-types';

// app
import { PortfolioDataView } from './PortfolioData.view';

PortfolioData.propTypes = {
  locations: propTypes.array.isRequired,
  handleUpdateCenter: propTypes.func.isRequired,
};

export function PortfolioData({ locations, handleUpdateCenter }) {
  return <PortfolioDataView handleUpdateCenter={handleUpdateCenter} locations={locations} />;
}

export default PortfolioData;
