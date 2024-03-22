import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import classnames from 'classnames';
import get from 'lodash/get';
import has from 'lodash/has';

// app
import styles from './PolicyTableRow.styles';
import { InlineEdit, PopoverMenu, Restricted, Status, TableCell, TableCheckbox, TrafficLights, Translate } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { withStyles, TableRow, Typography } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  referenceDataStatusesPolicy: get(state, 'referenceData.statuses.policy', []),
  referenceDataStatusesPolicyMarketQuote: get(state, 'referenceData.statuses.policyMarketQuote', []),
});

export class PolicyTableRow extends PureComponent {
  static propTypes = {
    printView: PropTypes.bool,
    policy: PropTypes.object.isRequired,
    markets: PropTypes.array,
    isSelected: PropTypes.bool,
    isNextSelected: PropTypes.bool,
    isDisabled: PropTypes.bool,
    isChecked: PropTypes.bool,
    isIndeterminate: PropTypes.bool,
    isEditing: PropTypes.array,
    showPremium: PropTypes.bool,
    showWritten: PropTypes.bool,
    showSigned: PropTypes.bool,
    showStatus: PropTypes.bool,
    toggleOptions: PropTypes.object.isRequired,
    popoverItems: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        callback: PropTypes.func.isRequired,
      })
    ),
    inlineEditValues: PropTypes.object,
    inlineEditOnClick: PropTypes.func,
    inlineEditOnClickAway: PropTypes.func,
    handleToggle: PropTypes.func,
    handleSelect: PropTypes.func,
  };

  static defaultProps = {
    printView: false,
    showHeaderRow: true,
  };

  render() {
    const {
      policy,
      markets,
      isSelected,
      isNextSelected,
      isDisabled,
      isChecked,
      isIndeterminate,
      isEditing,
      showPremium,
      showWritten,
      showSigned,
      showStatus,
      toggleOptions,
      popoverItems,
      inlineEditValues,
      inlineEditOnClick,
      inlineEditOnClickAway,
      handleToggle,
      handleSelect,
      referenceDataStatusesPolicy,
      referenceDataStatusesPolicyMarketQuote,
      children,
      classes,
      printView,
      showHeaderRow,
    } = this.props;

    const statusPendingId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicyMarketQuote, constants.STATUS_MARKET_PENDING);
    const statusQuotedId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicyMarketQuote, constants.STATUS_MARKET_QUOTED);
    const statusDeclinedId = utils.referenceData.status.getIdByCode(
      referenceDataStatusesPolicyMarketQuote,
      constants.STATUS_MARKET_DECLINED
    );
    const statusPolicyNtuId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicy, constants.STATUS_POLICY_NTU);
    const statusPolicyNtuLabel = utils.referenceData.status.getLabelById(referenceDataStatusesPolicy, statusPolicyNtuId);
    const marketsQuoted = utils.markets.getByStatusIds(utils.policy.getMarkets(policy), [statusQuotedId]);

    const currency = utils.policy.getCurrency(policy);
    const layerPremiumByCurrency = utils.markets.getPremiumByCurrency(marketsQuoted, currency, false, false);

    const hasMultiplePremiums = utils.markets.hasMultiplePremiums(marketsQuoted);
    const hasPremium = layerPremiumByCurrency[currency];

    const layerName = utils.policy.getName(policy);
    const layerWritten = utils.markets.getLineSize(marketsQuoted);
    const layerSigned = utils.markets.getLineSize(marketsQuoted, true);

    const isEditingNotes = isEditing && Array.isArray(isEditing) && isEditing.includes('notes');
    const isSelectable = utils.generic.isFunction(handleSelect);
    const isToggable = utils.generic.isFunction(handleToggle);
    const isEditable = inlineEditValues && utils.generic.isFunction(inlineEditOnClick) && utils.generic.isFunction(inlineEditOnClickAway);
    const isEditableNotes = isEditable && has(inlineEditValues, 'notes');
    const isNtu = statusPolicyNtuLabel && policy.statusId === statusPolicyNtuId;

    const classesRow = {
      [classes.row]: true,
      [classes.rowSelected]: isSelected,
      [classes.rowNextSelected]: isNextSelected,
    };

    const classesNotes = {
      [classes.notes]: true,
      [classes.notesWithContent]: Boolean(isEditableNotes ? inlineEditValues['notes'] : policy.notes),
    };

    // not the best way to apply styles :(
    // but this makes the table column width more optimized, with less wasted space
    // as opposed to a generic (larger) min-width using CSS
    const minWidth =
      40 + // checkbox width
      layerName.length * 7.5 + // 7.5 is average character width
      (Boolean(isEditableNotes ? inlineEditValues['notes'] : policy.notes) ? 60 : 0) + // 60 is minimum notes width incl. margin
      (isNtu ? 60 : 0) + // 60 is approx chip width
      'px';

    return (
      <Fragment>
        {showHeaderRow && (
          <TableRow
            hover
            onClick={isToggable ? handleToggle(toggleOptions) : undefined}
            className={classnames(classesRow)}
            data-testid="policy-row"
          >
            <TableCell minimal nowrap bold nestedClasses={{ root: classes.name }} style={{ minWidth }} data-testid="policy-main-cell">
              <div className={classes.details}>
                {!printView && isSelectable && (
                  <Restricted include={[constants.ROLE_BROKER]}>
                    <TableCheckbox
                      checked={isChecked}
                      disabled={isDisabled}
                      indeterminate={isIndeterminate}
                      handleClick={handleSelect(policy.id)}
                      tooltip={isDisabled ? { title: utils.string.t('placement.sheet.layersNotAllowed') } : undefined}
                      nestedClasses={{ root: classes.checkbox }}
                      data-testid="policy-row-checkbox"
                    />
                  </Restricted>
                )}

                <span className={classes.layer} title={policy.notes && policy.notes.trim() ? policy.notes : undefined}>
                  {layerName}
                </span>

                <span className={classnames(classesNotes)}>
                  {isEditableNotes && (
                    <Fragment>
                      <Restricted include={[constants.ROLE_BROKER]}>
                        <InlineEdit
                          name="notes"
                          value={inlineEditValues['notes']}
                          editing={isEditingNotes}
                          title
                          onClick={inlineEditOnClick('notes', policy.id)}
                          onClickAway={inlineEditOnClickAway('notes', policy)}
                        />
                      </Restricted>

                      <Restricted include={[constants.ROLE_COBROKER, constants.ROLE_UNDERWRITER]}>
                        <Typography variant="body2" noWrap className={classes.notes} title={policy.notes}>
                          {policy.notes}
                        </Typography>
                      </Restricted>
                    </Fragment>
                  )}
                  {!isEditableNotes && policy.notes}
                </span>

                {isNtu && (
                  <Status
                    size="sm"
                    text={<Translate label="status.ntu" />}
                    status={statusPolicyNtuLabel}
                    data-testid={`policy-status-${policy.id}`}
                    nestedClasses={{ root: classes.status }}
                  />
                )}
              </div>
            </TableCell>

            {showPremium && (
              <TableCell narrow nowrap center bold data-testid="policy-premium-cell">
                {hasMultiplePremiums || !currency ? (
                  utils.string.t('app.various')
                ) : (
                  <Translate
                    label="format.currency"
                    options={{ value: { number: layerPremiumByCurrency[currency] || 0, currency: hasPremium ? currency : '' } }}
                  />
                )}
              </TableCell>
            )}

            {showWritten && (
              <TableCell narrow nowrap center bold data-testid="policy-written-cell">
                <Translate label="format.percent" options={{ value: { number: layerWritten } }} />
              </TableCell>
            )}

            {showSigned && (
              <TableCell narrow nowrap center bold data-testid="policy-signed-cell">
                <Translate label="format.percent" options={{ value: { number: layerSigned, default: '-' } }} />
              </TableCell>
            )}

            {showStatus && (
              <TableCell compact narrow nowrap center bold data-testid="policy-status-cell">
                {markets && markets.length > 0 && (
                  <TrafficLights
                    tooltip
                    green={utils.markets.getByStatusIds(markets, [statusQuotedId]).length}
                    yellow={utils.markets.getByStatusIds(markets, [statusPendingId]).length}
                    red={utils.markets.getByStatusIds(markets, [statusDeclinedId]).length}
                  />
                )}
              </TableCell>
            )}

            <TableCell menu data-testid="policy-menu-cell">
              {!printView && popoverItems && popoverItems.length > 0 && (
                <Restricted include={[constants.ROLE_BROKER]}>
                  <PopoverMenu
                    id="market-sheet-policy"
                    data={{
                      title: utils.policy.getName(policy),
                      type: 'policy',
                      policy: policy,
                    }}
                    items={popoverItems}
                  />
                </Restricted>
              )}
            </TableCell>
          </TableRow>
        )}
        {/* market rows - displayed if layer is selected */}
        {children}
      </Fragment>
    );
  }
}

export default compose(connect(mapStateToProps, null), withStyles(styles))(PolicyTableRow);
