import React from 'react';
import numbro from 'numbro';
import PropTypes from 'prop-types';

// app
import styles from './TooltipList.styles';
import { Translate } from 'components';

// mui
import { NavigateNext } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core';

TooltipListView.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number.isRequired, PropTypes.string.isRequired]),
      label: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export function TooltipListView({ items }) {
  const classes = makeStyles(styles, { name: 'TooltipList' })();

  return items.map((item) => {
    if (!item.id || !item.label || !item.amount) return null;
    return (
      <div className={classes.item} key={item.id}>
        <NavigateNext className={classes.bullet} />
        <span className={classes.name} data-testid="tooltipList-item-name">
          {item.label}
        </span>
        <span className={classes.ellipsis} />
        <span className={classes.amount} data-testid="tooltipList-item-amount">
          <Translate label="format.currency" options={{ value: { number: numbro.unformat(item.amount), format: { mantissa: 0 } } }} />
        </span>
      </div>
    );
  });
}
