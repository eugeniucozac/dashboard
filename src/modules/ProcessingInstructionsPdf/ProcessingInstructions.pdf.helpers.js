import flatten from 'lodash/flatten';
import get from 'lodash/get';
import upperCase from 'lodash/upperCase';

// app
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';
import { processingInstructionsSchema } from 'schemas';

export const getData = ({
  processingInstruction = {},
  departmentName,
  frontEndContactName = '',
  authorizedSignatoryName = '',
  accountExecutiveName = '',
  producingBrokerName = '',
  retainedBrokerageAmountForPdf,
  totalAmountForPdf,
  refDataCurrencies,
}) => {
  const labels = helpers.getLabels();
  if (!processingInstruction) return;
  return {
    labels,
    tableHeader: helpers.createHeader(),
    summaryBody: helpers.createSummaryBody(
      processingInstruction,
      departmentName,
      frontEndContactName,
      accountExecutiveName,
      producingBrokerName
    ),
    checklistBody: flatten(
      ['prePlacing', 'mrc', 'otherDetails'].map((sectionKey) => helpers.createChecklistBody(processingInstruction, sectionKey, false))
    ),
    instructionBody: helpers.createInstructionBody(
      processingInstruction,
      retainedBrokerageAmountForPdf,
      totalAmountForPdf,
      refDataCurrencies
    ),
    specialBody: helpers.createSpecialBody(processingInstruction),
    attachedDocumentBody: helpers.createAttachedDocumemtBody(processingInstruction),
    approvalBody: helpers.createApprovalBody(processingInstruction, frontEndContactName, authorizedSignatoryName),
  };
};

