import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import get from 'lodash/get';

// app
import styles from './PlacementMap.styles';
import { mapLayers } from 'utils/map/mapLayers';
import { MapBox, MapBoxButton, Restricted, Translate } from 'components';
import { showModal, resetLocations, deletePlacementLocations, getLocationGroupsForPlacement, retryGeocoding } from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { withStyles, CircularProgress, Link, Typography } from '@material-ui/core';
import LocationOffIcon from '@material-ui/icons/LocationOff';

const mapStateToProps = (state) => ({
  configVars: get(state, 'config.vars'),
  userAccessToken: get(state, 'user.auth.accessToken'),
  locationUploading: get(state, 'location.uploading'),
  locationGeocoding: get(state, 'location.geocoding'),
  placementSelectedId: get(state, 'placement.selected.id'),
});

// dispatch
const mapDispatchToProps = {
  showModal,
  resetLocations,
  deletePlacementLocations,
  getLocationGroupsForPlacement,
  retryGeocoding,
};

export class PlacementMap extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    locationsFiltered: PropTypes.array.isRequired,
    center: PropTypes.array,
    zoom: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.state = {
      map: null,
    };
  }

  onLoadMap = (mapInstance) => {
    this.setState({ map: mapInstance }, () => {
      this.addSources();
    });
  };

  onChangeMap = () => {
    this.addSources();
  };

  addSources = () => {
    const { configVars, placementSelectedId } = this.props;

    const clusterLayers = this.getClustersLayers();

    // remove sources before trying to add new ones
    // mapbox breaks if sources/layers already exist
    this.removeSources();

    this.state.map.addSource('location-geojson', {
      type: 'geojson',
      data: configVars.endpoint.location + '/api/locations/' + placementSelectedId + '/geo',
      cluster: true,
      //clusterMaxZoom: 20, // Max zoom to cluster points on
      clusterRadius: 60, // Radius of each cluster when clustering points (defaults to 50)
      clusterProperties: {
        mtiv: ['+', ['get', 'mtiv']],
        '4tiv': ['+', ['get', '4tiv']],
        tiv: ['+', ['get', 'tiv']],
      },
    });

    clusterLayers.forEach((layer, i) => {
      const clusterName = 'cluster-' + i;
      this.state.map.addLayer({
        id: clusterName,
        type: 'circle',
        source: 'location-geojson',
        paint: {
          'circle-color': layer[1],
          'circle-radius': layer[2],
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff',
        },
        filter:
          i === 0
            ? ['all', ['>=', ['get', 'mtiv'], layer[0]]]
            : ['all', ['>=', ['get', 'mtiv'], layer[0]], ['<', ['get', 'mtiv'], clusterLayers[i - 1][0]]],
      });
    });

    this.state.map.addLayer({
      id: 'cluster-label',
      type: 'symbol',
      source: 'location-geojson',
      filter: ['all', ['has', 'point_count']],
      layout: {
        'text-field': ['format', ['get', 'point_count'], {}, '\n', {}, '~$', {}, ['to-string', ['/', ['get', '4tiv'], 100]], {}, 'm', {}],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-offset': [0, -0.25],
        'text-size': 8,
      },
      paint: {
        'text-color': '#fff',
      },
    });

    this.state.map.addLayer({
      id: 'non-cluster-label',
      type: 'symbol',
      source: 'location-geojson',
      filter: ['all', ['!has', 'point_count']],
      layout: {
        'text-field': ['format', '~$', {}, ['to-string', ['/', ['get', '4tiv'], 100]], {}, 'm', {}],
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 8,
      },
      paint: {
        'text-color': '#fff',
      },
    });
  };

  removeSources = () => {
    const layers = ['cluster-label', 'non-cluster-label', ...this.getClustersLayers().map((l, i) => 'cluster-' + i)];
    const sources = ['location-geojson'];

    this.cleanup(layers, sources);
  };

  cleanup = (layers, sources) => {
    const { map } = this.state;

    // mapbox is specific about the order: remove layers first, then sources
    layers.forEach((layer, i) => {
      if (map.getLayer(layer)) {
        map.removeLayer(layer);
      }
    });

    sources.forEach((source, i) => {
      if (map.getSource(source)) {
        map.removeSource(source);
      }
    });
  };

  getClustersLayers = () => {
    const tivSizes = [0, 0.1, 1, 10, 100, 1000, 10000];
    const tivRadius = [16, 18, 20, 22, 26, 30, 34];
    const tivColors = utils.color.scale(tivSizes.length * 2);

    return tivSizes
      .map((s, i) => {
        return [tivSizes[i], tivColors[i * 2], tivRadius[i]];
      })
      .reverse();
  };

  getLocationsGeocoded = (locations) => {
    if (!utils.generic.isValidArray(locations, true)) return [];

    return locations.filter((location) => {
      const found = get(location, 'geocodeResult.locationsFound');
      return location && found && found > 0;
    });
  };

  handleClickRemoveLocations = (event) => {
    this.props.showModal({
      component: 'CONFIRM',
      props: {
        title: 'map.locations.remove',
        subtitle: 'map.locations.removeHint',
        fullWidth: true,
        maxWidth: 'xs',
        componentProps: {
          submitHandler: () => {
            this.props.deletePlacementLocations();
            this.removeSources();
          },
        },
      },
    });
  };

  handleClickGeocodingTryAgain = (id) => (event) => {
    this.props.retryGeocoding();
    this.props.getLocationGroupsForPlacement(id);
  };

  render() {
    const { center, zoom, userAccessToken, locationUploading, locationGeocoding, placementSelectedId, classes } = this.props;

    const locations = this.getLocationsGeocoded(this.props.locations);
    const locationsFiltered = this.getLocationsGeocoded(this.props.locationsFiltered);

    const mapBtnDelete = (
      <Restricted include={[constants.ROLE_BROKER]}>
        {locations.length > 0 && (
          <MapBoxButton
            icon={LocationOffIcon}
            size="small"
            disabled={locationUploading}
            tooltip={{ title: utils.string.t('map.locations.remove') }}
            onClick={this.handleClickRemoveLocations}
            data-testid="map-locations-remove-button"
          />
        )}
      </Restricted>
    );

    const mapHeader = (
      <Restricted include={[constants.ROLE_BROKER]}>
        {locationGeocoding.status && locations.length > 0 && (
          <div className={classes.geocoding}>
            <Typography variant="body2" className={classes.geocodingText}>
              <Translate label="app.geocoding" />
              {': ' + locationGeocoding.completed + ' / ' + locationGeocoding.total}
            </Typography>
            <CircularProgress size={'1em'} />
          </div>
        )}

        {locationGeocoding.result === 'failed' && locations.length > 0 && (
          <div className={classes.geocoding}>
            <Typography variant="body2" className={classes.geocodingText}>
              <Translate label="placement.overview.map.geocodingFailed" />
              <span> - </span>
              <Link onClick={this.handleClickGeocodingTryAgain(placementSelectedId)} className={classes.geocodingLink}>
                <Translate label="app.tryAgain" />
              </Link>
            </Typography>
          </div>
        )}
      </Restricted>
    );

    return (
      <MapBox
        id="placement-overview"
        height={450}
        allowScrollZoom={false}
        placementOverflow={true}
        showMarkers={false}
        fitBounds
        center={center}
        zoom={zoom}
        layers={mapLayers}
        locations={locations.map((l) => l.geocodeResult)}
        locationsFiltered={locationsFiltered.map((l) => l.geocodeResult)}
        buttons={[mapBtnDelete]}
        header={mapHeader}
        instanceObject={{
          transformRequest: (url, resourceType) => {
            if (resourceType === 'Source' && url.includes('api/locations')) {
              return {
                url: url,
                headers: { Authorization: 'Bearer ' + userAccessToken },
              };
            }
          },
        }}
        onLoad={this.onLoadMap}
        onChange={this.onChangeMap}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(compose(withStyles(styles))(PlacementMap));
