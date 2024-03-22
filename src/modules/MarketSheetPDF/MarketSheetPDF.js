import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { MarketSheetPDFView } from './MarketSheetPDF.view.js';
import toNumber from 'lodash/toNumber';
import { STATUS_MARKET_QUOTED, STATUS_POLICY_NTU } from 'consts';
import { selectRefDataDepartmentById, selectRefDataStatusIdByCode } from 'stores';

MarketSheetPDF.propTypes = {
  mudmapConfig: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  mudmaps: PropTypes.object,
  year: PropTypes.object.isRequired,
  policiesFiltered: PropTypes.array.isRequired,
  placement: PropTypes.object.isRequired,
  formValues: PropTypes.object.isRequired,
};

export function MarketSheetPDF({ mudmapConfig, layers, mudmaps, year, policiesFiltered, placement, formValues }) {
  const department = useSelector(selectRefDataDepartmentById(placement.departmentId)) || {};
  const statusMarketQuoted = useSelector(selectRefDataStatusIdByCode('market', STATUS_MARKET_QUOTED));
  const statusPolicyNtu = useSelector(selectRefDataStatusIdByCode('policy', STATUS_POLICY_NTU));
  const comments = useSelector((state) => state.comment.items);

  const getPoliciesMudmap = (businessTypeId) => {
    const config = (mudmaps && mudmaps[businessTypeId]) || [];
    return utils.policies.getMudmap(
      policiesFiltered.filter((policy) => {
        const isValidStatus = policy.statusId !== statusPolicyNtu;
        const isSelectedGroup = policy.businessTypeId === toNumber(businessTypeId);
        return isValidStatus && isSelectedGroup;
      }),
      config,
      statusMarketQuoted,
      'written'
    );
  };

  const groups = Object.keys(layers).map((key, lIndex) => {
    return {
      policies: layers[key].map((policy, pIndex) => ({
        ...policy,
        markets: utils.placementPDF.getPDFMarkets(policy.markets, comments, placement.id, lIndex, pIndex),
      })),
      mudmap: getPoliciesMudmap(key),
      businessTypeName: utils.referenceData.businessTypes.getNameById(department.businessTypes, toNumber(key)),
    };
  });

  return (
    <MarketSheetPDFView
      placementInfo={{
        id: placement.id,
        users: placement.users,
        department: department && department.name,
        insureds: utils.placement.getInsureds(placement),
        clients: utils.placement.getClients(placement),
        clientCount: placement.clients && placement.clients.length,
        inceptionDate: placement.inceptionDate,
        description: placement.description,
      }}
      pages={utils.placementPDF.getPages(groups, formValues, comments, placement.id)}
      yearObj={year}
      mudmapConfig={mudmapConfig}
      formValues={formValues}
    />
  );
}

export default MarketSheetPDF;