const helpers = {
  getSettlementCurrency: (id, refDataCurrencies) => {
    return refDataCurrencies.find((ref) => ref.currencyCodeID === id)?.currencyCd;
  },
  getPaymentBasis: (id) => {
    const paymentBasisOptions = [
      { id: 1, code: 'cash', name: 'Cash' },
      { id: 2, code: 'quaterly', name: 'Quaterly' },
      { id: 3, code: 'otherDeferred', name: 'Other Deferred' },
    ];
    return paymentBasisOptions.find((p) => p.id === id)?.name;
  },
  getPpwOrPpc: (id) => {
    const ppwOrPpcOptions = [
      { id: 1, code: 'ppw', name: 'PPW', value: 1 },
      { id: 2, code: 'ppc', name: 'PPC', value: 2 },
      { id: 3, code: 'na', name: 'N/A', value: 3 },
    ];
    return ppwOrPpcOptions.find((p) => p.id === id)?.name;
  },
  getMultiToggleLabel: (value) => {
    if (!value) return;
    let newValue = '';

    if (value === constants.PI_TOGGLE_ID_YES) {
      return (newValue = utils.string.t('app.yes'));
    }
    if (value === constants.PI_TOGGLE_ID_NO) {
      return (newValue = utils.string.t('app.no'));
    }
    if (value === constants.PI_TOGGLE_ID_NA) {
      return (newValue = utils.string.t('app.na'));
    }
    return newValue;
  },
  createHeader: () => {
    return [
      ['processingInstructionDetails', 'frontEndContact', 'authorisedSignatory'].map((headerKey) => helpers.getHeaderLabel(headerKey)),
    ];
  },
  createChecklistBody: (processingInstruction, sectionKey, subHeader) => {
    if (!processingInstruction) return [];
    const rows = get(processingInstructionsSchema, `content.${sectionKey}`);
    if (!rows || !Array.isArray(rows)) return [];
    const data = rows.map((row) => {
      const item = processingInstruction.checklist.find((item) => item.checkListDetails === row.rowKey) || {};
      const labelColumn = `${helpers.getRowLabel(sectionKey, row.rowKey)}`;
      return [
        item.signedDate
          ? `${labelColumn} (${utils.string.t('format.date', { value: { date: item.signedDate, format: config.ui.format.date.text } })})`
          : labelColumn,
        upperCase(helpers.renderAccountHandler(item.accountHandler, row, processingInstruction.checklist)).replace(/ /g, '/'),
        item.authorisedSignatory ? utils.string.t('app.authorised') : '-',
      ];
    });
    return [[{ colSpan: 3, content: subHeader ? helpers.getSectionSubHeader(sectionKey) : helpers.getSectionLabel(sectionKey) }], ...data];
  },
  createInstructionBody: (processingInstruction, retainedBrokerageAmountForPdf, totalAmountForPdf, refDataCurrencies) => {
    if (!processingInstruction) return [];

    const premiumTaxCalSheetAttach = helpers.getMultiToggleLabel(
      utils.processingInstructions.getFinancialField(processingInstruction, 'premiumTaxCalculationSheetAttached')?.numberValue
    );

    const signedLinesCalAttach = helpers.getMultiToggleLabel(
      utils.processingInstructions.getFinancialField(processingInstruction, 'signedLinesCalculationSheetAttached')?.numberValue
    );

    return [
      [utils.string.t('processingInstructions.pdf.instructionLabels.piPageSubHeader')],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.premiumAndTaxCalSheetAttach'),
        premiumTaxCalSheetAttach ? premiumTaxCalSheetAttach : utils.string.t('app.no'),
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.PREMIUM_TAX_CALCULATION_SHEET_ATTACHED)
          ?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.signedLinesCalAttach'),
        signedLinesCalAttach ? signedLinesCalAttach : utils.string.t('app.no'),
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.SIGNED_LINES_CALCULATION_SHEET_ATTACHED)
          ?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.grossPremium'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'grossPremiumAmount')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.GROSS_PREMIUM_AMOUNT)
          ?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.slipOrder'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'slipOrder')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.SLIP_ORDER)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.totalBrokerage'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'totalBrokerage')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.TOTAL_BROKERAGE)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [utils.string.t('processingInstructions.pdf.instructionLabels.splitAsFollows'), '', '-'],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.clientDiscount'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'clientDiscount')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.CLIENT_DISCOUNT)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.thirdPartyCommSharing'),
        utils.processingInstructions.getFinancialField(processingInstruction, constants.THIRD_PARTY)?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.THIRD_PARTY)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.thirdPartyName'),
        utils.processingInstructions.getFinancialField(processingInstruction, constants.THIRD_PARTY)?.stringValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.THIRD_PARTY)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.pfInternalCommissionSharing'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'pfinternal')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.PF_INTERNAL)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.pfInternalDeptName'),
        utils.processingInstructions.getFinancialField(processingInstruction, constants.PF_INTERNAL)?.stringValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.PF_INTERNAL)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.retainedBrokerage'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'retainedBrokerage')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.RETAINED_BROKERAGE)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.retainedBrokerageAmount'),
        `${
          processingInstruction?.details?.retainedBrokerageCurrencyCode ? processingInstruction?.details?.retainedBrokerageCurrencyCode : ''
        } ${retainedBrokerageAmountForPdf?.retBrokerageAmt}`,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.RETAINED_BROKERAGE)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.retainedBrokergaeAmountInSelectedCurr'),
        `GBP ${
          retainedBrokerageAmountForPdf?.convertedBrokerageAmt?.value ? retainedBrokerageAmountForPdf?.convertedBrokerageAmt?.value : ''
        } @ ${utils.string.t('format.number', {
          value: { number: retainedBrokerageAmountForPdf?.convertedBrokerageAmt?.rate, format: { trimMantissa: false } },
        })}`,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.RETAINED_BROKERAGE)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.total'),
        totalAmountForPdf,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.TOTAL_BROKERAGE)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.fees'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'fees')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.FEES)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.otherDeductions'),
        utils.processingInstructions.getFinancialField(processingInstruction, 'otherDeductions')?.numberValue,
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.OTHER_DEDUCTIONS)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.settlementCurrency'),
        helpers.getSettlementCurrency(
          utils.processingInstructions.getFinancialField(processingInstruction, constants.SETTLEMENT_CURRENCY_CODE_ID)?.numberValue,
          refDataCurrencies
        ),
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.SETTLEMENT_CURRENCY_CODE_ID)
          ?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.string.t('processingInstructions.pdf.instructionLabels.paymentBasis'),
        helpers.getPaymentBasis(utils.processingInstructions.getFinancialField(processingInstruction, 'paymentBasis')?.numberValue),
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.PAYMENT_BASIS)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
      [
        utils.processingInstructions.getFinancialField(processingInstruction, 'ppwOrPpc')?.dateValue
          ? `${utils.string.t('processingInstructions.pdf.instructionLabels.ppwPpcApplicable')} (${utils.string.t('format.date', {
              value: {
                date: utils.processingInstructions.getFinancialField(processingInstruction, 'ppwOrPpc')?.dateValue,
                format: config.ui.format.date.text,
              },
            })})`
          : utils.string.t('processingInstructions.pdf.instructionLabels.ppwPpcApplicable'),
        helpers.getPpwOrPpc(utils.processingInstructions.getFinancialField(processingInstruction, 'ppwOrPpc')?.numberValue),
        processingInstruction?.financialChecklist?.find((item) => item.name === constants.PPW_PPC)?.approvedByAuthorisedSignatory
          ? utils.string.t('app.authorised')
          : '-',
      ],
    ];
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
  renderAccountHandler: (accountHandler, row, lineItems) => {
    const cell = row.cells.find((cell) => cell.name === 'accountHandler');
    if (!cell) return;
    if (row.rowKey === 'total') return helpers.calculateTotal(lineItems);
    if (row.rowKey === 'retainedBrokerageAmount') return helpers.calculateRetainedBrokerageAmount(lineItems);
    if (!cell.component || !cell.component.optionsKey) return accountHandler;
    return utils.form.getSelectOption(cell.component.optionsKey, {}, accountHandler);
  },
  createSummaryBody: (processingInstruction, departmentName, frontEndContactName, accountExecutiveName, producingBrokerName) => {
    const processType =
      constants.PROCESS_TYPE_ID_CLOSING === processingInstruction?.processTypeId
        ? constants.PROCESS_TYPE_CLOSING
        : constants.PROCESS_TYPE_ID_FDO === processingInstruction?.processTypeId
        ? constants.PROCESS_TYPE_FDO
        : '';
    const leadRef = processingInstruction?.riskReferences?.find((r) => r.leadPolicy);
    const allRiskRefs = processingInstruction?.riskReferences?.map((r) => r.riskRefId);
    return [
      [utils.string.t('processingInstructions.pdf.summaryLabels.processType'), upperCase(processType)],
      [utils.string.t('processingInstructions.pdf.summaryLabels.addedRiskRef'), allRiskRefs.join(', ')],
      [utils.string.t('processingInstructions.pdf.summaryLabels.leadRiskRef'), leadRef?.riskRefId],
      [utils.string.t('processingInstructions.pdf.summaryLabels.gxbInstance'), leadRef?.xbInstance],
      [utils.string.t('processingInstructions.pdf.summaryLabels.department'), departmentName],
      [utils.string.t('processingInstructions.pdf.summaryLabels.reInsuredOrCoverHolderName'), leadRef?.assuredName],
      [utils.string.t('processingInstructions.pdf.summaryLabels.period'), `From: ${leadRef?.inceptionDate} To: ${leadRef?.expiryDate}`],
      [utils.string.t('processingInstructions.pdf.summaryLabels.invoicingClient'), leadRef?.clientName],
      [utils.string.t('processingInstructions.pdf.summaryLabels.contactName'), processingInstruction?.details?.contactName],
      [utils.string.t('processingInstructions.pdf.summaryLabels.clientEmail'), processingInstruction?.details?.clientEmail],
      [
        utils.string.t('processingInstructions.pdf.summaryLabels.eocInvoiceContactName'),
        processingInstruction?.details?.eocInvoiceContactName,
      ],
      [utils.string.t('processingInstructions.pdf.summaryLabels.eocInvoiceEmail'), processingInstruction?.details?.eocInvoiceMail],
      [utils.string.t('processingInstructions.pdf.summaryLabels.producingBroker'), producingBrokerName],
      [utils.string.t('processingInstructions.pdf.summaryLabels.accountExecutive'), accountExecutiveName],
      [utils.string.t('processingInstructions.pdf.summaryLabels.frontEndContactName'), frontEndContactName],
      [
        {
          colSpan: 2,
          content: utils.string.t('processingInstructions.pdf.leadRiskReferenceLegend'),
        },
      ],
    ];
  },
  createApprovalBody: (processingInstruction, frontEndContactName, authorizedSignatoryName) => {
    return [
      [
        `${utils.string.t('processingInstructions.pdf.approvalSection.name')}: ${frontEndContactName}`,
        `${utils.string.t('processingInstructions.pdf.approvalSection.name')}: ${authorizedSignatoryName}`,
      ],
      [
        `${utils.string.t('processingInstructions.pdf.approvalSection.approved')}: ${helpers.formatDate(new Date())}`,
        `${utils.string.t('processingInstructions.pdf.approvalSection.approved')}: ${helpers.formatDate(new Date())}`,
      ],
    ];
  },
  createAttachedDocumemtBody: (processingInstruction) => {
    const leadRef = processingInstruction?.riskReferences?.find((r) => r.leadPolicy);
    const gxbDocuments = leadRef?.gxbDocuments?.map((item, index) => [index + 1, item.name]);
    return [
      [
        `${utils.string.t('processingInstructions.pdf.attachedDocumentSection.sno')}`,
        `${utils.string.t('processingInstructions.pdf.attachedDocumentSection.header')}`,
      ],
      ...gxbDocuments,
    ];
  },

  createSpecialBody: (processingInstruction) => {
    return [
      [
        `${utils.string.t('processingInstructions.pdf.specialInstructions.highPriority')}: ${
          processingInstruction?.details?.highPriority || '-'
        }`,
        `${utils.string.t('processingInstructions.pdf.specialInstructions.frontEndSendDocuments')}: ${
          processingInstruction?.details?.frontEndSendDocs || '-'
        }`,
      ],
      [
        {
          colSpan: 2,
          content: `${utils.string.t('processingInstructions.pdf.specialInstructions.notes')}: ${
            processingInstruction?.details?.notes || '-'
          }`,
        },
      ],
    ];
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
    attachedDocumentSectionHeader: utils.string.t('placement.openingMemo.attachedDocumentSection.header'),
    accountHandler: utils.string.t('placement.openingMemo.approvers.accountHandler'),
    authorisedSignatory: utils.string.t('placement.openingMemo.approvers.authorisedSignatory'),
    placingBrokerLabel: utils.string.t('placement.openingMemo.specialInstructions.placingBroker.label'),
    originatorLabel: utils.string.t('placement.openingMemo.specialInstructions.originator.label'),
    accountExecutiveLabel: utils.string.t('placement.openingMemo.specialInstructions.accountExecutive.label'),
    producingBrokerLabel: utils.string.t('placement.openingMemo.specialInstructions.producingBroker.label'),
    frontEndContactLabel: utils.string.t('processingInstructions.authorisations.fields.frontEndContact'),
  }),
  getRowLabel: (sectionKey, rowKey) => utils.string.t(`processingInstructions.checklist.lineItems.${sectionKey}.rows.${rowKey}.label`),
  getYesNoNaLabel: (accountHandler) => utils.string.t(`form.options.yesNoNa.${utils.string.replaceLowerCase(accountHandler)}`),
  getSectionLabel: (sectionKey) => utils.string.t(`processingInstructions.checklist.lineItems.${sectionKey}.label`),
  getSectionSubHeader: (sectionKey) => utils.string.t(`processingInstructions.checklist.lineItems.${sectionKey}.subHeader`),
  getHeaderLabel: (headerKey) => utils.string.t(`processingInstructions.pdf.pdfColHeaderLabels.${headerKey}`),
  getOptionLabel: (rowKey, value) => utils.string.t(`form.options.${rowKey}.${value}`),
};
