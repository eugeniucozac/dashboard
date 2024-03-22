import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';

// app
import { DepartmentView } from './Department.view';
import { selectUserDepartmentIds, selectRefDataDepartments, selectIsBroker, selectIsCobroker } from 'stores';
import * as utils from 'utils';
import config from 'config';

export default function Department({ match }) {
  const history = useHistory();

  const [selectedTab, setSelectedTab] = useState('renewals');

  const placement = useSelector((state) => get(state, 'placement'));
  const placementSelected = useSelector((state) => get(state, 'placement.selected'));
  const uiBrand = useSelector((state) => get(state, 'ui.brand'));
  const uiLoaderQueue = useSelector((state) => get(state, 'ui.loader.queue', []));
  const userIsBroker = useSelector(selectIsBroker);
  const userIsCoBroker = useSelector(selectIsCobroker);
  const userDepartmentIds = useSelector(selectUserDepartmentIds);
  const refDataDepartments = useSelector(selectRefDataDepartments);

  const urlDepartment = utils.referenceData.departments.getById(refDataDepartments, toNumber(get(match, 'params.id'))) || {};
  const urlDepartmentId = toNumber(get(match, 'params.id'));
  const urlDepartmentName = urlDepartment.name;

  useEffect(
    () => {
      // redirect /home if requested deptId isn't available to this user
      if (!userDepartmentIds.includes(urlDepartmentId)) {
        history.replace(config.routes.home.root);
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
  };

  const tabs = [
    {
      value: 'renewals',
      label:
        (userIsBroker && utils.string.t('department.titlePlacements')) || (userIsCoBroker && utils.string.t('department.titleAccounts')),
    },
    ...(userIsBroker ? [{ value: 'markets', label: utils.string.t('app.market_plural') }] : []),
  ];

  // abort
  if (!urlDepartmentId || !urlDepartmentName) return null;

  return (
    <>
      <Helmet>
        <title>{`${
          (userIsBroker && utils.string.t('department.titlePlacements')) || (userIsCoBroker && utils.string.t('department.titleAccounts'))
        } ${urlDepartmentName ? `- ${urlDepartmentName}` : ''} - ${utils.app.getAppName(uiBrand)}`}</title>
      </Helmet>

      <DepartmentView
        isBroker={userIsBroker}
        tabs={tabs}
        selectedTab={selectedTab}
        placement={placement}
        placementSelected={placementSelected}
        hasLoader={uiLoaderQueue.length > 0}
        handlers={{
          handleSelectTab: handleSelectTab,
        }}
      />
    </>
  );
}
