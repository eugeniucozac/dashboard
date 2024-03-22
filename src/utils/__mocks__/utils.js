const mock = {
  api: jest.requireActual('utils/api/api.js').default,
  app: jest.requireActual('utils/app/app.js').default,
  client: jest.requireActual('utils/client/client.js').default,
  color: jest.requireActual('utils/color/color.js').default,
  currency: jest.requireActual('utils/currency/currency.js').default,
  date: jest.requireActual('utils/date/date.js').default,
  departments: jest.requireActual('utils/departments/departments.js').default,
  dms: jest.requireActual('utils/dms/dms.js').default,
  dmsFormatter: jest.requireActual('utils/dms/dmsFormatter.js').default,
  dmsSearch: jest.requireActual('utils/dms/dmsSearch.js').default,
  excel: jest.requireActual('utils/excel/excel.js').default,
  file: jest.requireActual('utils/file/file.js').default,
  filters: jest.requireActual('utils/filters/filters.js').default,
  form: jest.requireActual('utils/form/form.js').default,
  generic: jest.requireActual('utils/generic/generic.js').default,
  location: jest.requireActual('utils/location/location.js').default,
  number: jest.requireActual('utils/number/number.js').default,
  layer: jest.requireActual('utils/layer/layer.js').default,
  layers: jest.requireActual('utils/layers/layers.js').default,
  map: jest.requireActual('utils/map/map.js').default,
  market: jest.requireActual('utils/market/market.js').default,
  markets: jest.requireActual('utils/markets/markets.js').default,
  media: jest.requireActual('utils/media/media.js').default,
  office: jest.requireActual('utils/office/office.js').default,
  openingMemo: jest.requireActual('utils/openingMemo/openingMemo.js').default,
  placement: jest.requireActual('utils/placement/placement.js').default,
  placementPDF: jest.requireActual('utils/placementPDF/placementPDF.js').default,
  policies: jest.requireActual('utils/policies/policies.js').default,
  policy: jest.requireActual('utils/policy/policy.js').default,
  processingInstructions: jest.requireActual('utils/processingInstructions/processingInstructions.js').default,
  referenceData: jest.requireActual('utils/referenceData/referenceData.js').default,
  risk: jest.requireActual('utils/risk/risk.js').default,
  schemas: jest.requireActual('utils/schemas/schemas.js').default,
  sort: jest.requireActual('utils/sort/sort.js').default,
  string: jest.requireActual('utils/string/string.js').default,
  trip: jest.requireActual('utils/trip/trip.js').default,
  user: jest.requireActual('utils/user/user.js').default,
  users: jest.requireActual('utils/users/users.js').default,
};

// mock utils method here:
mock.string.t = (key, options) => {
  let formattingDetails = '';
  const value = (options && options.value) || {};

  // make a call to i18n t() anyway so that mock calls can be tracked
  mock.i18n.t(key, options);

  switch (key) {
    case 'format.lowercase':
      formattingDetails = `(${value.label || ''})`;
      break;
    case 'format.uppercase':
      formattingDetails = `(${value.label || ''})`;
      break;
    case 'format.date':
      formattingDetails = `(${value.date || ''})`;
      break;
    case 'format.dateFromNow':
      formattingDetails = `(${value.date || ''})`;
      break;
    case 'format.number':
      formattingDetails = `(${value.number || ''})`;
      break;
    case 'format.currency':
      formattingDetails = `(${value.number || ''})`;
      break;
    case 'format.percent':
      formattingDetails = `(${value.number || ''})`;
      break;
    default:
      formattingDetails = '';
  }

  return `${key}${formattingDetails}`;
};

mock.string.html = (key, options) => {
  // make a call to i18n t() anyway so that mock calls can be tracked
  mock.i18n.t(key, options);

  return `${key}`;
};

mock.i18n = {};
mock.i18n.changeLanguage = jest.fn();
mock.i18n.t = jest.fn((key, options) => key);

export const api = mock.api;
export const app = mock.app;
export const client = mock.client;
export const color = mock.color;
export const currency = mock.currency;
export const date = mock.date;
export const departments = mock.departments;
export const dms = mock.dms;
export const dmsFormatter = mock.dmsFormatter;
export const dmsSearch = mock.dmsSearch;
export const excel = mock.excel;
export const file = mock.file;
export const filters = mock.filters;
export const form = mock.form;
export const generic = mock.generic;
export const i18n = mock.i18n;
export const location = mock.location;
export const layer = mock.layer;
export const layers = mock.layers;
export const map = mock.map;
export const market = mock.market;
export const markets = mock.markets;
export const media = mock.media;
export const number = mock.number;
export const office = mock.office;
export const openingMemo = mock.openingMemo;
export const placement = mock.placement;
export const placementPDF = mock.placementPDF;
export const policies = mock.policies;
export const policy = mock.policy;
export const processingInstructions = mock.processingInstructions;
export const referenceData = mock.referenceData;
export const risk = mock.risk;
export const sort = mock.sort;
export const schemas = mock.schemas;
export const string = mock.string;
export const trip = mock.trip;
export const user = mock.user;
export const users = mock.users;
