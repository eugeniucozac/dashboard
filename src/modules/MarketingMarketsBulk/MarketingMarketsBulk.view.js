import React from 'react';
import PropTypes from 'prop-types';

// app
import { Button, Restricted, Translate } from 'components';
import * as constants from 'consts';

// mui
import { Box, makeStyles } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import Switch from '@material-ui/core/Switch';

import styles from './MarketingMarketsBulk.styles';
import * as utils from 'utils';

MarketingMarketsBulkView.propTypes = {
  bulk: PropTypes.shape({
    itemsMarkets: PropTypes.array.isRequired,
  }).isRequired,
  handlers: PropTypes.shape({
    toggleBulkSelect: PropTypes.func.isRequired,
    bulkDelete: PropTypes.func.isRequired,
  }).isRequired,
  showBulkSelect: PropTypes.bool,
};

export function MarketingMarketsBulkView({ handlers, showBulkSelect, bulk }) {
  const classes = makeStyles(styles, { name: 'MarketingMarketsBulk' })();
  return (
    <Box data-testid="placement-marketing">
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
              {bulk.itemsMarkets && bulk.itemsMarkets.length > 0 && (
                <Box m={0.5}>
                  <Button
                    icon={DeleteIcon}
                    color="primary"
                    variant="outlined"
                    disabled={!bulk.itemsMarkets || bulk.itemsMarkets.length <= 0}
                    size="xsmall"
                    text={utils.string.t('placement.marketing.delete')}
                    onClick={handlers.bulkDelete}
                    data-testid="btn-delete-market"
                  />
                </Box>
              )}
            </>
          )}
        </Restricted>
      </Box>
    </Box>
  );
}
