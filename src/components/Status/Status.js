import React from 'react';
import PropTypes from 'prop-types';

// app
import { StatusView } from './Status.view';

Status.propTypes = {
  status: PropTypes.string.isRequired,
  statusOverrides: PropTypes.object,
  size: PropTypes.oneOf(['xxs', 'xs', 'sm', 'md', 'lg', 'xl']),
  text: PropTypes.node,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

Status.defaultProps = {
  status: 'other',
  statusOverrides: {},
  nestedClasses: {},
};

export default function Status({ text, size, status, statusOverrides, nestedClasses, ...rest }) {
  const statusMap = {
    alert: 'alert',
    allbound: 'success',
    approved: 'success',
    autontu: 'error',
    awaitingapproval: 'alert',
    bound: 'success',
    cancelled: 'error',
    declined: 'error',
    done: 'success',
    enquiry: 'new',
    error: 'error',
    expired: 'error',
    info: 'info',
    inprogress: 'info',
    light: 'light',
    na: 'unknown',
    new: 'new',
    notstarted: 'unknown',
    nottakenup: 'error',
    ntu: 'error',
    open: 'unknown',
    other: 'unknown',
    partbound: 'alert',
    pending: 'alert',
    quoted: 'success',
    referred: 'alert',
    reopen: 'pink',
    review: 'alert',
    sanction_blocked: 'error',
    blocked: 'error',
    signeddown: 'success',
    started: 'alert',
    success: 'success',
    unknown: 'unknown',
    draft: 'alert',
    rejected: 'error',
    ...statusOverrides,
  };

  return <StatusView {...rest} text={text} size={size} type={statusMap[status] || 'unknown'} nestedClasses={nestedClasses} />;
}
