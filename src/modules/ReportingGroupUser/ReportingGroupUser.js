import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import PropTypes from 'prop-types';

import { ReportingGroupUserView } from './ReportingGroupUser.view';
import * as utils from 'utils';
import { showModal, selectReportAdminList, deleteReportGroupUser } from 'stores';

ReportingGroupUser.propTypes = {
  groupTitle: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
};

export default function ReportingGroupUser({ groupTitle, groupId }) {
  const brand = useSelector((state) => state.ui.brand);
  const groupUserList = useSelector(selectReportAdminList);

  const dispatch = useDispatch();
  const [searchVal, setSearchVal] = useState('');
  const [isBack, setBack] = useState(false);

  const fields = [
    {
      gridSize: { xs: 12 },
      name: 'fullName',
      type: 'text',
      placeholder: utils.string.t('admin.searchByFullName'),
      value: searchVal,
      muiComponentProps: {
        'data-testid': 'fullName',
      },
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.searchLabel'),
      handler: (values) => {
        setBack(false);
        setSearchVal(values.fullName);
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        setBack(true);
        setSearchVal('');
      },
    },
  ];

  const popoverActions = [
    {
      id: 'admin-delete-user',
      label: utils.string.t('app.deleteUser'),
      callback: ({ user }) => handleDelete(user),
    },
  ];

  const handleDelete = (popoverData) => {
    let submitHandler = () => {
      dispatch(deleteReportGroupUser(groupId, popoverData?.id));
    };

    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: utils.string.t('app.deleteUser'),
          subtitle: popoverData.title,
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler,
          },
        },
      })
    );
  };

  <Helmet>
    <title>{`${utils.string.t('reporting.title')} - ${utils.app.getAppName(brand)}`}</title>
  </Helmet>;
  return (
    <ReportingGroupUserView
      groupTitle={groupTitle || ''}
      groupId={groupId}
      list={groupUserList ? groupUserList : []}
      handleDelete={handleDelete}
      actions={actions}
      fields={fields}
      popoverActions={popoverActions}
      searchVal={searchVal ? searchVal : null}
      isBack={isBack}
    />
  );
}
