import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';
import groupBy from 'lodash/groupBy';

// app
import styles from './StructuringTable.styles.js';
import { PopoverMenu, Restricted, Status, TableCheckbox, TableHead, Translate } from 'components';
import { LayerTableRow, LayerMarketTableRow, LayerMarketTableInfoRow } from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Box, Table, TableBody, TableCell, TableRow } from '@material-ui/core';

StructuringTableView.propTypes = {
  layers: PropTypes.array.isRequired,
  commentIDs: PropTypes.array,
  cols: PropTypes.array.isRequired,
  capacityTypes: PropTypes.array.isRequired,
  marketSelectedId: PropTypes.number,
  rowLimit: PropTypes.number,
  printView: PropTypes.bool,
  statuses: PropTypes.shape({
    policyNtu: PropTypes.object,
    policyMarketQuoteStatuses: PropTypes.array,
  }).isRequired,
  bulk: PropTypes.shape({
    type: PropTypes.string,
    items: PropTypes.array,
    itemsMarkets: PropTypes.array,
  }).isRequired,
  handlers: PropTypes.shape({
    bulkSelectLayer: PropTypes.func,
    bulkSelectMarket: PropTypes.func,
    editLayer: PropTypes.func,
    deleteLayer: PropTypes.func,
    addLayerMarket: PropTypes.func,
    editLayerMarket: PropTypes.func,
    deleteLayerMarket: PropTypes.func,
    getSelectedBulkMarketsByLayer: PropTypes.func,
    toggleMarket: PropTypes.func,
    bulkSelectToggle: PropTypes.func,
  }).isRequired,
};

