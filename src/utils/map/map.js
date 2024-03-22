import mapboxgl from 'mapbox-gl';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import config from 'config';

const utilsMap = {
  visibility: {
    visible: 'visible',
    none: 'none',
  },

  setMarkers: (mapInstance, locations, markers = []) => {
    if (!mapInstance || !locations || !utils.generic.isValidArray(markers)) return;

    const markersArray = [];

    utilsMap.parseLocations(locations).forEach((location) => {
      const bespokeColor = get(location, 'properties.backgroundColor[0]');
      const color = bespokeColor || config.mapbox.marker.color[location.active ? 'active' : 'default'];
      const marker = new mapboxgl.Marker({ color }).setLngLat([location.lng, location.lat]);
      const markerExists = markers.find((m) => isEqual(m.getLngLat(), marker.getLngLat()));

      if (markerExists) return;

      // adding original location object (id, lat, lng, etc...) to the marker
      marker.location = location;

      try {
        marker.addTo(mapInstance);
      } catch {}

      markersArray.push(marker);
    });

    return markersArray;
  },

  parseLocations: (locations) => {
    if (!utils.generic.isValidArray(locations, true)) return [];

    return locations
      .filter((location) => {
        return location && location.locationsFound > 0;
      })
      .sort((a, b) => {
        if (!a || !b) return false;
        if ((!a.lat && a.lat !== 0) || (!b.lat && b.lat !== 0)) return false;
        return b.lat - a.lat;
      });
  },

  addDefaultLayers: (map, layers) => {
    if (!map || !layers || typeof layers !== 'object') return map;

    Object.values(layers).forEach((lg) => {
      lg.config.forEach((c) => {
        if (utils.generic.isFunction(map.addLayer) && !map.getLayer(c.id)) {
          map.addLayer(c);
        }
      });
    });

    Object.values(layers).forEach((lg) => {
      let v = lg.visibility;

      lg.config.forEach((c) => {
        if (utils.generic.isFunction(map.setLayoutProperty)) {
          map.setLayoutProperty(c.id, 'visibility', v);
        }
      });
    });

    return map;
  },

  addDefaultSources: (map) => {
    if (!map) return map;

    if (!map.getSource('mapbox-streets')) map.addSource('mapbox-streets', config.mapbox.sources.streets);
    if (!map.getSource('mapbox-terrain')) map.addSource('mapbox-terrain', config.mapbox.sources.terrain);

    return map;
  },

  getLevelByZoom: (levels, zoom) => {
    if (!utils.generic.isValidArray(levels, true)) return;
    let level;
    levels.forEach((lvl) => {
      const [operator, levelZoom, levelType] = lvl;
      if (utils.generic.getWithDynamicOperator(zoom, operator, levelZoom)) {
        level = levelType;
      }
    });
    return level;
  },

  getZoomOptions: (levels) => {
    if (!utils.generic.isValidArray(levels)) return [];
    const uniqueLevels = {};
    levels.forEach((level) => {
      if (uniqueLevels[level[2]]) return;
      uniqueLevels[level[2]] = {
        id: level[2],
        zoom: level[1],
        label: utils.string.t(`map.levels.${level[2]}`),
      };
    });
    return Object.values(uniqueLevels);
  },

  getLevelOption: (levelOptions, level) => {
    if (!utils.generic.isValidArray(levelOptions, true) || !level) return;
    return levelOptions.find((option) => option.id === level);
  },
};

export default utilsMap;
