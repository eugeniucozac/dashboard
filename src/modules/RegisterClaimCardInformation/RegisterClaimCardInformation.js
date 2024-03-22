import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import moment from 'moment';
import * as Yup from 'yup';

// app
import styles from './RegisterClaimCardInformation.styles';
import { RegisterClaimCardInformationView } from './RegisterClaimCardInformation.view';
import {
  selectLossQualifiers,
  selectReferralValues,
  selectComplexityValues,
  selectReferralResponse,
  selectBEAdjusterList,
  selectPriorities,
  selectClaimData,
  selectClaimIdFromGrid,
  selectClaimsPolicyInformation,
  selectClaimPolicyInsures,
  selectClaimsInformation,
  selectorDmsViewFiles,
  selectDmsDocDetails,
  selectLossInformation,
  setBEAdjusterValue,
  updateClaimantNamesSuccess,
  selectSelectedBEAdjusterList,
  selectClaimIdUnderProgress,
} from 'stores';
import { CLAIM_LOSS_DATE_DISABLED_QUALIFIERS } from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab/Autocomplete';
RegisterClaimCardInformation.prototype = {
  activeStep: PropTypes.number,
  isAllStepsCompleted: PropTypes.bool,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  index: PropTypes.number,
  handleFormStatus: PropTypes.func.isRequired,
};

