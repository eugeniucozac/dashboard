import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import styles from './LayerMarketTableInfoRow.style';
import { TableCell, Translate, Badge } from 'components';
import { selectRefDataStatusesMarketQuote } from 'stores';
import * as utils from 'utils';

import { makeStyles, TableRow } from '@material-ui/core';

LayerMarketTableInfoRow.propTypes = {
  marketGroup: PropTypes.array.isRequired,
};

export default function LayerMarketTableInfoRow({ marketGroup }) {
  const classes = makeStyles(styles, { name: 'LayerMarketTableInfoRow' })();

  const currency = utils.markets.getCurrency(marketGroup);
  const layerPremiumByCurrency = utils.markets.getPremiumByCurrency(marketGroup, currency, false, false);
  const hasMultiplePremiums = utils.markets.hasMultiplePremiums(marketGroup);
  const hasPremium = layerPremiumByCurrency[currency];
  const layerWritten = utils.markets.getLineSize(marketGroup);
  const referenceDataStatusesPolicyMarketQuote = useSelector(selectRefDataStatusesMarketQuote);

  const marketStatus = utils.referenceData.status.getLabelById(referenceDataStatusesPolicyMarketQuote, marketGroup[0]?.statusId);
  const badgeTypes = {
    quoted: 'success',
    declined: 'error',
    pending: 'alert',
    undefined: 'alert',
  };

  const checkRowLength = marketStatus === 'quoted' ? 0 : 1;

  return (
    <>
      {marketGroup.length > checkRowLength ? (
        <TableRow className={classes.infoRow} data-testid="layer-row">
          <TableCell colSpan={3} data-testid="layer-main-cell"></TableCell>

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

          <TableCell narrow nowrap center bold data-testid="layer-written-cell">
            <Translate label="format.percent" options={{ value: { number: layerWritten } }} />
          </TableCell>

          <TableCell compact narrow nowrap center bold data-testid="layer-status-cell">
            <Badge
              type={badgeTypes[marketStatus]}
              standalone
              badgeContent={marketGroup.length}
              showZero={true}
              className={classes.item}
              data-testid="success-badge"
            />
          </TableCell>
          <TableCell colSpan={2} data-testid="layer-main-cell"></TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
