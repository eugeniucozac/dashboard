import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Admin.styles';
import { Layout, SectionHeader, Tabs } from 'components';
import { AdminUser, AdminOffices, AdminMarkets } from 'modules';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

AdminView.propTypes = {
  handleSelectTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.string.isRequired,
  isDev: PropTypes.bool.isRequired,
};

export function AdminView({ handleSelectTab, selectedTab, isDev }) {
  const classes = makeStyles(styles, { name: 'Admin' })();

  const tabs = [
    { value: 'users', label: utils.string.t('admin.user_plural') },
    { value: 'offices', label: utils.string.t('admin.office_plural') },
    ...(isDev ? [{ value: 'markets', label: utils.string.t('admin.market_plural') }] : []),
  ];

  return (
    <Layout testid="admin">
      <Layout main>
        <SectionHeader title={utils.string.t('admin.title')} icon={SettingsIcon} testid="admin" />
        <Tabs compact tabs={tabs} onChange={(tabName) => handleSelectTab(tabName)} />
        <div className={classes.tabContent}>
          {selectedTab === 'users' && <AdminUser />}
          {selectedTab === 'offices' && <AdminOffices />}
          {selectedTab === 'markets' && <AdminMarkets />}
        </div>
      </Layout>
    </Layout>
  );
}
