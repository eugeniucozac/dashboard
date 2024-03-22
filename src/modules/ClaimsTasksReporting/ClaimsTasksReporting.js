import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { isEmpty } from 'lodash';

// app
import { ClaimsTasksReportingView } from './ClaimsTasksReporting.view';
import * as constants from 'consts';
import * as utils from 'utils';

import { getClaimsTasksReporting, selectClaimsTasksReporting, selectClaimsTasksReportingLoader, selectUserRole } from 'stores';

ClaimsTasksReporting.propTypes = {
  isExpanded: PropTypes.bool,
};

ClaimsTasksReporting.defaultProps = {
  isExpanded: false,
};

export default function ClaimsTasksReporting({ isExpanded }) {
  const dispatch = useDispatch();

  const data = useSelector(selectClaimsTasksReporting);
  const isDataLoading = useSelector(selectClaimsTasksReportingLoader);
  const userRole = useSelector(selectUserRole);

  const [expanded, setExpanded] = useState(!isEmpty(data));

  const buildChartData = (value, label, colors) => {
    return {
      labels: label,
      datasets: [
        {
          data: value,
          backgroundColor: colors,
        },
      ],
    };
  };

  const toggle = () => {
    !isExpanded && setExpanded(!expanded);
  };

  useEffect(() => {
    dispatch(getClaimsTasksReporting(constants.BUSINESS_PROCESS_CLAIMS_NAME));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!isEmpty(data) && !isDataLoading) {
      setExpanded(true);
    }
  }, [data, isDataLoading]); // eslint-disable-line react-hooks/exhaustive-deps

  // hide component when user has no permission
  if (utils.user.isTechnicianMphasis(userRole?.[0]) || utils.user.isTechnicianArdonagh(userRole?.[0])) return null;

  return (
    <ClaimsTasksReportingView
      data={data}
      expanded={isExpanded || expanded}
      isDataLoading={isDataLoading}
      isExpanded={isExpanded}
      handlers={{
        buildChartData,
        toggle,
      }}
    />
  );
}
