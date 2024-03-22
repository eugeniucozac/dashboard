import flatten from 'lodash/flatten';
import get from 'lodash/get';

// app
import * as utils from 'utils';
import config from 'config';
import { PLACEMENT_DECLARATION } from 'consts';
import { openingMemoSchema } from 'schemas';
import { transformOpeningMemoInPUT } from 'stores';

export const getData = ({ openingMemo = {}, departmentName, referenceData = {} }) => {
  const transformedOpeningMemo = transformOpeningMemoInPUT(openingMemo);
  const labels = helpers.getLabels();

  if (!transformedOpeningMemo) return;

  return {
    labels,
    tableHeader: helpers.createHeader(),
    summaryBody: helpers.createSummaryBody(transformedOpeningMemo, departmentName, referenceData.newRenewalBusinesses, labels),
    checklistBody: flatten(
      ['prePlacing', 'mrc', 'other'].map((sectionKey) =>
        helpers.createChecklistBody(transformedOpeningMemo, sectionKey, false, referenceData)
      )
    ),
    instructionBody: helpers.createChecklistBody(transformedOpeningMemo, 'instructions', true, referenceData),
    specialBody: helpers.createSpecialBody(transformedOpeningMemo),
    approvalBody: helpers.createApprovalBody(transformedOpeningMemo, labels.approved),
  };
};

