import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import classnames from 'classnames';
import get from 'lodash/get';
import round from 'lodash/round';

// app
import styles from './LayerMarketTableRow.styles';
import { Avatar, PopoverMenu, Status, LayerComment, Restricted, TableCell, TableCheckbox, Translate, StatusIcon } from 'components';
import { selectRefDataStatusesMarketQuote, selectFormattedAccountStatusList, selectIsBroker } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { Box, TableRow, makeStyles } from '@material-ui/core';

LayerMarketTableRow.propTypes = {
  layer: PropTypes.object,
  market: PropTypes.object.isRequired,
  capacities: PropTypes.array,
  isChecked: PropTypes.bool,
  isSelected: PropTypes.bool,
  showPremium: PropTypes.bool,
  showWritten: PropTypes.bool,
  showSigned: PropTypes.bool,
  showStatus: PropTypes.bool,
  showBulkSelect: PropTypes.bool,
  showUnderwriterGroup: PropTypes.bool,
  popoverItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
  handlers: PropTypes.shape({
    bulkSelectMarket: PropTypes.func,
    toggleMarket: PropTypes.func,
  }).isRequired,
};

LayerMarketTableRow.defaultProps = {
  printView: false,
};

export function LayerMarketTableRow({
  layer,
  market,
  capacities = [],
  isChecked,
  isSelected,
  comments,
  showPremium,
  showWritten,
  showSigned,
  showStatus,
  showBulkSelect,
  showUnderwriterGroup,
  popoverItems,
  printView,
  handlers,
}) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const classes = makeStyles(styles, { name: 'LayerMarketTableRow' })();
  const referenceDataStatusesPolicyMarketQuote = useSelector(selectRefDataStatusesMarketQuote);
  const referenceDataAccountStatuses = useSelector(selectFormattedAccountStatusList);
  const percentage = round(utils.market.getLineSize(market), config.ui.format.percent.decimal);
  const underwriters = get(market, 'underwriter') || {};
  const underwritersName = utils.user.fullname(underwriters);
  const underwriterGroup = showUnderwriterGroup && utils.market.getUnderwriterGroup(market);
  const signedPercentage = round(utils.market.getLineSize(market, true), config.ui.format.percent.decimal);
  const marketName = utils.market.getName(market);
  const marketStatus = utils.referenceData.status.getLabelById(referenceDataStatusesPolicyMarketQuote, market.statusId);
  const marketPremium = market.premium;
  const currency = utils.market.getCurrency(market);
  const marketWritten = percentage;
  const marketSigned = signedPercentage;
  const marketCapacityId = get(market, 'market.capacityTypeId');
  const marketCapacity = capacities.find((c) => c.id === marketCapacityId) || {};

  const { hasComments, newComments } = comments;

  const isSelectable = utils.generic.isFunction(handlers.bulkSelectMarket);
  const hasStatus = !!(market.market && market.market.statusId);
  const userIsBorker = useSelector(selectIsBroker);

  const classesRow = {
    [classes.row]: true,
    [classes.rowSelected]: isSelected,
  };

  const marketClasses = {
    [classes.market]: true,
    [classes.marketWithoutStatus]: !hasStatus,
  };

  const handleAddComments = () => {
    setIsCommentsOpen(true);
  };

  const handleAddCommentClose = () => {
    setIsCommentsOpen(false);
  };

  const popoverItemsWithComments = [
    ...popoverItems,
    {
      id: 'addComments',
      label: utils.string.t('placement.generic.addComments'),
      callback: handleAddComments,
    },
  ];

  return (
    <TableRow
      onDoubleClick={() =>
        userIsBorker &&
        handlers.editLayerMarket({
          title: marketName,
          layer: layer,
          layerMarket: market,
        })
      }
      hover
      className={classnames(classesRow)}
      data-testid="market-row"
    >
      <TableCell minimal data-testid="market-main-cell">
        <div className={classnames(marketClasses)}>
          {!printView && isSelectable && showBulkSelect && (
            <Restricted include={[constants.ROLE_BROKER]}>
              <TableCheckbox
                checked={isChecked}
                handleClick={handlers.bulkSelectMarket(layer.id, market.id)}
                nestedClasses={{ root: classes.checkbox }}
                data-testid="market-row-checkbox"
              />
            </Restricted>
          )}
          <Restricted include={[constants.ROLE_BROKER]}>
            {hasStatus && <StatusIcon translationPath="statusMarket" list={referenceDataAccountStatuses} id={market.market.statusId} />}
          </Restricted>

          <div className={classes.marketDetails}>
            {marketName && (
              <div className={classes.marketName} data-testid="market-name">
                <Box display="flex" alignItems="center" position="relative">
                  <span>
                    {underwriterGroup && (
                      <span
                        title={utils.string.t('placement.bound.underwriterGroup', { group: underwriterGroup })}
                        className={classes.marketUnderwriterGroup}
                      >
                        [{underwriterGroup}]
                      </span>
                    )}
                    {marketName}
                  </span>
                  {marketCapacity && marketCapacity.color && (
                    <Box ml={0.5} mb={underwritersName ? '-1px' : '-2px'}>
                      <Avatar text=" " size={10} bg={marketCapacity.color} title={marketCapacity.name} />
                    </Box>
                  )}
                </Box>
                {market.isLeader && (
                  <Status
                    size="xs"
                    text={<Translate label="placement.generic.lead" />}
                    status="light"
                    nestedClasses={{ root: classes.marketTag }}
                    data-testid="market-generic-lead"
                  />
                )}
                {market.lineToStand && (
                  <Status
                    size="xs"
                    text={<Translate label="placement.generic.lineToStand" />}
                    status="light"
                    nestedClasses={{ root: classes.marketTag }}
                    data-testid="market-line-to-stand-cell"
                  />
                )}
              </div>
            )}
            {underwritersName && <div className={classes.marketContact}>{underwritersName}</div>}
          </div>
        </div>
      </TableCell>

      <TableCell narrow nowrap center data-testid="market-umr-cell">
        {market.uniqueMarketReference}
      </TableCell>

      <TableCell narrow nowrap center data-testid="market-section-cell">
        {market.section}
      </TableCell>

      {showPremium && (
        <TableCell narrow nowrap center data-testid="market-premium-cell">
          <Translate
            label="format.currency"
            options={{ value: { number: marketPremium, currency: marketPremium ? currency : '', default: '-' } }}
          />
        </TableCell>
      )}

      {showWritten && (
        <TableCell narrow nowrap center data-testid="market-written-cell">
          <Translate label="format.percent" options={{ value: { number: marketWritten, default: '-' } }} />
        </TableCell>
      )}

      {showSigned && (
        <TableCell narrow nowrap center data-testid="market-signed-cell">
          <Translate label="format.percent" options={{ value: { number: marketSigned } }} />
        </TableCell>
      )}

      {showStatus && (
        <TableCell compact narrow nowrap center data-testid="market-status-cell">
          {marketStatus && <Status size="xs" text={<Translate label={`status.${marketStatus}`} />} status={marketStatus} />}
        </TableCell>
      )}

      <TableCell compact center data-testid="market-comments-cell">
        <LayerComment
          newComments={newComments}
          hasComments={hasComments}
          isOpen={isCommentsOpen}
          handleAddCommentClose={handleAddCommentClose}
          commentsOptions={{
            id: `placement/${layer.placementId}/layerMarket/${market.id}`,
          }}
        />
      </TableCell>

      <TableCell menu data-testid="market-menu-cell">
        {!printView && popoverItems && popoverItems.length > 0 && (
          <Restricted include={[constants.ROLE_BROKER]}>
            <PopoverMenu
              id="structuring-table-row"
              data={{
                title: marketName,
                layer: layer,
                layerMarket: market,
              }}
              items={popoverItemsWithComments}
            />
          </Restricted>
        )}
      </TableCell>
    </TableRow>
  );
}

export default LayerMarketTableRow;
