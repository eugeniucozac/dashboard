import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router';
import { useDispatch } from 'react-redux';

// app
import { LossClaimsTasksDashboardView } from './LossClaimsTasksDashboard.view';
import { setFnolSelectedTab } from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function LossClaimsTasksDashboard() {
  const params = useParams();
  const history = useHistory();
  const dispatch = useDispatch();

  const tabs = [
    { value: 'losses', label: utils.string.t('claims.lossClaimsTasksDashboard.losses') },
    { value: 'claims', label: utils.string.t('claims.lossClaimsTasksDashboard.claims') },
    { value: 'tasks', label: utils.string.t('claims.lossClaimsTasksDashboard.tasks') },
    { value: 'reports', label: utils.string.t('claims.lossClaimsTasksDashboard.reports') },
    { value: 'advanceSearch', label: utils.string.t('claims.lossClaimsTasksDashboard.advanceSearch') },
  ];

  const isValidTabUrl = params?.tabDashboard && tabs.map((t) => t.value).includes(params.tabDashboard);

  const [selectedTab, setSelectedTab] = useState(isValidTabUrl ? params.tabDashboard : 'losses');

  useEffect(() => {
    dispatch(setFnolSelectedTab(''));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
    history.push(`${config.routes.claimsFNOL.root}/tab/${tabName}`);
    dispatch(setFnolSelectedTab(tabName));
  };

  return <LossClaimsTasksDashboardView tabs={tabs} selectedTab={selectedTab} handleSelectTab={handleSelectTab} />;
}
