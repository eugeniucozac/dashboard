import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import debounce from 'lodash/debounce';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';
import uniqBy from 'lodash/uniqBy';

// app
import { PremiumProcessingCasesView } from './PremiumProcessingCases.view';
import config from 'config';
import * as utils from 'utils';
import { FormCheckbox, MultiSelectAsync, MultiSelect, FormDate, Tooltip, Badge } from 'components';
import * as constants from 'consts';
import styles from './PremiumProcessingCases.styles';

import {
  resetSearch,
  getCasesList,
  updateCasesSelected,
  chooseUnchooseCase,
  showModal,
  selectPremiumProcessingSort,
  selectAssignedToUsers,
  casesSelectDeselection,
  selectCasesList,
  postAssignToUser,
  enqueueNotification,
  resetCasesSelected,
  getPiRefData,
  selectUsersInRoles,
  selectPiDepartmentList,
  selectRefDataNewBordereauType,
  selectRefDataNewFacilityType,
  selectcaseFilters,
  selectRefDataNewBpmFlag,
  selectRefDataNewBpmStage,
  selectRefDataNewProcessType,
  updateMultiSelectedRows,
  setMultiSelectRows,
} from 'stores';

// mui
import { Box, makeStyles } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

PremiumProcessingCases.propTypes = {
  loggedUserDetails: PropTypes.array,
};

