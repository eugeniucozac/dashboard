import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './FilterChips.styles';
import { FilterChip, Link } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

FilterChipsView.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string,
    })
  ).isRequired,
  handleRemoveItems: PropTypes.func,
  showRemoveAll: PropTypes.bool,
  removeAllLabel: PropTypes.string,
};

FilterChipsView.defaultProps = {
  items: [],
};

export function FilterChipsView({ items, handleRemoveItems, showRemoveAll, removeAllLabel }) {
  const classes = makeStyles(styles, { name: 'FilterChips' })();

  return (
    <div className={classes.root}>
      <div className={classes.chips}>
        {items.map((item, index) => (
          <FilterChip
            key={index}
            removeProps={{ ...(utils.generic.isFunction(handleRemoveItems) && { onClick: () => handleRemoveItems([item]) }) }}
          >
            {item.label}
          </FilterChip>
        ))}
      </div>
      {showRemoveAll && handleRemoveItems && items.length > 1 && (
        <Link text={removeAllLabel || utils.string.t('app.removeAll')} color="secondary" handleClick={() => handleRemoveItems(items)} />
      )}
    </div>
  );
}
