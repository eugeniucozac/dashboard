import React, { useState } from 'react';
import { withKnobs, boolean } from '@storybook/addon-knobs';
import { Button, MapBox, MapBoxButton, MapBoxTooltip, TableCell, TableHead } from 'components';
import { Box, Grid, Link, Table, TableRow, TableBody, Typography } from '@material-ui/core';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import ExploreIcon from '@material-ui/icons/Explore';
import DirectionsIcon from '@material-ui/icons/Directions';
import * as utils from 'utils';
import config from 'config';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import reducer from 'stores';
import merge from 'lodash/merge';

export default {
  title: 'MapBox',
  component: MapBox,
  decorators: [withKnobs],
};

const locations = [
  {
    id: 0,
    inputAddress: '10 Perimeter Park Dr, Atlanta, 30341, DEKALB COUNTY, GA',
    outputAddress: '10 Perimeter Park Dr, Atlanta, GA 30341, USA',
    lng: -84.294549,
    lat: 33.918275,
    accuracy: 'ROOFTOP',
    locationsFound: 1,
  },
  {
    id: 1,
    inputAddress: '13000 TANGLEWOOD DRIVE, WESTWEGO, 70094, JEFFERSON PARISH, LA',
    outputAddress: 'Tanglewood Dr, Westwego, LA 70094, USA',
    lng: -90.144803,
    lat: 29.8944844,
    accuracy: 'GEOMETRIC_CENTER',
    locationsFound: 1,
  },
  {
    id: 2,
    inputAddress: '4130 Garrett Road, Durham, 27707, DURHAM COUNTY, NC',
    outputAddress: '4130 Garrett Rd, Durham, NC 27707, USA',
    lng: -78.9791492,
    lat: 35.964363,
    accuracy: 'ROOFTOP',
    locationsFound: 1,
  },
  {
    id: 3,
    inputAddress: '1855 BLVD DE PROVINCE, BATON ROUGE, 70816, EAST BATON ROUGE PARISH, ',
    outputAddress: '1855 Boulevard De Province, Baton Rouge, LA 70816, USA',
    lng: -91.0452648,
    lat: 30.4365714,
    accuracy: 'ROOFTOP',
    locationsFound: 1,
  },
  {
    id: 4,
    inputAddress: '3700 ORLEANS AVENUE, NEW ORLEANS, 70119, ORLEANS PARISH, LA',
    outputAddress: '3700 Orleans Ave, New Orleans, LA 70119, USA',
    lng: -90.093459,
    lat: 29.9767886,
    accuracy: 'ROOFTOP',
    locationsFound: 1,
  },
  {
    id: 5,
    inputAddress: '123 Augusta Drive',
    outputAddress: 'Augusta, GA, USA',
    lng: -82.0105148,
    lat: 33.4734978,
    accuracy: 'ROOFTOP',
    locationsFound: 1,
  },
];

const btnDirections = (
  <MapBoxButton
    icon={DirectionsIcon}
    size="small"
    tooltip={{ title: 'Directions' }}
    onClick={() => {
      alert('Map button clicked: "Directions"');
    }}
    data-testid="map-button-directions"
  />
);

const btnExplore = (
  <MapBoxButton
    icon={ExploreIcon}
    size="small"
    tooltip={{ title: 'Explore' }}
    onClick={() => {
      alert('Map button clicked: "Explore"');
    }}
    data-testid="map-button-explore"
  />
);

const btnAudio = (
  <MapBoxButton
    icon={AudiotrackIcon}
    size="small"
    disabled={true}
    tooltip={{ title: 'Audio' }}
    onClick={() => {
      alert('Map button clicked: "Audio"');
    }}
    data-testid="map-button-audio"
  />
);

const customTooltipComponent = ({ tooltip }) => {
  const latlng = `${Math.abs(tooltip.lat)}° ${tooltip.lat > 0 ? 'N' : 'S'}, ${Math.abs(tooltip.lng)}° ${tooltip.lng > 0 ? 'E' : 'W'}`;

  return (
    <MapBoxTooltip title={tooltip.outputAddress} list={[{ icon: <LocationOnIcon />, title: latlng }]}>
      <Button
        color="primary"
        size="xsmall"
        text="Click me"
        style={{ marginBottom: 5 }}
        onClick={() => {
          alert(`Tooltip button clicked:\n${tooltip.id} - ${tooltip.outputAddress}`);
        }}
      />
    </MapBoxTooltip>
  );
};

