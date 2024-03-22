import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';
import xor from 'lodash/xor';
import orderBy from 'lodash/orderBy';
import toNumber from 'lodash/toNumber';
import isEmpty from 'lodash/isEmpty';

// app
import { TableHead, TableRowGroup, Translate } from 'components';
import { PolicyTableRow, MarketTableRow } from 'modules';
import { selectPolicyMarket } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { Table, TableBody } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  placementSelectedPolicies: state.placement.selected.policies,
  placementSelectedDepartmentId: state.placement.selected.departmentId,
  referenceDataDepartments: state.referenceData.departments,
  referenceDataStatusesPolicyMarketQuote: state.referenceData.statuses.policyMarketQuote,
});

// dispatch
const mapDispatchToProps = {
  selectPolicyMarket,
};

export class BoundTable extends PureComponent {
  static propTypes = {
    policies: PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: {
        groups: [],
        policies: [],
        markets: null,
      },
    };
  }

  componentDidMount() {
    const { policies } = this.props;

    if (utils.generic.isValidArray(policies, true)) {
      this.setExpandedRows(policies);
    }
  }

  componentDidUpdate(prevProps) {
    const prevPolicies = prevProps.policies;
    const nextPolicies = this.props.policies;

    const noPreviousPolicies = !prevPolicies || (prevPolicies && prevPolicies.length <= 0);
    const newPolicies = utils.generic.isValidArray(nextPolicies) && nextPolicies.length > 0;

    // parse for first time
    if (noPreviousPolicies && newPolicies) {
      this.setExpandedRows(nextPolicies);
    }
  }

  handleToggleGroup = (params) => (event) => {
    let values = get(this.state, `expanded.groups`, []);

    if (values.includes(params.groups)) {
      values = values.filter((value) => {
        return value !== params.groups;
      });
    } else {
      values.push(params.groups);
    }

    this.setState({
      expanded: {
        ...this.state.expanded,
        groups: [...values],
      },
    });
  };

  handleToggleLayer = (params) => (event) => {
    const values = get(this.state, `expanded.policies`, []);

    this.setState({
      expanded: {
        ...this.state.expanded,
        policies: xor(values, [params.policy]),
      },
    });
  };

  handleToggleMarket = (marketId) => (event) => {
    this.props.selectPolicyMarket(marketId);

    this.setState({
      expanded: {
        ...this.state.expanded,
        markets: marketId,
      },
    });
  };

  isRowSelected = (type, id) => {
    const { expanded } = this.state;

    return get(expanded, `${type}`, []).includes(id);
  };

  setExpandedRows = (policies) => {
    const policiesGrouped = utils.policies.getByBusinessType(policies);
    const businessTypeId = toNumber(get(policiesGrouped, '[0][0]'));
    const isSingleLayer = get(policiesGrouped, '[0][1]', []).length === 1;

    // always expand the first group on load
    if (businessTypeId) {
      this.handleToggleGroup({ groups: businessTypeId })();
    }

    // expand layer if it's the only on in the group
    if (isSingleLayer) {
      this.handleToggleLayer({ policy: get(policiesGrouped, '[0][1][0].id') })();
    }
  };

  render() {
    const { policies, placementSelectedDepartmentId, referenceDataDepartments, referenceDataStatusesPolicyMarketQuote } = this.props;
    const { expanded } = this.state;

    const department = utils.referenceData.departments.getById(referenceDataDepartments, placementSelectedDepartmentId);
    const businessTypes = department && department.businessTypes;

    const cols = [
      { id: 'layer' },
      { id: 'premium', label: <Translate label="placement.generic.premium" />, align: 'center', compact: true },
      { id: 'written', label: <Translate label="placement.generic.written" />, align: 'center', compact: true },
      { id: 'signed', label: <Translate label="placement.generic.signed" />, align: 'center', compact: true },
      { id: 'actions', empty: true },
    ];

    return (
      <Fragment>
        <Table>
          <TableHead columns={cols} />

          {utils.policies.getByBusinessType(policies).map((arr) => {
            const businessTypeId = toNumber(arr[0]);
            const businessType = utils.referenceData.businessTypes.getById(businessTypes, businessTypeId);
            const businessTypeName = businessType && businessType.description;
            const policies = orderBy(arr[1], ['excess', 'amount'], ['asc', 'asc']);
            const statusQuotedId = utils.referenceData.status.getIdByCode(
              referenceDataStatusesPolicyMarketQuote,
              constants.STATUS_MARKET_QUOTED
            );
            const isGroupSelected = this.isRowSelected('groups', businessTypeId);
            const isFirstParentExpanded = this.isRowSelected('policies', policies[0].id);

            const toggleOptions = {
              groups: businessTypeId,
            };

            const businessTypeMarketCount = policies.reduce((acc, policy) => {
              if (!policy.markets || isEmpty(policy.markets)) return acc;

              const markets = utils.markets.getByStatusIds(policy.markets, [statusQuotedId]);
              return acc + markets.length;
            }, 0);

            return (
              <Fragment key={businessTypeId}>
                <TableBody>
                  {businessTypeMarketCount > 0 && (
                    <Fragment>
                      <TableRowGroup
                        name={businessTypeName}
                        isExpanded={isGroupSelected}
                        isFirstParentExpanded={isGroupSelected && isFirstParentExpanded}
                        columns={cols}
                        toggleOptions={toggleOptions}
                        handleToggleGroup={this.handleToggleGroup}
                      />

                      {policies.map((policy, index) => {
                        const isLayerSelected = get(expanded, `policies`, []).includes(policy.id);
                        const isNextSelected = policies[index + 1] && this.isRowSelected('policies', policies[index + 1].id);
                        const marketsAll = utils.policy.getMarkets(policy);
                        const marketsQuoted = utils.markets.getByStatusIds(marketsAll, [statusQuotedId]);
                        const marketsOrdered = utils.markets.order(marketsQuoted, true);

                        const toggleOptions = {
                          policy: policy.id,
                        };

                        if (isGroupSelected && marketsOrdered.length > 0) {
                          return (
                            <PolicyTableRow
                              key={policy.id}
                              policy={policy}
                              isSelected={isLayerSelected}
                              isNextSelected={!isLayerSelected && isNextSelected}
                              showPremium
                              showWritten
                              showSigned
                              toggleOptions={toggleOptions}
                              handleToggle={this.handleToggleLayer}
                            >
                              {marketsOrdered.map((marketObj, marketIndex) => {
                                if (isLayerSelected) {
                                  return (
                                    <MarketTableRow
                                      key={marketObj.id}
                                      market={marketObj}
                                      isLast={marketIndex === marketsOrdered.length - 1}
                                      showPremium
                                      showWritten
                                      showSigned
                                      showUnderwriterGroup
                                      handleToggle={this.handleToggleMarket}
                                    />
                                  );
                                }

                                return null;
                              })}
                            </PolicyTableRow>
                          );
                        }

                        return null;
                      })}
                    </Fragment>
                  )}
                </TableBody>
              </Fragment>
            );
          })}
        </Table>
      </Fragment>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps))(BoundTable);
