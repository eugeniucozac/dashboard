import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { PortfolioMapHeaderView } from './PortfolioMapHeader.view';

PortfolioMapHeader.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string,
};

export function PortfolioMapHeader({ logo, title }) {
  const departments = useSelector((state) => state.portfolioMap.tiv.filteredDepartments);

  return <PortfolioMapHeaderView departments={departments} logo={logo} title={title} />;
}

export default PortfolioMapHeader;