export const Markers = () => {
  const [viewport, setViewport] = useState({});

  return (
    <MapBox
      id="markers"
      height={400}
      showMarkers={boolean('Show Markers', true)}
      fitBounds={boolean('Fit Bounds', true)}
      locations={locations}
      allowFullscreen={boolean('Fullscreen Button', true)}
      allowSatelliteView={boolean('Satellite View Button', true)}
      buttons={boolean('Custom Buttons', false) ? [btnDirections, btnExplore, btnAudio] : []}
      overlay={boolean('Overlay', false) ? { text: 'Map loading...', visible: true } : {}}
      allowScrollZoom={boolean('Zoom on Scroll', true)}
      allowMarkerClickZoom={boolean('Zoom on Marker Click', true)}
      {...viewport}
      header={
        <Box pb={1} mr={1}>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                <Link style={{ color: '#4fb2ce' }} onClick={() => setViewport({ ...viewport, center: [-90.093459, 29.9767886], zoom: 11 })}>
                  Zoom to New Orleans
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      }
      tooltipComponent={customTooltipComponent}
    />
  );
};

export const Clusters = () => {
  const [viewport, setViewport] = useState({});
  const [clusterMapInstance, setClusterMapInstance] = useState(null);

  const onloadClusterMap = (instance) => {
    console.log('[onloadClusterMap]', instance);

    addClustersToMap(instance);
    setClusterMapInstance(instance);
  };

  const onChangeClusterMap = () => {
    console.log('[onChangeClusterMap]');
    addClustersToMap(clusterMapInstance);
  };

  const addClustersToMap = (instance) => {
    instance.addSource('location-geojson', {
      type: 'geojson',
      // data: config.api.endpoints.locations.url + '/' + 23880 + '/geo',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: { tiv: 19318631.0, '4tiv': 1932, ktiv: 19319, '5tiv': 193, mtiv: 19, state: 'GA' },
            geometry: { type: 'Point', coordinates: [-84.294549, 33.918275] },
          },
          {
            type: 'Feature',
            properties: { tiv: 22856775.0, '4tiv': 2286, ktiv: 22857, '5tiv': 229, mtiv: 23, state: 'LA' },
            geometry: { type: 'Point', coordinates: [-90.144803, 29.8944844] },
          },
          {
            type: 'Feature',
            properties: { tiv: 29165385.0, '4tiv': 2917, ktiv: 29165, '5tiv': 292, mtiv: 29, state: 'NC' },
            geometry: { type: 'Point', coordinates: [-78.9791492, 35.964363] },
          },
          {
            type: 'Feature',
            properties: { tiv: 11729016.95, '4tiv': 1173, ktiv: 11729, '5tiv': 117, mtiv: 12, state: '' },
            geometry: { type: 'Point', coordinates: [-91.0452648, 30.4365714] },
          },
          {
            type: 'Feature',
            properties: { tiv: 40940261.0, '4tiv': 4094, ktiv: 40940, '5tiv': 409, mtiv: 41, state: 'LA' },
            geometry: { type: 'Point', coordinates: [-90.0921232, 29.9765908] },
          },
          {
            type: 'Feature',
            properties: { tiv: 15692110.0, '4tiv': 1569, ktiv: 15692, '5tiv': 157, mtiv: 16, state: 'LA' },
            geometry: { type: 'Point', coordinates: [-90.1725436, 29.9948153] },
          },
        ],
      },
      cluster: true,
      //clusterMaxZoom: 20, // Max zoom to cluster points on
      clusterRadius: 60, // Radius of each cluster when clustering points (defaults to 50)
      clusterProperties: {
        mtiv: ['+', ['get', 'mtiv']],
        '4tiv': ['+', ['get', '4tiv']],
        tiv: ['+', ['get', 'tiv']],
      },
    });

    const tivSizes = [0, 0.1, 1, 10, 100, 1000, 10000];
    const tivRadius = [16, 18, 20, 22, 26, 30, 34];
    const tivColors = utils.color.scale(tivSizes.length * 2);

    let clusterLayers = tivSizes
      .map((s, i) => {
        return [tivSizes[i], tivColors[i * 2], tivRadius[i]];
      })
      .reverse();

    clusterLayers.forEach((layer, i) => {
      const clusterName = 'cluster-' + i;
      instance.addLayer({
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

    instance.addLayer({
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

    instance.addLayer({
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

  return (
    <MapBox
      id="clusters"
      height={400}
      showMarkers={false}
      fitBounds={boolean('Fit Bounds', true)}
      locations={locations}
      allowFullscreen={boolean('Fullscreen Button', true)}
      allowSatelliteView={boolean('Satellite View Button', true)}
      buttons={boolean('Custom Buttons', false) ? [btnDirections, btnExplore, btnAudio] : []}
      allowScrollZoom={boolean('Zoom on Scroll', true)}
      {...viewport}
      header={
        <Box pb={1} mr={1}>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                <Link style={{ color: '#4fb2ce' }} onClick={() => setViewport({ ...viewport, center: [-90.093459, 29.9767886], zoom: 11 })}>
                  Zoom to New Orleans
                </Link>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      }
      onLoad={onloadClusterMap}
      onChange={onChangeClusterMap}
    />
  );
};

export const LocationsList = () => {
  const [viewport, setViewport] = useState({});
  const [activeMarkers, setActiveMarkers] = useState([1]);

  const handleMarkerClick = (location) => {
    setActiveMarkers([location.id]);
  };

  const handleRowClick = (location) => (event) => {
    setViewport({
      ...viewport,
      center: [location.lng, location.lat],
      zoom: config.mapbox.marker.maxZoom,
    });

    setActiveMarkers([location.id]);
  };

  return (
    <Grid container spacing={2} direction="column">
      <Grid item>
        <MapBox
          id="markers"
          height={400}
          activeMarkers={activeMarkers}
          onClickMarker={handleMarkerClick}
          fitBounds
          locations={locations}
          allowFullscreen={boolean('Fullscreen Button', true)}
          allowSatelliteView={boolean('Satellite View Button', true)}
          buttons={boolean('Custom Buttons', false) ? [btnDirections, btnExplore, btnAudio] : []}
          allowScrollZoom={boolean('Zoom on Scroll', true)}
          allowMarkerClickZoom={boolean('Zoom on Marker Click', true)}
          tooltipComponent={({ tooltip }) => {
            return <MapBoxTooltip list={[{ icon: <LocationOnIcon />, title: tooltip.outputAddress }]} />;
          }}
          {...viewport}
        />
      </Grid>
      <Grid item>
        <Table size="small">
          <TableHead
            columns={[
              { id: 'streetAddress', label: 'Address' },
              { id: 'lat', label: 'Latitude' },
              { id: 'lng', label: 'Longitude' },
            ]}
          />

          <TableBody>
            {locations.map((location) => {
              return (
                <TableRow
                  key={location.id}
                  hover
                  selected={activeMarkers.includes(location.id)}
                  style={{ cursor: 'pointer' }}
                  onClick={handleRowClick(location)}
                >
                  <TableCell compact>{location.outputAddress}</TableCell>
                  <TableCell compact>{location.lat}</TableCell>
                  <TableCell compact>{location.lng}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Grid>
    </Grid>
  );
};

export const Levels = () => {
  const levels = {
    country: [
      {
        address: 'United States',
        lat: 37.09024,
        lng: -95.712891,
        locationsFound: 4225,
        tiv: 25000000,
        properties: {
          backgroundColor: ['#FF6633', '#E6B333'],
          data: [20000000, 5000000],
        },
      },
    ],
    state: [
      {
        address: 'Kansas, United States',
        lat: 39.011902,
        lng: -98.4842465,
        locationsFound: 23,
        properties: {
          data: [66797267.68],
          backgroundColor: ['#00B3E6'],
        },
      },
      {
        address: 'Oklahoma, United States',
        lat: 35.0077519,
        lng: -97.092877,
        locationsFound: 23,
        properties: {
          data: [221052812.35, 1805400, 52272150],
          backgroundColor: ['#00B3E6', '#E6331A', '#3366E6'],
        },
      },
      {
        address: 'Colorado, United States',
        lat: 39.5500507,
        lng: -105.7820674,
        locationsFound: 22,
        properties: {
          data: [221052812.35, 1805400, 52272150],
          backgroundColor: ['#00B3E6', '#E6331A', '#3366E6'],
        },
      },
    ],
    county: [
      {
        address: 'Cleveland County, Oklahoma, United States',
        lat: 35.254964,
        lng: -97.3516558,
        locationsFound: 2,
        properties: {
          data: [350190, 6463887],
          backgroundColor: ['#00B3E6', '#3366E6'],
        },
      },
      {
        address: 'McClain County, Oklahoma, United States',
        lat: 35.0282316,
        lng: -97.4814163,
        locationsFound: 1,
        properties: {
          data: [7394855.13],
          backgroundColor: ['#00B3E6'],
        },
      },
      {
        address: 'Canadian County, Oklahoma, United States',
        lat: 35.5593784,
        lng: -98.0465185,
        locationsFound: 1,
        properties: {
          data: [1219169.66],
          backgroundColor: ['#00B3E6'],
        },
      },
      {
        address: 'Oklahoma County, Oklahoma, United States',
        lat: 35.6038323,
        lng: -97.3516558,
        locationsFound: 14,
        properties: {
          data: [341821538.16, 30854677],
          backgroundColor: ['#00B3E6', '#3366E6'],
        },
      },
      {
        address: 'Okmulgee County, Oklahoma, United States',
        lat: 35.6795873,
        lng: -95.9832577,
        locationsFound: 1,
        properties: {
          data: [13363468],
          backgroundColor: ['#00B3E6'],
        },
      },
      {
        address: 'Garvin County, Oklahoma, United States',
        lat: 34.7289063,
        lng: -97.3516558,
        locationsFound: 2,
        properties: {
          data: [2230315],
          backgroundColor: ['#00B3E6'],
        },
      },
      {
        address: 'Pittsburg County, Oklahoma, United States',
        lat: 34.9879281,
        lng: -95.8142885,
        locationsFound: 6,
        properties: {
          data: [7088622],
          backgroundColor: ['#00B3E6'],
        },
      },
      {
        address: 'Pottawatomie County, Oklahoma, United States',
        lat: 35.275439,
        lng: -97.0068393,
        locationsFound: 3,
        properties: {
          data: [135626743.8],
          backgroundColor: ['#00B3E6'],
        },
      },
    ],
    zip: [
      {
        address: '73069, Cleveland County, Oklahoma, United States',
        lat: 35.2585957,
        lng: -97.4705935,
        locationsFound: 1,
        properties: {
          data: [6463887],
          backgroundColor: ['#3366E6'],
        },
      },
    ],
    address: [
      {
        address: '2351 Interstate Dr, Norman, 73069, Cleveland, OK',
        lat: 35.2469258,
        lng: -97.4840377,
        locationsFound: 1,
        properties: {
          data: [6463887],
          backgroundColor: ['#3366E6'],
        },
      },
    ],
  };
  const [isLoading, setIsLoading] = useState(false);
  const [locations, setLocations] = useState([]);

  const getStore = (obj) => {
    const enhancer = compose(applyMiddleware(thunk));
    const defaultStore = createStore(reducer, {}, enhancer);
    const preloadedState = merge(defaultStore.getState(), obj);

    // return default store if no custom JSON is passed
    if (!obj) {
      return defaultStore;
    }

    // otherwise, return new deeply-merged store with data from JSON obj
    return createStore(reducer, preloadedState, enhancer);
  };

  const getLocations = ({ level }) => {
    setIsLoading(true);
    setTimeout(() => {
      setLocations(levels[level]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Provider store={getStore()}>
      <MapBox
        id="clusters"
        height={400}
        locations={[...locations]}
        allowFullscreen={boolean('Fullscreen Button', true)}
        allowSatelliteView={boolean('Satellite View Button', true)}
        buttons={boolean('Custom Buttons', false) ? [btnDirections, btnExplore, btnAudio] : []}
        allowScrollZoom={boolean('Zoom on Scroll', true)}
        onLoad={(map, props) => getLocations(props)}
        reCenter={false}
        onLevelChange={getLocations}
        isLoading={isLoading}
        showMarkers={true}
        markerType={config.mapbox.markerType.doughnut}
      />
    </Provider>
  );
};
