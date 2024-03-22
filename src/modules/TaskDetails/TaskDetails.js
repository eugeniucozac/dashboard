import { React, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory, useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import get from 'lodash/get';
import moment from 'moment';
import * as Yup from 'yup';

//app
import { TaskDetailsView } from './TaskDetails.view';
import * as utils from 'utils';
import {
  SANCTIONS_CHECK_STATUSES,
  CLAIM_PROCESSING_REQ_TYPES,
  CURRENCY_PURCHASED_STATUS,
  TASK_TEAM_TYPE,
  CLAIM_SECTION_ENABLED_UG,
} from 'consts';
import styles from './TaskDetails.styles';
import {
  closeSanctionsCheck,
  selectCurrencyPurchasedValue,
  selectClaimsInformation,
  selectLossInformation,
  selectClaimsPolicyInformation,
  selectClaimsInterest,
  selectClaimInfoIsLoading,
  selectPolicyInfoIsLoading,
  selectLossInfoIsLoading,
  selectPolicySectionIsLoading,
  selectCatCodes,
  selectClaimsPolicySections,
  selectIsTaskDashboardTaskDetailsLoading,
  showModal,
  getSanctionsCheckStatus,
  selectSanctionsCheckStatus,
  getClaimsTasksProcessingList,
} from 'stores';
import config from 'config';
import * as constants from 'consts';

//mui
import { makeStyles } from '@material-ui/core';

TaskDetails.propTypes = {
  taskObj: PropTypes.object.isRequired,
  isDirtyRef: PropTypes.bool.isRequired,
  setIsDirty: PropTypes.func.isRequired,
  handleDirtyCheck: PropTypes.func.isRequired,
};

export default function TaskDetails({ taskObj, isDirtyRef, setIsDirty, handleDirtyCheck }) {
  const currencyPurchased = useSelector(selectCurrencyPurchasedValue);
  const [currencyValue, setCurrencyValue] = useState(currencyPurchased);
  const location = useLocation();
  const claimsInformation = useSelector(selectClaimsInformation);
  const lossInformation = useSelector(selectLossInformation);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const interests = useSelector(selectClaimsInterest)?.items;
  const isClaimInfoLoading = useSelector(selectClaimInfoIsLoading);
  const isLossInfoLoading = useSelector(selectLossInfoIsLoading);
  const isPolicyInfoLoading = useSelector(selectPolicyInfoIsLoading);
  const isPolicySectionLoading = useSelector(selectPolicySectionIsLoading);
  const isTaskDetailsLoading = useSelector(selectIsTaskDashboardTaskDetailsLoading);

  const catCodes = useSelector(selectCatCodes);
  const catCode = catCodes.find((item) => Number(item.id) === lossInformation.catCodesID)?.description;
  const policySections = useSelector(selectClaimsPolicySections);
  const sanctionCheckStatus = useSelector(selectSanctionsCheckStatus);

  const isInflightLoss = lossInformation?.isInflighLoss === 1;
  const isSectionEnabled = CLAIM_SECTION_ENABLED_UG.indexOf(policyInformation.policyType) > -1 || false;
  const origCurrencies = useSelector((state) => get(state, 'referenceData.currencyCodes'));
  const countriesList = useSelector((state) => get(state, 'referenceData.countriesList'));

  const isTaskSanctionsCheck = taskObj?.taskDefKey === constants.SANCTIONS_CHECK_KEY;

  const underWritingInfo = {
    items: claimsInformation?.policyUnderWritingGroupDtoList,
    isLoading: isClaimInfoLoading,
    basisOfOrder:
      claimsInformation?.basisOfOrder?.toString() === '0'
        ? utils.string.t('claims.typeOfSettlement.ourShare')
        : utils.string.t('claims.typeOfSettlement.oneHundredPercent'),
    movementType: claimsInformation?.movementType,
    orderPercentage: claimsInformation?.orderPercentage,
    isPolicySectionLoading: isPolicySectionLoading,
    policySectionInfo: !isSectionEnabled
      ? 'NA'
      : !claimsInformation?.policySectionID
      ? utils.string.t('app.all')
      : policySections?.find((sec) => sec?.id?.toString() === claimsInformation?.policySectionID?.toString())?.name,
  };

  const getCurrencyName = (currencyCode) => {
    const currencyName = origCurrencies?.find(
      (currency) => currency?.currencyCd?.toLowerCase() === currencyCode?.toLowerCase()
    )?.currencyName;
    return `${currencyCode} - ${currencyName}`;
  };

  const getCountryName = (countryCode) => {
    const countryName = countriesList?.find((country) => country?.countryCode?.toLowerCase() === countryCode?.toLowerCase())?.countryName;
    return countryName;
  };
  const lossInfo = [
    { title: utils.string.t('claims.lossInformation.ref'), value: lossInformation?.lossRef },
    {
      title: utils.string.t('claims.lossInformation.fromDate'),
      value: lossInformation?.fromDate && moment(lossInformation?.fromDate).format(config.ui.format.date.slashNumeric),
    },
    {
      title: utils.string.t('claims.lossInformation.toDate'),
      value: lossInformation?.toDate && moment(lossInformation?.toDate).format(config.ui.format.date.slashNumeric),
    },
    { title: utils.string.t('claims.lossInformation.name'), value: lossInformation?.lossName },
    {
      title: utils.string.t('claims.lossInformation.dateAndTime'),
      value:
        (lossInformation?.firstContactDate &&
          moment(lossInformation?.firstContactDate).format(config.ui.format.date.slashNumericDateAndTime)) ||
        (isInflightLoss ? 'NA' : ''),
    },
    { title: utils.string.t('claims.lossInformation.assignedTo'), value: lossInformation?.assignedToName || (isInflightLoss ? 'NA' : '') },
    { title: utils.string.t('claims.lossInformation.details'), value: lossInformation?.lossDescription },
    { title: utils.string.t('claims.lossInformation.catCode'), value: catCode },
  ];
  const claimInfo = [
    { title: utils.string.t('claims.claimInformation.claimRef'), value: claimsInformation?.claimReference },
    {
      title: utils.string.t('claims.claimInformation.claimReceivedDateTime'),
      value:
        claimsInformation?.claimReceivedDate && moment(claimsInformation?.claimReceivedDate).format(config.ui.format.date.slashNumeric),
    },
    { title: utils.string.t('claims.claimInformation.claimant'), value: claimsInformation?.claimantName },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateFrom'),
      value: claimsInformation?.lossFromDate && moment(claimsInformation?.lossToDate).format(config.ui.format.date.slashNumericDateAndTime),
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.lossDateTo'),
      value: claimsInformation?.lossToDate && moment(claimsInformation?.lossToDate).format(config.ui.format.date.slashNumericDateAndTime),
    },
    { title: utils.string.t('claims.claimInformation.lossQualifier'), value: claimsInformation?.lossQualifierName },
    { title: utils.string.t('claims.claimInformation.location'), value: claimsInformation?.location },
    { title: utils.string.t('claims.claimInformation.fguNarrative'), value: claimsInformation?.fgunarrative },
    { title: utils.string.t('claims.claimInformation.priority'), value: claimsInformation?.priorityDescription },
    {
      title: utils.string.t('claims.claimInformation.adjustorType'),
      value:
        claimsInformation?.beAdjusterID === 0
          ? utils.string.t('claims.claimInformation.nonBeAdjuster')
          : utils.string.t('claims.claimInformation.beAdjuster'),
    },
    {
      title: utils.string.t('claims.claimInformation.adjustorName'),
      value: claimsInformation?.beAdjusterID !== 0 ? claimsInformation.adjusterName : claimsInformation.nonBEAdjusterName,
    },

    { title: utils.string.t('claims.claimInformation.adjustorRef'), value: claimsInformation?.adjusterReference },
    { title: utils.string.t('claims.claimInformation.complexityBasis'), value: claimsInformation?.complexity },
    { title: utils.string.t('claims.claimInformation.referral'), value: claimsInformation?.referralValue },
    { title: utils.string.t('claims.claimInformation.rfiResponse'), value: claimsInformation?.referralResponseDescription },
    { title: utils.string.t('claims.claimInformation.claimStatus'), value: claimsInformation?.claimStatus },
  ];
  const policyInfo = [
    {
      title: utils.string.t('claims.columns.claimsManagement.policyRef'),
      value: policyInformation?.policyRef,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.policyType'),
      value: policyInformation?.policyType,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.policyStatus'),
      value: policyInformation?.statusCode,
      isLoading: isPolicyInfoLoading,
    },
    { title: utils.string.t('claims.columns.claimsManagement.company'), value: policyInformation?.company, isLoading: isPolicyInfoLoading },
    {
      title: utils.string.t('claims.columns.claimsManagement.division'),
      value: policyInformation?.division,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.riskDetails'),
      value: policyInformation?.policyNote,
      isLoading: isPolicyInfoLoading,
    },
    { title: utils.string.t('claims.columns.claimsManagement.client'), value: policyInformation?.client, isLoading: isPolicyInfoLoading },
    { title: utils.string.t('claims.columns.claimsManagement.insured'), value: policyInformation?.insured, isLoading: isPolicyInfoLoading },
    {
      title: utils.string.t('claims.columns.claimsManagement.reinsured'),
      value: policyInformation?.reInsured,
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.inceptionDate'),
      value:
        policyInformation?.inceptionDate && moment(policyInformation?.inceptionDate).format(config.ui.format.date.slashNumericDateAndTime),
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.searchPolicy.columns.expiryDate'),
      value: policyInformation?.expiryDate && moment(policyInformation?.expiryDate).format(config.ui.format.date.slashNumericDateAndTime),
      isLoading: isPolicyInfoLoading,
    },
    {
      title: utils.string.t('claims.columns.claimsManagement.interest'),
      value: interests?.find((item) => item.policyInterestID === claimsInformation.policyInterestID)?.description,
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.bordereauClaim'),
      value: claimsInformation?.bordereauClaim === 1 ? 'Yes' : 'No',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.certificateInceptionDate'),
      value: claimsInformation?.isBordereau
        ? claimsInformation?.certificateInceptionDate &&
          moment(claimsInformation?.certificateInceptionDate).format(config.ui.format.date.slashNumericDateAndTime)
        : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.certificateExpiryDate'),
      value: claimsInformation?.isBordereau
        ? claimsInformation?.certificateExpiryDate &&
          moment(claimsInformation?.certificateExpiryDate).format(config.ui.format.date.slashNumericDateAndTime)
        : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.certificateNumber'),
      value: claimsInformation?.isBordereau ? claimsInformation?.certificateNumber : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.bordereauPeriod'),
      value: claimsInformation?.bordereauClaim === 1 ? claimsInformation?.bordereauPeriod : 'NA',
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.country'),
      value: claimsInformation?.settlementCountry && getCountryName(claimsInformation?.settlementCountry),
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.originalCurrency'),
      value: claimsInformation?.originalCurrency && getCurrencyName(claimsInformation?.originalCurrency),
      isLoading: isClaimInfoLoading,
    },
    {
      title: utils.string.t('claims.claimInformation.settlementCurrency'),
      value: claimsInformation?.settlementCurrencyCode && getCurrencyName(claimsInformation?.settlementCurrencyCode),
      isLoading: isClaimInfoLoading,
    },
  ];
  const underWritingGroupColumns = [
    {
      id: 'groupRef',
      label: utils.string.t('claims.underWritingGroups.groupRef'),
    },
    {
      id: 'percentage',
      label: utils.string.t('claims.underWritingGroups.percentage'),
    },
    {
      id: 'facility',
      label: utils.string.t('claims.underWritingGroups.facility'),
    },
    {
      id: 'facilityRef',
      label: utils.string.t('claims.underWritingGroups.facilityRef'),
    },
    {
      id: 'slipLeader',
      label: utils.string.t('claims.underWritingGroups.slipLeader'),
    },
    {
      id: 'ucr',
      label: utils.string.t('claims.underWritingGroups.ucr'),
    },
    {
      id: 'narrative',
      label: utils.string.t('claims.underWritingGroups.narrative'),
    },
    {
      id: 'dateValidFrom',
      label: utils.string.t('claims.underWritingGroups.dateValidFrom'),
    },
    {
      id: 'dateValidTo',
      label: utils.string.t('claims.underWritingGroups.dateValidTo'),
    },
  ];
  const taskInfo = [
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.taskRef'),
      value: taskObj?.taskRef,
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.targetDueDate'),
      value: taskObj?.targetDueDate && moment(taskObj?.targetDueDate).format(config.ui.format.date.text),
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.status'),
      value: taskObj?.status,
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.taskType'),
      value: taskObj?.taskType,
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.assignedTo'),
      value: taskObj?.assigneeFullName,
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.priority'),
      value: taskObj?.priority,
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    {
      title: utils.string.t('claims.processing.taskDetailsLabels.dateCreated'),
      value: taskObj?.createdOn && moment(taskObj?.createdOn).format(config.ui.format.date.text),
      isLoading: isTaskDetailsLoading,
      colsUpdate: true,
    },
    ...(isTaskSanctionsCheck
      ? [
          {
            title: utils.string.t('claims.processing.taskDetailsLabels.sanctionsCheckStatus'),
            value: sanctionCheckStatus?.value,
            isLoading: isTaskDetailsLoading,
            colsUpdate: true,
          },
        ]
      : []),
  ];
  const history = useHistory();
  const dispatch = useDispatch();
  const classes = makeStyles(styles, { name: 'TaskDetails' })();

  const fields = [
    {
      name: 'currencyPurchasedRadio',
      type: 'radio',
      value: currencyValue,
      defaultValue: currencyValue,
      muiFormGroupProps: {
        row: true,
        classes: {
          root: classes.radioLabel,
        },
      },
      options: [
        { value: CURRENCY_PURCHASED_STATUS.Yes, label: utils.string.t('claims.processing.taskDetailsLabels.yes') },
        { value: CURRENCY_PURCHASED_STATUS.No, label: utils.string.t('claims.processing.taskDetailsLabels.no') },
        {
          value: CURRENCY_PURCHASED_STATUS.notRequired,
          label: utils.string.t('claims.processing.taskDetailsLabels.notRequired'),
        },
      ],
    },
    {
      name: 'sanctionsCheckState',
      type: 'radio',
      defaultValue: SANCTIONS_CHECK_STATUSES.approved,
      muiFormGroupProps: {
        row: true,
        classes: {
          root: classes.radioLabel,
        },
      },
      options: [
        { value: SANCTIONS_CHECK_STATUSES.approved, label: utils.string.t('status.approved') },
        { value: SANCTIONS_CHECK_STATUSES.rejected, label: utils.string.t('status.rejected') },
      ],
    },
    {
      name: 'comments',
      type: 'text',
      defaultValue: '',
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 3,
      },
      validation: Yup.string().when('sanctionsCheckState', {
        is: (val) => val === SANCTIONS_CHECK_STATUSES.rejected,
        then: Yup.string().required(utils.string.t('claims.processing.taskDetailsLabels.minimumRequirement')),
        otherwise: Yup.string().nullable(),
      }),
    },
    {
      name: 'details',
      type: 'text',
      defaultValue: '',
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 3,
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const {
    control,
    watch,
    setValue,
    getValues,
    formState: { isDirty },
    handleSubmit,
    errors,
  } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  useEffect(() => {
    if (currencyPurchased !== '') {
      setValue('currencyPurchasedRadio', currencyPurchased);
      setCurrencyValue(currencyPurchased);
    }
  }, [currencyPurchased]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getSanctionsCheckStatus(taskObj?.rootProcessId));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const currencyPurchasedValue = watch('currencyPurchasedRadio');
  const sanctionsCheckState = watch('sanctionsCheckState');
  const comments = watch('comments');

  const searchTypeCall = CLAIM_PROCESSING_REQ_TYPES.search;
  const filterTypeCall = CLAIM_PROCESSING_REQ_TYPES.filter;

  const handleCloseCallBack = () => {
    location?.state?.redirectUrl ? history.push(location?.state?.redirectUrl) : history.push(config.routes.claimsFNOL.root);
    const taskType = location?.state?.isTaskTeam ? TASK_TEAM_TYPE.myTeam : TASK_TEAM_TYPE.myTask;
    dispatch(getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType }));
    dispatch(getClaimsTasksProcessingList({ requestType: filterTypeCall, taskType }));
  };

  const handleClose = () => {
    const params = {
      sanctionsResult: sanctionsCheckState,
      taskId: taskObj?.taskId,
      resolutionComments: comments,
      caseIncidentID: taskObj?.caseIncidentID,
      processId: taskObj?.processId,
    };
    dispatch(closeSanctionsCheck(params, handleCloseCallBack));
  };
  const handleCancel = () => {
    if (isDirty) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('status.alert'),
            hint: utils.string.t('claims.notes.notifications.alertPopup'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                location?.state?.redirectUrl ? history.push(location?.state?.redirectUrl) : history.push(config.routes.claimsFNOL.root);
              },
            },
          },
        })
      );
    } else {
      location?.state?.redirectUrl ? history.push(location?.state?.redirectUrl) : history.push(config.routes.claimsFNOL.root);
    }
  };
  const isAnyClaimSubmitted = lossInformation?.isAnyClaimSubmitted;
  // This is used to check any claim is submitted for particular loss
  const handleEditLoss = () => {
    history.push({
      pathname: `${config.routes.claimsFNOL.newLoss}`,
      state: {
        redirectUrl: `${config.routes.claimsFNOL.task}/${taskObj?.taskRef}`,
        loss: { isNextDiabled: true, isClaimSubmitted: isAnyClaimSubmitted },
      },
    });
  };
  return (
    <TaskDetailsView
      taskObj={taskObj}
      fields={fields}
      currencyPurchasedValue={currencyPurchasedValue}
      control={control}
      currencyValue={currencyValue}
      handlers={{ handleClose, setCurrencyValue, handleCancel }}
      lossInfo={lossInfo?.map((info) => ({
        ...info,
        isLoading: isLossInfoLoading,
      }))}
      policyInfo={policyInfo}
      claimInfo={claimInfo?.map((info) => ({
        ...info,
        isLoading: isClaimInfoLoading,
      }))}
      taskInfo={taskInfo}
      underWritingInfo={underWritingInfo}
      underWritingGroupColumns={underWritingGroupColumns}
      isTaskDetailsLoading={isTaskDetailsLoading}
      isDirtyRef={isDirtyRef}
      setIsDirty={setIsDirty}
      handleDirtyCheck={handleDirtyCheck}
      handleSubmit={handleSubmit}
      errors={errors}
      getValues={getValues}
      setValue={setValue}
      sanctionCheckStatus={sanctionCheckStatus}
      handleEditLoss={handleEditLoss}
    />
  );
}
