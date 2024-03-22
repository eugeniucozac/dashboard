import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './MarketSheet.styles';
import {
  Button,
  ChartKey,
  Mudmap,
  Overflow,
  Restricted,
  SectionHeader,
  StylePicker,
  Tabs,
  Tooltip,
  Translate,
  PopoverMenu,
} from 'components';
import { MarketSheetTable } from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, useTheme, AppBar, Box, Collapse, Grid, Grow, Switch, Toolbar, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';

MarketSheetView.propTypes = {
  placement: PropTypes.object,
  isDev: PropTypes.bool,
  policies: PropTypes.array,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.number,
      label: PropTypes.string,
    })
  ),
  selectedTab: PropTypes.number,
  year: PropTypes.object,
  options: PropTypes.array,
  capacity: PropTypes.object,
  mudmap: PropTypes.shape({
    capacities: PropTypes.array,
    currency: PropTypes.string,
    dimensions: PropTypes.object,
    policies: PropTypes.array,
    visible: PropTypes.bool,
  }),
  handlers: PropTypes.object,
};

MarketSheetView.defaultProps = {
  placement: {},
  policies: [],
  options: [],
  mudmap: [],
  handlers: {},
};

export function MarketSheetView({ isDev, placement, policies, tabs, selectedTab, year, options, capacity, mudmap, handlers }) {
  const classes = makeStyles(styles, { name: 'MarketSheet' })();
  const theme = useTheme();

  const { bulk = {} } = placement;
  const hasMudmap = utils.generic.isValidArray(mudmap.policies, true);
  const currentGroup = Object.values(tabs).find((t) => t.value === selectedTab) || {};

  // these values are based of CSS properties
  // they might need to be updated if CSS styles change
  const padding = 32;
  const margin = 32;
  const header = theme.mixins.header.height;
  const buttons = 24;
  const mudmapRatio = mudmap.fullscreen
    ? (mudmap.dimensions.h - header - buttons - padding - margin) / (mudmap.dimensions.w - padding)
    : 0.45;

  const getUpdateString = () => {
    if (bulk.type === 'policy') {
      return 'placement.sheet.editNumPolicies';
    } else if (bulk.type === 'policyMarket') {
      return 'placement.sheet.editNumMarkets';
    } else {
      return 'placement.sheet.editItems';
    }
  };

  return (
    <>
      <SectionHeader title={<Translate label="placement.sheet.title" />} icon={ShoppingCartIcon} testid="placement-market-sheet">
        <Restricted include={[constants.ROLE_BROKER]}>
          <PopoverMenu
            variant="outlined"
            id="market-sheet-menu"
            size="medium"
            color="primary"
            text={utils.string.t('app.actions')}
            isButton
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            items={[
              {
                id: 'addLayer',
                label: utils.string.t('placement.sheet.addLayer'),
                callback: handlers.addLayerClick(),
              },
              ...(isDev
                ? [
                    {
                      id: 'downloadPDF',
                      label: utils.string.t('placement.sheet.downloadMarketSheet'),
                      callback: () => handlers.launchPDFModal(),
                    },
                  ]
                : []),
            ]}
          />
        </Restricted>
      </SectionHeader>

      <Tabs tabs={tabs} onChange={handlers.toggleTab} />

      <Restricted
        include={
          mudmap.visibleToCobrokers ? [constants.ROLE_BROKER, constants.ROLE_COBROKER, constants.ROLE_UNDERWRITER] : [constants.ROLE_BROKER]
        }
      >
        {hasMudmap && (
          <>
            {mudmap.fullscreen && (
              <AppBar elevation={1} data-testid="header-mudmap" classes={{ root: classes.appBar }}>
                <Toolbar className={classes.mudmapHeader}>
                  <Grid container spacing={4} justifyContent="space-between" alignItems="center">
                    <Grid item xs={8}>
                      <Typography variant="h1" className={classes.mudmapTitle}>
                        {currentGroup.label}
                      </Typography>
                    </Grid>
                    <Grid item xs={4} container style={{ justifyContent: 'flex-end' }}>
                      <Button
                        icon={FullScreenExitIcon}
                        size="medium"
                        text={utils.string.t('app.fullscreenExit')}
                        variant="contained"
                        color="primary"
                        onClick={handlers.toggleMudmapFullscreen}
                        data-testid="exit-mudmap-fullscreen"
                      />
                    </Grid>
                  </Grid>
                </Toolbar>
              </AppBar>
            )}

            <Box mt={2} className={classnames({ [classes.mudmapFullscreen]: mudmap.fullscreen })}>
              <Grid container alignItems="flex-start" justifyContent="space-between" spacing={1}>
                <Grid item>
                  <Grid container alignItems="flex-start" spacing={1}>
                    {!mudmap.fullscreen && (
                      <>
                        <Restricted include={[constants.ROLE_BROKER]}>
                          <Grid item>
                            <Button
                              size="xsmall"
                              variant="outlined"
                              icon={AddIcon}
                              text={<Translate label="placement.sheet.addLayer" />}
                              nestedClasses={{
                                btn: classes.btnSmall,
                              }}
                              onClick={handlers.addLayerClick({ title: currentGroup.label, id: selectedTab })}
                            />
                          </Grid>
                        </Restricted>

                        <Grid item>
                          <Button
                            text={
                              mudmap.visible ? (
                                <Translate label="placement.sheet.mudmap.hide" />
                              ) : (
                                <Translate label="placement.sheet.mudmap.show" />
                              )
                            }
                            size="xsmall"
                            variant="outlined"
                            nestedClasses={{
                              btn: classnames({
                                [classes.btnSmall]: true,
                                [classes.toggleMudmap]: true,
                                [classes.toggleMudmapExpanded]: mudmap.visible,
                              }),
                            }}
                            onClick={handlers.toggleMudmapVisible}
                          />
                        </Grid>
                      </>
                    )}

                    <Grid item>
                      <Tooltip title={utils.string.t(mudmap.fullscreen ? 'app.fullscreenExit' : 'app.fullscreen')}>
                        <Button
                          icon={mudmap.fullscreen ? FullScreenExitIcon : FullScreenIcon}
                          size="xsmall"
                          variant="outlined"
                          onClick={handlers.toggleMudmapFullscreen}
                        />
                      </Tooltip>
                    </Grid>

                    <Restricted include={[constants.ROLE_BROKER]}>
                      <Grid item>
                        <Grow in={mudmap.visible}>
                          <div>
                            <Box display="flex" alignItems="center" className={classes.toggleCobrokers}>
                              <Box ml={1} mr={0.5}>
                                <Translate
                                  variant="body2"
                                  label={`mudmap.${mudmap.visibleToCobrokers ? 'visibleCobrokers' : 'hiddenCobrokers'}`}
                                />
                              </Box>
                              <Switch
                                color="primary"
                                size="small"
                                checked={mudmap.visibleToCobrokers}
                                onClick={handlers.toggleMudmapForCobrokers(!mudmap.visibleToCobrokers)}
                              />
                            </Box>
                          </div>
                        </Grow>
                      </Grid>
                    </Restricted>
                  </Grid>
                </Grid>

                <Grid item style={{ position: 'relative', width: 160 }}>
                  <Grow in={mudmap.visible}>
                    <div style={{ position: 'absolute', right: 4, zIndex: 2 }}>
                      <ChartKey
                        isCollapsed
                        allowCollapse
                        size="xsmall"
                        avatarSize={18}
                        items={mudmap.capacities.map((c) => {
                          return {
                            id: c.id,
                            color: c.color,
                            label: c.name,
                          };
                        })}
                        title={utils.string.t('mudmap.capacityType_plural')}
                        onAvatarClick={handlers.openColorPicker}
                        nestedClasses={{
                          root: classes.capacity,
                        }}
                        testid="capacity-types"
                      />
                      <StylePicker el={capacity.target} item={capacity.item} onUpdate={handlers.changeColorPicker} />
                    </div>
                  </Grow>
                </Grid>
              </Grid>

              <Collapse in={mudmap.visible} data-testid="mudmap-container">
                <Box mt={4} mb={mudmap.fullscreen ? 0 : 3}>
                  <Mudmap
                    items={mudmap.policies}
                    capacities={mudmap.capacities}
                    fullscreen={mudmap.fullscreen}
                    ratio={mudmapRatio}
                    type="written"
                    handlers={{ reorderMudmap: handlers.reorderMudmap }}
                  />
                </Box>
              </Collapse>
            </Box>
          </>
        )}
      </Restricted>

      <div className={classes.table}>
        {options.map((option) => {
          if (!option.selected) return null;

          return (
            <Overflow key={option.id}>
              <MarketSheetTable
                year={year.id}
                option={option.id}
                policies={policies}
                capacities={mudmap.capacities}
                handleAddLayerClick={handlers.addLayerClick}
              />
            </Overflow>
          );
        })}
      </div>

      <Box mt={2}>
        <Restricted include={[constants.ROLE_BROKER]}>
          <Grow in={bulk.items && bulk.items.length > 0}>
            <Button
              icon={EditIcon}
              color="primary"
              variant="outlined"
              disabled={!bulk.items || bulk.items.length <= 0}
              size="small"
              text={<Translate label={getUpdateString()} options={{ count: bulk.items && bulk.items.length }} />}
              onClick={handlers.bulkUpdateClick}
            />
          </Grow>
        </Restricted>
      </Box>
    </>
  );
}