export function StructuringTableView({
  layers: layersArray,
  commentIDs,
  marketSelectedId,
  cols,
  capacityTypes,
  rowLimit,
  printView,
  showBulkSelect,
  statuses,
  bulk,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'StructuringTable' })();

  const layers = utils.layers.orderLayers(layersArray);

  const statusQuotedId = utils.referenceData.status.getIdByCode(statuses.policyMarketQuoteStatuses, constants.STATUS_MARKET_QUOTED);
  const statusPendingID = utils.referenceData.status.getIdByCode(statuses.policyMarketQuoteStatuses, constants.STATUS_MARKET_PENDING);
  const statusDeclinedID = utils.referenceData.status.getIdByCode(statuses.policyMarketQuoteStatuses, constants.STATUS_MARKET_DECLINED);

  // abort
  if (utils.generic.isInvalidOrEmptyArray(layers)) return null;

  return (
    <Box display="inline-block" minWidth="100%">
      {layers.map((layer, index) => {
        const layerName = utils.layer.getName(layer);
        const isNtu = layer.statusId === statuses.policyNtu.id;
        const markets = get(layer, 'markets') || [];
        const marketsOrdered = utils.markets.order(markets);
        const currency = utils.markets.getCurrency(markets);
        const limitedRows =
          rowLimit && isNumber(rowLimit) ? utils.placementPDF.getAccumulatedRowCount(marketsOrdered, rowLimit) : marketsOrdered;
        const isLayerChecked = bulk.items.includes(layer.id);

        const rowGroups = groupBy(limitedRows, (row) => row.statusId);

        let quotedMarkets = [];
        let pendingMarkets = [];
        let declinedMarkets = [];
        let marketsWithNoStatus = [];

        if (rowGroups[statusQuotedId]) {
          const marketObject = groupBy(rowGroups[statusQuotedId], (row) => row.premium);
          Object.keys(marketObject).map((group) => {
            quotedMarkets?.push(marketObject[group]);
            return true;
          });
        }

        if (rowGroups[statusPendingID]) {
          const marketObject = groupBy(rowGroups[statusPendingID], (row) => row.statusId);
          Object.keys(marketObject).map((group) => {
            pendingMarkets?.push(marketObject[group]);
            return true;
          });
        }
        if (rowGroups[statusDeclinedID]) {
          const marketObject = groupBy(rowGroups[statusDeclinedID], (row) => row.statusId);
          Object.keys(marketObject).map((group) => {
            declinedMarkets?.push(marketObject[group]);
            return true;
          });
        }
        if (rowGroups['null']) {
          const marketObject = groupBy(rowGroups['null'], (row) => row.statusId);
          Object.keys(marketObject).map((group) => {
            marketsWithNoStatus?.push(marketObject[group]);
            return true;
          });
        }

        const allMarkets = [...quotedMarkets, ...pendingMarkets, ...declinedMarkets, ...marketsWithNoStatus];

        return (
          <Table key={layer.id} data-testid={`layer-table-${layer.id}`} className={classes.table}>
            <TableHead
              nestedClasses={{
                tableCell: classes.tableHeadCell,
              }}
              columns={cols.map((col) => {
                if (col.title) {
                  col.label = (
                    <Box display="flex" alignItems="center" flexWrap="wrap" className={classes.layer}>
                      {!printView && (
                        <Restricted include={[constants.ROLE_BROKER]}>
                          {showBulkSelect && (
                            <TableCheckbox
                              checked={isLayerChecked}
                              handleClick={
                                isLayerChecked
                                  ? handlers.bulkSelectLayer(constants.DESELECTED, layer.id, markets)
                                  : handlers.bulkSelectLayer(constants.SELECTED, layer.id, markets)
                              }
                              nestedClasses={{ root: classes.checkbox }}
                              data-testid="layer-row-checkbox"
                            />
                          )}
                        </Restricted>
                      )}
                      <span className={classes.layerName}>{layerName}</span>
                      {isNtu && (
                        <span className={classes.layerStatus}>
                          <Status
                            size="xs"
                            text={<Translate label="status.ntu" />}
                            status={statuses.policyNtu.key}
                            data-testid={`layer-status-${layer.id}`}
                            nestedClasses={{ root: classes.status }}
                          />
                        </span>
                      )}
                      <span className={classes.layerNotes}>{layer.notes}</span>
                    </Box>
                  );
                }

                if (col.menu) {
                  col.label = (
                    <>
                      {!printView && (
                        <Restricted include={[constants.ROLE_BROKER]}>
                          <PopoverMenu
                            id="layer-table-row"
                            data={{
                              title: layerName,
                              layer: layer,
                            }}
                            items={[
                              {
                                id: 'editLayer',
                                label: 'app.edit',
                                callback: handlers.editLayer,
                              },
                              {
                                id: 'deleteLayer',
                                label: 'app.delete',
                                callback: handlers.deleteLayer,
                              },
                              {
                                id: 'addLayerMarket',
                                label: 'placement.marketing.addLayerMarket',
                                callback: handlers.addLayerMarket,
                              },
                            ]}
                          />
                        </Restricted>
                      )}
                    </>
                  );
                }

                return { ...col };
              })}
            />
            <TableBody>
              <LayerTableRow
                showHeaderRow={layer.showHeaderRow}
                layer={layer}
                markets={markets}
                currency={currency}
                showPremium
                showWritten
                showStatus
                data-testid={layer.id}
              >
                {allMarkets.map((market, index) => {
                  return (
                    <Fragment key={`key-${index}`}>
                      {market.map((marketObj, index) => {
                        const isMarketChecked = bulk.itemsMarkets.includes(marketObj.id);
                        const isMarketSelected = marketObj.id === marketSelectedId;
                        const hasComments = commentIDs.map((comment) => comment.id).includes(marketObj.id);
                        const newComments = hasComments
                          ? commentIDs.filter((comment) => comment.nrDays < 3 && comment.id === marketObj.id).length > 0
                            ? true
                            : false
                          : false;

                        return (
                          <Fragment key={marketObj.id}>
                            <LayerMarketTableRow
                              printView={printView}
                              layer={layer}
                              market={marketObj}
                              capacities={capacityTypes}
                              isLast={index === limitedRows.length - 1}
                              isChecked={isMarketChecked}
                              isSelected={isMarketSelected}
                              comments={{ hasComments: hasComments, newComments: newComments }}
                              showPremium
                              showWritten
                              showStatus
                              showBulkSelect={showBulkSelect}
                              handlers={{
                                toggleMarket: handlers.toggleMarket,
                                bulkSelectMarket: handlers.bulkSelectMarket,
                                editLayerMarket: handlers.editLayerMarket,
                              }}
                              popoverItems={[
                                {
                                  id: 'edit-layer-market',
                                  label: 'app.edit',
                                  callback: handlers.editLayerMarket,
                                },
                                {
                                  id: 'delete-layer-market',
                                  label: 'app.delete',
                                  callback: handlers.deleteLayerMarket,
                                },
                                {
                                  id: 'duplicateLayerMarket',
                                  label: 'placement.marketing.duplicateLayerMarket',
                                  callback: handlers.duplicateLayerMarket,
                                },
                              ]}
                            />

                            {printView && marketObj.seeNoteMessage ? (
                              <TableRow className={classes.seeNotesRow}>
                                <TableCell colSpan={4}>
                                  {utils.string.t('placement.firmOrder.seeNotes', { label: marketObj.seeNoteMessage })}
                                </TableCell>
                              </TableRow>
                            ) : null}
                          </Fragment>
                        );
                      })}
                      <LayerMarketTableInfoRow marketGroup={market} />
                    </Fragment>
                  );
                })}
              </LayerTableRow>
            </TableBody>
          </Table>
        );
      })}
    </Box>
  );
}
