import React from 'react';
import propTypes from 'prop-types';

// app
import { PortfolioAccountsView } from './PortfolioAccounts.view';

PortfolioAccounts.propTypes = {
  accounts: propTypes.array.isRequired,
};

export function PortfolioAccounts({ accounts }) {
  return <PortfolioAccountsView accounts={accounts} />;
}

export default PortfolioAccounts;
