import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import kebabCase from 'lodash/kebabCase';
import round from 'lodash/round';

// app
import styles from './MarketingMarkets.styles';
import {
  Avatar,
  Overflow,
  PopoverMenu,
  Restricted,
  Status,
  StatusIcon,
  TableCell,
  TableHead,
  TrafficLights,
  Translate,
  TableCheckbox,
} from 'components';
import { MarketingMarketsBulk } from 'modules';
import { selectIsBroker } from 'stores';
import * as constants from 'consts';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Box, Table, TableRow, TableBody } from '@material-ui/core';

MarketingMarketsView.propTypes = {
  items: PropTypes.array,
  groups: PropTypes.array,
  cols: PropTypes.array.isRequired,
  placementId: PropTypes.number.isRequired,
  marketAccountStatuses: PropTypes.array.isRequired,
  handleEditMarket: PropTypes.func.isRequired,
  popoverActions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
  bulk: PropTypes.shape({
    marketingMarkets: PropTypes.array.isRequired,
  }),
  handlers: PropTypes.shape({
    bulkSelectMarketingMarket: PropTypes.func.isRequired,
    changeMarket: PropTypes.func.isRequired,
  }),
  showBulkSelect: PropTypes.bool,
};

export function MarketingMarketsView({
  groups,
  cols,
  marketAccountStatuses,
  popoverActions,
  handleEditMarket,
  showBulkSelect,
  bulk,
  handlers,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'MarketingMarkets' })({ wide: media.wideUp });
  const userIsBorker = useSelector(selectIsBroker);
  const markets = groups.map((group) => group.markets);

  return (
    <Box mt={-1} data-testid="placement-marketing-markets">
      {groups &&
        utils.generic.isValidArray(groups, true) &&
        groups.map((group) => {
          const groupName = kebabCase(group.name);
          const markets = utils.sort.arrayNestedPropertyValue(group.markets, 'market.edgeName', 'asc');

          return (
            <Box mb={2} key={`${group.id}-${groupName}`}>
              <Overflow>
                <Table size="small" data-testid={`table-capacity-${group.id}-${groupName}`}>
                  <TableHead
                    columns={cols.map((col) => {
                      const isTitle = col.id === 'name';

                      if (isTitle) {
                        col.label = (
                          <Box display="flex" alignItems="center" position="relative">
                            <span>{group.name}</span>
                            {group.color && (
                              <Box ml={0.75} mb={-0.25}>
                                <Avatar text=" " size={10} bg={group.color} title={group.name} />
                              </Box>
                            )}
                          </Box>
                        );
                      }

                      return { ...col };
                    })}
                  />

                  <TableBody data-testid="list">
                    {utils.generic.isValidArray(markets, true) &&
                      markets.map((item) => {
                        const hasStatus = !!(item.market && item.market.statusId);
                        const hasTrafficLights = Object.values(item.quotes).some((q) => q.length > 0);
                        const isChecked = bulk.marketingMarkets.includes(item.id);
                        const getMarketAmounts = (market) => {
                          const currency = utils.market.getCurrency(market);
                          const premium = utils.market.getPremium(market, false);
                          const written = round(utils.market.getLineSize(market), config.ui.format.percent.decimal);

                          const premiumString =
                            premium || premium === 0
                              ? utils.string.t('format.currency', {
                                  value: { number: premium, currency: premium ? currency : '', default: '-' },
                                })
                              : '';

                          const writtenString =
                            written || written === 0 ? utils.string.t('format.percent', { value: { number: written, default: '-' } }) : '';

                          return `<span>${
                            writtenString ? (premiumString ? `${premiumString} @ ${writtenString}` : `@ ${writtenString}`) : premiumString
                          }</span>`;
                        };

                        const getStatusContent = (quotes, type) => {
                          const typeCount = `${utils.string.t(`status.${type}`)}: ${quotes[type]?.length}`;

                          return `
                              ${`<strong>${typeCount}</strong>`}
                              <br/>
                              ${quotes[type]?.items
                                .map((market) => {
                                  return [market.placementlayerBusinessType, market.placementlayerName, getMarketAmounts(market)].join(
                                    ' - '
                                  );
                                })
                                .join('<br/>')}
                            `;
                        };

                        const tooltipContent = hasTrafficLights && (
                          <div
                            className={classes.tooltipContent}
                            dangerouslySetInnerHTML={{
                              __html: [
                                item.quotes.quoted?.length > 0 ? getStatusContent(item.quotes, 'quoted') : null,
                                item.quotes.pending?.length > 0 ? getStatusContent(item.quotes, 'pending') : null,
                                item.quotes.declined?.length > 0 ? getStatusContent(item.quotes, 'declined') : null,
                              ]
                                .filter(Boolean)
                                .join('<br/><br/>'),
                            }}
                          />
                        );

                        return (
                          <TableRow
                            key={item.id}
                            onDoubleClick={() => userIsBorker && handleEditMarket({ placementMarket: item })}
                            className={classnames(classes.row, {
                              [classes.rowNew]: Boolean(item.__new__),
                            })}
                          >
                            <TableCell nestedClasses={{ root: classes.cellsMarkets }}>
                              <div className={classes.market}>
                                <Restricted include={[constants.ROLE_BROKER]}>
                                  {showBulkSelect && (
                                    <TableCheckbox
                                      checked={isChecked}
                                      handleClick={handlers.bulkSelectMarketingMarket(item.id)}
                                      nestedClasses={{ root: classes.checkbox }}
                                      data-testid="market-row-checkbox"
                                    />
                                  )}
                                  <div className={classes.marketStatus}>
                                    {hasStatus && (
                                      <StatusIcon translationPath="statusMarket" list={marketAccountStatuses} id={item.market.statusId} />
                                    )}
                                  </div>
                                </Restricted>
                                <div className={classes.marketName}>
                                  {utils.market.getName(item)}
                                  {item.notes && <div className={classes.marketNotes}>{item.notes}</div>}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              {!hasTrafficLights && item.statusLabel && (
                                <Status size="xs" text={<Translate label={`status.${item.statusLabel}`} />} status={item.statusLabel} />
                              )}
                              {hasTrafficLights && (
                                <TrafficLights
                                  tooltip
                                  tooltipContent={tooltipContent}
                                  tooltipProps={{
                                    rich: true,
                                    placement: 'left',
                                    nestedClasses: {
                                      tooltip: classes.tooltipRoot,
                                    },
                                  }}
                                  green={item.quotes?.quoted?.length}
                                  yellow={item.quotes?.pending?.length}
                                  red={item.quotes?.declined?.length}
                                />
                              )}
                            </TableCell>
                            <TableCell nestedClasses={{ root: classes.cellsUnderwriters }}>
                              {utils.user.fullname(item.underwriter)}
                            </TableCell>
                            <TableCell menu>
                              <PopoverMenu id="placement-marketing-market" data={{ placementMarket: item }} items={popoverActions} />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </Overflow>
            </Box>
          );
        })}
      {markets && markets.length > 0 ? <MarketingMarketsBulk markets={markets} /> : null}
    </Box>
  );
}
