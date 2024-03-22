const schemasOpeningMemo = {
  tabNames: ['prePlacing', 'mrc', 'other', 'instructions'],
  defaultTab: 'prePlacing',
  columnHeaders: [
    { id: 'detail', align: 'center' },
    { id: 'accountHandler', align: 'center' },
    { id: 'isAuthorised', align: 'center' },
  ],
  i18nPath: 'placement.openingMemo',
  content: {
    prePlacing: [
      {
        rowKey: 'quotesPutUp',
        cells: [
          { label: true, name: 'itemDate', component: { type: 'datepicker', outputFormat: 'iso' } },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'dutyOfDisclosure',
        cells: [
          { label: true, name: 'itemDate', component: { type: 'datepicker', outputFormat: 'iso' } },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'demandsNeeds',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'slipsSigned',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'evidence',
        cells: [
          { label: true, name: 'itemDate', component: { type: 'datepicker', outputFormat: 'iso' } },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'atlas',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'bars',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
    ],
    mrc: [
      {
        rowKey: 'allWrittenLines',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'allUnderwriter',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'informationClearlyStated',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'allMarketsApproved',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'paymentTerms',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'subscriptionAgreement',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'riskCodes',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
    ],
    other: [
      {
        rowKey: 'marketSheet',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'confirmSanctioned',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'thirdParty',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'contractCertainty',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
    ],
    instructions: [
      {
        rowKey: 'premiumTax',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'signedLines',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'grossPremium',
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'currency', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'slipOrder',
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'percent', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'totalBrokerage',
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'currency', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'splitAsFollows',
        cells: [{ label: true, cellProps: { colSpan: 3, bold: true } }],
      },
      {
        rowKey: 'totalClientDiscount',
        rowStyles: { subRow: true },
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'percent', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'totalThirdParty',
        rowStyles: { subRow: true },
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'percent', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'thirdPartyName',
        rowStyles: {
          subRow: true,
          extraLeftPadding: true,
          isHidden: true,
          changeBy: 'lineItems.totalThirdParty.accountHandler',
        },
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'text', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'totalPfInternal',
        rowStyles: { subRow: true },
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'percent', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'pfInternalDepartment',
        rowStyles: {
          subRow: true,
          extraLeftPadding: true,
          isHidden: true,
          changeBy: 'lineItems.totalPfInternal.accountHandler',
        },
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'text', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'totalRetainedBrokerage',
        rowStyles: { subRow: true },
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'text', variant: 'percent', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'retainedBrokerageAmount',
        rowStyles: { subRowHeader: true },
        cells: [
          {
            name: 'premiumCurrency',
            label: true,
            component: { type: 'select', optionsKey: 'premiumCurrency', defaultValue: 'USD' },
          },
          {
            name: 'accountHandler',
            component: {
              type: 'dynamic',
              variant: 'currency',
              defaultValue: 0,
              dynamicValue: {
                variant: 'retainedBrokerageAmount',
                sourceRowIds: [
                  'lineItems.grossPremium.accountHandler',
                  'lineItems.slipOrder.accountHandler',
                  'lineItems.totalRetainedBrokerage.accountHandler',
                  'lineItems.retainedBrokerageAmount.premiumCurrency',
                ],
              },
            },
          },
          {},
        ],
      },
      {
        rowKey: 'total',
        rowStyles: { subRowHeader: true },
        cells: [
          {
            label: true,
            cellProps: { bold: true },
          },
          {
            name: 'accountHandler',
            component: {
              type: 'dynamic',
              variant: 'percent',
              defaultValue: 0,
              dynamicValue: {
                variant: 'sum',
                sourceRowIds: [
                  'lineItems.totalClientDiscount.accountHandler',
                  'lineItems.totalThirdParty.accountHandler',
                  'lineItems.totalPfInternal.accountHandler',
                  'lineItems.totalRetainedBrokerage.accountHandler',
                  'premiumCurrency',
                ],
              },
            },
          },
          {},
        ],
      },
      {
        rowKey: 'fees',
        cells: [
          { label: true, cellProps: { bold: true } },
          { name: 'accountHandler', component: { type: 'text', variant: 'text', defaultValue: '' } },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'otherDeductions',
        cells: [
          { label: true, cellProps: { bold: true } },
          { name: 'accountHandler', component: { type: 'text', variant: 'text', defaultValue: '' } },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'settlementCurrency',
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'select', optionsKey: 'currency', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'paymentBasis',
        cells: [
          { label: true, cellProps: { bold: true } },
          {
            name: 'accountHandler',
            component: { type: 'select', optionsKey: 'paymentBasis', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
      {
        rowKey: 'ppwPPC',
        cells: [
          {
            label: true,
            cellProps: { bold: true },
            name: 'itemDate',
            component: { type: 'datepicker', outputFormat: 'iso' },
          },
          {
            name: 'accountHandler',
            component: { type: 'select', optionsKey: 'ppwPPC', defaultValue: '' },
          },
          { name: 'isAuthorised', cellProps: { center: true }, component: { type: 'checkbox', defaultValue: false } },
        ],
      },
    ],
  },
};

export default schemasOpeningMemo;
