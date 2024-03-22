import * as utils from 'utils';

export const mapLayers = {
  buildings: {
    name: '3D Buildings',
    config: [
      {
        name: '3D Buildings',
        id: '3d-buildings',
        source: 'mapbox-streets',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.6,
        },
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  contours: {
    name: 'Contours',
    config: [
      {
        name: 'Contours',
        id: 'contour',
        layout: {
          visibility: 'visible',
        },
        type: 'line',
        source: 'mapbox-terrain',
        paint: {},
        'source-layer': 'contour',
        visibility: 'none',
      },
      {
        name: 'Contour Labels',
        id: 'contour-label',
        layout: {
          'symbol-placement': 'line',
          'text-field': ['concat', ['to-string', ['get', 'ele']], 'm (', ['to-string', ['*', ['get', 'ele'], 3.3]], 'ft)'],
        },
        type: 'symbol',
        source: 'mapbox-terrain',
        paint: {
          'text-halo-color': 'hsl(0, 0%, 100%)',
          'text-halo-width': 1,
        },
        'source-layer': 'contour',
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  nfhl: {
    name: 'National Flood Hazard Layer',
    config: [
      {
        name: 'National Flood Hazard Layer',
        id: 'nfhl',
        type: 'raster',
        paint: {
          'raster-opacity': 0.5,
        },
        source: {
          type: 'raster',
          tiles: [
            'https://hazards.fema.gov/gis/nfhl/rest/services/public/NFHL/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=3857&layers=&layerDefs=&size=256%2c256&imageSR=3857&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image',
          ],
        },
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  weatherRadar: {
    name: 'Weather Radar Imagery',
    config: [
      {
        name: 'Weather Radar Imagery',
        id: 'noaa-wri',
        type: 'raster',
        paint: {
          'raster-opacity': 0.5,
        },
        source: {
          type: 'raster',
          tiles: [
            'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/radar_meteo_imagery_nexrad_time/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=EPSG%3A3857&layers=&layerDefs=&size=256%2c256&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image',
          ],
        },
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  liveHurricanes: {
    name: 'Live Hurricanes',
    config: [
      {
        name: 'New Noaa',
        id: 'noaa-track-intensity',
        type: 'raster',
        paint: {
          'raster-opacity': 0.5,
        },
        source: {
          type: 'raster',
          tiles: [
            'https://nowcoast.noaa.gov/arcgis/rest/services/nowcoast/wwa_meteocean_tropicalcyclones_trackintensityfcsts_time/MapServer/export?bbox={bbox-epsg-3857}&bboxSR=EPSG%3A3857&layers=&layerDefs=&size=256%2c256&imageSR=&format=png&transparent=true&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&f=image',
          ],
        },
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  coastalFlood: {
    name: 'Coastal Flood Exposure (Category 5)',
    config: [
      {
        name: 'Coastal Flood Exposure',
        id: 'costal-flood',
        type: 'raster',
        paint: {
          'raster-opacity': 0.5,
        },
        source: {
          type: 'raster',
          tiles: [
            'https://tiles.arcgis.com/tiles/C8EMgrsFcRFL6LrL/arcgis/rest/services/NHC_NationalMOM_Category5_CONUS/MapServer/tile/{z}/{y}/{x}',
          ],
        },
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  allShootings: {
    name: 'All Shootings (2014 - 2019)',
    config: [
      {
        name: 'All Shootings',
        id: 'all-shootings',
        type: 'circle',
        source: {
          type: 'geojson',
          data: 'https://pf-public-json-data.s3.eu-west-2.amazonaws.com/terrorism/allShootings.json',
        },
        paint: {
          'circle-radius': 4,
          'circle-color': '#32CD32',
        },
        filter: ['==', '$type', 'Point'],
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
  massShootings: {
    name: 'Mass Shootings (2014 - 2019)',
    config: [
      {
        name: 'Mass Shootings',
        id: 'mass-shootings',
        type: 'circle',
        source: {
          type: 'geojson',
          data: 'https://pf-public-json-data.s3.eu-west-2.amazonaws.com/terrorism/massShootings.json',
        },
        paint: {
          'circle-radius': 4,
          'circle-color': '#B42222',
        },
        filter: ['==', '$type', 'Point'],
        visibility: 'none',
      },
    ],
    visibility: utils.map.visibility.none,
  },
};
