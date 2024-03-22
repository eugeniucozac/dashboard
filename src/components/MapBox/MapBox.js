import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import sortBy from 'lodash/sortBy';
import ReactDOM from 'react-dom';

// mapbox
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './mapBox.css';

// app
import styles from './MapBox.styles';
import { MapBoxOverlay, MapBoxTooltipPortal, Chart, ChartKey, Loader, ChartZoomLevel } from 'components';
import * as utils from 'utils';
import config from 'config';
import { KEYCODE } from 'consts';

// mui
import { withStyles, Fade } from '@material-ui/core';

export class MapBox extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    locations: PropTypes.array,
    locationsFiltered: PropTypes.array,
    buttons: PropTypes.array,
    levels: PropTypes.array,
    levelOverride: PropTypes.string,
    doughnutSizes: PropTypes.object,
    layers: PropTypes.object,
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    overflow: PropTypes.bool,
    placementOverflow: PropTypes.bool,
    responsive: PropTypes.bool,
    allowScrollZoom: PropTypes.bool,
    allowFullscreen: PropTypes.bool,
    allowSatelliteView: PropTypes.bool,
    allowMarkerClickZoom: PropTypes.bool,
    isLoading: PropTypes.bool,
    activeMarkers: PropTypes.array,
    showMarkers: PropTypes.bool,
    markerType: PropTypes.string,
    markerMaxZoom: PropTypes.number,
    fitBounds: PropTypes.bool,
    fitBoundsOptions: PropTypes.object,
    center: PropTypes.arrayOf(PropTypes.number),
    zoom: PropTypes.number,
    minZoom: PropTypes.number,
    maxZoom: PropTypes.number,
    pitch: PropTypes.number,
    overlay: PropTypes.object,
    instanceObject: PropTypes.object,
    tooltipComponent: PropTypes.func,
    onLoad: PropTypes.func,
    onLevelChange: PropTypes.func,
    onChange: PropTypes.func,
    onClickMarker: PropTypes.func,
    reCenter: PropTypes.bool,
    mapKey: PropTypes.shape({
      items: PropTypes.arrayOf(
        PropTypes.shape({
          color: PropTypes.string,
          avatarText: PropTypes.string,
          checked: PropTypes.bool,
          id: PropTypes.string,
          label: PropTypes.string,
        })
      ).isRequired,
      allowCollapse: PropTypes.bool,
      title: PropTypes.string,
      nestedClasses: PropTypes.object,
      handleToggle: PropTypes.func,
      colorMode: PropTypes.oneOf(['light', 'dark']),
    }),
  };

  static defaultProps = {
    nestedClasses: {},
    height: config.mapbox.height,
    center: config.mapbox.location.country.center.US,
    levels: config.mapbox.levels,
    reCenter: true,
    doughnutSizes: config.mapbox.doughnutSizes,
    markerType: config.mapbox.markerType.default,
    zoom: config.mapbox.zoom,
    minZoom: config.mapbox.minZoom,
    maxZoom: config.mapbox.maxZoom,
    pitch: config.mapbox.pitch,
    allowScrollZoom: true,
    isLoading: false,
    allowFullscreen: true,
    allowMarkerClickZoom: true,
    allowSatelliteView: true,
    activeMarkers: [],
    showMarkers: true,
    markerMaxZoom: config.mapbox.marker.maxZoom,
    fitBoundsOptions: config.mapbox.fitBoundsOptions,
  };

  constructor(props) {
    super(props);
    mapboxgl.accessToken = config.mapbox.token;

    const mapLocations = this.getLocations(props.locations, props.locationsFiltered);

    if (props.tooltipComponent) {
      this.tooltipElem = document.createElement('div');
    }

    this.state = {
      ready: false,
      fullscreen: false,
      showSatelliteView: false,
      layers: Object.assign({}, props.layers),
      markers: [],
      popups: [],
      tooltip: {},
      tooltipContainerId: `root-mapbox-tooltip-${props.id}`,
      defaultInstanceObject: {
        container: `map-${props.id}`,
        center: props.center,
        zoom: props.zoom,
        minZoom: props.minZoom,
        maxZoom: props.maxZoom,
        pitch: props.pitch,
        style: config.mapbox.styles.street,
        ...(props.fitBounds && { bounds: this.getBounds(mapLocations) }),
        ...(props.fitBounds && { fitBoundsOptions: props.fitBoundsOptions }),
      },
    };
  }

  componentWillMount() {
    if (this.props.tooltipComponent) {
      const tooltipContainer = document.createElement('div');

      tooltipContainer.id = this.state.tooltipContainerId;
      document.body.appendChild(tooltipContainer);
    }
  }

  componentDidMount() {
    const { layers, defaultInstanceObject } = this.state;
    const { allowScrollZoom, showMarkers, locations, locationsFiltered, instanceObject, onLoad, onChange } = this.props;

    // get current list of locations
    const mapLocations = this.getLocations(locations, locationsFiltered);

    // instantiate mapbox
    this.map = new mapboxgl.Map(Object.assign({}, defaultInstanceObject, instanceObject));

    // setup map onLoad
    this.map.on('load', () => {
      const { markers } = this.state;
      const { levels } = this.props;

      const level = utils.map.getLevelByZoom(levels, Math.round(this.map.getZoom()));

      if (!allowScrollZoom) {
        this.map.scrollZoom.disable();
      }

      this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-left');

      if (showMarkers && mapLocations.length > 0) {
        this.mapAddMarkers(mapLocations, []);
      }

      utils.map.addDefaultSources(this.map);
      utils.map.addDefaultLayers(this.map, layers);

      // run additional code specific to the parent component (ex: add clusters layers/sources)
      if (utils.generic.isFunction(onLoad)) {
        onLoad(this.map, { markers, level });
      }

      this.setState({
        ready: true,
        boundingBox: this.map.getBounds().toArray().flat(),
      });

      document.addEventListener('keydown', this.handleEscape);
    });

    // Add layers/sources when changing the style
    this.map.on('style.load', () => {
      const { markers, ready } = this.state;

      if (!ready) return;

      this.mapRemovePopups();

      if (utils.generic.isFunction(onChange)) {
        utils.map.addDefaultSources(this.map);
        utils.map.addDefaultLayers(this.map, layers);
        onChange(markers);
      }
    });

    this.map.on('zoomend', () => {
      const { ready, level, markers } = this.state;
      const { onLevelChange, levels, locations, locationsFiltered, levelOverride } = this.props;

      if (!ready) return;
      if (!utils.generic.isFunction(onLevelChange)) return;

      const newLevel = utils.map.getLevelByZoom(levels, Math.round(this.map.getZoom()));

      if (level === newLevel || levelOverride) {
        this.mapAddMarkers(this.getLocations(locations, locationsFiltered), markers);
      }
      if (level !== newLevel) {
        onLevelChange({ level: newLevel });
      }
    });

    this.map.on('dragend', () => {
      const { ready, boundingBox, markers } = this.state;
      const { locations, locationsFiltered, showMarkers } = this.props;

      if (!ready || !showMarkers) return;

      const newBoundingBox = this.map.getBounds().toArray().flat();

      if (boundingBox && !isEqual(boundingBox, newBoundingBox)) {
        this.setState({ boundingBox: newBoundingBox });
        this.mapAddMarkers(this.getLocations(locations, locationsFiltered), markers);
      }
    });
  }

  componentWillUnmount() {
    // remove all markers
    this.mapRemoveMarkers();

    // remove MapBox map instance
    if (utils.generic.isFunction(this.map && this.map.remove)) {
      this.map.remove();
    }

    // remove all DOM nodes used for HTML tooltip
    if (this.props.tooltipComponent) {
      const tooltipContainer = document.getElementById(this.state.tooltipContainerId);
      const tooltipNode = this.tooltipElem;
      const tooltipParent = this.tooltipElem.parentNode;

      if (tooltipNode && tooltipParent) {
        tooltipParent.removeChild(tooltipNode);
      }

      if (tooltipContainer) {
        tooltipContainer.remove();
      }
    }

    document.removeEventListener('keydown', this.handleEscape);
  }

  componentDidUpdate(prevProps) {
    const { markers, ready } = this.state;
    const {
      locations,
      locationsFiltered,
      activeMarkers,
      allowScrollZoom,
      showMarkers,
      center,
      zoom,
      fitBounds,
      fitBoundsOptions,
      onChange,
      reCenter,
    } = this.props;

    const mapLocations = sortBy(this.getLocations(locations, locationsFiltered), ['id']);
    const mapPrevLocations = sortBy(this.getLocations(prevProps.locations, prevProps.locationsFiltered), ['id']);

    const isNewLocations = !isEqual(
      mapPrevLocations.map((l) => l && l.id),
      mapLocations.map((l) => l && l.id)
    );
    const isUpdatedLocations = !isEqual(mapPrevLocations, mapLocations);
    const isUpdatedActiveMarkers = !isEqual(prevProps.activeMarkers, activeMarkers);
    const isNewPropsShowMarkers = !isEqual(prevProps.showMarkers, showMarkers);
    const isNewPropsFitBounds = !isEqual(prevProps.fitBounds, fitBounds);
    const isNewPropsAllowScroll = !isEqual(prevProps.allowScrollZoom, allowScrollZoom);

    if (isNewPropsAllowScroll) {
      if (allowScrollZoom) {
        this.map.scrollZoom.enable();
      } else {
        this.map.scrollZoom.disable();
      }
    }

    // whenever anything changes in the locations (ex: new/removed locations or any property has changed)
    // reset the markers
    if (isUpdatedLocations || isNewPropsShowMarkers || isNewPropsFitBounds) {
      this.mapRemovePopups();
      this.mapRemoveMarkers();

      if (showMarkers) {
        this.mapAddMarkers(mapLocations, []);
      }

      // if locations have been added or removed
      if (isNewLocations) {
        // executed onChange callback (ex: to add clusters sources/layers)
        if (ready && utils.generic.isValidArray(mapLocations, true) && utils.generic.isFunction(onChange)) {
          onChange(markers);
        }
      }

      // re-center the map on the new/updated array of markers
      if (fitBounds) {
        this.map.fitBounds(this.getBounds(mapLocations), fitBoundsOptions);
      } else {
        if (!reCenter) return;
        this.map.flyTo({ center, zoom });
      }
    }

    // if active marker(s) was updated
    if (isUpdatedActiveMarkers && showMarkers) {
      markers.forEach((marker) => {
        marker.getElement().classList.toggle('active', activeMarkers.includes(marker.location.id));
      });
    }

    if (prevProps.center !== center || prevProps.zoom !== zoom) {
      const newCenter = prevProps.center !== center ? center : prevProps.center;
      const newZoom = prevProps.zoom !== zoom ? zoom : prevProps.zoom;

      this.map.flyTo({
        ...(prevProps.zoom !== zoom && { zoom: newZoom }),
        ...(prevProps.center !== center && { center: newCenter }),
      });
    }
  }

  getBounds = (locations) => {
    const bounds = new mapboxgl.LngLatBounds();

    const boundingBox = locations.reduce((acc, l) => {
      let lngLat;
      try {
        lngLat = new mapboxgl.LngLat(l.lng, l.lat);
      } catch {
        console.error('MapBox: invalid lngLat provided', { id: l.id, lat: l.lat, lng: l.lng });
      }

      return lngLat && lngLat.lng && lngLat.lat ? bounds.extend([lngLat.lng, lngLat.lat]) : acc;
    }, {});

    return !isEmpty(boundingBox) ? boundingBox : config.mapbox.location.country.boundingBox.US;
  };

  getLocations = (locations, locationsFiltered) => {
    const locs = utils.generic.isValidArray(locations, true) ? locations : [];
    const locsFiltered = utils.generic.isValidArray(locationsFiltered, true) ? locationsFiltered : [];
    const locsReturned = locsFiltered.length > 0 ? locsFiltered : locs;

    return locsReturned.filter((l) => l.lat && l.lng && l.locationsFound > 0);
  };

  mapAddPopup = (marker) => {
    const popup = new mapboxgl.Popup({ offset: 40 })
      .setLngLat([marker.location.lng, marker.location.lat])
      .setDOMContent(this.tooltipElem)
      .addTo(this.map);

    this.setState({ popups: [popup] });
  };

  mapRemovePopups = () => {
    this.state.popups.forEach((popup) => {
      if (utils.generic.isFunction(popup.remove)) {
        popup.remove();
      }
    });

    this.setState({ popups: [] });
  };

  createDoughnutChart = ({ location }) => {
    const { level } = this.state;
    const { doughnutSizes, levelOverride } = this.props;
    const { properties = {} } = location;
    const { data = [], backgroundColor = [] } = properties;

    return (
      <Chart
        type="doughnut"
        data={{
          datasets: [
            {
              borderWidth: 1,
              data,
              backgroundColor,
            },
          ],
        }}
        options={config.ui.chart.doughnut}
        width={doughnutSizes[levelOverride || level]}
        height={doughnutSizes[levelOverride || level]}
      />
    );
  };

  setDoughnutMarkers = (locations, markers) => {
    if (!locations) return;

    const markersArray = [];

    utils.map.parseLocations(locations).forEach((location) => {
      const tooltipContainer = document.createElement('div');
      const ChartComponent = this.createDoughnutChart;
      ReactDOM.render(<ChartComponent location={location} />, tooltipContainer);
      const marker = new mapboxgl.Marker(tooltipContainer).setLngLat([location.lng, location.lat]);
      const markerExists = markers.find((m) => isEqual(m.getLngLat(), marker.getLngLat()));

      if (markerExists) return;

      // adding original location object (id, lat, lng, etc...) to the marker
      marker.location = location;

      try {
        marker.addTo(this.map);
      } catch {}

      markersArray.push(marker);
    });

    return markersArray;
  };

  mapAddMarkers = (locations, markers) => {
    const { onChange, markerType, doughnutSizes, levels, levelOverride } = this.props;
    const newLevel = utils.map.getLevelByZoom(levels, Math.round(this.map.getZoom()));
    const newBoundingBox = this.map.getBounds();

    this.setState({ level: newLevel });

    const filteredLocations = locations.filter((location) => newBoundingBox.contains(new mapboxgl.LngLat(location.lng, location.lat)));

    const showDoughnutMarkers =
      markerType === config.mapbox.markerType.doughnut && Object.keys(doughnutSizes).includes(levelOverride || newLevel);

    const newMarkers = showDoughnutMarkers
      ? this.setDoughnutMarkers(filteredLocations, markers)
      : utils.map.setMarkers(this.map, filteredLocations, markers);

    // saving the marker instances to state to keep access to MapBox remove() method
    this.setState({ markers: [...markers, ...newMarkers] }, () => {
      if (utils.generic.isFunction(onChange)) {
        onChange(this.state.markers);
      }
    });

    this.mapParseMarkers(newMarkers);
  };

  mapRemoveMarkers = () => {
    this.state.markers.forEach((marker) => {
      if (utils.generic.isFunction(marker.remove)) {
        marker.remove();
      }
    });

    this.setState({ markers: [] });
  };

  mapParseMarkers = (markers) => {
    markers.forEach((marker) => {
      marker._element.addEventListener('click', this.mapClickMarker(marker));
    });
  };

  mapClickMarker = (marker) => (event) => {
    const { onClickMarker, tooltipComponent } = this.props;

    // prevent marker click from bubbling up to the map (which closes popup meant to be opened)
    event.stopPropagation();

    this.mapRemovePopups();

    const markers = this.map.getContainer().querySelectorAll('.mapboxgl-marker');
    const location = marker.location || {};

    markers.forEach((el) => {
      el.classList.remove('active');
    });

    marker.getElement().classList.add('active');

    // update the tooltip state
    // after the update, fetch the re-rendered content from the React Portal
    if (tooltipComponent) {
      this.setState({ tooltip: location }, () => {
        if (this.tooltipElem) {
          this.mapAddPopup(marker);
        }
      });
    }

    if (utils.generic.isFunction(onClickMarker)) {
      onClickMarker(marker.location);
    }

    if (this.props.allowMarkerClickZoom) {
      this.map.flyTo({
        center: marker._lngLat,
        zoom: Math.max(this.map.getZoom(), this.props.markerMaxZoom),
      });
    }
  };

  mapToggleLayer = (layerGroupKey) => {
    const layers = { ...this.state.layers };
    const layerGroup = layers[layerGroupKey];
    const { visible, none } = utils.map.visibility;

    layerGroup.visibility = layerGroup.visibility === visible ? none : visible;
    layerGroup.config.forEach((c) => {
      this.map.setLayoutProperty(c.id, 'visibility', layerGroup.visibility);
    });

    this.setState({
      layers,
    });
  };

  mapToggleFullScreen = () => {
    this.setState({ fullscreen: !this.state.fullscreen }, () => {
      if (this.map && utils.generic.isFunction(this.map.resize)) {
        this.map.resize();
      }
    });
  };

  mapToggleSatellite = () => {
    this.setState({ showSatelliteView: !this.state.showSatelliteView }, () => {
      this.map.setStyle(this.state.showSatelliteView ? config.mapbox.styles.satellite : config.mapbox.styles.street);
    });
  };

  handleEscape = (event) => {
    if (event.keyCode === KEYCODE.Escape) {
      event.preventDefault();

      if (this.state.fullscreen) {
        this.setState({ fullscreen: false }, () => {
          if (this.map && utils.generic.isFunction(this.map.resize)) {
            this.map.resize();
          }
        });
      }
    }
  };

  levelLoaderComponent = () => {
    if (!this.map) return null;

    const { isLoading } = this.props;

    return <Loader visible={isLoading} label={utils.string.t('app.loading_locations')} absolute />;
  };

  render() {
    const { layers, tooltip, ready, fullscreen, tooltipContainerId, showSatelliteView } = this.state;
    const {
      id,
      height,
      allowFullscreen,
      overflow,
      placementOverflow,
      responsive,
      buttons,
      header,
      locations,
      tooltipComponent,
      overlay,
      classes,
      allowSatelliteView,
      mapKey,
      onLevelChange,
      nestedClasses,
      levels,
      levelOverride,
    } = this.props;

    const isOverlayVisible = overlay && overlay.visible;

    const classesMapContainer = {
      [classes.root]: !fullscreen,
      [classes.overflow]: !fullscreen && overflow,
      [classes.placementOverflow]: !fullscreen && placementOverflow,
      [classes.responsive]: !fullscreen && responsive,
      [classes.fullScreen]: fullscreen,
    };

    const classesMap = {
      [classes.map]: true,
      [nestedClasses.map]: Boolean(nestedClasses.map),
      [classes.mapOverflow]: overflow,
      [classes.mapOverlay]: isOverlayVisible,
    };

    if (this.map) {
      this.map.resize();
    }

    const LevelLoaderComponent = this.levelLoaderComponent;
    const TooltipComponent = tooltipComponent;

    return (
      <Fade in={ready}>
        <div className={classnames(classesMapContainer)}>
          <MapBoxOverlay
            locations={locations}
            layers={layers}
            overflow={overflow}
            fullscreen={allowFullscreen ? fullscreen : false}
            buttons={buttons}
            header={header}
            showSatelliteView={showSatelliteView}
            handleToggleSatellite={allowSatelliteView ? this.mapToggleSatellite : undefined}
            handleToggleLayer={this.mapToggleLayer}
            handleToggleFullScreen={allowFullscreen ? this.mapToggleFullScreen : undefined}
          />

          {mapKey && <ChartKey {...mapKey} />}

          {this.map && utils.generic.isFunction(onLevelChange) && (
            <>
              <ChartZoomLevel
                disabled={locations.length === 0}
                onLevelChange={onLevelChange}
                levels={levels}
                level={utils.map.getLevelByZoom(levels, Math.round(this.map.getZoom()))}
                levelOverride={levelOverride}
              />
              <LevelLoaderComponent />
            </>
          )}

          {tooltipComponent && (
            <MapBoxTooltipPortal id={tooltipContainerId} elem={this.tooltipElem}>
              {!isEmpty(tooltip) && <TooltipComponent tooltip={tooltip} />}
            </MapBoxTooltipPortal>
          )}

          <div
            id={`map-${id}`}
            style={{ height: fullscreen ? null : height }}
            className={classnames('map', 'mapboxgl-map', classnames(classesMap))}
          >
            {isOverlayVisible && <div className={classes.overlay}>{overlay.text}</div>}
          </div>
        </div>
      </Fade>
    );
  }
}

export default compose(withStyles(styles))(MapBox);
