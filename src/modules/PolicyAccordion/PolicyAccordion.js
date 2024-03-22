import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import get from 'lodash/get';
import toNumber from 'lodash/toNumber';

// app
import { PolicyAccordionView } from './PolicyAccordion.view';
import { Translate } from 'components';
import { selectRefDataDepartments, selectRefDataStatusesMarketQuote } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { useTheme } from '@material-ui/core';

PolicyAccordion.propTypes = {
  placement: PropTypes.object.isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

PolicyAccordion.defaultProps = {
  nestedClasses: {},
};

export default function PolicyAccordion({ placement, nestedClasses }) {
  const theme = useTheme();
  const refDataDepartments = useSelector(selectRefDataDepartments);
  const refDataStatusesMarketQuote = useSelector(selectRefDataStatusesMarketQuote);

  const buildChartData = (value, label) => {
    return {
      datasets: [
        {
          data: [value <= 100 ? value : Math.min(100, value - 100), value <= 100 ? 100 - value : Math.max(0, 100 - (value - 100))],
          backgroundColor: [
            value <= 100 ? theme.palette.primary.main : theme.palette.secondary.main,
            value <= 100 ? theme.palette.neutral.light : theme.palette.primary.main,
          ],
        },
      ],
      labels: [utils.string.t(label), ''],
    };
  };

  const cols = [
    { id: 'layer', label: <Translate label="placement.generic.layer" /> },
    { id: 'premium', label: <Translate label="placement.generic.premium" />, align: 'center' },
    { id: 'written', label: <Translate label="placement.generic.written" />, align: 'center', compact: true },
    { id: 'signed', label: <Translate label="placement.generic.signed" />, align: 'center', compact: true },
    { id: 'status', label: <Translate label="placement.generic.status" />, align: 'center', compact: true },
  ];

  const statusPendingId = utils.referenceData.status.getIdByCode(refDataStatusesMarketQuote, constants.STATUS_MARKET_PENDING);
  const statusQuotedId = utils.referenceData.status.getIdByCode(refDataStatusesMarketQuote, constants.STATUS_MARKET_QUOTED);
  const statusDeclinedId = utils.referenceData.status.getIdByCode(refDataStatusesMarketQuote, constants.STATUS_MARKET_DECLINED);

  const policiesFiltered = utils.generic.isValidArray(placement?.policies, true)
    ? placement.policies.filter((policy) => {
        return utils.policy.isOriginGxb(policy);
      })
    : [];

  const departmentId = get(placement, 'departmentId');
  const department = utils.referenceData.departments.getById(refDataDepartments, departmentId);
  const businessTypes = department && department.businessTypes;

  const policiesGrouped = utils.policies.getByBusinessType(policiesFiltered);

  const policiesParsed = policiesGrouped.map(([key, items]) => {
    const businessTypeName = utils.referenceData.businessTypes.getNameById(businessTypes, toNumber(key));

    const orderedItems = utils.policies.orderPolicies(items);

    return [businessTypeName, orderedItems];
  });

  // abort
  if (utils.generic.isInvalidOrEmptyArray(policiesFiltered)) return null;

  return (
    <PolicyAccordionView
      groups={policiesParsed}
      cols={cols}
      statuses={{
        quoted: statusQuotedId,
        pending: statusPendingId,
        declined: statusDeclinedId,
      }}
      handlers={{
        buildChartData,
      }}
      nestedClasses={nestedClasses}
    />
  );
}
