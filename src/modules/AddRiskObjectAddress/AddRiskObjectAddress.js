import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import sortBy from 'lodash/sortBy';
import debounce from 'lodash/debounce';
import get from 'lodash/get';
import round from 'lodash/round';
import turfLength from '@turf/length';
import { lineString as turfLineString } from '@turf/helpers';

// app
import styles from './AddRiskObjectAddress.styles';
import { AddRiskObjectAddressView } from './AddRiskObjectAddress.view';
import { getRiskAddress } from 'stores';
import config from 'config';

// mui
import { makeStyles } from '@material-ui/core';

AddRiskObjectAddress.propTypes = {
  field: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
};

export default function AddRiskObjectAddress({ field, formProps }) {
  const classes = makeStyles(styles, { name: 'AddRiskObjectAddress' })();
  const dispatch = useDispatch();
  const refLocations = useRef([]);
  const [distance, setDistance] = useState();
  const [locations, setLocations] = useState([]);
  const [map, setMap] = useState({ maxZoom: 12 });
  const validFields = [
    'street',
    'city',
    'zipCode',
    'county',
    'state',
    'distanceToCoast',
    'formattedAddress',
    'outputCounty',
    'outputState',
  ];

  const geojson = {
    type: 'FeatureCollection',
    features: [],
  };

  const mapOnLoad = (instance) => {
    if (!instance) return;

    setMap({ ...map, instance });

    instance.addSource('geojson', {
      type: 'geojson',
      data: geojson,
    });

    instance.addLayer({
      id: 'measure-circle',
      type: 'circle',
      source: 'geojson',
      paint: {
        'circle-radius': 5,
        'circle-color': 'rgb(19, 93, 252)',
        'circle-stroke-width': 2,
        'circle-stroke-color': 'rgb(255,255,255)',
      },
      filter: ['in', '$type', 'Point'],
    });

    instance.addLayer({
      id: 'measure-lines',
      type: 'line',
      source: 'geojson',
      layout: {
        'line-cap': 'round',
        'line-join': 'round',
      },
      paint: {
        'line-color': 'rgb(19, 93, 252)',
        'line-width': 2.5,
      },
      filter: ['in', '$type', 'LineString'],
    });

    instance.addLayer({
      id: 'measure-point',
      type: 'symbol',
      source: 'geojson',
      layout: {
        'text-field': ['get', 'title'],
        'text-size': 14,
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top',
        'symbol-z-order': 'source',
      },
      paint: {
        'text-halo-blur': 1,
        'text-halo-color': 'rgba(255,255,255,1)',
        'text-halo-width': 1,
      },
      filter: ['in', '$type', 'Point'],
    });

    instance.on('click', (event) => {
      const marker = get(refLocations, 'current[0]') || {};
      const coordinatesMarker = [marker.lng, marker.lat];
      const coordinatesPoint = [event.lngLat.lng, event.lngLat.lat];
      const distance = turfLength(turfLineString([coordinatesMarker, coordinatesPoint]), { units: 'miles' });
      const distanceString = distance ? round(distance, 2) : '';

      // abort
      if (!marker.lng || !marker.lat) return;

      geojson.features = [];
      updateDistance(distanceString);

      const line = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: [coordinatesMarker, coordinatesPoint],
        },
      };

      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: coordinatesPoint,
        },
        properties: {
          title: `${distance ? distanceString + ' miles' : ''}`,
        },
      };

      geojson.features.push(point);
      geojson.features.push(line);
      instance.getSource('geojson').setData(geojson);
    });
  };

  const handleAddressSearch = debounce(async (name, value, getValues) => {
    const values = get(getValues({ nest: true }), field.name);

    const obj = {
      ...values,
      [name]: value,
    };

    if (Object.values(obj).some((v) => Boolean(v))) {
      const response = await dispatch(
        getRiskAddress(
          Object.values(obj)
            .filter((v) => !!v)
            .join(', ')
        )
      );

      if (response) {
        refLocations.current = [response];
        setLocations([response]);
        updateLocation([response]);
        updateDistance('', false);

        const mapSource = map.instance.getSource('geojson');
        geojson.features = [];
        mapSource.setData(geojson);
      }
    }
  }, config.ui.autocomplete.delay);

  const handleAddressOnChange = (definition) => (value, control) => {
    handleAddressSearch(definition.name, value, control.getValues);
    return value;
  };

  const updateDistance = (value, revalidate = true) => {
    setDistance(value);
    formProps.setValue(`${field.name}.distanceToCoast`, value);

    if (revalidate) {
      formProps.trigger(`${field.name}.distanceToCoast`);
    }
  };

  const updateLocation = (value) => {
    const { outputAddress, county, state } = value[0];
    formProps.setValue(`${field.name}.formattedAddress`, outputAddress);
    formProps.setValue(`${field.name}.outputCounty`, county);
    formProps.setValue(`${field.name}.outputState`, state);
  };

  const customFieldProperties =
    field && field.objectDef
      ? {
          objectDef: sortBy(
            field.objectDef
              .filter((def) => validFields.includes(def.name))
              .map((def) => {
                if (def.name === 'street') {
                  def.gridSize = { xs: 12, sm: 8, lg: 12 };
                  def.order = 0;
                  def.onChange = handleAddressOnChange(def);
                }
                if (def.name === 'zipCode') {
                  def.gridSize = { xs: 4 };
                  def.order = 1;
                  def.onChange = handleAddressOnChange(def);
                }
                if (def.name === 'city') {
                  def.gridSize = { xs: 8, sm: 12, md: 6, lg: 8 };
                  def.order = 2;
                  def.onChange = handleAddressOnChange(def);
                }
                if (def.name === 'county') {
                  def.gridSize = { xs: 8, md: 4, lg: 8 };
                  def.order = 3;
                  def.onChange = handleAddressOnChange(def);
                }
                if (def.name === 'state') {
                  def.gridSize = { xs: 4, md: 2, lg: 4 };
                  def.order = 4;
                  def.onChange = handleAddressOnChange(def);
                }
                if (def.name === 'distanceToCoast') {
                  def.type = 'hidden';
                  def.order = -1;
                  def.errorProps = {
                    nestedClasses: {
                      root: classes.error,
                    },
                  };
                }
                if (def.name === 'formattedAddress') {
                  def.type = 'hidden';
                  def.order = -1;
                }
                return def;
              }),
            'order'
          ),
        }
      : {};

  // abort
  if (!field || !field.name || !field.objectDef) return null;
  if (!formProps || !formProps.control) return null;

  return (
    <AddRiskObjectAddressView
      field={{ ...field, ...customFieldProperties }}
      formProps={formProps}
      map={map}
      locations={locations}
      distance={distance}
      mapOnLoad={mapOnLoad}
    />
  );
}
