import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

// app
import { QuoteBindAdminView } from './QuoteBindAdmin.view';
import * as utils from 'utils';
import config from 'config';

export default function QuoteBindAdmin() {
  const [selectedTab, setSelectedTab] = useState();
  const brand = useSelector((state) => state.ui.brand);

  useEffect(
    () => {
      setSelectedTab('facilities');
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSelectTab = (name) => {
    setSelectedTab(name);
  };

  const tabs = [
    { value: 'facilities', label: utils.string.t('app.facility_plural') },
    { value: 'clients', label: utils.string.t('app.client_plural') },
    { value: 'carriers', label: utils.string.t('products.admin.carrier_plural') },
    { value: 'insureds', label: utils.string.t('app.insured_plural') },
    { value: 'reInsureds', label: utils.string.t('app.reInsured_plural') },
  ];

  const breadcrumbs = [
    {
      name: 'products',
      label: utils.string.t('products.title'),
      link: config.routes.quoteBind.root,
    },
    {
      name: 'products-admin',
      label: utils.string.t('products.admin.titleShort'),
      link: config.routes.quoteBind.admin,
      active: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('products.admin.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <QuoteBindAdminView tabs={tabs} breadcrumbs={breadcrumbs} selectedTab={selectedTab} handleSelectTab={handleSelectTab} />
    </>
  );
}
