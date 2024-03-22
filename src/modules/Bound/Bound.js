import React, { PureComponent, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';

// app
import { Overflow, SectionHeader, Translate } from 'components';
import { BoundTable } from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import LockIcon from '@material-ui/icons/Lock';

// state
const mapStateToProps = (state) => ({
  placementSelected: state.placement.selected,
  referenceDataStatusesPolicy: state.referenceData.statuses.policy,
  referenceDataStatusesPolicyMarketQuote: state.referenceData.statuses.policyMarketQuote,
});

export class Bound extends PureComponent {
  render() {
    const { placementSelected, referenceDataStatusesPolicy, referenceDataStatusesPolicyMarketQuote } = this.props;

    const policies = get(placementSelected, 'policies') || [];

    const policiesFiltered = policies.filter((policy) => {
      const statusQuotedId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicyMarketQuote, constants.STATUS_MARKET_QUOTED);

      // check if policy is from origin GXB
      const isGxb = utils.policy.isOriginGxb(policy);

      // check if policy has markets with quotes
      const marketsAll = get(policy, 'markets') || [];
      const marketsQuoted = utils.markets.getByStatusIds(marketsAll, [statusQuotedId]);
      const hasMarkets = marketsQuoted.length > 0;

      // check if policy is NTU
      const statusPolicyNtuId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicy, constants.STATUS_POLICY_NTU);
      const isInProgress = policy.statusId !== statusPolicyNtuId;

      return isGxb && hasMarkets && isInProgress;
    });

    if (placementSelected) {
      return (
        <Fragment>
          <SectionHeader title={<Translate label="placement.bound.title" />} icon={LockIcon} testid="placement-bound" />

          <Overflow>
            <BoundTable policies={policiesFiltered} />
          </Overflow>
        </Fragment>
      );
    } else {
      return null;
    }
  }
}

export default compose(connect(mapStateToProps, null))(Bound);
