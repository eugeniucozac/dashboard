import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import styles from './MarketingMudmap.styles';
import { Button, ChartKey, Empty, Mudmap, Restricted, StylePicker, Tabs, Tooltip, Translate } from 'components';
import { ReactComponent as IconDataChart } from '../../assets/svg/line-icon-data-chart.svg';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, useTheme, AppBar, Box, Grid, Switch, Toolbar, Typography } from '@material-ui/core';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';

MarketingMudmapView.propTypes = {
  mudmap: PropTypes.shape({
    layers: PropTypes.array.isRequired,
    fullscreen: PropTypes.bool.isRequired,
    capacities: PropTypes.array.isRequired,
    dimensions: PropTypes.shape({
      w: PropTypes.number.isRequired,
      h: PropTypes.number.isRequired,
    }).isRequired,
    visibleToCobrokers: PropTypes.bool.isRequired,
  }).isRequired,
  capacity: PropTypes.object,
  tabs: PropTypes.array,
  selectedTab: PropTypes.number,
  handlers: PropTypes.shape({
    toggleTab: PropTypes.func.isRequired,
    toggleMudmapFullscreen: PropTypes.func.isRequired,
    toggleMudmapForCobrokers: PropTypes.func.isRequired,
    reorderMudmap: PropTypes.func.isRequired,
    openColorPicker: PropTypes.func.isRequired,
    changeColorPicker: PropTypes.func.isRequired,
  }).isRequired,
};

export function MarketingMudmapView({ mudmap, capacity, tabs, selectedTab, handlers }) {
  const classes = makeStyles(styles, { name: 'MarketingMudmap' })();
  const theme = useTheme();

  const hasMudmap = utils.generic.isValidArray(mudmap.layers, true);
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

  return (
    <Box data-testid="placement-marketing-mudmap">
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
                      </Grid>
                    </Restricted>
                  </Grid>
                </Grid>

                <Grid item style={{ position: 'relative', width: 160 }}>
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
                </Grid>
              </Grid>

              <Box mt={4} mb={mudmap.fullscreen ? 0 : 3} data-testid="mudmap-container">
                <Mudmap
                  items={mudmap.layers}
                  capacities={mudmap.capacities}
                  fullscreen={mudmap.fullscreen}
                  ratio={mudmapRatio}
                  type="written"
                  handlers={{
                    reorderMudmap: handlers.reorderMudmap,
                  }}
                />
              </Box>
            </Box>
          </>
        )}

        {!hasMudmap && (
          <Empty
            title={utils.string.t('placement.marketing.mudmapNotAvailable')}
            text={utils.string.t('placement.marketing.mudmapNotAvailableHint')}
            icon={<IconDataChart />}
            padding
          />
        )}
      </Restricted>
    </Box>
  );
}
