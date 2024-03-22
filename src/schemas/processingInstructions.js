const schemasProcessingInstructions = {
  tabNames: ['prePlacing', 'mrc', 'otherDetails'],
  defaultTab: 'prePlacing',
  columnHeaders: [
    { id: 'detail', align: 'center' },
    { id: 'accountHandler', align: 'center' },
    { id: 'authorisedSignatory', align: 'center' },
  ],
  i18nPath: 'processingInstructions.checklist.lineItems',
  content: {
    prePlacing: [
      {
        rowKey: 'quotesPutUp',
        cells: [
          {
            label: true,
            name: 'signedDate',
            component: { type: 'datepicker' },
          },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
        ],
      },
      {
        rowKey: 'dutyOfDisclosure',
        cells: [
          { label: true, name: 'signedDate', component: { type: 'datepicker' } },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
        ],
      },
      {
        rowKey: 'dateOfOrder',
        cells: [
          { label: true, name: 'signedDate', component: { type: 'datepicker' } },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
        ],
      },
    ],
    otherDetails: [
      {
        rowKey: 'marketSheet',
        cells: [
          { label: true },
          {
            name: 'accountHandler',
            component: { type: 'toggle', optionsKey: 'yesNoNa', defaultValue: '' },
          },
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
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
          {
            name: 'authorisedSignatory',
            cellProps: { center: true },
            component: { type: 'checkbox', defaultValue: false },
          },
        ],
      },
    ],
  },
};

export default schemasProcessingInstructions;
