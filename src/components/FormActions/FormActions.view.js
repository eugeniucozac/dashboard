import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './FormActions.styles';

// mui
import { makeStyles, Divider, DialogActions } from '@material-ui/core';

FormActionsView.propTypes = {
  type: PropTypes.oneOf(['default', 'dialog', 'blank']),
  align: PropTypes.oneOf(['left', 'right']),
  divider: PropTypes.bool,
  nestedClasses: PropTypes.shape({
    actions: PropTypes.string,
  }),
};

FormActionsView.defaultProps = {
  type: 'default',
  align: 'right',
  divider: true,
  nestedClasses: {},
};

export function FormActionsView({ type, align, divider, children, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'FormActions' })({ type });

  const classesActions = {
    [classes.actions]: true,
    [classes.actionsLeft]: align === 'left',
    [classes.actionsRight]: align === 'right',
    [nestedClasses.actions]: Boolean(nestedClasses.actions),
    [classes.actionsDialog]: type === 'dialog',
  };

  return (
    <>
      {type === 'dialog' && (
        <>
          {divider && <Divider />}
          <DialogActions className={classnames(classesActions)}>{children}</DialogActions>
        </>
      )}
      {type === 'default' && <div className={classnames(classesActions)}>{children}</div>}
    </>
  );
}
