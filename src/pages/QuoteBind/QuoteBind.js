import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

// app
import { QuoteBindView } from './QuoteBind.view';
import {
  getRiskProducts,
  getRiskList,
  selectRiskListItems,
  selectRiskListPagination,
  selectRiskListSort,
  selectRiskListLoading,
  selectProductsSorted,
  selectRefDataStatusesMarketQuote,
  selectIsAdmin,
  selectIsBroker,
  showModal,
} from 'stores';
import { usePagination } from 'hooks';
import * as utils from 'utils';
import config from 'config';

export default function QuoteBind() {
  const dispatch = useDispatch();
  const history = useHistory();

  const brand = useSelector((state) => state.ui.brand);
  const riskProducts = useSelector(selectProductsSorted);
  const riskList = useSelector((state) => state.risk.list);
  const riskListLoading = useSelector(selectRiskListLoading);
  const riskItems = useSelector(selectRiskListItems);
  const riskPagination = useSelector(selectRiskListPagination);
  const riskSort = useSelector(selectRiskListSort);
  const isAdmin = useSelector(selectIsAdmin);
  const userIsBroker = useSelector(selectIsBroker);
  const statuses = useSelector(selectRefDataStatusesMarketQuote);
  const [selectedTab, setSelectedTab] = useState('risks');

  const handleSearch = (query) => {
    dispatch(getRiskList({ query: query }));
  };

  const handleSearchReset = () => {
    if (get(riskList, 'query')) {
      dispatch(getRiskList({ query: '' }));
    }
  };

  const handleChangePage = (newPage) => {
    dispatch(getRiskList({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getRiskList({ size: rowsPerPage }));
  };

  const handleClickRow = (risk) => (event) => {
    history.push(`${config.routes.quoteBind.riskDetails}/${risk.id}`);
  };

  const handleClickLaunchBdx = (event) => {
    dispatch(
      showModal({
        component: 'DOWNLOAD_BORDEREAUX',
        props: {
          title: 'products.reports',
          fullWidth: true,
          maxWidth: 'sm',
        },
      })
    );
  };

  const handleClickAddRisk = (event) => {
    dispatch(
      showModal({
        component: 'ADD_RISK',
        props: {
          title: 'risks.addRisk',
          fullScreen: true,
          disableAutoFocus: true,
        },
      })
    );
  };

  const pagination = usePagination(riskItems, riskPagination, handleChangePage, handleChangeRowsPerPage);

  useEffect(
    () => {
      dispatch(getRiskList());
      if (isEmpty(riskProducts)) {
        dispatch(getRiskProducts());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
  };

  const tabs = [
    {
      value: 'risks',
      label: utils.string.t('products.tabs.risks'),
    },
  ];

  userIsBroker &&
    tabs.push({
      value: 'draftRisks',
      label: utils.string.t('products.tabs.draftRisks.label'),
    });

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('products.title')} - ${utils.app.getAppName(brand)} - ${utils.string.t('products.tabs.risks')}`}</title>
      </Helmet>

      <QuoteBindView
        isAdmin={isAdmin}
        list={riskList}
        riskListLoading={riskListLoading}
        riskProducts={riskProducts}
        sort={riskSort}
        pagination={pagination.obj}
        statuses={statuses}
        tabs={tabs}
        selectedTab={selectedTab}
        handlers={{
          search: handleSearch,
          searchReset: handleSearchReset,
          changePage: pagination.handlers.handleChangePage,
          changeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
          clickLaunchBdx: handleClickLaunchBdx,
          clickRow: handleClickRow,
          clickAddRisk: handleClickAddRisk,
          handleSelectTab: handleSelectTab,
        }}
      />
    </>
  );
}
