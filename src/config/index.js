import defaults from '../theme/theme-defaults';
import * as constants from 'consts';
import selectOptions from './selectOptions';
export { selectOptions };
const config = {
  locale: 'en',
  localeCountry: 'en-GB',
  currency: constants.CURRENCY_USD,
  assets: 'https://edgeassets.blob.core.windows.net',
  routes: {
    admin: {
      currentAdmin: '/admin',
      edgeAdmin: '/edge-admin',
    },
    authentication: {
      root: '/authentication',
    },
    checklist: {
      root: '/checklist',
    },
    claimsFNOL: {
      root: '/claims-fnol',
      item: '/claim-fnol',
      processing: '/claims-fnol/processing',
      newLoss: '/claims-fnol/register-new-loss',
      complexityRules: '/claims-fnol/complexity-rules-management',
      loss: '/claims-fnol/loss',
      claim: '/claims-fnol/claim',
      task: '/claims-fnol/task',
      taskTab:'/claims-fnol/tab/tasks',
      rfi: '/claims-fnol/rfi',
    },
    claimsProcessing: {
      root: '/claims-processing',
      claim: '/claims-processing/claim',
      task: '/claims-processing/task',
      rfi: '/claims-processing/rfi',
    },
    client: {
      root: '/clients',
      item: '/client',
    },
    department: {
      root: '/department',
    },
    home: {
      root: '/',
    },
    icons: {
      root: '/icons',
    },
    industryNews: {
      root: '/industry-news',
    },
    login: {
      root: '/login',
    },
    logout: {
      root: '/logout',
    },
    market: {
      root: '/markets',
      item: '/market',
    },
    modelling: {
      root: '/modelling',
    },
    opportunity: {
      root: '/opportunity',
    },
    placement: {
      root: '/placement',
      bound: '/placement/bound',
      documents: '/placement/documents',
      firmOrder: '/placement/firm-order',
      marketing: {
        markets: '/placement/marketing/markets',
        structuring: '/placement/marketing/structuring',
        mudmap: '/placement/marketing/mudmap',
      },
      marketSheet: '/placement/market-sheet',
      modelling: '/placement/modelling',
      checklist: '/placement/checklist',
      overview: '/placement/overview',
    },
    policy: {
      root: '/policy',
    },
    premiumProcessing: {
      root: '/premium-processing',
      old: '/premium-processing-old', // Added new route for backup, Once QA signoff's for new PP willbe deleting this Old PP pages
      case: '/premium-processing/case',
    },
    processingInstructions: {
      root: '/processing-instructions',
      steps: '/processing-instruction',
    },
    quoteBind: {
      root: '/quote-bind',
      admin: '/quote-bind/admin',
      riskDetails: '/quote-bind/risk',
      aggregate: '/quote-bind/aggregates',
    },
    reporting: {
      root: '/reporting',
    },
    reportingExtended: {
      root: '/reporting-extended',
    },
    trip: {
      root: '/trips',
    },
  },
  ui: {
    brand: {
      priceforbes: {
        logo: 'https://edgeassets.blob.core.windows.net/logo/edge-pf-horizontal.png',
        primaryColor: defaults.palette.primary.main,
        secondaryColor: defaults.palette.secondary.main,
      },
      bishopsgate: {
        logo: 'https://edgeassets.blob.core.windows.net/logo/edge-bishopsgate-horizontal.png',
        primaryColor: defaults.palette.primary.main,
        secondaryColor: defaults.palette.secondary.main,
      },
    },
    pagination: {
      default: 10,
      defaultMobile: 5,
      options: [5, 10, 25, 100],
    },
    sort: {
      direction: {
        default: 'asc',
      },
    },
    notification: {
      delay: {
        info: 4000,
        success: 4000,
        warning: 6000,
        error: null,
      },
    },
    autocomplete: {
      delay: 350,
    },
    format: {
      currency: {
        integer: 14,
        decimal: 2,
      },
      date: {
        iso: 'YYYY-MM-DDTHH:mm:ssZ',
        numeric: 'DD-MM-YYYY',
        slashNumeric: 'DD/MM/YYYY',
        slashNumericDateAndTime: 'DD/MM/YYYY hh:mm a',
        text: 'll',
        dateTime: 'lll',
        textTime: 'lll',
        midTimeFormat: 'h:mm:ss',
      },
      number: {
        integer: 14,
        decimal: 2,
      },
      percent: {
        integer: 12,
        decimal: 4,
      },
    },
    chart: {
      colours: {
        default: ['#8ddbf1', '#75e0ed', '#0063ff', '#3600e1', '#650066'],
        extended: ['#794373', '#b77ca9', '#00765a', '#00768e', '#1c6089'],
      },
      bar: {
        responsive: true,
        maintainAspectRatio: true,
        legend: {
          display: false,
          position: 'bottom',
          labels: {
            boxWidth: 20,
            fontSize: 11,
            padding: 6,
          },
        },
        title: {
          display: false,
        },
        tooltips: {
          backgroundColor: defaults.palette.tooltip.bg,
          mode: 'index',
          intersect: false,
          displayColors: false,
          bodyFontSize: 11,
          footerFontSize: 9,
          footerFontStyle: 'normal',
        },
        hover: {
          animationDuration: 150,
        },
        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
                drawTicks: false,
                tickMarkLength: 2,
              },
              ticks: {
                fontSize: 10,
                lineHeight: 1,
                padding: 6,
              },
              scaleLabel: {
                fontSize: 10,
                fontStyle: 'bold',
                display: true,
              },
              maxBarThickness: 100,
            },
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
                drawTicks: false,
                tickMarkLength: 5,
              },
              ticks: {
                fontSize: 10,
                padding: 10,
              },
              scaleLabel: {
                fontSize: 10,
                fontStyle: 'bold',
                display: true,
              },
            },
          ],
        },
        animation: {
          duration: 800,
          easing: 'easeInOutCubic',
          animateScale: true,
          animateRotate: true,
        },
      },
      doughnut: {
        responsive: true,
        aspectRatio: 1,
        legend: { display: false },
        title: { display: false },
        tooltips: { enabled: false },
        hover: { mode: null },
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic',
          animateScale: true,
          animateRotate: true,
        },
      },
      pie: {
        responsive: true,
        aspectRatio: 1,
        legend: { display: false },
        title: { display: false },
        tooltips: { enabled: false },
        hover: { mode: null },
        animation: {
          duration: 1500,
          easing: 'easeInOutCubic',
          animateScale: true,
          animateRotate: true,
        },
      },
    },
  },
  colorPicker: {
    colors: [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#795548',
      '#9e9e9e',
      '#607d8b',
    ],
  },
  mapbox: {
    height: 320,
    pitch: 30,
    zoom: 3.5,
    minZoom: 0,
    maxZoom: 20,
    marker: {
      maxZoom: 10,
      color: {
        default: '#135dfc',
        active: '#9d0aff',
      },
    },
    levels: [
      ['<=', 3, 'country'],
      ['===', 4, 'state'],
      ['===', 5, 'state'],
      ['===', 6, 'state'],
      ['===', 7, 'state'],
      ['===', 8, 'county'],
      ['===', 9, 'county'],
      ['===', 10, 'county'],
      ['===', 11, 'zip'],
      ['===', 12, 'zip'],
      ['>=', 13, 'address'],
    ],
    doughnutSizes: {
      country: 60,
      state: 40,
      county: 40,
      zip: 40,
    },
    fitBoundsOptions: {
      padding: 80,
      maxZoom: 12,
    },
    location: {
      country: {
        center: {
          CA: [-97, 53],
          GB: [-2, 54],
          US: [-97, 35],
        },
        boundingBox: {
          CA: [
            [-141.149597, 42.855833],
            [-51.676941, 70.661788],
          ],
          GB: [
            [-7.57216793459, 49.959999905],
            [1.68153079591, 58.6350001085],
          ],
          US: [
            [-124.797993, 25.01204],
            [-66.960468, 48.957341],
          ],
        },
      },
    },
    markerType: {
      default: 'default',
      doughnut: 'doughnut',
    },
    token: 'pk.eyJ1IjoiYWxleGRhYmVsbCIsImEiOiJjanN4MGdqZWEwbGFkNDlvMGgxMGh0dzE4In0.3qeF3ZawfjZXeZWRguYFcA',
    styles: {
      street: 'mapbox://styles/mapbox/streets-v11',
      satellite: 'mapbox://styles/mapbox/satellite-v9',
    },
    sources: {
      streets: {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-streets-v7',
      },
      terrain: {
        type: 'vector',
        url: 'mapbox://mapbox.mapbox-terrain-v2',
      },
    },
  },
  auth: {
    domain: 'auth.edge.ardonaghspecialty.com',
    clientID: '8sFdWx7J1PuGXhBcbO3a1Xhdk31AokoW',
    bishopsgate: { clientID: 'huZeQS9g5K0pwFILSp8IenyNHHFvub56' },
    redirectAuthentication: window.location.protocol + '//' + window.location.host + '/authentication',
    redirectLogout: window.location.protocol + '//' + window.location.host + '/login',
    responseType: 'token id_token',
    scope: 'read:messages openid profile email',
    leeway: 60,
  },
  departments: {
    physicalLoss: [
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
    ],
  },
  openingMemo: {
    originalBrokerage: {
      2022: [
        {
          currency: 'EUR',
          rate: 1.2,
        },
        {
          currency: 'GBP',
          rate: 1.0,
        },
        {
          currency: 'USD',
          rate: 1.52,
        },
        {
          currency: 'AED',
          rate: 4.7,
        },
        {
          currency: 'AUD',
          rate: 1.7,
        },
        {
          currency: 'CAD',
          rate: 1.75,
        },
        {
          currency: 'CHF',
          rate: 1.3,
        },
        {
          currency: 'CNY',
          rate: 8.92412,
        },
        {
          currency: 'DKK',
          rate: 9.0,
        },
        {
          currency: 'FJD',
          rate: 2.7,
        },
        {
          currency: 'HKD',
          rate: 10.5,
        },
        {
          currency: 'INR',
          rate: 99.7753,
        },
        {
          currency: 'JPY',
          rate: 140.0,
        },
        {
          currency: 'KWD',
          rate: 0.41564,
        },
        {
          currency: 'NOK',
          rate: 11.0,
        },
        {
          currency: 'NZD',
          rate: 1.9,
        },
        {
          currency: 'QAR',
          rate: 4.97579,
        },
        {
          currency: 'RUB',
          rate: 102.141,
        },
        {
          currency: 'SAR',
          rate: 5.0,
        },
        {
          currency: 'SEK',
          rate: 11.5,
        },
        {
          currency: 'SGD',
          rate: 1.8,
        },
        {
          currency: 'THB',
          rate: 47.0,
        },
        {
          currency: 'TND',
          rate: 3.66834,
        },
        {
          currency: 'ZAR',
          rate: 17.0,
        },
      ],
      2021: [
        {
          currency: 'EUR',
          rate: 1.2,
        },
        {
          currency: 'GBP',
          rate: 1.0,
        },
        {
          currency: 'USD',
          rate: 1.52,
        },
        {
          currency: 'AED',
          rate: 4.7,
        },
        {
          currency: 'AUD',
          rate: 1.7,
        },
        {
          currency: 'CAD',
          rate: 1.75,
        },
        {
          currency: 'CHF',
          rate: 1.3,
        },
        {
          currency: 'CNY',
          rate: 8.92412,
        },
        {
          currency: 'DKK',
          rate: 9.0,
        },
        {
          currency: 'FJD',
          rate: 2.7,
        },
        {
          currency: 'HKD',
          rate: 10.5,
        },
        {
          currency: 'INR',
          rate: 99.7753,
        },
        {
          currency: 'JPY',
          rate: 140.0,
        },
        {
          currency: 'KWD',
          rate: 0.41564,
        },
        {
          currency: 'NOK',
          rate: 11.0,
        },
        {
          currency: 'NZD',
          rate: 1.9,
        },
        {
          currency: 'QAR',
          rate: 4.97579,
        },
        {
          currency: 'RUB',
          rate: 102.141,
        },
        {
          currency: 'SAR',
          rate: 5.0,
        },
        {
          currency: 'SEK',
          rate: 11.5,
        },
        {
          currency: 'SGD',
          rate: 1.8,
        },
        {
          currency: 'THB',
          rate: 47.0,
        },
        {
          currency: 'TND',
          rate: 3.66834,
        },
        {
          currency: 'ZAR',
          rate: 17.0,
        },
      ],
      2020: [
        {
          currency: 'EUR',
          rate: 1.2,
        },
        {
          currency: 'GBP',
          rate: 1.0,
        },
        {
          currency: 'USD',
          rate: 1.52,
        },
        {
          currency: 'AED',
          rate: 5.0,
        },
        {
          currency: 'AUD',
          rate: 1.8,
        },
        {
          currency: 'CAD',
          rate: 1.75,
        },
        {
          currency: 'CHF',
          rate: 1.3,
        },
        {
          currency: 'DKK',
          rate: 9.0,
        },
        {
          currency: 'FJD',
          rate: 2.7,
        },
        {
          currency: 'HKD',
          rate: 10.5,
        },
        {
          currency: 'JPY',
          rate: 140.0,
        },
        {
          currency: 'NOK',
          rate: 11.0,
        },
        {
          currency: 'NZD',
          rate: 1.9,
        },
        {
          currency: 'SAR',
          rate: 5.0,
        },
        {
          currency: 'SEK',
          rate: 11.5,
        },
        {
          currency: 'SGD',
          rate: 1.8,
        },
        {
          currency: 'THB',
          rate: 47.0,
        },
        {
          currency: 'ZAR',
          rate: 19.5,
        },
      ],
    },
  },
  processingInstructions: {
    // Remove above openingMemo once PI goes live
    originalBrokerage: {
      2022: [
        {
          currency: 'EUR',
          rate: 1.2,
        },
        {
          currency: 'GBP',
          rate: 1.0,
        },
        {
          currency: 'USD',
          rate: 1.52,
        },
        {
          currency: 'AED',
          rate: 5.0,
        },
        {
          currency: 'AUD',
          rate: 1.8,
        },
        {
          currency: 'CAD',
          rate: 1.75,
        },
        {
          currency: 'CHF',
          rate: 1.3,
        },
        {
          currency: 'CNY',
          rate: 8.92412,
        },
        {
          currency: 'DKK',
          rate: 9.0,
        },
        {
          currency: 'FJD',
          rate: 2.7,
        },
        {
          currency: 'HKD',
          rate: 10.5,
        },
        {
          currency: 'INR',
          rate: 99.7753,
        },
        {
          currency: 'JPY',
          rate: 140.0,
        },
        {
          currency: 'KWD',
          rate: 0.41564,
        },
        {
          currency: 'NOK',
          rate: 11.0,
        },
        {
          currency: 'NZD',
          rate: 1.9,
        },
        {
          currency: 'QAR',
          rate: 4.97579,
        },
        {
          currency: 'RUB',
          rate: 102.141,
        },
        {
          currency: 'SAR',
          rate: 5.0,
        },
        {
          currency: 'SEK',
          rate: 11.5,
        },
        {
          currency: 'SGD',
          rate: 1.8,
        },
        {
          currency: 'THB',
          rate: 47.0,
        },
        {
          currency: 'TND',
          rate: 3.66834,
        },
        {
          currency: 'ZAR',
          rate: 19.5,
        },
      ],
      2021: [
        {
          currency: 'EUR',
          rate: 1.2,
        },
        {
          currency: 'GBP',
          rate: 1.0,
        },
        {
          currency: 'USD',
          rate: 1.52,
        },
        {
          currency: 'AED',
          rate: 5.0,
        },
        {
          currency: 'AUD',
          rate: 1.8,
        },
        {
          currency: 'CAD',
          rate: 1.75,
        },
        {
          currency: 'CHF',
          rate: 1.3,
        },
        {
          currency: 'CNY',
          rate: 8.92412,
        },
        {
          currency: 'DKK',
          rate: 9.0,
        },
        {
          currency: 'FJD',
          rate: 2.7,
        },
        {
          currency: 'HKD',
          rate: 10.5,
        },
        {
          currency: 'INR',
          rate: 99.7753,
        },
        {
          currency: 'JPY',
          rate: 140.0,
        },
        {
          currency: 'KWD',
          rate: 0.41564,
        },
        {
          currency: 'NOK',
          rate: 11.0,
        },
        {
          currency: 'NZD',
          rate: 1.9,
        },
        {
          currency: 'QAR',
          rate: 4.97579,
        },
        {
          currency: 'RUB',
          rate: 102.141,
        },
        {
          currency: 'SAR',
          rate: 5.0,
        },
        {
          currency: 'SEK',
          rate: 11.5,
        },
        {
          currency: 'SGD',
          rate: 1.8,
        },
        {
          currency: 'THB',
          rate: 47.0,
        },
        {
          currency: 'TND',
          rate: 3.66834,
        },
        {
          currency: 'ZAR',
          rate: 19.5,
        },
      ],
      2020: [
        {
          currency: 'EUR',
          rate: 1.2,
        },
        {
          currency: 'GBP',
          rate: 1.0,
        },
        {
          currency: 'USD',
          rate: 1.52,
        },
        {
          currency: 'AED',
          rate: 5.0,
        },
        {
          currency: 'AUD',
          rate: 1.8,
        },
        {
          currency: 'CAD',
          rate: 1.75,
        },
        {
          currency: 'CHF',
          rate: 1.3,
        },
        {
          currency: 'DKK',
          rate: 9.0,
        },
        {
          currency: 'FJD',
          rate: 2.7,
        },
        {
          currency: 'HKD',
          rate: 10.5,
        },
        {
          currency: 'JPY',
          rate: 140.0,
        },
        {
          currency: 'NOK',
          rate: 11.0,
        },
        {
          currency: 'NZD',
          rate: 1.9,
        },
        {
          currency: 'SAR',
          rate: 5.0,
        },
        {
          currency: 'SEK',
          rate: 11.5,
        },
        {
          currency: 'SGD',
          rate: 1.8,
        },
        {
          currency: 'THB',
          rate: 47.0,
        },
        {
          currency: 'ZAR',
          rate: 19.5,
        },
      ],
    },
  },
  slipcase: {
    apiKey: '5c0192578add277855ed33deb28d2c27b8e074b5',
    /* mappings: [Edge department id]: [Slipcase id(s)] */
    mappings: {
      1: [12],
      2: [30, 31],
      3: [14],
      4: [26],
      5: [37],
      7: [30, 31],
      8: [11, 24, 6],
      9: [11, 24, 6],
      12: [5],
      13: [9],
      18: [11],
      21: [21, 29, 39],
    },
  },
};
export default config;
