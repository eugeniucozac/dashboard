import React from 'react';
import PropTypes from 'prop-types';

// app
import { Tooltip, Badge } from 'components';
import * as utils from 'utils';
import styles from './StatusIcon.styles';

// mui
import FlagOutlinedIcon from '@material-ui/icons/FlagOutlined';
import CheckIcon from '@material-ui/icons/Check';
import { makeStyles } from '@material-ui/core';

StatusIconView.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export function StatusIconView({ title, type }) {
  const classes = makeStyles(styles, { name: 'StatusIcon' })();
  const icons = {
    error: FlagOutlinedIcon,
    alert: FlagOutlinedIcon,
    success: CheckIcon,
  };
  const Icon = icons[type];

  return (
    <span className={classes.root}>
      <Tooltip title={utils.string.t(title)}>
        <Badge badgeContent={<Icon className={classes.icon} />} type={type} compact standalone />
      </Tooltip>
    </span>
  );
}

export default StatusIconView;
