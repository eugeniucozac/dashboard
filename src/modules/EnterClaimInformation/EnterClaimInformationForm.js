import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';

//app
import styles from '../EnterClaimCardInformation/EnterClaimCardInformation.styles';
import { EnterClaimInformationView } from './EnterClaimInformation.view';
import {
  getClaimantNames,
  getClaimBordereauPeriods,
  getSettlementCurrency,
  selectSettlementCurrency,
  selectBEAdjusterList,
  selectClaimsInformation,
  selectSelectedBEAdjusterList,
  selectReferralValues,
  selectReferralResponse,
  selectSectionEnabledUG,
  selectClaimIdUnderProgress,
  updateClaimantNamesSuccess,
  setBEAdjusterValue,
  selectClaimBordereauPeriods,
  selectClaimData,
} from 'stores';
import * as utils from 'utils';
import { CLAIM_SECTION_ENABLED_UG, CLAIM_POLICY_SECTION_DEFAULT, CLAIM_LOSS_DATE_DISABLED_QUALIFIERS } from 'consts';

//mui
import { makeStyles } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';

EnterClaimInformationForm.prototypes = {
  policyRef: PropTypes.object.isRequired,
  setPolicyRef: PropTypes.func.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  context: PropTypes.string.isRequired,
  validation: PropTypes.bool.isRequired,
  setValidation: PropTypes.func.isRequired,
  policyInformation: PropTypes.object.isRequired,
  catCodes: PropTypes.array.isRequired,
  lossInformation: PropTypes.object.isRequired,
  lossQualifiers: PropTypes.array.isRequired,
  claimantNames: PropTypes.array.isRequired,
  beAdjusterList: PropTypes.array.isRequired,
  underWritingGroups: PropTypes.object.isRequired,
  interest: PropTypes.object.isRequired,
  allClaimDetails: PropTypes.object.isRequired,
  priorities: PropTypes.array.isRequired,
  complexityValues: PropTypes.array.isRequired,
  claimPolicyInsures: PropTypes.array.isRequired,
  claimPolicyClients: PropTypes.array.isRequired,
  policySections: PropTypes.array.isRequired,
};

