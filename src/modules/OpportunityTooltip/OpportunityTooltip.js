import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { firstBy } from 'thenby';
import get from 'lodash/get';

// app
import { OpportunityTooltipView } from './OpportunityTooltip.view';
import * as utils from 'utils';

OpportunityTooltip.propTypes = {
  tooltip: PropTypes.shape({
    client: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    }),
    outputAddress: PropTypes.string,
    premiumSnapshots: PropTypes.array,
  }),
};

export default function OpportunityTooltip({ tooltip }) {
  const departments = useSelector((state) => get(state, 'referenceData.departments'));

  // abort
  if (!tooltip) return null;

  const title = get(tooltip, 'client.name');
  const address = tooltip.outputAddress;
  const previousYear = utils.app.getCurrentYear() - 1;
  const premiums = get(tooltip, 'premiumSnapshots') || [];

  const premiumsFiltered = premiums
    .filter((premium) => {
      return premium.year === previousYear && premium.premium > 0;
    })
    .map((premium) => {
      const dept = utils.referenceData.departments.getById(departments, premium.departmentId);
      premium.departmentName = dept && dept.name;
      return premium;
    })
    .sort(firstBy(utils.sort.array('numeric', 'premium', 'desc')));

  return <OpportunityTooltipView title={title} address={address} year={previousYear} premiums={premiumsFiltered} />;
}
