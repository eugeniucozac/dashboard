import React from 'react';
import propTypes from 'prop-types';

// app
import { TooltipList, Info } from 'components';
import styles from './PortfolioAccounts.styles';

// mui
import { makeStyles } from '@material-ui/core';

PortfolioAccountsView.propTypes = {
  accounts: propTypes.array.isRequired,
};

export function PortfolioAccountsView({ accounts }) {
  const classes = makeStyles(styles, { name: 'PortfolioAccounts' })();
  return (
    <ul className={classes.tooltipList}>
      {accounts.map((account, index) => (
        <li key={index}>
          <Info
            title={account.label}
            content={<TooltipList items={account.placements} />}
            avatarBg={account.color}
            avatarText={' '}
            avatarSize={16}
          />
        </li>
      ))}
    </ul>
  );
}
