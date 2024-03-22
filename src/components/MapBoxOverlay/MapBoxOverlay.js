import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './MapBoxOverlay.styles';
import { MapBoxButton, ChartKey } from 'components';
import * as utils from 'utils';

// mui
import { withStyles, Popover, Toolbar } from '@material-ui/core';
import LayersIcon from '@material-ui/icons/Layers';
import FullScreenIcon from '@material-ui/icons/Fullscreen';
import FullScreenExitIcon from '@material-ui/icons/FullscreenExit';
import LanguageIcon from '@material-ui/icons/Language';

export class MapBoxOverlay extends PureComponent {
  static propTypes = {
    locations: PropTypes.array,
    layers: PropTypes.object,
    buttons: PropTypes.array,
    overflow: PropTypes.bool,
    fullscreen: PropTypes.bool,
    showSatelliteView: PropTypes.bool,
    header: PropTypes.node,
    handleToggleLayer: PropTypes.func,
    handleToggleFullScreen: PropTypes.func,
    handleToggleSatellite: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
    };
  }

  handleClickLayers = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleCloseLayers = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { anchorEl } = this.state;
    const {
      layers,
      overflow,
      fullscreen,
      buttons,
      header,
      handleToggleLayer,
      handleToggleFullScreen,
      handleToggleSatellite,
      classes,
      showSatelliteView,
    } = this.props;

    const isLayersMenuOpen = Boolean(anchorEl);
    const layerKeys = Object.keys(layers);
    const hasLayers = layers && Object.keys(layers).length > 0 && handleToggleLayer;

    const classesToolbar = {
      [classes.toolbarOverflow]: overflow,
    };

    return (
      <Toolbar className={classnames(classes.toolbar, classesToolbar)}>
        <div className={classes.buttons}>
          {utils.generic.isFunction(handleToggleFullScreen) && (
            <MapBoxButton
              icon={fullscreen ? FullScreenExitIcon : FullScreenIcon}
              size="small"
              tooltip={{ title: utils.string.t(fullscreen ? 'app.fullscreenExit' : 'app.fullscreen') }}
              onClick={handleToggleFullScreen}
              data-testid="map-full-screen-button"
            />
          )}

          {hasLayers && (
            <MapBoxButton
              icon={LayersIcon}
              size="small"
              tooltip={{ title: utils.string.t('map.layers.tooltip') }}
              onClick={this.handleClickLayers}
              open={isLayersMenuOpen}
              aria-owns={isLayersMenuOpen ? 'menu' : null}
              data-testid="map-layers-button"
            />
          )}

          {utils.generic.isFunction(handleToggleSatellite) && (
            <MapBoxButton
              icon={LanguageIcon}
              size="small"
              selected={showSatelliteView}
              tooltip={{ title: utils.string.t('map.satellite.tooltip') }}
              onClick={handleToggleSatellite}
              data-testid="map-toggle-satellite-button"
            />
          )}

          {/* render additional buttons passed in props */}
          {utils.generic.isValidArray(buttons, true) &&
            buttons.map((option, index) => {
              return React.cloneElement(option, { key: `map-button-${index}` });
            })}
        </div>

        {/* render extra content to display above the map (ex: geocoding) */}
        {!fullscreen && header}

        {hasLayers && (
          <Popover
            id="menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.handleCloseLayers}
            classes={{ paper: classes.popover }}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
          >
            <div className={classes.menu}>
              <ChartKey
                items={layerKeys.map((k) => {
                  const item = layers[k];
                  return {
                    id: item.name,
                    label: item.name,
                    checked: item.visibility === utils.map.visibility.visible,
                    groupKey: k,
                  };
                })}
                onToggle={(id, checked, item) => handleToggleLayer(item.groupKey)}
              />
            </div>
          </Popover>
        )}
      </Toolbar>
    );
  }
}

export default compose(withStyles(styles))(MapBoxOverlay);
