import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import get from 'lodash/get';
import has from 'lodash/has';
import xor from 'lodash/xor';
import orderBy from 'lodash/orderBy';
import toNumber from 'lodash/toNumber';
import isEmpty from 'lodash/isEmpty';
import isNumber from 'lodash/isNumber';

// app
import styles from './MarketSheetTable.styles.js';
import { TableHead, Translate } from 'components';
import { MarketTableRow, PolicyTableRow } from 'modules';
import {
  bulkPlacementToggle,
  deletePlacementPolicy,
  putPlacementEditPolicy,
  postPlacementEditQuote,
  selectPolicyMarket,
  showModal,
} from 'stores';
import * as utils from 'utils';

// mui
import { Table, TableBody, TableCell, withStyles, TableRow } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  configVars: state.config.vars,
  placementBulkType: get(state, 'placement.bulk.type', ''),
  placementBulkItems: get(state, 'placement.bulk.items', []),
});

// dispatch
const mapDispatchToProps = {
  selectPolicyMarket,
  bulkPlacementToggle,
  deletePlacementPolicy,
  putPlacementEditPolicy,
  postPlacementEditQuote,
  showModal,
};

export class MarketSheetTable extends PureComponent {
  static propTypes = {
    year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    option: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    policies: PropTypes.array.isRequired,
    capacities: PropTypes.array,
    printView: PropTypes.bool,
    rowLimit: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      expanded: {
        groups: [],
        policies: [],
        markets: null,
      },
      editing: {},
    };
  }

  static defaultProps = {
    printView: false,
    showHeaderRow: true,
  };

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

  handleEditPolicyClick = (popoverData) => {
    this.props.showModal({
      component: 'EDIT_POLICY',
      props: {
        title: 'placement.sheet.editPolicy',
        subtitle: popoverData.title,
        fullWidth: true,
        maxWidth: 'sm',
        componentProps: {
          policy: popoverData.policy,
        },
      },
    });
  };

  handleDeleteClick = (popoverData) => {
    this.props.showModal({
      component: 'CONFIRM_DELETE',
      props: {
        title: 'placement.sheet.deletePolicy',
        subtitle: popoverData.title,
        fullWidth: true,
        maxWidth: 'xs',
        disableAutoFocus: true,
        componentProps: {
          submitHandler: () => this.props.deletePlacementPolicy(get(popoverData, 'policy.id')),
        },
      },
    });
  };

  handleAddMarketClick = (popoverData) => {
    this.props.showModal({
      component: 'ADD_MARKET',
      props: {
        title: 'placement.sheet.addMarket',
        subtitle: popoverData.title,
        fullWidth: true,
        maxWidth: 'sm',
        disableAutoFocus: true,
        componentProps: {
          policy: popoverData.policy,
        },
      },
    });
  };

  handleCreateWhitespaceClick = (popoverData) => {
    this.props.showModal({
      component: 'CREATE_IN_WHITESPACE',
      props: {
        title: 'placement.sheet.createInWhitespace',
        fullWidth: true,
        maxWidth: 'sm',
        disableAutoFocus: true,
        componentProps: {
          policy: popoverData.policy,
        },
      },
    });
  };

  handleEditQuoteClick = (popoverData) => {
    this.props.showModal({
      component: 'EDIT_QUOTE',
      props: {
        title: 'placement.sheet.editQuote',
        subtitle: popoverData.title,
        fullWidth: true,
        maxWidth: 'sm',
        disableAutoFocus: true,
        componentProps: {
          policy: popoverData.policy,
          policyMarket: popoverData.policyMarket,
        },
      },
    });
  };

  handleInlineEditClick = (field, id) => () => {
    this.setState({
      editing: {
        [field]: id,
      },
    });
  };

  handleInlineEditClickAway = (values, errors, submitForm) => (field, object) => (event) => {
    const isDiff = object[field] !== values[field];
    const isTruthy = Boolean(values[field]) || values[field] === 0;
    const isFalsy = !Boolean(values[field]);
    const wasTruthy = Boolean(object[field]) || object[field] === 0;
    const isValuesChanged = (isDiff && isTruthy) || (isDiff && wasTruthy && isFalsy);

    // if values have changed -> submit form
    if (isValuesChanged) {
      submitForm();
    }

    // if errors, prevent changing editing fields
    if (isEmpty(errors)) {
      this.setState({
        editing: {},
      });
    }
  };

  handleToggleGroup = (params) => (event) => {
    let values = get(this.state, `expanded.groups.${params.year}.${params.option}`, []);

    if (values.includes(params.key)) {
      values = values.filter((value) => {
        return value !== params.key;
      });
    } else {
      values.push(params.key);
    }

    this.setState((currentState) => {
      return {
        ...currentState,
        expanded: {
          ...currentState.expanded,
          groups: {
            [params.year]: {
              [params.option]: [...values],
            },
          },
        },
      };
    });
  };

  handleToggleLayer = (markets) => (params) => (event) => {
    if (!markets || markets.length <= 0) return;

    const values = get(this.state, `expanded.policies.${params.year}.${params.option}`, []);

    this.setState((currentState) => {
      return {
        ...currentState,
        expanded: {
          ...currentState.expanded,
          policies: {
            [params.year]: {
              [params.option]: xor(values, [params.policy]),
            },
          },
        },
      };
    });
  };

  handleSelectLayer = (policyId) => (event) => {
    event.stopPropagation();
    this.props.bulkPlacementToggle('policy', policyId);
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

  handleSelectMarket = (marketId) => (event) => {
    event.stopPropagation();
    this.props.bulkPlacementToggle('policyMarket', marketId);
  };

  getSelectedBulkMarketsByPolicy = (policy) => {
    const bulkItems = get(this.props, 'placementBulkItems', []);
    const markets = get(policy, 'markets') || [];

    return markets.filter((marketObj) => {
      return has(marketObj, 'id') && bulkItems.includes(marketObj.id);
    });
  };

  setExpandedRows = (policies) => {
    const { year, option } = this.props;
    const policiesGrouped = utils.policies.getByBusinessType(policies);
    const businessTypeId = toNumber(get(policiesGrouped, '[0][0]'));
    const isSingleLayer = get(policiesGrouped, '[0][1]', []).length === 1;

    // always expand the first group on load
    if (businessTypeId) {
      this.handleToggleGroup({ year, option, key: businessTypeId })();
    }

    // expand layer if it's the only on in the group
    if (isSingleLayer) {
      const markets = get(policiesGrouped, '[0][1][0].markets');
      this.handleToggleLayer(markets)({ year, option, policy: get(policiesGrouped, '[0][1][0].id') })();
    }
  };

  isRowSelected = (type, id) => {
    const { expanded } = this.state;
    const { year, option } = this.props;

    return get(expanded, `${type}.${year}.${option}`, []).includes(id);
  };

  isRowEditing = (entries, id) => {
    return Object.entries(entries)
      .filter((e) => e[1] === id)
      .map((e) => e[0]);
  };

  render() {
    const {
      year,
      option,
      policies,
      capacities,
      configVars,
      placementBulkType,
      placementBulkItems,
      putPlacementEditPolicy,
      postPlacementEditQuote,
      printView,
      rowLimit,
      classes,
    } = this.props;
    const { expanded, editing } = this.state;

    const cols = [
      { id: 'layer' },
      { id: 'premium', label: <Translate label="placement.generic.premium" />, align: 'center', compact: true },
      { id: 'written', label: <Translate label="placement.generic.written" />, align: 'center', compact: true },
      { id: 'status', label: <Translate label="placement.generic.status" />, align: 'center', compact: true },
      { id: 'actions', empty: true },
    ];

    return (
      <Table data-testid="market-sheet-table">
        <TableHead columns={cols} />

        {utils.policies.getByBusinessType(policies).map((arr) => {
          const businessTypeId = toNumber(arr[0]);
          const policies = orderBy(arr[1], ['excess', 'amount'], ['asc', 'asc']);
          const bulkType = placementBulkType;
          const isBulkPolicy = placementBulkType === 'policy';
          const isBulkMarket = placementBulkType === 'policyMarket';

          return (
            <TableBody key={businessTypeId}>
              {policies.map((policy, index) => {
                const isLayerSelected = this.isRowSelected('policies', policy.id);
                const isNextSelected = policies[index + 1] && this.isRowSelected('policies', policies[index + 1].id);
                const isLayerChecked = isBulkPolicy && placementBulkItems.includes(policy.id);
                const isLayerDisabled = Boolean(bulkType && !isBulkPolicy);
                const isLayerIndeterminate = isLayerDisabled && this.getSelectedBulkMarketsByPolicy(policy).length > 0;
                const isLayerEditing = this.isRowEditing(editing, policy.id);
                const markets = get(policy, 'markets') || [];
                const marketsOrdered = utils.markets.order(markets);

                const toggleOptions = {
                  year: year,
                  option: option,
                  policy: policy.id,
                };

                const limitedRows =
                  rowLimit && isNumber(rowLimit) ? utils.placementPDF.getAccumulatedRowCount(marketsOrdered, rowLimit) : marketsOrdered;

                const layerFormFields = [
                  {
                    name: 'id',
                    type: 'hidden',
                    value: policy.id,
                  },
                  {
                    name: 'departmentId',
                    type: 'hidden',
                    value: policy.departmentId,
                  },
                  {
                    name: 'businessTypeId',
                    type: 'hidden',
                    value: policy.businessTypeId,
                  },
                  {
                    name: 'notes',
                    type: 'textarea',
                    value: policy.notes || '',
                    validation: Yup.string().max(280),
                    muiComponentProps: {
                      multiline: true,
                      minRows: 1,
                      maxRows: 3,
                    },
                  },
                ];
                return (
                  <Formik
                    key={policy.id}
                    enableReinitialize={true}
                    initialValues={utils.form.getInitialValues(layerFormFields)}
                    validationSchema={utils.form.getValidationSchema(layerFormFields)}
                    onSubmit={(values, { setSubmitting }) => {
                      putPlacementEditPolicy(values);
                      setSubmitting(false);
                    }}
                  >
                    {({ values, errors, touched, submitForm }) => {
                      return (
                        <PolicyTableRow
                          printView={printView}
                          showHeaderRow={policy.showHeaderRow}
                          policy={policy}
                          markets={markets}
                          isSelected={isLayerSelected}
                          isNextSelected={!isLayerSelected && isNextSelected}
                          isChecked={isLayerChecked}
                          isDisabled={isLayerDisabled}
                          isIndeterminate={isLayerIndeterminate}
                          isEditing={isLayerEditing}
                          showPremium
                          showWritten
                          showStatus
                          toggleOptions={toggleOptions}
                          inlineEditValues={values}
                          inlineEditOnClick={this.handleInlineEditClick}
                          inlineEditOnClickAway={this.handleInlineEditClickAway(values, errors, submitForm)}
                          handleToggle={this.handleToggleLayer(markets)}
                          handleSelect={this.handleSelectLayer}
                          popoverItems={[
                            {
                              id: 'editPolicy',
                              label: 'placement.sheet.editPolicy',
                              callback: this.handleEditPolicyClick,
                            },
                            {
                              id: 'deletePolicy',
                              label: 'placement.sheet.deletePolicy',
                              callback: this.handleDeleteClick,
                            },
                            {
                              id: 'addMarket',
                              label: 'placement.sheet.addMarket',
                              callback: this.handleAddMarketClick,
                            },
                            ...(utils.app.isDevelopment(configVars)
                              ? [
                                  {
                                    id: 'createWhitespace',
                                    label: 'placement.sheet.createInWhitespace',
                                    callback: this.handleCreateWhitespaceClick,
                                  },
                                ]
                              : []),
                          ]}
                          data-testid={policy.id}
                        >
                          {limitedRows.map((marketObj, index) => {
                            const isMarketChecked = isBulkMarket && placementBulkItems.includes(marketObj.id);
                            const isMarketDisabled = Boolean(bulkType && bulkType !== 'policyMarket');
                            const isMarketSelected = marketObj.id === expanded.market;
                            const isMarketEditing = this.isRowEditing(editing, marketObj.id);

                            const marketFormFields = [
                              {
                                name: 'policyMarketId',
                                type: 'hidden',
                                value: marketObj.id,
                              },
                              {
                                name: 'premium',
                                type: 'number',
                                value: marketObj.premium === 0 ? 0 : marketObj.premium || '',
                                validation: Yup.number().currency(),
                              },
                              {
                                name: 'writtenLinePercentage',
                                type: 'number',
                                value: marketObj.writtenLinePercentage === 0 ? 0 : marketObj.writtenLinePercentage || '',
                                validation: Yup.number().min(0).max(100).percent(),
                              },
                            ];

                            if (isLayerSelected || printView) {
                              return (
                                <Fragment key={marketObj.id}>
                                  <Formik
                                    key={marketObj.id}
                                    enableReinitialize={true}
                                    initialValues={utils.form.getInitialValues(marketFormFields)}
                                    validationSchema={utils.form.getValidationSchema(marketFormFields)}
                                    onSubmit={(values, { setSubmitting }) => {
                                      postPlacementEditQuote(values);
                                      setSubmitting(false);
                                    }}
                                  >
                                    {({ values, errors, touched, submitForm }) => {
                                      return (
                                        <MarketTableRow
                                          printView={printView}
                                          policy={policy}
                                          market={marketObj}
                                          capacities={capacities}
                                          isLast={index === limitedRows.length - 1}
                                          isChecked={isMarketChecked}
                                          isDisabled={isMarketDisabled}
                                          isSelected={isMarketSelected}
                                          isEditing={isMarketEditing}
                                          showPremium
                                          showWritten
                                          showStatus
                                          inlineEditValues={values}
                                          inlineEditOnClick={this.handleInlineEditClick}
                                          inlineEditOnClickAway={this.handleInlineEditClickAway(values, errors, submitForm)}
                                          handleToggle={this.handleToggleMarket}
                                          handleSelect={this.handleSelectMarket}
                                          popoverItems={[
                                            {
                                              id: 'editQuote',
                                              label: 'placement.sheet.editQuote',
                                              callback: this.handleEditQuoteClick,
                                            },
                                          ]}
                                        />
                                      );
                                    }}
                                  </Formik>
                                  {printView && marketObj.seeNoteMessage ? (
                                    <TableRow className={classes.seeNotesRow}>
                                      <TableCell colSpan={4}>
                                        {utils.string.t('placement.firmOrder.seeNotes', { label: marketObj.seeNoteMessage })}
                                      </TableCell>
                                    </TableRow>
                                  ) : null}
                                </Fragment>
                              );
                            }
                            return null;
                          })}
                        </PolicyTableRow>
                      );
                    }}
                  </Formik>
                );
              })}
            </TableBody>
          );
        })}
      </Table>
    );
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), withStyles(styles))(MarketSheetTable);
