import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';

// app
import { DepartmentMarketsView } from './DepartmentMarkets.view';
import {
  getDepartmentMarkets,
  deleteDepartmentMarket,
  showModal,
  selectDepartmentMarketsItems,
  selectRefDataCapacityTypes,
  selectFormattedAccountStatusList,
} from 'stores';
import { Translate } from 'components';
import * as utils from 'utils';

export default function DepartmentMarkets() {
  const dispatch = useDispatch();
  const params = useParams();

  const departmentMarketsItems = useSelector(selectDepartmentMarketsItems);
  const refDataCapacityTypes = useSelector(selectRefDataCapacityTypes);
  const refDataAccountStatuses = useSelector(selectFormattedAccountStatusList);

  const urlDepartmentId = toNumber(get(params, 'id'));
  const modalProps = {
    fullWidth: true,
    maxWidth: 'md',
  };

  const marketGroups = [...refDataCapacityTypes, { name: utils.string.t('market.noCapacityMarkets') }]
    .map((type) => {
      type.markets = departmentMarketsItems.filter((market) => {
        return type.id ? get(market, 'market.capacityTypeId') === type.id : !Boolean(get(market, 'market.capacityTypeId'));
      });

      return type;
    })
    .filter((type) => utils.generic.isValidArray(type.markets, true));

  useEffect(
    () => {
      dispatch(getDepartmentMarkets(urlDepartmentId));
    },
    [urlDepartmentId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleAddDepartmentMarket = (data) => (event) => {
    dispatch(
      showModal({
        component: 'ADD_DEPARTMENT_MARKET',
        props: {
          ...modalProps,
          title: 'market.addMarket',
          componentProps: data,
        },
      })
    );
  };

  const handleEditDepartmentMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_DEPARTMENT_MARKET',
        props: {
          ...modalProps,
          title: 'market.editMarket',
          componentProps: popoverData,
        },
      })
    );
  };

  const handleDeleteDepartmentMarket = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          ...modalProps,
          title: 'market.deleteMarket',
          maxWidth: 'xs',
          componentProps: {
            submitHandler: () => {
              dispatch(deleteDepartmentMarket(get(popoverData, 'market.id')));
            },
          },
        },
      })
    );
  };

  const cols = [
    { id: 'name', title: true, style: { width: '50%' } },
    { id: 'underwriter', label: <Translate label="market.cols.underwriterName" />, style: { width: '25%' } },
    { id: 'email', label: <Translate label="market.cols.underwriterEmail" />, style: { width: '25%' } },
    { id: 'actions', empty: true },
  ];

  const popoverActions = [
    {
      id: 'edit-department-market',
      label: 'market.actions.edit',
      callback: (popoverData) => handleEditDepartmentMarket(popoverData),
    },
    {
      id: 'delete-department-market',
      label: 'market.actions.delete',
      callback: (popoverData) => handleDeleteDepartmentMarket(popoverData),
    },
  ];

  return (
    <DepartmentMarketsView
      items={departmentMarketsItems}
      groups={marketGroups}
      cols={cols}
      deptId={urlDepartmentId}
      marketAccountStatuses={refDataAccountStatuses}
      popoverActions={popoverActions}
      handlers={{
        addDepartmentMarket: handleAddDepartmentMarket,
      }}
    />
  );
}
