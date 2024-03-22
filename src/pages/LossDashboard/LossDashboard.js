import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';

// app
import { LossDashboardView } from './LossDashboard.view';
import {
  selectLossSelected,
  selectFnolSelectedTab,
  selectLossInformation,
  resetDmsWidgetDocuments,
  resetClaimsDMSDocumentDetails,
} from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function LossDashboard() {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const lossSelected = useSelector(selectLossSelected);
  const lossInformation = useSelector(selectLossInformation);
  const fnolSelectedTab = useSelector(selectFnolSelectedTab);

  const lossData =
    (utils.generic.isValidObject(lossSelected, 'lossRef') && lossSelected) ||
    (utils.generic.isValidObject(lossInformation, 'lossRef') && lossInformation);

  const tabs = [
    { value: 'details', label: utils.string.t('claims.loss.tabMenu.details') },
    { value: 'actions', label: utils.string.t('claims.loss.tabMenu.actions') },
    { value: 'documents', label: utils.string.t('claims.loss.tabMenu.docs') },
    { value: 'notes', label: utils.string.t('claims.loss.tabMenu.notes') },
    { value: 'auditTrail', label: utils.string.t('claims.loss.tabMenu.auditTrail') },
  ];

  const isValidTabUrl = params?.tab && tabs.map((t) => t.value).includes(params.tab);
  const [selectedTab, setSelectedTab] = useState(isValidTabUrl ? params.tab : 'details');

  const breadcrumbs = [
    {
      name: 'claimsFNOL',
      label: utils.string.t('claims.loss.title'),
      link: `${config.routes.claimsFNOL.root}${fnolSelectedTab ? `/tab/${fnolSelectedTab}` : ''}`,
    },
    {
      name: 'loss',
      label: `${utils.string.t('claims.loss.text', {
        lossRef: !lossInformation?.lossRef ? lossSelected?.lossRef : lossInformation?.lossRef,
      })}`,
      link: `${config.routes.claimsFNOL.loss}/${!lossInformation?.lossRef ? lossSelected?.lossRef : lossInformation?.lossRef}`,
      active: true,
      largeFont: true,
    },
  ];

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
    history.push(`${config.routes.claimsFNOL.loss}/${lossSelected?.lossRef}/${tabName}`);
  };

  useEffect(() => {
    if (!lossData?.lossRef) {
      history.push(config.routes.claimsFNOL.root);
    }
    return () => {
      dispatch(resetDmsWidgetDocuments());
      dispatch(resetClaimsDMSDocumentDetails());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!lossData) return null;

  return (
    <LossDashboardView
      tabs={tabs}
      selectedTab={selectedTab}
      lossSelected={lossData}
      handleSelectTab={handleSelectTab}
      breadcrumbs={breadcrumbs}
    />
  );
}
