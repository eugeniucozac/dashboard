import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import { AdminView } from './Admin.view';

export function Admin() {
  const [selectedTab, setSelectedTab] = useState('users');

  const brand = useSelector((state) => state.ui.brand);
  const configVars = useSelector((state) => get(state, 'config.vars', {}));

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
  };

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('admin.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <AdminView selectedTab={selectedTab} handleSelectTab={handleSelectTab} isDev={utils.app.isDevelopment(configVars)} />
    </>
  );
}

export default Admin;
