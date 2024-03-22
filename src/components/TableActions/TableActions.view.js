import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './TableActions.style';

// mui
import { makeStyles } from '@material-ui/core';

TableActionsView.propTypes = {
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

TableActionsView.defaultProps = {
  nestedClasses: {},
};

export function TableActionsView({ nestedClasses, children }) {
  const classes = makeStyles(styles, { name: 'TableActions' })();

  return <div className={classnames({ [classes.root]: true, [nestedClasses.root]: Boolean(nestedClasses.root) })}>{children}</div>;
}
