const selectOptions = {
  options: {
    products: {
      dynamic: {
        source: 'products',
        value: 'value',
        label: 'label',
        transform: (item) => {
          return {
            id: item.value,
            value: item.value,
            label: item.label,
          };
        },
      },
    },
    templates: {
      dynamic: {
        source: 'templates',
        transform: (item) => {
          return {
            id: item,
            value: item,
            label: item,
          };
        },
      },
    },
    countries: {
      dynamic: {
        source: 'countries',
        value: 'value',
        label: 'label',
        transform: (item) => {
          return {
            value: item.value,
            label: item.label,
          };
        },
      },
    },
    countryOfOrigin: {
      dynamic: {
        source: 'countryOfOrigin',
        value: 'value',
        label: 'label',
        transform: (item) => {
          return {
            value: item.value,
            label: item.label,
          };
        },
      },
    },
    carriers: {
      dynamic: {
        source: 'carriers',
        value: 'id',
        label: 'name',
      },
    },
    pricerModule: {
      dynamic: {
        source: 'pricerModule',
        value: 'value',
        label: 'label',
        transform: (item) => {
          return {
            value: item.value,
            label: item.label,
          };
        },
      },
    },
    notifiedUsers: {
      dynamic: {
        source: 'notifiedUsers',
        transform: (item) => {
          return {
            name: item.name,
            email: item.email,
          };
        },
      },
    },
    clients: {
      dynamic: {
        source: 'clients',
        value: 'id',
        label: 'name',
      },
    },
    insureds: {
      dynamic: {
        source: 'insureds',
        value: 'id',
        label: 'name',
      },
    },
    reinsureds: {
      dynamic: {
        source: 'reinsureds',
        value: 'id',
        label: 'name',
      },
    },
    currency: {
      dynamic: {
        source: 'currencies',
        value: 'id',
        label: 'code',
      },
    },
    paymentBasis: {
      fixed: {
        labelPath: 'form.options.paymentBasis',
        options: ['CASH', 'QUARTERLY', 'OTHER_DEFERRED'],
      },
    },
    premiumCurrency: {
      dynamic: {
        source: 'premiumCurrency',
        value: 'currency',
        label: 'currency',
      },
    },
    ppwPPC: {
      fixed: {
        labelPath: 'form.options.ppwPPC',
        options: ['PPW', 'PPC', 'NA'],
      },
    },
    yesNoNa: {
      fixed: {
        labelPath: 'form.options.yesNoNa',
        options: ['YES', 'NO', 'NA'],
      },
    },
    placementType: {
      fixed: {
        labelPath: 'form.options.placementType',
        options: ['DECLARATION', 'OPEN_MARKET', 'LINESLIP', 'BINDER'],
      },
    },
  },
};

export default selectOptions;
