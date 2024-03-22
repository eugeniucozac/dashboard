import React, { Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import moment from 'moment';
import PropTypes from 'prop-types';

// app
import styles from './LinkClaimPolicy.styles';
import { LinkClaimPolicyView } from './LinkClaimPolicy.view';
import { FormGrid } from 'components';
import {
  getInterest,
  getClaimDetails,
  getPolicyInsures,
  getPolicyClients,
  getPolicySections,
  getBEAdjuster,
  getComplexityValues,
  selectClaimsPolicySections,
  selectClaimsInterestItems,
  selectClaimPolicyInsures,
  selectSectionEnabledUG,
  selectClaimsUnderwritingGroups,
  selectClaimPolicyClients,
  selectAllClaimDetails,
  postClaimDetailsInformation,
  postEditClaimDetailsInformation,
  selectLinkPoliciesData,
  getLinkPoliciesData,
  selectRefDataNewCountriesList,
  selectClaimsInterest,
  selectIsClaimPolicyClientsLoading,
  selectPolicySectionIsLoading,
  selectisClaimPolicyInsuresLoading,
  selectRefDataSettlementCurrency,
  selectRefDataBaseCurrency,
  selectClaimBordereauPeriods,
  getClaimBordereauPeriods,
  getReferralValues,
  selectBordereauPeriodsLoading,
  resetClaimsInformation,
} from 'stores';
import * as utils from 'utils';
import { CLAIM_SECTION_ENABLED_UG, CLAIM_POLICY_SECTION_DEFAULT } from 'consts';

//mui
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles } from '@material-ui/core';

SelectedClaimPolicy.propTypes = {
  selectedPolicy: PropTypes.bool,
};

