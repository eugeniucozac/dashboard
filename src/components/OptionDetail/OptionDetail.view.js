import React from 'react';

// app
import { Tooltip } from 'components';
import styles from './OptionDetail.styles';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// mui
import { makeStyles } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

OptionDetailView.propTypes = {
  label: PropTypes.string.isRequired,
  sublabel: PropTypes.string,
  detail: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  children: PropTypes.node,
  type: PropTypes.oneOf(['default', 'primary']),
};

OptionDetailView.defaultProps = {
  type: 'default',
};

export function OptionDetailView({ label, sublabel, detail, children, type }) {
  const classes = makeStyles(styles, { name: 'OptionDetail' })();
  const iconClass = type === 'default' ? classnames(classes.icon, classes.iconDefault) : classnames(classes.icon, classes.iconPrimary);

  return (
    <div className={classes.root}>
      {children}
      {(label || detail) && (
        <span className={classes.labelWrapper}>
          {label && <span className={classes.label}>{label}</span>}
          {sublabel && <span className={classes.sublabel}>{sublabel}</span>}
          {detail && (
            <Tooltip title={<span className={classes.detail}>{detail}</span>}>
              {detail && <InfoOutlinedIcon classes={{ root: iconClass }} />}
            </Tooltip>
          )}
        </span>
      )}
    </div>
  );
}