const helpers = {
  createHeader: () => {
    return [['detail', 'accountHandler', 'isAuthorised'].map((headerKey) => helpers.getHeaderLabel(headerKey))];
  },
  createChecklistBody: (openingMemo, sectionKey, subHeader, referenceData) => {
    if (!openingMemo) return [];
    const rows = get(openingMemoSchema, `content.${sectionKey}`);
    if (!rows || !Array.isArray(rows)) return [];
    const data = rows.map((row) => {
      const item = openingMemo.lineItems.find((item) => item.itemKey === row.rowKey) || {};
      const labelColumn = `${helpers.getRowLabel(sectionKey, row.rowKey)}`;
      return [
        item.itemDate
          ? `${labelColumn} (${utils.string.t('format.date', { value: { date: item.itemDate, format: config.ui.format.date.text } })})`
          : labelColumn,
        helpers.renderAccountHandler(item.accountHandler, row, referenceData, openingMemo.lineItems),
        item.isAuthorised ? utils.string.t('app.authorised') : '-',
      ];
    });
    return [[{ colSpan: 3, content: subHeader ? helpers.getSectionSubHeader(sectionKey) : helpers.getSectionLabel(sectionKey) }], ...data];
  },
  calculateTotal: (lineItems) => {
    const sourceRowIds = ['totalClientDiscount', 'totalThirdParty', 'totalPfInternal', 'totalRetainedBrokerage'];
    const values = lineItems.filter((item) => sourceRowIds.includes(item.itemKey)).map((item) => item.accountHandler);
    return utils.generic.getSumOfArray(values, config.ui.format.percent.decimal);
  },
  calculateRetainedBrokerageAmount: (lineItems) => {
    const premiumCurrency = (lineItems.find((item) => item.itemKey === 'retainedBrokerageAmount') || {}).premiumCurrency || '';
    const grossPremium = lineItems.find((item) => item.itemKey === 'grossPremium');
    const slipOrder = lineItems.find((item) => item.itemKey === 'slipOrder');
    const totalRetainedBrokerage = lineItems.find((item) => item.itemKey === 'totalRetainedBrokerage');

    if (
      !utils.generic.isValidObject(grossPremium) ||
      !utils.generic.isValidObject(slipOrder) ||
      !utils.generic.isValidObject(totalRetainedBrokerage)
    )
      return;

    const brokerageAmount = utils.openingMemo.getRetainedBrokerageValue(
      grossPremium.accountHandler,
      slipOrder.accountHandler,
      totalRetainedBrokerage.accountHandler
    );
    const convertedBrokerage = utils.openingMemo.getRetainedBrokerageConvertedValue(premiumCurrency, brokerageAmount);
    const convertedBrokerageString = convertedBrokerage
      ? ` / GBP ${convertedBrokerage.value} @ ${utils.string.t('format.number', {
          value: { number: convertedBrokerage.rate, format: { trimMantissa: false } },
        })}`
      : '';

    return `${premiumCurrency} ${brokerageAmount}${convertedBrokerageString}`;
  },
  renderAccountHandler: (accountHandler, row, referenceData, lineItems) => {
    const cell = row.cells.find((cell) => cell.name === 'accountHandler');
    if (!cell) return;
    if (row.rowKey === 'total') return helpers.calculateTotal(lineItems);
    if (row.rowKey === 'retainedBrokerageAmount') return helpers.calculateRetainedBrokerageAmount(lineItems);
    if (!cell.component || !cell.component.optionsKey) return accountHandler;
    return utils.form.getSelectOption(cell.component.optionsKey, referenceData, accountHandler);
  },
  createSummaryBody: (openingMemo, departmentName, newRenewalBusinesses, labels) => {
    const originator = get(openingMemo, 'originator.fullName');
    const placingBroker = get(openingMemo, 'placingBroker.fullName');

    return [
      [utils.string.t('placement.openingMemo.riskReference'), openingMemo.uniqueMarketReference || '-'],
      [
        helpers.getRowLabel('summary', 'placementType'),
        helpers.getOptionLabel('placementType', openingMemo.placementType?.toLowerCase() || '-'),
      ],
      ...(openingMemo.placementType === PLACEMENT_DECLARATION
        ? [[helpers.getRowLabel('summary', 'attachedTo'), openingMemo.attachedTo || '-']]
        : []),
      ['', ''],
      [
        helpers.getRowLabel('summary', 'newRenewalBusinessId'),
        openingMemo.newRenewalBusinessId
          ? utils.referenceData.newRenewalBusinesses.getLabelById(newRenewalBusinesses, openingMemo.newRenewalBusinessId)
          : '-',
      ],
      [helpers.getRowLabel('summary', 'department'), departmentName || '-'],
      [helpers.getRowLabel('summary', 'reInsured'), openingMemo.reInsured || '-'],
      [
        helpers.getRowLabel('summary', 'period'),
        `${helpers.formatDate(openingMemo.inceptionDate)} - ${helpers.formatDate(openingMemo.expiryDate)}`.trim() || '-',
      ],
      ['', ''],
      [helpers.getRowLabel('summary', 'invoicingClient'), openingMemo.invoicingClient || '-'],
      [helpers.getRowLabel('summary', 'clientContactName'), openingMemo.clientContactName || '-'],
      [helpers.getRowLabel('summary', 'clientEmail'), openingMemo.clientEmail || '-'],
      [helpers.getRowLabel('summary', 'eocInvoiceContactName'), openingMemo.eocInvoiceContactName || '-'],
      [helpers.getRowLabel('summary', 'eocInvoiceEmail'), openingMemo.eocInvoiceEmail || '-'],
      ['', ''],
      [labels.producingBrokerLabel, get(openingMemo, 'producingBroker.fullName') || '-'],
      [labels.accountExecutiveLabel, get(openingMemo, 'accountExecutive.fullName') || '-'],
      ...(placingBroker ? [[labels.placingBrokerLabel, placingBroker]] : []),
      ...(originator ? [[labels.originatorLabel, originator]] : []),
    ];
  },
  createApprovalBody: (openingMemo, approvedLabel) => {
    return [
      [get(openingMemo, 'accountHandler.fullName'), get(openingMemo, 'authorisedSignatory.fullName')],
      [
        openingMemo.isAccountHandlerApproved ? `${approvedLabel}: ${helpers.formatDate(openingMemo.accountHandlerApprovalDate)}` : '-',
        openingMemo.isAuthorisedSignatoryApproved
          ? `${approvedLabel}: ${helpers.formatDate(openingMemo.authorisedSignatoryApprovalDate)}`
          : '-',
      ],
    ];
  },
  createSpecialBody: (openingMemo) => {
    return [[{ colSpan: 2, content: openingMemo.notes || '-' }], [{ colSpan: 2, content: openingMemo.listOfRisks || '-' }]];
  },
  formatDate: (date) => {
    return utils.string.t('format.date', { value: { date, format: config.ui.format.date.text } });
  },
  getLabels: () => ({
    na: utils.string.t('form.options.yesNoNa.na'),
    approved: utils.string.t('app.approved'),
    pdfHeader: utils.string.t('placement.openingMemo.pdf.header'),
    instructionToProcessing: utils.string.t('placement.openingMemo.instructionToProcessing'),
    specialInstructionsHeader: utils.string.t('placement.openingMemo.specialInstructions.header'),
    accountHandler: utils.string.t('placement.openingMemo.approvers.accountHandler'),
    authorisedSignatory: utils.string.t('placement.openingMemo.approvers.authorisedSignatory'),
    placingBrokerLabel: utils.string.t('placement.openingMemo.specialInstructions.placingBroker.label'),
    originatorLabel: utils.string.t('placement.openingMemo.specialInstructions.originator.label'),
    accountExecutiveLabel: utils.string.t('placement.openingMemo.specialInstructions.accountExecutive.label'),
    producingBrokerLabel: utils.string.t('placement.openingMemo.specialInstructions.producingBroker.label'),
  }),
  getRowLabel: (sectionKey, rowKey) => utils.string.t(`placement.openingMemo.${sectionKey}.rows.${rowKey}.label`),
  getYesNoNaLabel: (accountHandler) => utils.string.t(`form.options.yesNoNa.${utils.string.replaceLowerCase(accountHandler)}`),
  getSectionLabel: (sectionKey) => utils.string.t(`placement.openingMemo.${sectionKey}.label`),
  getSectionSubHeader: (sectionKey) => utils.string.t(`placement.openingMemo.${sectionKey}.subHeader`),
  getHeaderLabel: (headerKey) => utils.string.t(`placement.openingMemo.columnNames.${headerKey}`),
  getOptionLabel: (rowKey, value) => utils.string.t(`form.options.${rowKey}.${value}`),
};
