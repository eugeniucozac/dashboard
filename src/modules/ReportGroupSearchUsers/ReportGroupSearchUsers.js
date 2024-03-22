import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { getUserList, addReportGroupUser, selectReportAdminList } from 'stores';
import { ReportGroupSearchUsersView } from './ReportGroupSearchUsers.view';
import usersUtils from '../../utils/users/users';

ReportGroupSearchUsers.propTypes = {
  searchVal: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
};
export default function ReportGroupSearchUsers({ searchVal, groupId }) {
  const userList = useSelector((state) => state.admin.userList) || {};
  const groupUserList = useSelector(selectReportAdminList);
  const dispatch = useDispatch();

  useEffect(
    () => {
      dispatch(getUserList({ size: 1000 }));
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const newUserList = userList.items.map((user) => ({
    ...user,
    hasAccess: groupUserList && groupUserList.filter((e) => e.id === user.id).length > 0,
  }));

  const searchedUserList = usersUtils.filterUserList(newUserList, searchVal);

  const handleAddUser = (user) => {
    dispatch(addReportGroupUser(groupId, user));
  };

  return <ReportGroupSearchUsersView userList={searchedUserList ? searchedUserList : null} handleAddUser={handleAddUser} />;
}