export default function PremiumProcessingCases({ loggedUserDetails, handlers }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCases' })();

  const dispatch = useDispatch();
  const history = useHistory();
  const showCheckboxes = useSelector((state) => state.premiumProcessing.isMultiSelectEnabled);
  const premiumProcessingSort = useSelector(selectPremiumProcessingSort);
  const assignedToUsersList = useSelector(selectAssignedToUsers);
  const [resetKey, setResetKey] = useState(new Date().getTime());
  const currentUserRole = { id: 1, name: 'PP Technician' };
  const casesList = useSelector(selectCasesList);
  const selectedCases = useSelector((state) => state.premiumProcessing.selected);
  const flagsInRow = casesList?.items?.some((i) =>
    i?.flag?.map((flag) => {
      return (
        flag === constants.QC_FLAG ||
        flag === constants.RP_FLAG ||
        flag === constants.RESUBMITTED_FLAG ||
        flag === constants.REJECTCLOSE_FLAG
      );
    })
  );
  const processTypes = useSelector(selectRefDataNewProcessType) || [];
  const fecUsers = useSelector(selectUsersInRoles);
  const bordereauTypeList = useSelector(selectRefDataNewBordereauType);
  const facilityTypeList = useSelector(selectRefDataNewFacilityType);
  const bpmFlagList = useSelector(selectRefDataNewBpmFlag);
  const bpmStageList = useSelector(selectRefDataNewBpmStage);
  const departmentsList = useSelector(selectPiDepartmentList);
  const selectedFilterDetails = useSelector(selectcaseFilters);
  const isFecUsersLoaded = utils.generic.isValidArray(fecUsers, true);
  const isBordereauTypeList = utils.generic.isValidArray(bordereauTypeList, true);
  const isBpmFlagList = utils.generic.isValidArray(bpmFlagList, true);
  const isBpmStageList = utils.generic.isValidArray(bpmStageList, true);
  const isFacilityTypeList = utils.generic.isValidArray(facilityTypeList, true);

  let optionsDepartments = [];
  let optionsProcessTypes = [];
  let optionsFecUser = [];
  let optionBordereauType = [];
  let optionBpmFlagList = [];
  let optionBpmStageList = [];
  let optionFacilityTypeList = [];
  let slaOverdueList = [
    { id: '1-3', name: '1 - 3 days' },
    { id: '3-5', name: '3 - 5 days' },
    { id: '5-10', name: '5 - 10 days' },
    { id: '10', name: '> 10 days' },
  ];

  let assingnedToDropdownList = [];
  let assignedToFilterOptions = [];
  const defaultFormFields = [
    {
      name: 'inceptionDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'searchInceptionDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'singlevalue',
      type: 'checkbox',
      value: false,
      label: '',
      title: '',
      muiComponentProps: {
        onChange: (name, value) => {
          selectDeSelectCases(value);
        },
      },
    },
    {
      name: 'workInprogress',
      type: 'switch',
      value: false,
      color: 'primary',
      disabled: true,
      muiComponentProps: {
        onChange: (name, value) => {
          toggleClick(value);
        },
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(defaultFormFields);
  const { control, register, reset, watch, setValue, formState } = useForm({ defaultValues });

  const tableColumns = [
    {
      id: 'select',
      label: (
        <Box ml={0.6} mb={-1}>
          <FormCheckbox {...utils.form.getFieldProps(defaultFormFields, 'singlevalue')} control={control} register={register} />
        </Box>
      ),
      visible: false,
    },
    {
      id: 'flag',
      visible: true,
      label: '',
    },
    {
      id: 'department',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.department'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'caseCreatedOn',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.caseCreatedOn'),
      sort: { type: 'date', direction: 'asc' },
    },
    {
      id: 'policyRef',
      visible: true,
      nowrap: true,
      ellipsis: true,
      label: utils.string.t('premiumProcessing.columns.policyRef'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'processName',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.process'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'priority',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.priority'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'assignedToUser',
      visible: true,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.assignedTo'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'caseId',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.caseId'),
      sort: { type: 'number', direction: 'asc' },
    },
    {
      id: 'inceptionDate',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.inceptionDate'),
      sort: { type: 'date', direction: 'asc' },
    },
    {
      id: 'fecName',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.fecName'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'bordereauType',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.bordereauType'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'facilityType',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.facilityType'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'caseStage',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.caseStage'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'nonPremium',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.nonPremium'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'feeAmendments',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.feeAmendments'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'workPackageReference',
      visible: false,
      nowrap: true,
      label: utils.string.t('premiumProcessing.columns.workPackageReference'),
      sort: { type: 'lexical', direction: 'asc' },
    },
  ];

  const handleTableFilterApply = (filterData) => {
    const dataFromSearch = Object.keys(selectedFilterDetails)?.reduce(function (obj, k) {
      if (k === 'riskReference' || k === 'insured' || k === 'caseId' || k === 'searchInceptionDate' || k === 'workPackageReferance') {
        obj[k] = selectedFilterDetails[k];
      }
      return obj;
    }, {});

    filterData = { ...filterData, ...dataFromSearch };
    dispatch(getCasesList({ filters: filterData }));
  };
  /** Event triggers on Table Header checkbox click */
  const selectDeSelectCases = (value) => {
    if (casesList?.items) {
      dispatch(casesSelectDeselection({ checked: value }));
      if (value && casesList?.items?.length > 10) {
        dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseSelectionWarningMessage'), 'warning'));
      }
    }
  };

  const toggleClick = (value) => {
    if (value) {
      dispatch(getCasesList({ checkSigning: true }));
      return;
    }
    dispatch(getCasesList());
  };

  const handleSort = (by, dir) => {
    dispatch(getCasesList({ orderBy: by, direction: dir }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getCasesList({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getCasesList({ size: rowsPerPage }));
  };

  const showCheckboxesHandler = () => {
    dispatch(chooseUnchooseCase());
  };

  const showCheckboxColumnHandler = (value) => {
    dispatch(setMultiSelectRows(value));
  };

  /** Event triggeres on Table Row checkbox click */
  const handleCheckboxClick = (caseData) => {
    dispatch(updateCasesSelected(caseData));
  };
  /** Event triggeres on Table Row checkbox click (NEW) */
  const handleUpdateMultiSelectedRows = (caseData) => {
    dispatch(updateMultiSelectedRows(caseData));
  };

  /** Event triggers to enable/disable MultiSelect option for table  */
  const handleSelectSingleCase = (caseData) => {
    dispatch(updateCasesSelected(caseData));
  };

  const searchSubmit = debounce((query) => {
    // TODO
    if (query.length >= 2 || query.length === 0 || query === '') {
      dispatch(getCasesList({ query }));
    }
  }, config.ui.autocomplete.delay);

  const searchReset = () => {
    // TODO
    setResetKey(new Date().getTime());
    dispatch(resetSearch());
    dispatch(getCasesList());
  };

  const handleCasesFilter = () => {
    // TODO
  };

  const clickRfiQueryResponse = () => {
    // TODO
    if (currentUserRole.name === 'Operation Manager') {
      dispatch(
        showModal({
          component: 'RFI_QUERY_RESPONSE',
          props: {
            title: 'premiumProcessing.rfi.rfiQueryResponse',
            fullWidth: true,
            maxWidth: 'md',
            disableAutoFocus: true,
          },
        })
      );
    } else if (currentUserRole.name === 'PP Technician') {
      dispatch(
        showModal({
          component: 'RFI_QUERY_RESPONSE_LOGS',
          props: {
            title: 'RFI Query Responses Log',
            fullWidth: true,
            maxWidth: 'md',
            disableAutoFocus: true,
          },
        })
      );
    }
  };
  const showAssignedToModal = (displayMessages) => {
    const successMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_SUCCESS_STATUS);
    const failureMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_FAIL_STATUS);
    const juniorTechnicianMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS);
    const crossAssignmentUserMessages = displayMessages?.filter((data) => data.flag === constants.ASSINGED_TO_CROSS_USER_STATUS);

    const width = '80%';
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('premiumProcessing.assignedToModalTitle'),
          hideCompOnBlur: false,
          disableAutoFocus: true,
          maxWidth: 'xs',
          componentProps: {
            hideCancelButton: true,
            confirmLabel: utils.string.t('app.ok'),
            confirmMessage: (
              <Box>
                <ul>
                  {successMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {successMessages[0]?.message}
                        </Box>
                        {/* Mean time using inline styles, going to replace with new modal popup */}
                        <Badge badgeContent={<CheckIcon className={classes.badgeStyle} />} type="success" compact standalone />
                        <Tooltip
                          title={`Case Id : ${successMessages[0]?.caseId?.length > 0 && successMessages[0]?.caseId.join()}`}
                          placement={'top'}
                          arrow={true}
                        >
                          {/* Mean time using inline styles, going to replace with new modal popup */}
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                  {failureMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {failureMessages[0]?.message}
                        </Box>
                        {/* Mean time using inline styles, going to replace with new modal popup */}
                        <Badge badgeContent={<ClearIcon className={classes.badgeStyle} />} type="error" compact standalone />
                        <Tooltip
                          title={`Case Id : ${failureMessages[0]?.caseId?.length > 0 && failureMessages[0]?.caseId.join()}`}
                          placement={'top'}
                          arrow={true}
                        >
                          {/* Mean time using inline styles, going to replace with new modal popup */}
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                  {juniorTechnicianMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {juniorTechnicianMessages[0]?.message}
                        </Box>
                        {/* Mean time using inline styles, going to replace with new modal popup */}
                        <Badge badgeContent={<ClearIcon className={classes.badgeStyle} />} type="error" compact standalone />
                        <Tooltip
                          title={`Case Id : ${
                            juniorTechnicianMessages[0]?.caseId?.length > 0 && juniorTechnicianMessages[0]?.caseId.join()
                          }`}
                          placement={'top'}
                          arrow={true}
                        >
                          {/* Mean time using inline styles, going to replace with new modal popup */}
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                  {crossAssignmentUserMessages?.length > 0 && (
                    <li>
                      <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
                        <Box pr={1} display={'flex'} width={width} alignItems={'center'} justifyContent={'flex-start'}>
                          {crossAssignmentUserMessages[0]?.message}
                        </Box>
                        {/* Mean time using inline styles, going to replace with new modal popup */}
                        <Badge badgeContent={<ClearIcon className={classes.badgeStyle} />} type="error" compact standalone />

                        <Tooltip
                          title={`Case Id : ${
                            crossAssignmentUserMessages[0]?.caseId?.length > 0 && crossAssignmentUserMessages[0]?.caseId.join()
                          }`}
                          placement={'top'}
                          arrow={true}
                        >
                          {/* Mean time using inline styles, going to replace with new modal popup */}
                          <Badge badgeContent={<InfoIcon className={classes.infoStyle} />} type="info" compact standalone />
                        </Tooltip>
                      </Box>
                    </li>
                  )}
                </ul>
              </Box>
            ),
            buttonColors: { confirm: 'secondary' },
            submitHandler: () => {},
            handleClose: () => {},
          },
        },
      })
    );
    dispatch(getCasesList());
    dispatch(resetCasesSelected());
  };
  const handleAssignedUserToCase = async (values, caseRowValues, isBulk) => {
    if (caseRowValues.length > 0) {
      let assignList = assignedToUsersList.filter((a) => a.email === values.id && a.fullName === values.name);
      if (assignList?.length > 0) {
        const response = await dispatch(postAssignToUser({ userDetails: assignList, rowDetails: caseRowValues }));
        if (response && response?.status.toLowerCase() === 'ok') {
          const responseObject = response?.data?.assignCaseRequest;
          const successStatus = utils.generic.isValidArray(responseObject, true)
            ? responseObject.filter((data) => data.status === constants.SUCCESS_STATUS_CASE_ASSIGN)
            : [];
          const failureStatus = utils.generic.isValidArray(responseObject, true)
            ? responseObject.filter(
                (data) =>
                  data.status === constants.FAILURE_STATUS_CASE_ASSIGN &&
                  data?.isJuniorTechnician !== constants.SUCCESS_STATUS_CASE_ASSIGN &&
                  data?.isCrossGroupAssignment !== constants.SUCCESS_STATUS_CASE_ASSIGN
              )
            : [];
          const juniorTechnicianStatus = utils.generic.isValidArray(responseObject, true)
            ? responseObject.filter((data) => data.isJuniorTechnician === constants.SUCCESS_STATUS_CASE_ASSIGN)
            : [];
          const crossGroupAssignmentStatus = utils.generic.isValidArray(responseObject, true)
            ? responseObject.filter((data) => data.isCrossGroupAssignment === constants.SUCCESS_STATUS_CASE_ASSIGN)
            : [];
          let displayAssignedToResponse = [];

          //For Cross user assignment
          if (crossGroupAssignmentStatus?.length > 0) {
            displayAssignedToResponse.push(
              assignedToModalObject(
                constants.ASSINGED_TO_CROSS_USER_STATUS,
                responseObject,
                successStatus,
                failureStatus,
                juniorTechnicianStatus,
                crossGroupAssignmentStatus
              )
            );
          }
          // All success
          if (successStatus?.length > 0 && failureStatus?.length === 0) {
            displayAssignedToResponse.push(
              assignedToModalObject(
                constants.ASSINGED_TO_SUCCESS_STATUS,
                responseObject,
                successStatus,
                failureStatus,
                juniorTechnicianStatus,
                crossGroupAssignmentStatus
              )
            );
          }
          // All failed
          if (successStatus?.length === 0 && failureStatus?.length > 0) {
            displayAssignedToResponse.push(
              assignedToModalObject(
                constants.ASSINGED_TO_FAIL_STATUS,
                responseObject,
                successStatus,
                failureStatus,
                juniorTechnicianStatus,
                crossGroupAssignmentStatus
              )
            );
          }
          if (juniorTechnicianStatus?.length > 0) {
            displayAssignedToResponse.push(
              assignedToModalObject(
                constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS,
                responseObject,
                successStatus,
                failureStatus,
                juniorTechnicianStatus,
                crossGroupAssignmentStatus
              )
            );
          }

          // Mixed some are success and some or failure
          if (successStatus?.length > 0 && failureStatus?.length > 0) {
            displayAssignedToResponse.push(
              assignedToModalObject(
                constants.ASSINGED_TO_SUCCESS_STATUS,
                responseObject,
                successStatus,
                failureStatus,
                juniorTechnicianStatus,
                crossGroupAssignmentStatus
              )
            );
            displayAssignedToResponse.push(
              assignedToModalObject(
                constants.ASSINGED_TO_FAIL_STATUS,
                responseObject,
                successStatus,
                failureStatus,
                juniorTechnicianStatus,
                crossGroupAssignmentStatus
              )
            );
            if (juniorTechnicianStatus?.length > 0) {
              displayAssignedToResponse.push(
                assignedToModalObject(
                  constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS,
                  responseObject,
                  successStatus,
                  failureStatus,
                  juniorTechnicianStatus,
                  crossGroupAssignmentStatus
                )
              );
            }
          }
          showAssignedToModal(displayAssignedToResponse);
        }
      }
    } else {
      dispatch(enqueueNotification(utils.string.t('bulkAssignValiadtion'), 'warning'));
      return;
    }
  };

  const assignedToModalObject = (flagValue, dataList, successStatus, failureStatus, juniorTechnicianStatus, crossGroupAssignmentStatus) => {
    const displayObject = {
      message: '',
      flag: flagValue,
      caseId: [],
    };
    if (flagValue === constants.ASSINGED_TO_SUCCESS_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.casesAssignedSuccessfully', {
        count: successStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.status === constants.SUCCESS_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    } else if (flagValue === constants.ASSINGED_TO_FAIL_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.casesAssignmentFailure', {
        failureCount: failureStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.status === constants.FAILURE_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    } else if (flagValue === constants.ASSINGED_TO_FAIL_JUNIOR_TECHNICIAN_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.caseNotAssignedToJuniorTechnician', {
        juniorTechCount: juniorTechnicianStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.isJuniorTechnician === constants.SUCCESS_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    } else if (flagValue === constants.ASSINGED_TO_CROSS_USER_STATUS) {
      displayObject.message = utils.string.t('premiumProcessing.crossGroupAssignmentStatus', {
        crossGroupCount: crossGroupAssignmentStatus?.length,
      });
      displayObject.caseId = utils.generic.isValidArray(dataList, true)
        ? dataList.filter((data) => data.isCrossGroupAssignment === constants.SUCCESS_STATUS_CASE_ASSIGN).map((a) => a.caseIncidentId)
        : [];
    }
    return displayObject;
  };

  const handleDoubleClickCaseRow = (id) => {
    history.push(`${config.routes.premiumProcessing.case}/${id}/${constants.PREMIUM_PROCESSING_TAB_CASE_DETAILS}`);
  };

  const isDeparmentsLoaded = utils.generic.isValidArray(departmentsList, true);
  const isProcessTypesLoaded = utils.generic.isValidArray(processTypes, true);
  const isAssignedToUserList = utils.generic.isValidArray(assignedToUsersList, true);

  if (isDeparmentsLoaded) {
    optionsDepartments = uniqBy(departmentsList, 'deptID').map((d) => ({ id: d.deptID, name: d.name }));
  }

  const highMediumOptions = [
    { id: utils.string.t('app.yes'), name: utils.string.t('app.high') },
    { id: utils.string.t('app.no'), name: utils.string.t('app.medium') },
  ];
  const yesNoOptions = [
    { id: utils.string.t('app.yes'), name: utils.string.t('app.yes') },
    { id: utils.string.t('app.no'), name: utils.string.t('app.no') },
  ];

  if (isProcessTypesLoaded) {
    optionsProcessTypes = processTypes
      .filter((type) => type.businessProcessID === 1 && type.businessProcessID === 1 && type.processTypeID !== 6)
      .map((data) => ({
        id: data.processTypeID,
        name: data.processTypeDetails,
      }));
  }

  /** Converting the Assigned To list values with ID and NAME attributes */
  if (isAssignedToUserList) {
    if (utils.generic.isValidArray(assignedToUsersList, true)) {
      assignedToFilterOptions = [];
      assingnedToDropdownList = assignedToUsersList?.map((item) => {
        assignedToFilterOptions.push({ id: item.email, name: item.fullName });
        return { id: item.email, name: item.fullName, toolTipTitle: item.email };
      });
    }
  }
  if (isFacilityTypeList) {
    optionFacilityTypeList = facilityTypeList.map((type) => ({
      id: type.facilityTypeID,
      name: type.facilityTypeDetails,
    }));
  }
  if (isFecUsersLoaded) {
    optionsFecUser = fecUsers.map((type) => ({
      id: type.userId,
      name: type.fullName,
    }));
  }

  if (isBordereauTypeList) {
    optionBordereauType = bordereauTypeList.map((type) => ({
      id: type.bordereauTypeID,
      name: type.bordereauTypeDetails,
    }));
  }
  if (isBpmFlagList) {
    optionBpmFlagList = uniqBy(bpmFlagList, 'bpmFlagName').map((d, index) => ({ id: d.bpmFlagCode, name: d.bpmFlagName }));
  }
  if (isBpmStageList) {
    optionBpmStageList = uniqBy(bpmStageList, 'bpmStageName').map((d, index) => ({ id: d.bpmStageCode, name: d.bpmStageName }));
  }
  const fetchAsyncInsuredCoverHolder = useCallback(
    async (searchTerm) => {
      const results = await dispatch(getPiRefData('assureds', searchTerm));
      const resultsParsed = (utils.generic.isValidArray(results) ? results : []).map((item) => ({
        id: item,
        name: item,
      }));
      return resultsParsed;
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const fetchAsyncProcessingInstructionId = useCallback(
    async (searchTerm) => {
      const results = await dispatch(getPiRefData('ids', searchTerm));
      const resultsParsed = (utils.generic.isValidArray(results) ? results : []).map((item) => ({
        id: item,
        name: item,
      }));

      return resultsParsed;
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const handleTableFilterReset = () => {
    reset();
    dispatch(getCasesList({ filters: {} }));
  };
  const tableFilterFields = [
    {
      id: 'departmentId',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.department'),
      value: [],
      options: optionsDepartments,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="departmentId" search options={optionsDepartments} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.priority'),
      value: [],
      options: highMediumOptions,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="priority" search options={highMediumOptions} />,
    },
    {
      id: 'process',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.process'),
      value: [],
      options: optionsProcessTypes,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="process" search options={optionsProcessTypes} />,
    },
    {
      id: 'assignedTo',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.assignedTo'),
      value: [],
      options: assingnedToDropdownList,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="assignedTo" search options={assingnedToDropdownList} />,
    },

    {
      id: 'nonPremium',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.nonPremium'),
      value: [],
      options: yesNoOptions,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="nonPremium" search options={yesNoOptions} />,
    },
    {
      id: 'facilityType',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.facilityType'),
      value: [],
      options: optionFacilityTypeList,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="facilityType" search options={optionFacilityTypeList} />,
    },
    {
      id: 'bordereauType',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.bordereauType'),
      value: [],
      options: optionBordereauType,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="bordereauType" search options={optionBordereauType} />,
    },
    {
      id: 'insured',
      type: 'multiSelectAsync',
      label: utils.string.t('claims.insured'),
      value: [],
      nestedClasses: { root: classes.fieldWidth },
      content: (
        <MultiSelectAsync
          id="insured"
          max={5}
          searchMinChars={4}
          placeholder={utils.string.t('app.search')}
          labels={{ hint: utils.string.t('premiumProcessing.filters.hintInsured') }}
          handlers={{
            fetch: fetchAsyncInsuredCoverHolder,
          }}
        />
      ),
    },
    {
      id: 'processingInstructionId',
      type: 'multiSelectAsync',
      label: utils.string.t('premiumProcessing.filters.processingInstructionName'),
      value: [],
      nestedClasses: { root: classes.fieldWidth },
      content: (
        <MultiSelectAsync
          id="processingInstructionId"
          max={5}
          searchMinChars={4}
          placeholder={utils.string.t('app.search')}
          labels={{ hint: utils.string.t('premiumProcessing.filters.hintProcessingInstruction') }}
          handlers={{
            fetch: fetchAsyncProcessingInstructionId,
          }}
        />
      ),
    },
    {
      id: 'caseStage',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.caseStage'),
      value: [],
      options: optionBpmStageList,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="caseStage" search options={optionBpmStageList} />,
    },
    {
      id: 'fecName',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.fecName'),
      value: [],
      options: optionsFecUser,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="fecName" search options={optionsFecUser} />,
    },
    {
      id: 'ppc',
      type: 'multiSelect',
      label: utils.string.t('processingInstructions.details.ppwPPC'),
      value: [],
      options: yesNoOptions,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="ppc" search options={yesNoOptions} />,
    },
    {
      id: 'flag',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.flags'),
      value: [],
      options: optionBpmFlagList,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="flag" search options={optionBpmFlagList} />,
    },
    {
      id: 'slaOverdue',
      type: 'multiSelect',
      label: utils.string.t('premiumProcessing.columns.slaOverdue'),
      value: [],
      options: slaOverdueList,
      nestedClasses: { root: classes.fieldWidth },
      content: <MultiSelect id="slaOverdue" search options={slaOverdueList} />,
    },
    {
      id: 'inceptionDate',
      type: 'datepicker',
      label: utils.string.t('premiumProcessing.columns.inceptionDate'),
      value: '',
      nestedClasses: { root: classes.fieldWidth },
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultFormFields, 'inceptionDate')}
          id="datepicker"
          label={''}
          plainText
          plainTextIcon
          placeholder={utils.string.t('app.selectDate')}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          muiPickerProps={{
            disableToolbar: true,
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },
  ];

  return (
    <>
      <PremiumProcessingCasesView
        resetKey={resetKey}
        flagsInRow={flagsInRow}
        columnsData={tableColumns}
        cases={casesList?.items}
        tabSelectionView={casesList?.type}
        selectedCases={selectedCases}
        showCheckboxes={showCheckboxes}
        userRoleDetails={loggedUserDetails}
        pagination={{
          page: casesList?.page - 1,
          rowsTotal: casesList?.itemsTotal,
          rowsPerPage: casesList?.pageSize,
        }}
        defaultFormFields={defaultFormFields}
        sort={premiumProcessingSort}
        tableFilterFields={tableFilterFields}
        selectedFilterDetails={selectedFilterDetails}
        control={control}
        register={register}
        watch={watch}
        setValue={setValue}
        formState={formState}
        assingnedToDropdownList={assingnedToDropdownList}
        handlers={{
          searchSubmit,
          searchReset,
          changePage: handleChangePage,
          handleDoubleClickCaseRow: handleDoubleClickCaseRow,
          changeRowsPerPage: handleChangeRowsPerPage,
          sortColumn: handleSort,
          checkboxClick: handleCheckboxClick,
          updateMultiSelectedRows: handleUpdateMultiSelectedRows,
          selectSingleCase: handleSelectSingleCase,
          casesFilter: handleCasesFilter,
          showCheckboxesHandler: showCheckboxesHandler,
          showCheckboxColumnHandler: showCheckboxColumnHandler,
          clickRfiQueryResponse,
          assignedUsersToCase: handleAssignedUserToCase,
          tableFilterReset: handleTableFilterReset,
          tableFilterApply: handleTableFilterApply,
        }}
      />
    </>
  );
}
