import * as utils from 'utils';

describe('UTILS › map', () => {
  const locations = [
    { id: 0 },
    { id: 1, lat: 50.0, lng: 30.0 },
    { id: 2, lat: -40.0, lng: 40.0, locationsFound: 0 },
    { id: 3, lat: 60.0, lng: 50.0, locationsFound: 1 },
    { id: 4, lat: -20.0, lng: 60.0, locationsFound: 2 },
    { id: 5, lat: 0.0, lng: -30.0, locationsFound: 1 },
    { id: 6, lat: 35.0, lng: -80.0, locationsFound: 1 },
  ];

  it('should export the required methods', () => {
    // assert
    expect(utils.map).toHaveProperty('setMarkers');
    expect(utils.map).toHaveProperty('parseLocations');
    expect(utils.map).toHaveProperty('addDefaultLayers');
  });

  describe('setMarkers', () => {
    it('should return an array of markers', () => {
      // arrange
      const mapInstance = {};

      // assert
      expect(utils.map.setMarkers()).toBeUndefined();
      expect(utils.map.setMarkers(null)).toBeUndefined();
      expect(utils.map.setMarkers(null, null)).toBeUndefined();
      expect(utils.map.setMarkers({})).toBeUndefined();
      expect(utils.map.setMarkers({}, null)).toBeUndefined();
      expect(utils.map.setMarkers({}, null)).toBeUndefined();
      expect(utils.map.setMarkers(mapInstance, null)).toBeUndefined();
      expect(utils.map.setMarkers(mapInstance, locations).length).toBe(4);
    });
  });

  describe('parseLocations', () => {
    it('should sort/filter invalid locations from the array', () => {
      // assert
      expect(utils.map.parseLocations()).toEqual([]);
      expect(utils.map.parseLocations(null)).toEqual([]);
      expect(utils.map.parseLocations([])).toEqual([]);
      expect(utils.map.parseLocations('foo')).toEqual([]);
      expect(utils.map.parseLocations(1)).toEqual([]);
      expect(utils.map.parseLocations(locations)).toEqual([locations[3], locations[6], locations[5], locations[4]]);
    });
  });

  describe('addDefaultSources', () => {
    it('should return undefined if no map is passed', () => {
      // assert
      expect(utils.map.addDefaultSources()).toBeUndefined();
    });
    it('should call addSource if source does not yet exist', () => {
      // arrange
      const map = {
        getSource: jest.fn(() => undefined),
        addSource: jest.fn(),
      };

      // act
      const response = utils.map.addDefaultSources(map);

      // assert
      expect(map.addSource).toHaveBeenCalledTimes(2);
      expect(map.addSource).toHaveBeenCalledWith('mapbox-streets', { type: 'vector', url: 'mapbox://mapbox.mapbox-streets-v7' });
      expect(map.addSource).toHaveBeenCalledWith('mapbox-terrain', { type: 'vector', url: 'mapbox://mapbox.mapbox-terrain-v2' });
      expect(response).toEqual(map);
    });
    it('should not call addSource if source already exists', () => {
      // arrange
      const map = {
        getSource: jest.fn((id) => ({ id })),
        addSource: jest.fn(),
      };

      // act
      const response = utils.map.addDefaultSources(map);

      // assert
      expect(map.addSource).toHaveBeenCalledTimes(0);
      expect(response).toEqual(map);
    });
  });

  describe('addDefaultLayers', () => {
    it('should return a map object with the layers for missing params', () => {
      // arrange
      const map = {
        layers: [],
        getLayer: jest.fn(),
        addLayer: jest.fn((config) => {
          map.layers.push(config);
        }),
        setLayoutProperty: jest.fn((id, visibility, layerVisibility) => {}),
      };

      // assert
      expect(utils.map.addDefaultLayers()).toBeUndefined();
      expect(utils.map.addDefaultLayers(null)).toBeNull();
      expect(utils.map.addDefaultLayers(null, null)).toBeNull();
      expect(utils.map.addDefaultLayers({}, null)).toEqual({});
      expect(utils.map.addDefaultLayers({}, {})).toEqual({});
      expect(utils.map.addDefaultLayers(map)).toEqual(map);
      expect(utils.map.addDefaultLayers(map, null)).toEqual(map);
      expect(utils.map.addDefaultLayers(map, {})).toEqual(map);
      expect(utils.map.addDefaultLayers(map, '')).toEqual(map);
      expect(utils.map.addDefaultLayers(map, 'foo')).toEqual(map);
    });

    it('should return a map object with the layers for valid params', () => {
      // arrange
      const map = {
        layers: [],
        getLayer: jest.fn(),
        addLayer: jest.fn((config) => {
          map.layers.push(config);
        }),
        setLayoutProperty: jest.fn((id, visibility, layerVisibility) => {}),
      };

      const layers = {
        1: { name: 'foo', config: [{ id: 'aaa' }] },
        2: { name: 'bar', config: [{ id: 'bbb', visibility: 'none' }, { id: 'ccc' }], visibility: 'none' },
        3: {
          name: 'qwe',
          config: [
            { id: 'ddd', visibility: 'none' },
            { id: 'eee', visibility: 'visible' },
          ],
          visibility: 'visible',
        },
      };

      // assert
      expect(utils.map.addDefaultLayers(map, layers)).toEqual({
        ...map,
        layers: [
          { id: 'aaa' },
          { id: 'bbb', visibility: 'none' },
          { id: 'ccc' },
          { id: 'ddd', visibility: 'none' },
          { id: 'eee', visibility: 'visible' },
        ],
      });

      expect(map.addLayer).toHaveBeenCalledTimes(5);
      expect(map.addLayer.mock.calls[0][0]).toEqual(layers['1'].config[0]);
      expect(map.addLayer.mock.calls[1][0]).toEqual(layers['2'].config[0]);
      expect(map.addLayer.mock.calls[2][0]).toEqual(layers['2'].config[1]);
      expect(map.addLayer.mock.calls[3][0]).toEqual(layers['3'].config[0]);
      expect(map.addLayer.mock.calls[4][0]).toEqual(layers['3'].config[1]);
      expect(map.setLayoutProperty).toHaveBeenCalledTimes(5);
      expect(map.setLayoutProperty.mock.calls[0]).toEqual(['aaa', 'visibility', undefined]);
      expect(map.setLayoutProperty.mock.calls[1]).toEqual(['bbb', 'visibility', 'none']);
      expect(map.setLayoutProperty.mock.calls[2]).toEqual(['ccc', 'visibility', 'none']);
      expect(map.setLayoutProperty.mock.calls[3]).toEqual(['ddd', 'visibility', 'visible']);
      expect(map.setLayoutProperty.mock.calls[4]).toEqual(['eee', 'visibility', 'visible']);
    });
  });

  describe('getLevelByZoom', () => {
    const levels = [
      ['<=', 3, 'foo'],
      ['===', 6, 'bar'],
      ['>=', 7, 'baz'],
    ];
    it('should return the correct level by zoom', () => {
      expect(utils.map.getLevelByZoom()).toBe(undefined);
      expect(utils.map.getLevelByZoom(levels)).toBe(undefined);
      expect(utils.map.getLevelByZoom(levels, 1)).toBe('foo');
      expect(utils.map.getLevelByZoom(levels, 3)).toBe('foo');
      expect(utils.map.getLevelByZoom(levels, 6)).toBe('bar');
      expect(utils.map.getLevelByZoom(levels, 7)).toBe('baz');
      expect(utils.map.getLevelByZoom(levels, 20)).toBe('baz');
    });
  });

  describe('getZoomOptions', () => {
    const levels = [
      ['<=', 3, 'foo'],
      ['===', 6, 'bar'],
      ['>=', 7, 'baz'],
    ];
    const expectedResponse = [
      { id: 'foo', zoom: 3, label: 'map.levels.foo' },
      { id: 'bar', zoom: 6, label: 'map.levels.bar' },
      { id: 'baz', zoom: 7, label: 'map.levels.baz' },
    ];
    it('should return zoom options', () => {
      expect(utils.map.getZoomOptions()).toEqual([]);
      expect(utils.map.getZoomOptions(levels)).toEqual(expectedResponse);
    });
  });

  describe('getLevelByLevel', () => {
    const levelOptions = [
      { id: 'foo', zoom: 3, label: 'Foo' },
      { id: 'bar', zoom: 6, label: 'Bar' },
      { id: 'baz', zoom: 7, label: 'Baz' },
    ];
    it('should return the correct level by level', () => {
      expect(utils.map.getLevelOption()).toBe(undefined);
      expect(utils.map.getLevelOption(levelOptions)).toBe(undefined);
      expect(utils.map.getLevelOption(levelOptions, 'bar')).toEqual({ id: 'bar', zoom: 6, label: 'Bar' });
    });
  });
});