export default function SelectedClaimPolicy({
  policyData,
  selectedPolicyRender,
  setSelectedPolicyRender,
  validation,
  setValidation,
  setActiveStep,
  index,
  isFormsEdited,
  setFormEditedStatus,
  saveStatus,
  sectionEnabledValidationFlag,
  claimInfo,
  handleFormStatus,
  selectNextPolicy,
  setSelectNextPolicy,
  selectedPolicy,
}) {
  const classes = makeStyles(styles, { name: 'LinkClaimPolicy' })();

  const dispatch = useDispatch();

  const [uwResetKey, setUWResetKey] = useState();
  const [stepper, setStepper] = useState(false);
  const [isBordereauChecked, setBordereauChecked] = useState(false);

  let interest = useSelector(selectClaimsInterestItems);
  interest = utils.generic.isValidArray(interest)
    ? interest?.map((intrst) => ({ ...intrst, description: `${intrst.code} - ${intrst.description}` }))
    : null;

  let allSettlementCurriencies = useSelector(selectRefDataSettlementCurrency);
  let settlementCurriencies = utils.referenceData.settlementCurrencyTypes.getAllById(allSettlementCurriencies, policyData?.xbInstanceID);

  settlementCurriencies = utils.generic.isValidArray(settlementCurriencies)
    ? settlementCurriencies?.map((currency) => ({ ...currency, currencyName: `${currency.currencyCd} - ${currency.currencyName}` }))
    : null;
  const allClaimDetails = useSelector(selectAllClaimDetails);
  const underWritingGroups = useSelector(selectClaimsUnderwritingGroups);
  const policySections = useSelector(selectClaimsPolicySections);
  const claimPolicyInsures = useSelector(selectClaimPolicyInsures);
  const isSectionEnabled = useSelector(selectSectionEnabledUG);
  const claimPolicyClients = useSelector(selectClaimPolicyClients);
  const isInterestLoading = useSelector(selectClaimsInterest)?.isLoading;
  const isPoliciesClientsLoading = useSelector(selectIsClaimPolicyClientsLoading);
  const isPolicySectionLoading = useSelector(selectPolicySectionIsLoading);
  const isInsuredLoading = useSelector(selectisClaimPolicyInsuresLoading);
  const claimBordereauPeriods = useSelector(selectClaimBordereauPeriods);
  const isBordereauPeriodsLoading = useSelector(selectBordereauPeriodsLoading);

  let countriesList = useSelector(selectRefDataNewCountriesList);
  countriesList = utils.generic.isValidArray(countriesList)
    ? countriesList?.map((country) => ({ ...country, countryName: `${country.countryCode} - ${country.countryName}` }))
    : null;
  const linkPoliciesData = useSelector(selectLinkPoliciesData);
  const isBordereauFlag = allClaimDetails?.isBordereau === 1;

  let allOriginalCurrencies = useSelector(selectRefDataBaseCurrency);
  let originalCurrencies = utils.referenceData.baseCurrenyTypes.getAllById(allOriginalCurrencies, policyData?.xbInstanceID);
  originalCurrencies = utils.generic.isValidArray(originalCurrencies)
    ? originalCurrencies?.map((currency) => ({ ...currency, currencyName: `${currency.currencyCd} - ${currency.currencyName}` }))
    : null;

  useEffect(() => {
    if (selectedPolicyRender !== '') {
      dispatch(getInterest({ viewLoader: false }));
      dispatch(getPolicyInsures({ viewLoader: false }));
      isSectionEnabled && dispatch(getPolicySections({ viewLoader: false }));
      dispatch(getPolicyClients({ viewLoader: false })).then((response) => {
        if (utils.generic.isValidArray(response)) {
          dispatch(getLinkPoliciesData({ loader: true, fieldLoader: false }));
          setUWResetKey(new Date().getTime());
        }
      });
      dispatch(getClaimDetails()).then((response) => {
        if (response?.status?.toLowerCase() === 'ok') {
          dispatch(resetClaimsInformation());
        }
      });
      dispatch(getBEAdjuster({ viewLoader: false }));
      dispatch(getComplexityValues());
      dispatch(getReferralValues());
      dispatch(getClaimBordereauPeriods());
    }
  }, [selectedPolicyRender]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setBordereauChecked(!!linkPoliciesData?.data?.bordereauClaim);
  }, [linkPoliciesData?.data?.bordereauClaim]);

  const sectionAllOption =
    policyData?.policyType === CLAIM_SECTION_ENABLED_UG[0]
      ? []
      : [{ id: CLAIM_POLICY_SECTION_DEFAULT, name: utils.string.t('app.all'), description: null }];

  const policyInfo = [...sectionAllOption, ...(utils.generic.isValidArray(policySections, true) ? policySections : [])];

  const postSaveHandler = (postData) => {
    if (!claimInfo?.claimID) {
      dispatch(postClaimDetailsInformation(postData)).then((response) => {
        if (response) {
          dispatch(getLinkPoliciesData({ data: postData }));
          const formState = isFormsEdited?.map((form) => ({ ...form }));
          formState[index]['formEditedStatus'] = false;
          formState[index]['isSubmitted'] = false;
          setFormEditedStatus(formState);
          setValidation(false);
        }
      });
    } else {
      dispatch(postEditClaimDetailsInformation(postData)).then((response) => {
        if (response) {
          dispatch(getLinkPoliciesData({ data: postData }));
          const formState = isFormsEdited?.map((form) => ({ ...form }));
          formState[index]['formEditedStatus'] = false;
          formState[index]['isSubmitted'] = false;
          setFormEditedStatus(formState);
          setValidation(false);
        }
      });
    }
  };

  const postEditSaveHandler = (postData) => {
    utils.dms.resetDmsFiles(dispatch);
    if (claimInfo?.claimID) {
      dispatch(postEditClaimDetailsInformation(postData)).then((response) => {
        if (response) {
          dispatch(getLinkPoliciesData({ data: postData }));
          const formState = isFormsEdited?.map((form) => ({ ...form }));
          formState[index]['formEditedStatus'] = false;
          formState[index]['isSubmitted'] = true;
          setFormEditedStatus(formState);
          typeof response?.claimReference === 'string' && setActiveStep(index + 1);
          setValidation(true);
          setSelectedPolicyRender('');
        }
      });
    } else {
      dispatch(postClaimDetailsInformation(postData)).then((response) => {
        if (response) {
          dispatch(getLinkPoliciesData({ data: postData }));
          const formState = isFormsEdited?.map((form) => ({ ...form }));
          formState[index]['formEditedStatus'] = false;
          formState[index]['isSubmitted'] = true;
          setFormEditedStatus(formState);
          typeof response?.claimReference === 'string' && setActiveStep(index + 1);
          setValidation(true);
          setSelectedPolicyRender('');
        }
      });
    }
  };

  const postSaveNextHanlder = (postData) => {
    if (claimInfo?.claimID) {
      const policyUpdated = true;
      dispatch(postEditClaimDetailsInformation(postData, policyUpdated)).then((response) => {
        if (response) {
          dispatch(getLinkPoliciesData({ data: postData }));
          const formState = isFormsEdited?.map((form) => ({ ...form }));
          if (isFormsEdited[index]?.formEditedStatus) {
            formState[index]['formEditedStatus'] = false;
            formState[index]['isSubmitted'] = false;
            setFormEditedStatus(formState);
            typeof response?.claimReference === 'string' && setActiveStep(index + 1);
            setValidation(true);
            setSelectNextPolicy(false);
          } else {
            formState[index]['formEditedStatus'] = false;
            formState[index]['isSubmitted'] = true;
            setFormEditedStatus(formState);
            setValidation(true);
            setSelectedPolicyRender('');
            setSelectNextPolicy(false);
          }
        }
      });
    }
  };

  const clientValue = (claimPolicyClients) => {
    return linkPoliciesData?.data?.client && !linkPoliciesData?.fieldLoader
      ? claimPolicyClients?.find((clmPolicyclnt) => clmPolicyclnt.id === linkPoliciesData.data.client.id)
      : claimInfo?.clientID
      ? claimPolicyClients?.find((clmPolicyclnt) => clmPolicyclnt.id === claimInfo?.clientID?.toString())
      : claimPolicyClients?.length === 1
      ? claimPolicyClients[0]
      : null;
  };

  const countryCodeValue = (countriesList) => {
    return linkPoliciesData?.data?.countryCode && !linkPoliciesData?.fieldLoader
      ? countriesList?.find((country) => country.countryCode === linkPoliciesData.data.countryCode.countryCode)
      : claimInfo?.settlementCountry
      ? countriesList?.find((country) => country.countryCode === claimInfo.settlementCountry)
      : null;
  };
  const originalCurrencyValue = () => {
    return linkPoliciesData?.data?.originalCurrencyCode && !linkPoliciesData?.fieldLoader
      ? originalCurrencies?.find((currency) => currency.currencyCd === linkPoliciesData?.data?.originalCurrencyCode?.currencyCd)
      : claimInfo?.originalCurrency
      ? originalCurrencies?.find((currency) => currency?.currencyCd === claimInfo?.originalCurrency)
      : originalCurrencies?.find((currency) => currency?.currencyCd === allClaimDetails?.originalCurrency);
  };
  const settlementCurrencyValue = () => {
    return linkPoliciesData?.data?.originalCurrencyCode && !linkPoliciesData?.fieldLoader
      ? settlementCurriencies?.find((currency) => currency.currencyCd === linkPoliciesData.data.settlementCurrencyCode.currencyCd)
      : claimInfo?.settlementCurrencyCode
      ? settlementCurriencies?.find((currency) => currency?.currencyCd === claimInfo?.settlementCurrencyCode)
      : settlementCurriencies?.find((currency) => currency?.currencyCd === allClaimDetails?.settlementCurrencyCode);
  };

  const bordereauPeriod = claimBordereauPeriods?.find((periods) => periods?.id === linkPoliciesData?.data?.bordereauPeriod?.id);

  const bordereauPeriodValue = !claimInfo?.claimReference
    ? policyData?.bordereauPeriod
    : selectedPolicy
    ? allClaimDetails?.bordereauPeriod
    : bordereauPeriod;

  const certificateNumber = !claimInfo?.claimReference
    ? allClaimDetails?.certificateNumber
    : selectedPolicy
    ? allClaimDetails?.certificateNumber
    : linkPoliciesData?.data?.certificateNumber;

  const certExpiryDate = !claimInfo?.claimReference
    ? policyData?.expiryDate
    : selectedPolicy
    ? policyData?.expiryDate
    : linkPoliciesData?.data?.certificateExpiryDate;

  const certInceptionDate = !claimInfo?.claimReference
    ? policyData?.inceptionDate
    : selectedPolicy
    ? policyData?.inceptionDate
    : linkPoliciesData?.data?.certificateInceptionDate;

  const fields = [
    {
      name: 'insured',
      type: 'autocompletemui',
      options: claimPolicyInsures || [],
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('claims.claimInformation.insured'),
      value:
        linkPoliciesData?.data?.insured && !linkPoliciesData?.fieldLoader
          ? claimPolicyInsures?.find((clmPolicy) => clmPolicy.id === linkPoliciesData.data.insured.id)
          : claimInfo?.insuredID
          ? claimPolicyInsures?.find((clmPolicy) => clmPolicy.id === claimInfo?.insuredID?.toString())
          : claimPolicyInsures?.length === 1
          ? claimPolicyInsures[0]
          : null,
      validation: isFormsEdited?.[index]?.formEditedStatus
        ? Yup.object()
            .nullable()
            .required(utils.string.t('validation.required'))
            .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable()))
        : false,
    },
    {
      name: 'client',
      type: 'autocompletemui',
      options: claimPolicyClients || [],
      optionKey: 'id',
      optionLabel: 'name',
      label: utils.string.t('claims.claimInformation.client'),
      value: clientValue(claimPolicyClients),
      validation: isFormsEdited?.[index]?.formEditedStatus
        ? Yup.object()
            .nullable()
            .required(utils.string.t('validation.required'))
            .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable()))
        : false,
    },
    {
      name: 'countryCode',
      type: 'autocompletemui',
      options: countriesList || [],
      optionKey: 'countryCode',
      optionLabel: 'countryName',
      label: utils.string.t('claims.claimInformation.country'),
      value: countryCodeValue(countriesList),
      validation: isFormsEdited?.[index]?.formEditedStatus
        ? Yup.object().nullable().required(utils.string.t('validation.required'))
        : false,
    },
    {
      name: 'originalCurrencyCode',
      type: 'autocompletemui',
      options: originalCurrencies || [],
      optionKey: 'currencyCd',
      optionLabel: 'currencyName',
      label: utils.string.t('claims.claimInformation.originalCurrency'),
      value: originalCurrencyValue(),
      validation: isFormsEdited?.[index]?.formEditedStatus
        ? Yup.object().nullable().required(utils.string.t('validation.required'))
        : false,
    },
    {
      name: 'settlementCurrencyCode',
      type: 'autocompletemui',
      options: settlementCurriencies || [],
      optionKey: 'currencyCd',
      optionLabel: 'currencyName',
      label: utils.string.t('claims.claimInformation.settlementCurrency'),
      value: settlementCurrencyValue(),
      validation: isFormsEdited?.[index]?.formEditedStatus
        ? Yup.object().nullable().required(utils.string.t('validation.required'))
        : false,
    },
    {
      name: 'interest',
      type: 'autocompletemui',
      options: interest,
      label: utils.string.t('claims.claimInformation.interest'),
      value:
        linkPoliciesData?.data?.interest && !linkPoliciesData?.fieldLoader
          ? interest?.find((intrst) => intrst.xbPolicyID === linkPoliciesData.data.interest.xbPolicyID)
          : interest?.length === 1
          ? interest[0]
          : null,
      optionKey: 'xbPolicyID',
      optionLabel: 'description',
    },
    {
      name: 'movementType',
      type: 'toggle',
      label: '',
      value: linkPoliciesData?.data?.movementType || claimInfo?.movementType || 'Advice',
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
      defaultValue: claimInfo?.basisOfOrder?.toString() || '100',
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
      defaultValue: underWritingGroups.percentageOfSelected || '0',
      value: underWritingGroups.percentageOfSelected || '0',
      muiComponentProps: {
        disabled: true,
      },
      validation: Yup.number()
        .min(0, utils.string.t('claims.typeOfSettlement.errorMin'))
        .max(100, utils.string.t('claims.typeOfSettlement.error')),
    },
    ...(isBordereauFlag
      ? [
          {
            name: 'certificateNumber',
            type: 'text',
            label: utils.string.t('claims.claimInformation.certificateNumber'),
            value: certificateNumber,
            muiComponentProps: {
              classes: {
                root: classes.formInput,
              },
              disabled: isBordereauChecked,
            },
            validation:
              isFormsEdited?.[index]?.formEditedStatus && !isBordereauChecked
                ? Yup.string()
                    .nullable()
                    .required(utils.string.t('validation.required'))
                    .max(17, utils.string.t('claims.claimInformation.validation.maxCerficateNumber'))
                    .when('$validation', (validation, schema) => (validation ? schema : Yup.string()))
                : false,
          },
          {
            type: 'datepicker',
            name: 'certificateInceptionDate',
            label: utils.string.t('claims.claimInformation.certificateInceptionDate'),
            value: certInceptionDate,
            muiComponentProps: {
              fullWidth: true,
              disabled: isBordereauChecked,
            },
            validation: !isBordereauChecked
              ? Yup.date()
                  .nullable()
                  .required(utils.string.t('validation.required'))
                  .test('from', utils.string.t('claims.claimInformation.validation.greaterThenExpDate'), function (value) {
                    return value && this.options.parent.certificateExpiryDate
                      ? moment(value).isSameOrBefore(this.options.parent.certificateExpiryDate)
                      : true;
                  })
                  .when('$validation', (validation, schema) => (validation ? schema : Yup.date().nullable()))
              : false,
            outputFormat: 'iso',
          },
          {
            type: 'datepicker',
            name: 'certificateExpiryDate',
            label: utils.string.t('claims.claimInformation.certificateExpiryDate'),
            value: certExpiryDate,
            muiComponentProps: {
              fullWidth: true,
              disabled: isBordereauChecked,
            },
            validation: !isBordereauChecked
              ? Yup.date()
                  .nullable()
                  .required(utils.string.t('validation.required'))
                  .test('from', utils.string.t('claims.claimInformation.validation.lesserThenIncDate'), function (value) {
                    return value && this.options.parent.certificateInceptionDate
                      ? moment(value).isSameOrAfter(this.options.parent.certificateInceptionDate)
                      : true;
                  })
                  .when('$validation', (validation, schema) => (validation ? schema : Yup.date().nullable()))
              : false,
            outputFormat: 'iso',
          },
          {
            name: 'bordereauClaim',
            type: 'checkbox',
            defaultValue: Boolean(linkPoliciesData?.data?.bordereauClaim),
            muiComponentProps: {
              onChange: (_, value) => {
                setBordereauChecked(value);
              },
            },
          },
          {
            name: 'bordereauPeriod',
            type: 'autocompletemui',
            label: utils.string.t('claims.claimInformation.bordereauPeriod'),
            options: claimBordereauPeriods,
            optionKey: 'id',
            optionLabel: 'name',
            value: bordereauPeriodValue,
            muiComponentProps: {
              disabled: !isBordereauChecked,
            },
            validation: Yup.object()
              .nullable()
              .when('bordereauClaim', {
                is: (val) => val,
                then: Yup.object().nullable().required(utils.string.t('validation.required')),
                otherwise: Yup.object().nullable(),
              }),
          },
        ]
      : []),
    ...(isSectionEnabled
      ? [
          {
            name: 'ugSections',
            type: 'autocompletemui',
            value: linkPoliciesData?.data?.ugSections || null,
            options: policyInfo,
            optionKey: 'id',
            optionLabel: 'name',
            validation: sectionEnabledValidationFlag
              ? Yup.object()
                  .nullable()
                  .required(utils.string.t('validation.required'))
                  .when('$validation', (validation, schema) => (validation ? schema : Yup.object().nullable()))
              : false,
          },
        ]
      : []),
  ];
  if (isPoliciesClientsLoading || isInterestLoading || isPolicySectionLoading || isInsuredLoading) {
    return (
      <FormGrid container spacing={4}>
        {[...new Array(2)].map((item, index) => (
          <Fragment key={`skeleton-${index}`}>
            <FormGrid item xs={12}>
              <Skeleton height={30} width={100} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormGrid container spacing={4}>
                <FormGrid item xs={12} md={4}>
                  <Skeleton height={16} />
                  <Skeleton height={30} variant="rect" />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                  <Skeleton height={16} />
                  <Skeleton height={30} variant="rect" />
                </FormGrid>
                <FormGrid item xs={12} md={4}>
                  <Skeleton height={16} />
                  <Skeleton height={30} variant="rect" />
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </Fragment>
        ))}
      </FormGrid>
    );
  }

  return (
    linkPoliciesData?.searchBy !== '' &&
    linkPoliciesData?.searchTerm !== '' &&
    linkPoliciesData?.loader && (
      <LinkClaimPolicyView
        fields={fields}
        policyData={policyData}
        claimPolicyInsures={claimPolicyInsures}
        allClaimDetails={allClaimDetails}
        originalCurrencyValue={originalCurrencyValue}
        settlementCurrencyValue={settlementCurrencyValue}
        interest={interest}
        uwResetKey={uwResetKey}
        hasClaimRef={false}
        underWritingGroups={underWritingGroups}
        claimPolicyClients={claimPolicyClients}
        isBordereauFlag={isBordereauFlag}
        validation={validation}
        setValidation={setValidation}
        index={index}
        isFormsEdited={isFormsEdited}
        setFormEditedStatus={setFormEditedStatus}
        postSaveHandler={postSaveHandler}
        postEditSaveHandler={postEditSaveHandler}
        saveStatus={saveStatus}
        selectedPolicyRender={selectedPolicyRender}
        handleFormStatus={handleFormStatus}
        stepper={stepper}
        setStepper={setStepper}
        selectNextPolicy={selectNextPolicy}
        postSaveNextHanlder={postSaveNextHanlder}
        claimBordereauPeriods={claimBordereauPeriods}
        fieldsLoader={{
          isPoliciesClientsLoading: isPoliciesClientsLoading,
          isInterestLoading: isInterestLoading,
          isPolicySectionLoading: isPolicySectionLoading,
          isInsuredLoading: isInsuredLoading,
          isBordereauPeriodsLoading: isBordereauPeriodsLoading,
        }}
      />
    )
  );
}
