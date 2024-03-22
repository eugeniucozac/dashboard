import * as constants from 'consts';
import * as utils from 'utils';
import * as Yup from 'yup';

const searchField = {
  placeholder: utils.string.t('app.searchForProperty', { property: utils.string.t('app.user') }),
  optionLabel: 'fullName',
  optionKey: 'id',
  muiComponentProps: { 'data-testid': 'fullName-search' },
  innerComponentProps: {
    maxMenuHeight: 120,
    isClearable: false,
    blurInputOnSelect: true,
    noOptionsFoundMessage: utils.string.t('app.propertyNotFound', { property: utils.string.t('app.user') }),
  },
};

export const createFields = (openingMemo, newRenewalRefData, departments) => [
  {
    name: 'notes',
    type: 'textarea',
    label: utils.string.t(`placement.openingMemo.specialInstructions.notes.label`),
    value: openingMemo?.notes || '',
    muiComponentProps: {
      multiline: true,
      minRows: 4,
      maxRows: 8,
    },
  },
  {
    name: 'listOfRisks',
    type: 'textarea',
    label: utils.string.t(`placement.openingMemo.specialInstructions.listOfRisks.label`),
    hint: utils.string.t(`placement.openingMemo.specialInstructions.listOfRisks.hint`),
    value: openingMemo?.listOfRisks || '',
    muiComponentProps: {
      multiline: true,
      minRows: 4,
      maxRows: 8,
    },
  },
  ...['producingBroker', 'accountExecutive', 'originator', 'placingBroker'].map((key) => ({
    ...searchField,
    name: key,
    label: utils.string.t(`placement.openingMemo.specialInstructions.${key}.label`),
    value: openingMemo[key] ? openingMemo[key] : null,
  })),
  {
    name: 'uniqueMarketReference',
    value: openingMemo.uniqueMarketReference,
    label: utils.string.t('placement.openingMemo.riskReference'),
  },
  {
    name: 'clientEmail',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.clientEmail.label'),
    value: openingMemo.clientEmail || '',
    muiComponentProps: { size: 'small' },
  },
  {
    name: 'invoicingClient',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.invoicingClient.label'),
    value: openingMemo.invoicingClient || '',
    muiComponentProps: { size: 'small' },
  },
  {
    name: 'clientContactName',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.clientContactName.label'),
    value: openingMemo.clientContactName || '',
    muiComponentProps: { size: 'small' },
  },
  {
    name: 'eocInvoiceContactName',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.eocInvoiceContactName.label'),
    value: openingMemo.eocInvoiceContactName || '',
    muiComponentProps: { size: 'small' },
  },
  {
    name: 'eocInvoiceEmail',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.eocInvoiceEmail.label'),
    value: openingMemo.eocInvoiceEmail || '',
    muiComponentProps: { size: 'small' },
  },
  {
    type: 'datepicker',
    name: 'expiryDate',
    label: utils.string.t('app.expiryDate'),
    value: openingMemo.expiryDate || null,
    muiComponentProps: {
      fullWidth: true,
    },
    outputFormat: 'iso',
  },
  {
    type: 'datepicker',
    name: 'inceptionDate',
    icon: 'TodayIcon',
    label: utils.string.t('app.inceptionDate'),
    value: openingMemo.inceptionDate || null,
    muiComponentProps: {
      fullWidth: true,
    },
    outputFormat: 'iso',
  },
  {
    name: 'reInsured',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.reInsured.label'),
    value: openingMemo.reInsured || '',
    muiComponentProps: { size: 'small' },
  },
  {
    name: 'newRenewalBusinessId',
    size: 'md',
    options: newRenewalRefData,
    value: openingMemo.newRenewalBusinessId || '',
    muiComponentProps: { fullWidth: true },
    optionKey: 'id',
    optionLabel: 'description',
    label: utils.string.t('placement.openingMemo.summary.rows.newRenewalBusinessId.label'),
  },
  {
    name: 'departmentId',
    size: 'md',
    options: departments,
    value: openingMemo.departmentId || '',
    muiComponentProps: { fullWidth: true },
    optionKey: 'id',
    optionLabel: 'name',
    label: utils.string.t('placement.openingMemo.summary.rows.department.label'),
  },
  {
    name: 'placementType',
    type: 'radio',
    muiComponentProps: { size: 'small' },
    title: utils.string.t('placement.openingMemo.summary.rows.placementType.label'),
    value: openingMemo.placementType,
    validation: Yup.string().nullable().required(utils.string.t('validation.required')),
    options: [
      {
        label: utils.string.t('form.options.placementType.open_market'),
        value: constants.PLACEMENT_OPEN_MARKET,
      },
      {
        label: utils.string.t('form.options.placementType.lineslip'),
        value: constants.PLACEMENT_LINESLIP,
      },
      {
        label: utils.string.t('form.options.placementType.binder'),
        value: constants.PLACEMENT_BINDER,
      },
      {
        label: utils.string.t('form.options.placementType.declaration'),
        value: constants.PLACEMENT_DECLARATION,
      },
    ],
  },
  {
    name: 'attachedTo',
    type: 'text',
    label: utils.string.t('placement.openingMemo.summary.rows.attachedTo.label'),
    value: openingMemo.attachedTo || '',
    muiComponentProps: { size: 'small' },
  },
];
