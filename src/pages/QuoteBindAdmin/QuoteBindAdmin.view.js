import React from 'react';
import PropTypes from 'prop-types';

// app
import { Breadcrumb, Layout, SectionHeader, Tabs } from 'components';
import { ProductsAdminClients, ProductsAdminCarriers, ProductsAdminFacilities, ProductsAdminInsureds } from 'modules';
import * as utils from 'utils';

// mui
import { Divider } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';

QuoteBindAdminView.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string,
    })
  ).isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      active: PropTypes.bool,
    })
  ).isRequired,
  selectedTab: PropTypes.string,
  handleSelectTab: PropTypes.func.isRequired,
};

export function QuoteBindAdminView({ tabs, breadcrumbs, selectedTab, handleSelectTab }) {
  return (
    <>
      <Breadcrumb links={breadcrumbs} testid="products-admin" />
      <Divider />

      <Layout isCentered testid="products-admin">
        <Layout main>
          <SectionHeader title={utils.string.t('products.admin.title')} icon={SettingsIcon} testid="products-admin" />

          <Tabs compact tabs={tabs} onChange={(tabName) => handleSelectTab(tabName)} />

          {selectedTab === 'facilities' && <ProductsAdminFacilities />}
          {selectedTab === 'clients' && <ProductsAdminClients />}
          {selectedTab === 'carriers' && <ProductsAdminCarriers />}
          {selectedTab === 'insureds' && <ProductsAdminInsureds />}
          {selectedTab === 'reInsureds' && <ProductsAdminInsureds reInsured />}
        </Layout>
      </Layout>
    </>
  );
}