export default function EnterClaimInformationForm({
  catCodes,
  lossInformation,
  lossQualifiers,
  policyInformation,
  allClaimDetails,
  claimantNames,
  interest,
  underWritingGroups,
  priorities,
  beAdjusterList,
  handleBack,
  complexityValues,
  claimPolicyInsures,
  claimPolicyClients,
  policySections,
  ...props
}) {
  const classes = makeStyles(styles, { name: 'EnterClaimInformationForm' })();
  const dispatch = useDispatch();
  let currencies = useSelector(selectSettlementCurrency);
  currencies = currencies.map((currency) => ({ ...currency, name: `${currency.id} - ${currency.name}` }));
  const isSectionEnabled = useSelector(selectSectionEnabledUG);
  const allBEAdjusters = useSelector(selectBEAdjusterList);
  const selectedBeAdjuster = useSelector(selectSelectedBEAdjusterList);
  const existingClaimInfo = useSelector(selectClaimsInformation);
  const savedClaimInfo = useSelector(selectClaimIdUnderProgress);
  const referralValues = useSelector(selectReferralValues);
  const referralResponse = useSelector(selectReferralResponse);
  const claimBordereauPeriods = useSelector(selectClaimBordereauPeriods);
  const claimData = useSelector(selectClaimData);
  const [resetKey, setResetKey] = useState();
  const [uwResetKey, setUWResetKey] = useState();
  const [isBordereauChecked, setBordereauChecked] = useState(false);

  const checkBordereauValue = (claimBordereauPeriods) =>
    claimBordereauPeriods.find((bp) => bp.name === existingClaimInfo?.bordereauPeriod) || null;

  useEffect(() => {
    dispatch(getSettlementCurrency());
    dispatch(getClaimBordereauPeriods());
    setResetKey(new Date().getTime());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (existingClaimInfo?.bordereauPeriod) {
      setBordereauChecked(true);
    }
    if (policyData?.length > 0) setUWResetKey(new Date().getTime());
  }, [isSectionEnabled, existingClaimInfo?.bordereauPeriod]); // eslint-disable-line react-hooks/exhaustive-deps

  const isComplexFlag = allClaimDetails?.isComplex !== 0;
  const isBordereauFlag = allClaimDetails?.isBordereau === 1;
  const existingClaimOrPolicyCurrency =
    existingClaimInfo?.settlementCurrencyCode || savedClaimInfo?.settlementCurrencyCode || policyInformation?.originalCurrency;
  const selectedCurrency = currencies.find((c) => c.id === existingClaimOrPolicyCurrency);
  const lossQualifierValue = (lossQualifiers || []).find(
    (l) => l.id?.toString() === (existingClaimInfo?.lossQualifierID?.toString() || savedClaimInfo?.lossQualifierID?.toString())
  );
  const complexityDefaultValue =
    existingClaimInfo?.complexityBasis && complexityValues?.find((item) => item.complexityRulesValue === existingClaimInfo.complexityBasis);

  const complexityValue =
    savedClaimInfo?.complexityValueID && complexityValues?.find((item) => item.complexityRulesID === savedClaimInfo.complexityValueID);

  const referralDefaultValue =
    existingClaimInfo?.referralValue && referralValues?.find((item) => item.complexityRulesValue === existingClaimInfo.referralValue);

  const referralValue =
    savedClaimInfo?.referralValueID && referralValues?.find((item) => item.complexityRulesID === savedClaimInfo.referralValueID);

  const referralDefaultResponse =
    existingClaimInfo?.referralResponseDescription &&
    referralResponse?.find((item) => item.description === existingClaimInfo.referralResponseDescription);

  const referralResponseData =
    savedClaimInfo?.referralResponseID && referralResponse?.find((item) => item.id === savedClaimInfo.referralResponseID?.toString());

  const sectionAllOption =
    policyInformation?.policyType === CLAIM_SECTION_ENABLED_UG[0]
      ? []
      : [{ id: CLAIM_POLICY_SECTION_DEFAULT, name: utils.string.t('app.all'), description: null }];

  const policyData = [...sectionAllOption, ...(utils.generic.isValidArray(policySections, true) ? policySections : [])];

  const dateDisabledLossQualifiers = lossQualifiers
    .filter((item) => {
      return CLAIM_LOSS_DATE_DISABLED_QUALIFIERS.find((itr) => itr === item.name);
    })
    .map((item) => item.id);

  const hasClaimRef = Boolean(savedClaimInfo?.claimReference) || Boolean(existingClaimInfo?.claimReference);

  const fields = [
    {
      name: 'claimantName',
      type: 'autocompletemui',
      options: claimantNames || [],
      value:
        existingClaimInfo?.claimantName || claimantNames?.length === 1
          ? claimantNames[0]
          : claimantNames?.length > 1
          ? claimantNames[claimantNames.length - 1]
          : null,
      optionsCreatable: true,
      optionKey: 'id',
      optionLabel: 'name',
      muiComponentProps: {
        inputProps: {
          maxLength: 50,
        },
        filterOptions: (options, params) => {
          let filtered = createFilterOptions()(options, params);
          if (params.inputValue) {
            filtered = [
              ...filtered,
              {
                id: filtered.length + 1,
                name: `${utils.string.t('app.create')} - ${params.inputValue}`,
              },
            ];
          }
          return filtered;
        },
      },
      callback: (event, data) => {
        const hasCreateString = `${utils.string.t('app.create')} - `;
        const name = data?.name.replace(hasCreateString, '');
        const alreadyExists = claimantNames.find((claim) => claim.name === name);

        if (data?.name.includes(hasCreateString) && !alreadyExists) {
          const newClaimantName = { id: Object.keys(claimantNames).length, name };
          dispatch(updateClaimantNamesSuccess(newClaimantName));
        }
      },
      validation: Yup.object().nullable(),
    },

    {
      type: 'datepicker',
      name: 'claimReceivedDate',
      icon: 'TodayIcon',
      value: existingClaimInfo?.claimReceivedDate || savedClaimInfo?.claimReceivedDate || utils.date.today(),
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.date().max(new Date(), utils.string.t('claims.lossInformation.validation.futureDate')),
      outputFormat: 'iso',
    },
    {
      type: 'time',
      name: 'claimReceivedTime',
      icon: 'AccessTimeIcon',
      value: utils.string.t('format.date', {
        value: { date: existingClaimInfo?.claimReceivedDate || savedClaimInfo?.claimReceivedDate || new Date(), format: 'HH:mm' },
      }),
    },
    {
      name: 'settlementCurrencyCode',
      type: 'autocompletemui',
      options: currencies || [],
      optionKey: 'id',
      optionLabel: 'name',
      value: selectedCurrency || null,
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
    },
    {
      type: 'datepicker',
      name: 'fromDate',
      value: existingClaimInfo?.lossFromDate || lossInformation?.fromDate || savedClaimInfo?.lossFromDate || null,
      icon: 'TodayIcon',
      muiPickerProps: {
        minDate: lossInformation?.fromDate,
        maxDate: lossInformation?.toDate,
        disableToolbar: true,
        clearable: false,
        variant: 'inline',
        format: 'DD-MM-YYYY',
      },
      validation: Yup.date()
        .test('from', utils.string.t('claims.lossInformation.validation.greaterThenDate'), function (value) {
          return value && this.options.parent.toDate ? moment(value).isSameOrBefore(this.options.parent.toDate) : true;
        })
        .when('$validation', (validation, schema) =>
          validation
            ? schema.when('lossQualifierID', {
                is: (val) => !dateDisabledLossQualifiers.includes(val?.id),
                then: Yup.date()
                  .required(utils.string.t('validation.required'))
                  .max(new Date(), utils.string.t('claims.lossInformation.validation.futureDate'))
                  .nullable()
                  .transform((curr, orig) => (orig === '' ? null : curr)),
                otherwise: Yup.date().nullable(),
              })
            : Yup.date().nullable()
        ),
      outputFormat: 'iso',
    },
    {
      type: 'datepicker',
      name: 'toDate',
      value: existingClaimInfo?.lossToDate || lossInformation?.toDate || savedClaimInfo?.lossToDate || null,
      muiPickerProps: {
        minDate: lossInformation?.fromDate,
        maxDate: lossInformation?.toDate,
        disableToolbar: true,
        clearable: false,
        variant: 'inline',
        format: 'DD-MM-YYYY',
      },
      validation: Yup.date()
        .test('from', utils.string.t('claims.lossInformation.validation.lesserThenDate'), function (value) {
          return value && this.options.parent.fromDate ? moment(value).isSameOrAfter(this.options.parent.fromDate) : true;
        })
        .when('$validation', (validation, schema) =>
          validation
            ? schema.when('lossQualifierID', {
                is: (val) => !dateDisabledLossQualifiers.includes(val?.id),
                then: Yup.date()
                  .max(new Date(), utils.string.t('claims.lossInformation.validation.futureDate'))
                  .nullable()
                  .transform((curr, orig) => (orig === '' ? null : curr)),
                otherwise: Yup.date().nullable(),
              })
            : Yup.date().nullable()
        ),
      outputFormat: 'iso',
    },
    {
      name: 'lossQualifierID',
      type: 'autocompletemui',
      value: lossQualifierValue || null,
      options: lossQualifiers || [],
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.object()
        .nullable()
        .required(utils.string.t('validation.required'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable())),
    },
    {
      name: 'location',
      type: 'text',
      defaultValue: existingClaimInfo?.location || savedClaimInfo?.location || '',
      value: existingClaimInfo?.location || savedClaimInfo?.location || '',
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
      },
      validation: Yup.string()
        .required(utils.string.t('validation.required'))
        .max(200)
        .when('$validation', (validation, schema) => (validation ? schema : Yup.string())),
    },
    {
      name: 'adjusterReference',
      type: 'text',
      defaultValue: existingClaimInfo?.adjusterReference || savedClaimInfo?.adjusterReference || '',
      value: existingClaimInfo?.adjusterReference || savedClaimInfo?.adjusterReference || '',
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
      },
      validation: Yup.string().nullable().max(20, utils.string.t('claims.claimInformation.validation.maxAdjusterReference')),
    },
    {
      name: 'interest',
      type: 'text',
      defaultValue: interest.selectedInterest,
      value: interest.selectedInterest,
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
        disabled: true,
      },
      validation:
        interest?.items?.length > 0
          ? Yup.string()
              .required(utils.string.t('validation.required'))
              .when('$validation', (validation, schema) => (validation ? schema : Yup.string()))
          : Yup.string(),
    },
    {
      name: 'complexity',
      type: 'autocompletemui',
      options: complexityValues || [],
      value: complexityDefaultValue || complexityValue || null,
      optionKey: 'complexityRulesID',
      optionLabel: 'complexityRulesValue',
      muiComponentProps: {
        disabled: isComplexFlag,
      },
      validation: isComplexFlag
        ? Yup.object()
            .nullable()
            .required(utils.string.t('validation.required'))
            .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable()))
        : Yup.object().nullable(),
    },
    {
      name: 'referral',
      type: 'autocompletemui',
      options: referralValues || [],
      value: referralDefaultValue || referralValue || null,
      optionKey: 'complexityRulesID',
      optionLabel: 'complexityRulesValue',
      validation: Yup.object().when('complexity', {
        is: (val) =>
          complexityValues.find((item) => item.complexityRulesID === val?.complexityRulesID)?.complexityRulesValue === 'Referral Required',
        then: Yup.object().nullable().required(utils.string.t('validation.required')),
        otherwise: Yup.object().nullable(),
      }),
    },
    {
      name: 'rfiResponse',
      type: 'autocompletemui',
      options: referralResponse || [],
      value: referralDefaultResponse || referralResponseData || null,
      optionKey: 'id',
      optionLabel: 'description',
      validation: Yup.object().when('referral', {
        is: (val) => {
          if (val !== null) {
            const refValuesList = ['Referral Not Required', 'Referral Not Required: Assign to Myself', 'Unsure'];
            const getReferralValue = referralValues.find((item) => item.complexityRulesID === val?.complexityRulesID)?.complexityRulesValue;
            const refResponseState = refValuesList.includes(getReferralValue);
            return !refResponseState;
          } else {
            return false;
          }
        },
        then: Yup.object().nullable().required(utils.string.t('validation.required')),
        otherwise: Yup.object().nullable(),
      }),
    },
    {
      name: 'fgunarrative',
      type: 'text',
      defaultValue: existingClaimInfo?.fgunarrative || savedClaimInfo?.fgunarrative || '',
      value: existingClaimInfo?.fgunarrative || savedClaimInfo?.fgunarrative || '',
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
      },
      validation: Yup.string()
        .required(utils.string.t('validation.required'))
        .max(50)
        .when('$validation', (validation, schema) => (validation ? schema : Yup.string())),
    },
    {
      name: 'movementType',
      type: 'toggle',
      label: '',
      value: existingClaimInfo?.movementType || savedClaimInfo?.movementType || 'Advice',
      options: [
        {
          label: utils.string.t('claims.typeOfSettlement.advice'),
          value: 'Advice',
        },
        {
          label: utils.string.t('claims.typeOfSettlement.settlement'),
          value: 'Settlement',
        },
      ],
    },
    {
      name: 'order',
      type: 'radio',
      defaultValue: '100',
      // defaultValue: existingClaimInfo?.orderPercentage < 100 ? '1' : '0',
      // value: existingClaimInfo?.orderPercentage < 100 ? '1' : '0',
      muiFormGroupProps: {
        row: true,
        classes: {
          root: classes.radioLabel,
        },
      },
      options: [
        {
          label: utils.string.t('claims.typeOfSettlement.oneHundredPercent'),
          value: '100',
        },
        {
          label: utils.string.t('claims.typeOfSettlement.ourShare'),
          value: '0',
        },
      ],
    },
    {
      name: 'orderPercentage',
      type: 'number',
      defaultValue: existingClaimInfo?.orderPercentage || underWritingGroups.percentageOfSelected || savedClaimInfo?.orderPercentage || '0',
      value: existingClaimInfo?.orderPercentage || underWritingGroups.percentageOfSelected || savedClaimInfo?.orderPercentage || '0',
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
        disabled: true,
      },
      validation: Yup.number()
        .min(0, utils.string.t('claims.typeOfSettlement.errorMin'))
        .max(100, utils.string.t('claims.typeOfSettlement.error')),
    },
    {
      name: 'adjuster',
      type: 'radio',
      defaultValue: !existingClaimInfo?.nonBEAdjusterName || !savedClaimInfo?.nonBEAdjusterName ? 'beAdjuster' : 'nonBeAdjuster',
      value: !existingClaimInfo?.nonBEAdjusterName || !savedClaimInfo?.nonBEAdjusterName ? 'beAdjuster' : 'nonBeAdjuster',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiFormGroupProps: {
        row: true,
        nestedClasses: { root: classes.adjusterRadioGroup },
        classes: {
          root: classes.radioLabel,
        },
      },
      options: [
        {
          label: utils.string.t('claims.claimInformation.beAdjuster'),
          value: 'beAdjuster',
        },
        {
          label: utils.string.t('claims.claimInformation.nonBeAdjuster'),
          value: 'nonBeAdjuster',
        },
      ],
    },
    {
      name: 'beAdjuster',
      type: 'autocompletemui',
      defaultValue:
        existingClaimInfo?.beAdjusterID !== 0
          ? allBEAdjusters.items.find(
              (item) => item.id === (existingClaimInfo?.beAdjusterID?.toString() || savedClaimInfo?.beAdjusterID?.toString())
            )
          : selectedBeAdjuster || [],
      value:
        existingClaimInfo?.beAdjusterID !== 0
          ? allBEAdjusters.items.find(
              (item) => item.id === (existingClaimInfo?.beAdjusterID?.toString() || savedClaimInfo?.beAdjusterID?.toString())
            )
          : selectedBeAdjuster || [],
      options: beAdjusterList || [],
      optionKey: 'id',
      optionLabel: 'name',
      callback: (event, data) => {
        dispatch(setBEAdjusterValue(data));
      },
    },
    {
      name: 'nonBeAdjuster',
      type: 'text',
      defaultValue: existingClaimInfo?.nonBEAdjusterName || savedClaimInfo?.nonBEAdjusterName || '',
      value: existingClaimInfo?.nonBEAdjusterName || savedClaimInfo?.nonBEAdjusterName || '',
      muiComponentProps: {
        classes: {
          root: classes.formInput,
        },
      },
      validation: Yup.string().nullable().max(100, utils.string.t('claims.claimInformation.validation.maxNonBEAdjuster')),
    },
    {
      name: 'priority',
      type: 'autocompletemui',
      options: priorities?.length ? priorities : [],
      optionKey: 'id',
      optionLabel: 'description',
      value:
        existingClaimInfo?.priorityDescription && priorities.length > 0
          ? priorities.find((p) => p.description === (existingClaimInfo?.priorityDescription || savedClaimInfo?.priorityDescription))
          : priorities?.length > 0
          ? priorities.find((p) => p.description === 'Medium') || null
          : null,
    },
    {
      name: 'insured',
      type: 'autocompletemui',
      options: claimPolicyInsures || [],
      optionKey: 'id',
      optionLabel: 'name',
      value: existingClaimInfo?.insuredID
        ? claimPolicyInsures.find((cp) => cp.id === (existingClaimInfo?.insuredID?.toString() || savedClaimInfo?.insuredID?.toString()))
        : claimPolicyInsures?.length === 1
        ? claimPolicyInsures[0]
        : null,
      validation: Yup.object()
        .nullable()
        .required(utils.string.t('validation.required'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable())),
    },
    {
      name: 'client',
      type: 'autocompletemui',
      options: claimPolicyClients || [],
      optionKey: 'id',
      optionLabel: 'name',
      value: existingClaimInfo?.clientID
        ? claimPolicyClients.find((pc) => pc.id === (existingClaimInfo?.clientID?.toString() || savedClaimInfo?.clientID?.toString()))
        : claimPolicyClients?.length === 1
        ? claimPolicyClients[0]
        : null,
      validation: Yup.object()
        .nullable()
        .required(utils.string.t('validation.required'))
        .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable())),
    },
    ...(isBordereauFlag
      ? [
          {
            name: 'certificateNumber',
            type: 'text',
            value: existingClaimInfo?.certificateNumber || savedClaimInfo?.certificateNumber || allClaimDetails?.certificateNumber || '',
            muiComponentProps: {
              classes: {
                root: classes.formInput,
              },
            },
            validation: Yup.string()
              .nullable()
              .required(utils.string.t('validation.required'))
              .max(17, utils.string.t('claims.claimInformation.validation.maxCerficateNumber'))
              .when('$validation', (validation, schema) => (validation ? schema : Yup.string())),
          },
          {
            type: 'datepicker',
            name: 'certificateInceptionDate',
            value:
              savedClaimInfo?.certificateInceptionDate ||
              existingClaimInfo?.certificateInceptionDate ||
              allClaimDetails?.certificateInceptionDate ||
              null,
            muiComponentProps: {
              clearable: false,
              variant: 'inline',
              format: 'DD-MM-YYYY',
              fullWidth: true,
              classes: {
                root: classes.datepicker,
              },
            },
            validation: Yup.date()
              .nullable()
              .required(utils.string.t('validation.required'))
              .test('from', utils.string.t('claims.claimInformation.validation.greaterThenExpDate'), function (value) {
                return value && this.options.parent.certificateExpiryDate
                  ? moment(value).isSameOrBefore(this.options.parent.certificateExpiryDate)
                  : true;
              })
              .when('$validation', (validation, schema) => (validation ? schema : Yup.date().nullable())),
            outputFormat: 'iso',
          },
          {
            type: 'datepicker',
            name: 'certificateExpiryDate',
            value:
              savedClaimInfo?.certificateExpiryDate ||
              existingClaimInfo?.certificateExpiryDate ||
              allClaimDetails?.certificateExpiryDate ||
              null,
            muiComponentProps: {
              clearable: false,
              variant: 'inline',
              format: 'DD-MM-YYYY',
              fullWidth: true,
              classes: {
                root: classes.datepicker,
              },
            },
            validation: Yup.date()
              .nullable()
              .required(utils.string.t('validation.required'))
              .test('from', utils.string.t('claims.claimInformation.validation.lesserThenIncDate'), function (value) {
                return value && this.options.parent.certificateInceptionDate
                  ? moment(value).isSameOrAfter(this.options.parent.certificateInceptionDate)
                  : true;
              })
              .when('$validation', (validation, schema) => (validation ? schema : Yup.date().nullable())),
            outputFormat: 'iso',
          },
          {
            name: 'bordereauClaim',
            type: 'checkbox',
            defaultValue: Boolean(existingClaimInfo?.bordereauPeriod) || Boolean(savedClaimInfo?.bordereauPeriod),
            muiComponentProps: {
              onChange: (name, value) => setBordereauChecked(value),
            },
          },
        ]
      : []),
    ...(isBordereauChecked
      ? [
          {
            name: 'bordereauPeriod',
            type: 'autocompletemui',
            options: claimBordereauPeriods,
            optionKey: 'id',
            optionLabel: 'name',
            value: checkBordereauValue(claimBordereauPeriods),
            validation: Yup.object().nullable().required(utils.string.t('validation.required')),
          },
        ]
      : []),
    ...(isSectionEnabled
      ? [
          {
            name: 'ugSections',
            type: 'autocompletemui',
            value:
              savedClaimInfo?.policySectionID !== null
                ? policyData.find(
                    (policy) =>
                      policy.id.toString() ===
                      (existingClaimInfo?.policySectionID?.toString() || savedClaimInfo?.policySectionID?.toString())
                  )
                : policyData[0],
            options: policyData,
            optionKey: 'id',
            optionLabel: 'name',
            validation: Yup.object()
              .nullable()
              .required(utils.string.t('validation.required'))
              .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable())),
          },
        ]
      : []),
  ];

  const handleAddClaim = () => {
    dispatch(getClaimantNames());
  };

  return (
    <EnterClaimInformationView
      {...props}
      resetKey={resetKey}
      uwResetKey={uwResetKey}
      policyInformation={policyInformation}
      handleAddClaim={handleAddClaim}
      lossInformation={lossInformation}
      lossQualifiers={lossQualifiers}
      claimantNames={claimantNames}
      claimPolicyInsures={claimPolicyInsures}
      interest={interest}
      underWritingGroups={underWritingGroups}
      handleNext={props.handleNext}
      fields={fields}
      handleBack={handleBack}
      complexityValues={complexityValues}
      referralValues={referralValues}
      isBordereauFlag={isBordereauFlag}
      isComplexFlag={isComplexFlag}
      existingClaimInfo={existingClaimInfo ?? {}}
      claimData={claimData}
      hasClaimRef={hasClaimRef}
      currencies={currencies}
      isBordereauChecked={isBordereauChecked}
    />
  );
}
