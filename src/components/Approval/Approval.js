import React from 'react';
import PropTypes from 'prop-types';

// app
import { ApprovalView } from './Approval.view';

Approval.propTypes = {
  title: PropTypes.string.isRequired,
  user: PropTypes.object,
  userKey: PropTypes.string.isRequired,
  approvedDate: PropTypes.string,
  approvedDateKey: PropTypes.string.isRequired,
  isApproved: PropTypes.bool,
  isApprovedKey: PropTypes.string.isRequired,
  users: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  disableApproval: PropTypes.bool,
};

Approval.defaultTypes = {
  onChange: () => {},
};

export function Approval({
  users,
  title,
  onChange,
  isApproved,
  user,
  approvedDate,
  approvedDateKey,
  isApprovedKey,
  userKey,
  disabled,
  disableApproval,
}) {
  const isSubmitting = false;
  return (
    <ApprovalView
      disabled={disabled}
      disableApproval={disableApproval}
      users={users}
      title={title}
      onChange={onChange}
      user={user}
      userKey={userKey}
      isApproved={isApproved}
      isApprovedKey={isApprovedKey}
      approvedDate={approvedDate}
      approvedDateKey={approvedDateKey}
      isSubmitting={isSubmitting}
    />
  );
}

export default Approval;
