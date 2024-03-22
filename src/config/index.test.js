import config from './index';

describe('CONFIG', () => {
  it('should have the expected top-level properties defined', () => {
    expect(Object.keys(config)).toHaveLength(13);
    expect(config).toHaveProperty('locale');
    expect(config).toHaveProperty('localeCountry');
    expect(config).toHaveProperty('currency');
    expect(config).toHaveProperty('assets');
    expect(config).toHaveProperty('routes');
    expect(config).toHaveProperty('ui');
    expect(config).toHaveProperty('colorPicker');
    expect(config).toHaveProperty('mapbox');
    expect(config).toHaveProperty('auth');
    expect(config).toHaveProperty('departments');
    expect(config).toHaveProperty('openingMemo');
    expect(config).toHaveProperty('processingInstructions');
    expect(config).toHaveProperty('slipcase');
  });

  describe('locale', () => {
    it('should have the expected properties', () => {
      expect(config.locale).toBe('en');
    });
  });

  describe('localeCountry', () => {
    it('should have the expected properties', () => {
      expect(config.localeCountry).toBe('en-GB');
    });
  });

  describe('currency', () => {
    it('should have the expected properties', () => {
      expect(config.currency).toBe('USD');
    });
  });

  describe('assets', () => {
    it('should have the expected properties', () => {
      expect(config.assets).toBe('https://edgeassets.blob.core.windows.net');
    });
  });

  describe('routes', () => {
    it('should have the expected properties', () => {
      // admin
      // expect(config.routes.admin).toHaveProperty('root', '/admin');

      // authentication
      expect(config.routes.authentication).toHaveProperty('root', '/authentication');

      // checklist
      expect(config.routes.checklist).toHaveProperty('root', '/checklist');

      // client
      expect(config.routes.client).toHaveProperty('root', '/clients');
      expect(config.routes.client).toHaveProperty('item', '/client');

      // claim fnol
      expect(config.routes.claimsFNOL).toHaveProperty('root', '/claims-fnol');
      expect(config.routes.claimsFNOL).toHaveProperty('item', '/claim-fnol');

      // claim processing
      expect(config.routes.claimsProcessing).toHaveProperty('root', '/claims-processing');
      expect(config.routes.claimsProcessing).toHaveProperty('claim', '/claims-processing/claim');
      expect(config.routes.claimsProcessing).toHaveProperty('task', '/claims-processing/task');

      // department
      expect(config.routes.department).toHaveProperty('root', '/department');

      // home
      expect(config.routes.home).toHaveProperty('root', '/');

      // industryNews
      expect(config.routes.industryNews).toHaveProperty('root', '/industry-news');

      // login
      expect(config.routes.login).toHaveProperty('root', '/login');

      // logout
      expect(config.routes.logout).toHaveProperty('root', '/logout');

      // market
      expect(config.routes.market).toHaveProperty('root', '/markets');
      expect(config.routes.market).toHaveProperty('item', '/market');

      // modelling
      expect(config.routes.modelling).toHaveProperty('root', '/modelling');

      // opportunity
      expect(config.routes.opportunity).toHaveProperty('root', '/opportunity');

      // placement
      expect(config.routes.placement).toHaveProperty('root', '/placement');
      expect(config.routes.placement).toHaveProperty('bound', '/placement/bound');
      expect(config.routes.placement).toHaveProperty('documents', '/placement/documents');
      expect(config.routes.placement).toHaveProperty('firmOrder', '/placement/firm-order');
      expect(config.routes.placement).toHaveProperty('marketSheet', '/placement/market-sheet');
      expect(config.routes.placement).toHaveProperty('modelling', '/placement/modelling');
      expect(config.routes.placement).toHaveProperty('checklist', '/placement/checklist');
      expect(config.routes.placement).toHaveProperty('overview', '/placement/overview');

      // policy
      expect(config.routes.policy).toHaveProperty('root', '/policy');

      // products
      expect(config.routes.quoteBind).toHaveProperty('root', '/quote-bind');
      expect(config.routes.quoteBind).toHaveProperty('admin', '/quote-bind/admin');

      // trips
      expect(config.routes.trip).toHaveProperty('root', '/trips');
    });
  });

  describe('ui', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.ui)).toHaveLength(7);
      expect(config.ui).toHaveProperty('brand');
      expect(config.ui).toHaveProperty('pagination');
      expect(config.ui).toHaveProperty('sort');
      expect(config.ui).toHaveProperty('notification');
      expect(config.ui).toHaveProperty('autocomplete');
      expect(config.ui).toHaveProperty('format');
      expect(config.ui).toHaveProperty('chart');

      // brand
      expect(Object.keys(config.ui.brand)).toHaveLength(2);
      expect(config.ui.brand).toHaveProperty('priceforbes');
      expect(config.ui.brand.priceforbes).toHaveProperty('logo');
      expect(config.ui.brand.priceforbes).toHaveProperty('primaryColor');
      expect(config.ui.brand.priceforbes).toHaveProperty('secondaryColor');
      expect(config.ui.brand).toHaveProperty('bishopsgate');
      expect(config.ui.brand.bishopsgate).toHaveProperty('logo');
      expect(config.ui.brand.bishopsgate).toHaveProperty('primaryColor');
      expect(config.ui.brand.bishopsgate).toHaveProperty('secondaryColor');

      // pagination
      expect(Object.keys(config.ui.pagination)).toHaveLength(3);
      expect(config.ui.pagination).toHaveProperty('default');
      expect(config.ui.pagination).toHaveProperty('defaultMobile');
      expect(config.ui.pagination).toHaveProperty('options');

      // sort
      expect(Object.keys(config.ui.sort)).toHaveLength(1);
      expect(config.ui.sort).toHaveProperty('direction');
      expect(config.ui.sort.direction).toHaveProperty('default');

      // notification
      expect(Object.keys(config.ui.notification)).toHaveLength(1);
      expect(config.ui.notification).toHaveProperty('delay');

      // autocomplete
      expect(Object.keys(config.ui.autocomplete)).toHaveLength(1);
      expect(config.ui.autocomplete).toHaveProperty('delay');

      // format
      expect(Object.keys(config.ui.format)).toHaveLength(4);
      expect(config.ui.format).toHaveProperty('currency');
      expect(config.ui.format).toHaveProperty('date');
      expect(config.ui.format).toHaveProperty('number');
      expect(config.ui.format).toHaveProperty('percent');

      // chart
      expect(Object.keys(config.ui.chart)).toHaveLength(4);
      expect(config.ui.chart).toHaveProperty('colours');
      expect(config.ui.chart).toHaveProperty('bar');
      expect(config.ui.chart).toHaveProperty('doughnut');
      expect(config.ui.chart).toHaveProperty('pie');
    });
  });

  describe('colorPicker', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.colorPicker.colors)).toHaveLength(19);

      config.colorPicker.colors.forEach((color) => {
        expect(color).toMatch(/^#[a-f0-9]/i);
      });
    });
  });

  describe('mapbox', () => {
    it('should have the expected properties', () => {
      expect(config.mapbox).toHaveProperty('height');
      expect(config.mapbox).toHaveProperty('pitch');
      expect(config.mapbox).toHaveProperty('zoom');
      expect(config.mapbox).toHaveProperty('minZoom');
      expect(config.mapbox).toHaveProperty('maxZoom');
      expect(config.mapbox).toHaveProperty('marker');
      expect(config.mapbox.marker).toHaveProperty('maxZoom');
      expect(config.mapbox.marker).toHaveProperty('color');
      expect(config.mapbox.marker.color).toHaveProperty('default');
      expect(config.mapbox.marker.color).toHaveProperty('active');
    });
  });

  describe('auth', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.auth)).toHaveLength(8);
      expect(config.auth).toHaveProperty('domain');
      expect(config.auth).toHaveProperty('clientID');
      expect(config.auth).toHaveProperty('bishopsgate.clientID');
      expect(config.auth).toHaveProperty('redirectAuthentication');
      expect(config.auth).toHaveProperty('redirectLogout');
      expect(config.auth).toHaveProperty('responseType');
      expect(config.auth).toHaveProperty('scope');
      expect(config.auth).toHaveProperty('leeway');
    });
  });

  describe('departments', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.departments)).toHaveLength(1);
      expect(config.departments).toHaveProperty('physicalLoss');
      expect(config.departments.physicalLoss).toEqual([
        { id: 1, name: 'Property & Casualty' },
        { id: 2, name: 'International Energy' },
        { id: 3, name: 'Construction' },
        { id: 4, name: 'Mining' },
        { id: 5, name: 'Political & Terrorism' },
        { id: 7, name: 'US Energy' },
        { id: 11, name: 'Power and Utilities' },
        { id: 18, name: 'Cargo' },
        { id: 21, name: 'Property' },
        { id: 22, name: 'Programmes' },
      ]);
    });
  });

  describe('slipcase', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.slipcase)).toHaveLength(2);
      expect(config.slipcase).toHaveProperty('apiKey');
      expect(config.slipcase).toHaveProperty('mappings');
    });
  });

  describe('openingMemo', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.openingMemo)).toHaveLength(1);
      expect(config.openingMemo).toHaveProperty('originalBrokerage');
    });
  });

  describe('processingInstructions', () => {
    it('should have the expected properties', () => {
      expect(Object.keys(config.processingInstructions)).toHaveLength(1);
      expect(config.processingInstructions).toHaveProperty('originalBrokerage');
    });
  });
});
