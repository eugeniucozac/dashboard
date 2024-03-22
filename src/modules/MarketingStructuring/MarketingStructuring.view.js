import React from 'react';
import PropTypes from 'prop-types';

// app
import { Button, Overflow, Restricted, Tabs, Translate } from 'components';
import { StructuringTable } from 'modules';
import * as constants from 'consts';

// mui
import { Box, makeStyles } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Switch from '@material-ui/core/Switch';

import styles from './MarketingStructuring.styles';
import * as utils from 'utils';

MarketingStructuringView.propTypes = {
  layers: PropTypes.array,
  tabs: PropTypes.array,
  commentIDs: PropTypes.array,
  bulk: PropTypes.shape({
    type: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemsMarkets: PropTypes.array.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    getUpdateString: PropTypes.func.isRequired,
    bulkUpdate: PropTypes.func.isRequired,
    toggleTab: PropTypes.func.isRequired,
    selectBulkAll: PropTypes.func.isRequired,
    toggleBulkSelect: PropTypes.func.isRequired,
  }).isRequired,
  isLayerChecked: PropTypes.bool,
  isLineChecked: PropTypes.bool,
  showBulkSelect: PropTypes.bool,
};

export function MarketingStructuringView({ layers, tabs, commentIDs, bulk, handlers, showBulkSelect }) {
  const classes = makeStyles(styles, { name: 'MarketingStructuring' })();
  return (
    <Box data-testid="placement-marketing-structuring">
      <Tabs tabs={tabs} onChange={handlers.toggleTab} />

      <Overflow>
        <StructuringTable layers={layers} commentIDs={commentIDs} />
      </Overflow>
      {layers?.length ? (
        <Box display="flex">
          <Restricted include={[constants.ROLE_BROKER]}>
            <Box display="flex" alignItems="center" className={classes.formControlLabel}>
              <Box m={1}>
                <Translate variant="body2" label={'placement.marketing.multiSelectToggle'} />
              </Box>
              <Switch
                color="primary"
                size="small"
                onChange={handlers.toggleBulkSelect}
                checked={showBulkSelect}
                data-testid="switch-selector"
              />
            </Box>
            {showBulkSelect && (
              <>
                <Box m={0.5}>
                  <Button
                    icon={CheckBoxIcon}
                    color="primary"
                    variant="outlined"
                    size="xsmall"
                    text={utils.string.t('placement.marketing.selectAll')}
                    onClick={handlers.selectBulkAll}
                    data-testid="btn-select-all"
                  />
                </Box>
                <Box m={0.5}>
                  <Button
                    icon={CheckBoxOutlineBlankIcon}
                    color="primary"
                    variant="outlined"
                    size="xsmall"
                    text={utils.string.t('placement.marketing.deSelectAll')}
                    onClick={handlers.clearAllPlacement}
                    data-testid="btn-clear-all"
                  />
                </Box>
                {bulk.items && bulk.items.length > 0 && (
                  <Box m={0.5}>
                    <Button
                      icon={EditIcon}
                      color="primary"
                      variant="outlined"
                      disabled={!bulk.items || bulk.items.length <= 0}
                      size="xsmall"
                      text={<Translate label={'placement.marketing.editNumLayers'} options={{ count: bulk.items && bulk.items.length }} />}
                      onClick={(e) => handlers.bulkUpdate(e, true)}
                      data-testid="btn-edit-layer"
                    />
                  </Box>
                )}
                {bulk.itemsMarkets && bulk.itemsMarkets.length > 0 && (
                  <Box m={0.5}>
                    <Button
                      icon={EditIcon}
                      color="primary"
                      variant="outlined"
                      disabled={!bulk.itemsMarkets || bulk.itemsMarkets.length <= 0}
                      size="xsmall"
                      text={
                        <Translate
                          label={'placement.marketing.editNumLines'}
                          options={{ count: bulk.itemsMarkets && bulk.itemsMarkets.length }}
                        />
                      }
                      onClick={(e) => handlers.bulkUpdate(e, false)}
                      data-testid="btn-edit-market"
                    />
                  </Box>
                )}
              </>
            )}
          </Restricted>
        </Box>
      ) : null}
    </Box>
  );
}
