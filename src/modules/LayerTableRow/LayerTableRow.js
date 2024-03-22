import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';

// app
import styles from './LayerTableRow.styles';
import { TableCell, TrafficLights, Translate } from 'components';
import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { withStyles, TableRow } from '@material-ui/core';

// state
const mapStateToProps = (state) => ({
  referenceDataStatusesPolicy: get(state, 'referenceData.statuses.policy', []),
  referenceDataStatusesPolicyMarketQuote: get(state, 'referenceData.statuses.policyMarketQuote', []),
});

export class LayerTableRow extends PureComponent {
  static propTypes = {
    layer: PropTypes.object.isRequired,
    markets: PropTypes.array,
    showPremium: PropTypes.bool,
    showWritten: PropTypes.bool,
    showSigned: PropTypes.bool,
    showStatus: PropTypes.bool,
  };

  static defaultProps = {
    printView: false,
    showHeaderRow: true,
  };

  render() {
    const {
      layer,
      markets,
      showPremium,
      showWritten,
      showSigned,
      showStatus,
      referenceDataStatusesPolicyMarketQuote,
      children,
      classes,
      showHeaderRow,
    } = this.props;

    const statusPendingId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicyMarketQuote, constants.STATUS_MARKET_PENDING);
    const statusQuotedId = utils.referenceData.status.getIdByCode(referenceDataStatusesPolicyMarketQuote, constants.STATUS_MARKET_QUOTED);
    const statusDeclinedId = utils.referenceData.status.getIdByCode(
      referenceDataStatusesPolicyMarketQuote,
      constants.STATUS_MARKET_DECLINED
    );
    const currency = utils.markets.getCurrency(markets);
    const marketsQuoted = utils.markets.getByStatusIds(utils.layer.getMarkets(layer), [statusQuotedId]);

    const layerPremiumByCurrency = utils.markets.getPremiumByCurrency(marketsQuoted, currency, false, false);

    const hasMultiplePremiums = utils.markets.hasMultiplePremiums(marketsQuoted);
    const hasPremium = layerPremiumByCurrency[currency];

    const layerWritten = utils.markets.getLineSize(marketsQuoted);
    const layerSigned = utils.markets.getLineSize(marketsQuoted, true);

    return (
      <Fragment>
        {/* market rows */}
        {children}

        {/* layer total row */}
        {showHeaderRow && (
          <TableRow className={classes.row} data-testid="layer-row">
            <TableCell minimal colSpan={3} data-testid="layer-main-cell"></TableCell>

            {showPremium && (
              <TableCell narrow nowrap center bold data-testid="layer-premium-cell">
                {hasMultiplePremiums || !currency ? (
                  utils.string.t('app.various')
                ) : (
                  <Translate
                    label="format.currency"
                    options={{
                      value: {
                        number: Boolean(layerPremiumByCurrency[currency]) ? layerPremiumByCurrency[currency] : null,
                        currency: hasPremium ? currency : '',
                        default: '-',
                      },
                    }}
                  />
                )}
              </TableCell>
            )}

            {showWritten && (
              <TableCell narrow nowrap center bold data-testid="layer-written-cell">
                <Translate label="format.percent" options={{ value: { number: layerWritten } }} />
              </TableCell>
            )}

            {showSigned && (
              <TableCell narrow nowrap center bold data-testid="layer-signed-cell">
                <Translate label="format.percent" options={{ value: { number: layerSigned, default: '-' } }} />
              </TableCell>
            )}

            {showStatus && (
              <TableCell compact narrow nowrap center bold data-testid="layer-status-cell">
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

            <TableCell minimal colSpan={2} />
          </TableRow>
        )}
      </Fragment>
    );
  }
}

export default compose(connect(mapStateToProps, null), withStyles(styles))(LayerTableRow);
