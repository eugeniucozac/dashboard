import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './OpeningMemoTabs.styles';
import { Tabs } from 'components';

// mui
import { makeStyles } from '@material-ui/core';

OpeningMemoTabsView.propTypes = {
  tabs: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  sticky: PropTypes.bool.isRequired,
};

OpeningMemoTabsView.defaultProps = {
  sticky: false,
};

export function OpeningMemoTabsView({ tabs, onChange, sticky }) {
  const classes = makeStyles(styles, { name: 'OpeningMemoTabs' })({ sticky });

  const classesTabs = {
    tabs: sticky ? { root: classes.tabs } : undefined,
    tab: sticky ? { root: classes.tab } : undefined,
  };

  return <Tabs tabs={tabs} onChange={onChange} nestedClasses={classesTabs} />;
}
