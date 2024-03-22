import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { RoleAssignmentView } from './RoleAssignment.view';
import * as utils from 'utils';

export default function RoleAssignment() {
  const brand = useSelector((state) => state.ui.brand);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('roleAssignment.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <RoleAssignmentView />
    </>
  );
}