export default function RegisterClaimCardInformation({
  activeStep,
  isAllStepsCompleted,
  handleBack,
  handleSave,
  handleNext,
  save,
  index,
  handleFormStatus,
}) {
  const classes = makeStyles(styles, { name: 'RegisterClaimCardInformation' })();

  const dispatch = useDispatch();
  const todayDate = moment();

  const lossQualifiers = useSelector(selectLossQualifiers);
  const referralValues = useSelector(selectReferralValues);
  const selectedBeAdjuster = useSelector(selectSelectedBEAdjusterList);
  const complexityValues = useSelector(selectComplexityValues);
  const referralResponse = useSelector(selectReferralResponse);
  const claimantNames = useSelector(selectClaimPolicyInsures);
  const beAdjusterList = useSelector(selectBEAdjusterList);
  const priorities = useSelector(selectPriorities);
  const claimsInformation = useSelector(selectClaimsInformation);
  const claimRefId = useSelector(selectClaimData);
  const claimData = useSelector(selectClaimIdFromGrid);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const lossInformation = useSelector(selectLossInformation);
  const savedClaimInfo = useSelector(selectClaimIdUnderProgress);
  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);

  const lossQualifierValue = (claimsInformation?.lossQualifierID?.toString() || savedClaimInfo?.lossQualifierID?.toString());
  const referralResponseData = referralResponse?.find((item) => item.id === savedClaimInfo?.referralResponseID?.toString());
  const complexityValue =
    savedClaimInfo?.complexityValueID &&
    complexityValues?.find((item) => item.complexityRulesID === (claimsInformation.complexityValueID || savedClaimInfo?.complexityValueID));

  const referralValue =
    savedClaimInfo?.referralValueID && referralValues?.find((item) => item.complexityRulesID === savedClaimInfo?.referralValueID);

  const dateDisabledLossQualifiers = lossQualifiers
    .filter((item) => {
      return CLAIM_LOSS_DATE_DISABLED_QUALIFIERS.find((itr) => itr === item.name);
    })
    .map((item) => item.id);

  const concatDateAndTime = (contactDate, contactTime) => {
    let partDate = utils.string.t('format.date', { value: { date: contactDate || new Date(), format: 'D MMM YYYY' } });
    return utils.date.toISOString(partDate + ' ' + (contactTime ? contactTime + ':00' : '00:00:00'));
  };
  const fields = [
    {
      name: 'claimantName',
      type: 'autocompletemui',
      label: utils.string.t('claims.claimInformation.claimant'),
      options: claimantNames || [],
      value: claimantNames?.[0] || null,
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
      value: lossInformation.firstContactDate || null,
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.date().max(new Date(), utils.string.t('claims.lossInformation.validation.futureDateAndTime')),
    },
    {
      type: 'time',
      name: 'claimReceivedTime',
      value: utils.string.t('format.date', { value: { date: lossInformation?.firstContactDate || null, format: 'HH:mm' } }),
      muiComponentProps: {
        fullWidth: true,
        InputProps: {
          classes: {
            input: classes.timeInput,
          },
        },
      },
      validation: Yup.string()
        .nullable()
        .test('from', utils.string.t('claims.lossInformation.validation.futureDateAndTime'), function (value) {
          return !moment(new Date(concatDateAndTime(this?.options?.parent?.claimReceivedDate, value))).isAfter(new Date());
        }),
    },
    {
      type: 'datepicker',
      name: 'fromDate',
      label: utils.string.t('claims.lossInformation.fromDate'),
      value: lossInformation?.fromDate || savedClaimInfo?.lossFromDate || null,
      icon: 'TodayIcon',
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.date()
        .nullable()
        .test('from', utils.string.t('claims.lossInformation.validation.greaterThenDate'), function (value) {
          return value && this.options.parent.toDate ? moment(value).isSameOrBefore(this.options.parent.toDate) : true;
        })
        .test('from', utils.string.t('claims.lossInformation.validation.betweenTheDate'), function (value) {
          if (value && this.options.parent.fromDate && lossInformation?.fromDate) {
            if (lossInformation?.toDate) {
              return moment(value).isBetween(
                moment(lossInformation?.fromDate).subtract(1, 'days'),
                moment(lossInformation?.toDate).add(1, 'days')
              );
            } else {
              return moment(value).isSameOrAfter(lossInformation?.fromDate);
            }
          } else {
            return true;
          }
        })
        .test('from', utils.string.t('claims.lossInformation.validation.futureDate'), function (value) {
          return value ? todayDate.isAfter(value) : true;
        })
        .test('from', utils.string.t('validation.required'), function (value) {
          if (!dateDisabledLossQualifiers.includes(this.options.parent.lossQualifierID)) {
            return value || typeof value === 'undefined' ? true : false;
          } else {
            return true;
          }
        }),
      outputFormat: 'iso',
    },
    {
      type: 'datepicker',
      name: 'toDate',
      label: utils.string.t('claims.lossInformation.toDate'),
      value: lossInformation?.toDate || savedClaimInfo?.lossToDate || null,
      muiComponentProps: {
        fullWidth: true,
      },
      validation: Yup.date()
        .nullable()
        .test('from', utils.string.t('claims.lossInformation.validation.lesserThenDate'), function (value) {
          return value && this.options.parent.fromDate && value !== null ? moment(value).isSameOrAfter(this.options.parent.fromDate) : true;
        })
        .test('to', utils.string.t('claims.lossInformation.validation.betweenTheDate'), function (value) {
          if (value && this.options.parent.toDate && lossInformation?.toDate) {
            if (lossInformation?.fromDate) {
              return moment(value).isBetween(
                moment(lossInformation?.fromDate).subtract(1, 'days'),
                moment(lossInformation?.toDate).add(1, 'days')
              );
            } else {
              return moment(value).isSameOrBefore(lossInformation?.toDate);
            }
          } else {
            return true;
          }
        })
        .test('to', utils.string.t('claims.lossInformation.validation.futureDate'), function (value) {
          return value ? todayDate.isAfter(value) : true;
        }),
      outputFormat: 'iso',
    },
    {
      name: 'lossQualifierID',
      type: 'select',
      label: utils.string.t('claims.lossInformation.qualifier'),
      value: lossQualifierValue || '',
      options: lossQualifiers || [],
      optionKey: 'id',
      optionLabel: 'name',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'location',
      type: 'text',
      label: utils.string.t('claims.claimInformation.location'),
      value: claimsInformation.location || savedClaimInfo?.location || '',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'adjusterReference',
      type: 'text',
      label: utils.string.t('claims.claimInformation.adjustorRef'),
      value: claimsInformation.adjusterReference || savedClaimInfo?.adjusterReference || '',
      validation: Yup.string().nullable().max(20, utils.string.t('claims.claimInformation.validation.maxAdjusterReference')),
    },
    {
      name: 'complexity',
      type: 'autocompletemui',
      label: utils.string.t('claims.claimInformation.complexityBasis'),
      options: complexityValues || [],
      value: complexityValue || null,
      optionKey: 'complexityRulesID',
      optionLabel: 'complexityRulesValue',
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
    },
    {
      name: 'referral',
      type: 'autocompletemui',
      label: utils.string.t('claims.claimInformation.referral'),
      options: referralValues || [],
      value: referralValue || null,
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
      label: utils.string.t('claims.claimInformation.rfiResponse'),
      options: referralResponse || [],
      value: referralResponseData || null,
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
      label: utils.string.t('claims.claimInformation.fguNarrative'),
      value: claimsInformation.fgunarrative || savedClaimInfo?.fgunarrative || '',
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
    {
      name: 'adjuster',
      type: 'radio',
      title: utils.string.t('claims.claimInformation.adjustorType'),
      value: claimsInformation?.nonBEAdjusterName || savedClaimInfo?.nonBEAdjusterName ? 'nonBeAdjuster' : 'beAdjuster',
      validation: Yup.string().required(utils.string.t('validation.required')),
      muiFormGroupProps: {
        row: true,
        nestedClasses: { root: classes.adjusterRadioGroup },
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
      label: utils.string.t('claims.claimInformation.adjustorName'),
      value:
        claimsInformation?.beAdjusterID !== 0
          ? beAdjusterList.items.find((item) => item.id === claimsInformation?.beAdjusterID?.toString())
          : selectedBeAdjuster || [],
      options: beAdjusterList.items || [],
      optionKey: 'id',
      optionLabel: 'name',
      callback: (event, data) => {
        dispatch(setBEAdjusterValue(data));
      },
    },
    {
      name: 'nonBeAdjuster',
      type: 'text',
      label: utils.string.t('claims.claimInformation.adjustorName'),
      value: claimsInformation.nonBEAdjusterName || savedClaimInfo?.nonBEAdjusterName || '',
      validation: Yup.string().nullable().max(100, utils.string.t('claims.claimInformation.validation.maxNonBEAdjuster')),
    },
    {
      name: 'priority',
      type: 'select',
      label: utils.string.t('claims.claimInformation.priority'),
      options: priorities || [],
      optionKey: 'id',
      optionLabel: 'description',
      value:  priorities.length ? priorities.find((p) => p.description === 'Medium')?.id : "",
      validation: Yup.string().required(utils.string.t('validation.required')),
    },
  ];

  return (
    <RegisterClaimCardInformationView
      fields={fields}
      claimantNames={claimantNames}
      referralValues={referralValues}
      lossQualifiers={lossQualifiers}
      claimRefId={claimRefId}
      claimData={claimData}
      policyInformation={policyInformation}
      complexityValues={complexityValues}
      lossInformation={lossInformation}
      savedClaimInfo={savedClaimInfo}
      activeStep={activeStep}
      isAllStepsCompleted={isAllStepsCompleted}
      handleBack={handleBack}
      handleSave={handleSave}
      handleNext={handleNext}
      save={save}
      index={index}
      claimsDocsList={viewDocumentList?.length > 0 ? viewDocumentList : savedDmsDocList?.claimsDocDetails}
      handleFormStatus={handleFormStatus}
    />
  );
}
