import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import get from 'lodash/get';

//app
import {
  showModal,
  hideModal,
  selectClaimsTasksProcessingFilterLoading,
  selectClaimsTasksProcessingFilterValues,
  selectPremiumProcessingFilterValues,
  selectClaimsTasksProcessing,
  selectedClaimsProcessingTaskType,
  selectedPremiumProcessingTaskType,
  selectEditAdhocTaskStatus,
  getClaimsTasksProcessing,
  resetClaimsProcessingTasksItems,
  resetClaimsProcessingTasksFilters,
  resetClaimsProcessingTaskSearch,
  resetPremiumProcessingTaskSearch,
  selectCasesList,
  getPremiumProcessingTasksDetails,
  getTaskCaseViewType,
  selectMultiSelectedCase,
  selectUser,
  resetPremiumProcessingTasksFilters,
  enqueueNotification,
  resetPremiumProcessingTaskDetails,
  collapseNav,
  udpateIsCheckSigningToggle,
  selectTaskGridLoadingFlag,
} from 'stores';
import { TasksManagementView } from './TasksManagement.view';
import styles from './TasksManagement.styles';
import { MultiSelect, FormDate } from 'components';
import * as utils from 'utils';
import { useFlexiColumns } from 'hooks';
import {
  TEAM_TASKS_SPECIFIC_COLUMNS,
  TASK_TEAM_TYPE,
  TASKS_SEARCH_OPTION_PROCESS_REF,
  TASKS_SEARCH_OPTION_DESCRIPTION,
  TASKS_SEARCH_OPTION_TASKI_REF,
  CLAIM_PROCESSING_REQ_TYPES,
  API_RESPONSE_OK,
  TASKS_SEARCH_OPTION_WORK_PACKAGE_REFERENCE,
} from 'consts';
import config from 'config';

//mui
import { makeStyles } from '@material-ui/core';

TasksManagement.propTypes = {
  isPremiumProcessing: PropTypes.bool,
  premiumProcessingSaveAssigneeDetails: PropTypes.func,
};
export default function TasksManagement({ isPremiumProcessing = false, premiumProcessingSaveAssigneeDetails }) {
  const classes = makeStyles(styles, { name: 'TasksManagement' })();
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();
  const claimsTasksProcessing = useSelector(selectClaimsTasksProcessing);
  const claimsTasksProcessingFilters = useSelector(selectClaimsTasksProcessingFilterValues);
  const editAdhocStatus = useSelector(selectEditAdhocTaskStatus);
  const premiumProcessingCaseList = useSelector(selectCasesList);
  const premiumProcessingFilters = useSelector(selectPremiumProcessingFilterValues);
  const loggedUserDetails = useSelector(selectUser);
  const userRoleDetails = loggedUserDetails?.userRole;
  const uiNavExpanded = useSelector((state) => get(state, 'ui.nav.expanded'));
  const isTaskGridLoading = useSelector(selectTaskGridLoadingFlag);

  const [isCheckSigningValue, setIsCheckSigningValue] = useState(false);
  const ppMultiSelectedCasesList = useSelector(selectMultiSelectedCase);
  const isFetchingFilters = useSelector(selectClaimsTasksProcessingFilterLoading);

  const [newPage, setNewPage] = useState(0);
  const [searchByText, setSearchByText] = useState(utils.string.t('claims.searchByTasks.options.TaskRef'));
  const [resetKey, setResetKey] = useState();

  let selectedTaskViewType = TASK_TEAM_TYPE.myTask;
  if (
    isPremiumProcessing &&
    utils.generic.isValidArray(userRoleDetails, true) &&
    (utils.user.isSeniorManager(userRoleDetails[0]) || utils.user.isAdminUser(userRoleDetails[0]))
  ) {
    selectedTaskViewType = TASK_TEAM_TYPE.myTeam;
  }

  const [taskType, setTaskType] = useState(
    isPremiumProcessing ? selectedTaskViewType : claimsTasksProcessing.taskType || TASK_TEAM_TYPE.myTask
  );
  const [isTaskTeam, setIsTaskTeam] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchTypeCall = CLAIM_PROCESSING_REQ_TYPES.search;
  const filterTypeCall = CLAIM_PROCESSING_REQ_TYPES.filter;

  const { refId, refType } = params;

  const selectOptions = [
    { label: utils.string.t('claims.searchByTasks.options.TaskRef'), value: TASKS_SEARCH_OPTION_TASKI_REF },
    {
      label: isPremiumProcessing
        ? utils.string.t('claims.searchByTasks.options.riskRef')
        : utils.string.t('claims.searchByTasks.options.ClaimRef'),
      value: TASKS_SEARCH_OPTION_PROCESS_REF,
    },
    { label: utils.string.t('claims.searchByTasks.options.Description'), value: TASKS_SEARCH_OPTION_DESCRIPTION },
    ...(isCheckSigningValue
      ? [
          {
            label: utils.string.t('claims.searchByTasks.options.workPackage'),
            value: TASKS_SEARCH_OPTION_WORK_PACKAGE_REFERENCE,
          },
        ]
      : []),
  ];

  let taskTypeOptions = [
    { value: 'myTask', label: utils.string.t('claims.processing.myTasks') },
    { value: 'myTeam', label: utils.string.t('claims.processing.myTeamTasks') },
    ...(isPremiumProcessing ? [{ value: 'taskHistory', label: utils.string.t('claims.processing.tasksHistory') }] : []),
  ];
  if (isPremiumProcessing) {
    if (
      utils.user.isSeniorManager(userRoleDetails?.length > 0 && userRoleDetails[0]) ||
      utils.user.isAdminUser(userRoleDetails?.length > 0 && userRoleDetails[0])
    ) {
      taskTypeOptions = [
        {
          value: 'myTeam',
          label: utils.string.t('claims.processing.myTeamTasks'),
        },
        {
          value: 'taskHistory',
          label: utils.string.t('claims.processing.tasksHistory'),
        },
      ];
    }
  }
  const fields = [
    {
      name: 'taskType',
      type: 'radio',
      value: taskType,
      defaultValue: taskType,
      disabled: isTaskGridLoading,
      muiFormGroupProps: {
        row: true,
        classes: {
          root: classes.radioLabel,
        },
      },
      options: taskTypeOptions,
    },
    { name: isPremiumProcessing ? 'caseCreatedOn' : 'createdOn', type: 'datepicker', value: null },
    { name: 'targetDueDate', type: 'datepicker', value: null },
    { name: 'inceptionDate', type: 'datepicker', value: null },
    {
      name: 'searchType',
      type: 'autocompletemui',
      options: selectOptions,
      value:
        selectOptions?.find((item) =>
          item?.value === isPremiumProcessing ? TASKS_SEARCH_OPTION_TASKI_REF : TASKS_SEARCH_OPTION_PROCESS_REF
        ) || null,
      muiComponentProps: {
        inputProps: {
          title: searchByText || '',
        },
      },
      validation: Yup.object().nullable().required(utils.string.t('validation.required')),
      callback: (event, data) => {
        setSearchByText(data?.label);
      },
    },
  ];

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, watch, setValue } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const taskTypeValue = watch('taskType');
  const watchSearchType = watch('searchType');

  const tableFilterFields = [
    ...(!isPremiumProcessing
      ? [
          {
            id: isPremiumProcessing ? 'caseCreatedOn' : 'createdOn',
            type: 'datepicker',
            label: utils.string.t('claims.processing.tasksGridColumns.dateAndTimeCreated'),
            value: '',
            content: (
              <FormDate
                control={control}
                {...utils.form.getFieldProps(defaultValues, isPremiumProcessing ? 'caseCreatedOn' : 'createdOn')}
                id="creationdatepicker"
                name={isPremiumProcessing ? 'caseCreatedOn' : 'createdOn'}
                type="datepicker"
                value={''}
                label={''}
                plainText
                plainTextIcon
                placeholder={utils.string.t('app.selectDate')}
                muiComponentProps={{
                  fullWidth: false,
                  margin: 'dense',
                }}
                muiPickerProps={{
                  clearable: false,
                  variant: 'inline',
                  format: 'DD-MM-YYYY',
                }}
              />
            ),
          },
        ]
      : []),
    {
      id: 'targetDueDate',
      type: 'datepicker',
      label: utils.string.t('claims.processing.tasksGridColumns.dueDate'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultValues, 'targetDueDate')}
          id="duedatepicker"
          name="targetDueDate"
          type="datepicker"
          value={''}
          label={''}
          plainText
          plainTextIcon
          placeholder={utils.string.t('app.selectDate')}
          muiComponentProps={{
            fullWidth: false,
            margin: 'dense',
          }}
          muiPickerProps={{
            clearable: false,
            variant: 'inline',
            format: 'DD-MM-YYYY',
          }}
        />
      ),
    },

    {
      id: 'taskType',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.taskType'),
      value: [],
      options: isPremiumProcessing ? premiumProcessingFilters?.taskType : claimsTasksProcessingFilters?.taskType,
      content: (
        <MultiSelect
          id="taskType"
          search
          options={isPremiumProcessing ? premiumProcessingFilters?.taskType : claimsTasksProcessingFilters?.taskType}
        />
      ),
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.priority'),
      value: [],
      options: isPremiumProcessing ? premiumProcessingFilters?.priority : claimsTasksProcessingFilters?.priority,
      content: (
        <MultiSelect
          id="priority"
          search
          options={isPremiumProcessing ? premiumProcessingFilters?.priority : claimsTasksProcessingFilters?.priority}
        />
      ),
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.status'),
      value: [],
      options: isPremiumProcessing ? premiumProcessingFilters?.status : claimsTasksProcessingFilters?.status,
      content: (
        <MultiSelect
          id="status"
          search
          options={isPremiumProcessing ? premiumProcessingFilters?.status : claimsTasksProcessingFilters?.status}
        />
      ),
    },
    {
      id: 'assignee',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.assignedTo'),
      value: [],
      options: isPremiumProcessing ? premiumProcessingFilters?.assignee : claimsTasksProcessingFilters?.assignee,
      content: (
        <MultiSelect
          id="assignee"
          search
          options={isPremiumProcessing ? premiumProcessingFilters?.assignee : claimsTasksProcessingFilters?.assignee}
        />
      ),
    },
    ...(!isPremiumProcessing
      ? [
          {
            id: 'additionalAssignee',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.additionalAssignee'),
            value: [],
            options: claimsTasksProcessingFilters?.additionalAssignee,
            content: <MultiSelect id="additionalAssignee" search options={claimsTasksProcessingFilters?.additionalAssignee} />,
          },
        ]
      : [
          {
            id: 'inceptionDate',
            type: 'datepicker',
            label: utils.string.t('claims.processing.tasksGridColumns.inceptionDate'),
            value: '',
            content: (
              <FormDate
                control={control}
                {...utils.form.getFieldProps(defaultValues, 'inceptionDate')}
                id="inceptionDatedatepicker"
                name="inceptionDate"
                type="datepicker"
                value={''}
                label={''}
                plainText
                plainTextIcon
                placeholder={utils.string.t('app.selectDate')}
                muiComponentProps={{
                  fullWidth: false,
                  margin: 'dense',
                }}
                muiPickerProps={{
                  clearable: false,
                  variant: 'inline',
                  format: 'DD-MM-YYYY',
                }}
              />
            ),
          },
          {
            id: 'insuredName',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.insuredName'),
            value: [],
            options: isPremiumProcessing ? premiumProcessingFilters?.assuredName : claimsTasksProcessingFilters?.insuredName,
            content: (
              <MultiSelect
                id="insuredName"
                search
                options={isPremiumProcessing ? premiumProcessingFilters?.assuredName : claimsTasksProcessingFilters?.insuredName}
              />
            ),
          },
          {
            id: 'division',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.division'),
            value: [],
            options: isPremiumProcessing ? premiumProcessingFilters?.division : claimsTasksProcessingFilters?.division,
            content: (
              <MultiSelect
                id="division"
                search
                options={isPremiumProcessing ? premiumProcessingFilters?.division : claimsTasksProcessingFilters?.division}
              />
            ),
          },
          {
            id: 'instructionId',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.instructionId'),
            value: [],
            options: premiumProcessingFilters?.instructionId,
            content: <MultiSelect id="instructionId" search options={premiumProcessingFilters?.instructionId} />,
          },
          {
            id: 'processSubType',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.processSubType'),
            value: [],
            options: premiumProcessingFilters?.processSubType,
            content: <MultiSelect id="processSubType" search options={premiumProcessingFilters?.processSubType} />,
          },
        ]),
    ...(isPremiumProcessing
      ? [
          {
            id: 'ppwOrPpc',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.ppwPPC'),
            value: [],
            options: isPremiumProcessing ? premiumProcessingFilters?.ppwOrPpc : claimsTasksProcessingFilters?.ppwOrPpc,
            nestedClasses: { root: classes.fieldWidth },
            content: (
              <MultiSelect
                id="ppwOrPpc"
                search
                options={isPremiumProcessing ? premiumProcessingFilters?.ppwOrPpc : claimsTasksProcessingFilters?.ppwOrPpc}
              />
            ),
          },
        ]
      : []),
    ...(isPremiumProcessing
      ? [
          {
            id: 'frontEndContact',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.frontEndContact'),
            value: [],
            options: isPremiumProcessing ? premiumProcessingFilters?.frontEndContact : claimsTasksProcessingFilters?.frontEndContact,
            nestedClasses: { root: classes.fieldWidth },
            content: (
              <MultiSelect
                id="frontEndContact"
                search
                options={isPremiumProcessing ? premiumProcessingFilters?.frontEndContact : claimsTasksProcessingFilters?.frontEndContact}
              />
            ),
          },
        ]
      : []),
    ...(isPremiumProcessing
      ? [
          {
            id: 'bordereauType',
            type: 'multiSelect',
            label: utils.string.t('claims.processing.tasksGridColumns.bordereauType'),
            value: [],
            options: isPremiumProcessing ? premiumProcessingFilters?.bordereauType : claimsTasksProcessingFilters?.bordereauType,
            nestedClasses: { root: classes.fieldWidth },
            content: (
              <MultiSelect
                id="bordereauType"
                search
                options={isPremiumProcessing ? premiumProcessingFilters?.bordereauType : claimsTasksProcessingFilters?.bordereauType}
              />
            ),
          },
        ]
      : []),
  ];

  const columns = [
    { id: 'id', empty: true, visible: true },
    {
      id: 'taskRef',
      label: utils.string.t('claims.processing.tasksGridColumns.taskRef'),
      ...(!isPremiumProcessing && {
        sort: { type: 'lexical', direction: 'asc' },
      }),
      nowrap: true,
      visible: true,
      mandatory: !isPremiumProcessing ? true : false,
    },
    {
      id: 'createdOn',
      label: isPremiumProcessing
        ? utils.string.t('claims.processing.tasksGridColumns.dateCreated')
        : utils.string.t('claims.processing.tasksGridColumns.dateAndTimeCreated'),
      ...(!isPremiumProcessing && {
        sort: { type: 'date', direction: 'asc' },
      }),
      nowrap: true,
      visible: true,
      mandatory: !isPremiumProcessing ? true : false,
    },
    {
      id: isPremiumProcessing ? 'taskName' : 'taskType',
      label: utils.string.t('claims.processing.tasksGridColumns.taskName'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'description',
      label: utils.string.t('claims.processing.tasksGridColumns.description'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
      ellipsis: true,
    },
    {
      id: 'targetDueDate',
      label: utils.string.t('claims.processing.tasksGridColumns.targetdueDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: !isPremiumProcessing,
    },
    {
      id: 'processRef',
      label: isPremiumProcessing
        ? utils.string.t('claims.processing.tasksGridColumns.riskRef')
        : utils.string.t('claims.processing.tasksGridColumns.claimRef'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: !isPremiumProcessing,
    },
    {
      id: 'assignee',
      label: utils.string.t('claims.processing.tasksGridColumns.assignedTo'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    ...(!isPremiumProcessing
      ? [
          {
            id: 'additionalAssignee',
            label: utils.string.t('claims.processing.tasksGridColumns.additionalAssignee'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
            visible: isPremiumProcessing ? false : true,
          },
        ]
      : []),
    {
      id: 'priority',
      label: utils.string.t('claims.processing.tasksGridColumns.priority'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'status',
      label: utils.string.t('claims.processing.tasksGridColumns.status'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },

    ...(!isPremiumProcessing
      ? [{ id: 'team', label: utils.string.t('app.team'), sort: { type: 'lexical', direction: 'asc' }, nowrap: true }]
      : []),

    ...(isPremiumProcessing
      ? [
          {
            id: 'inceptionDate',
            label: utils.string.t('claims.processing.tasksGridColumns.inceptionDate'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
            visible: true,
            mandatory: isPremiumProcessing ?? false,
          },
          {
            id: 'assuredName',
            label: utils.string.t('claims.processing.tasksGridColumns.insuredName'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
            visible: true,
            mandatory: isPremiumProcessing ?? false,
          },
          {
            id: 'type',
            label: utils.string.t('claims.processing.tasksGridColumns.type'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
            visible: true,
          },
          {
            id: 'group',
            label: utils.string.t('claims.processing.tasksGridColumns.group'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
          },
          {
            id: 'departmentName',
            label: utils.string.t('claims.processing.tasksGridColumns.division'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
          },
          {
            id: 'processSubType',
            label: utils.string.t('claims.processing.tasksGridColumns.processSubType'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
          },
          {
            id: 'xbInstanceId',
            label: utils.string.t('claims.processing.tasksGridColumns.xbInstance'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
          },
        ]
      : [
          {
            id: 'requestedBy',
            label: utils.string.t('claims.processing.tasksGridColumns.createdBy'),
            sort: { type: 'lexical', direction: 'asc' },
            nowrap: true,
            visible: true,
          },
          { id: 'actions', menu: true, visible: true, mandatory: true },
        ]),
    ...(isPremiumProcessing && taskType === TASK_TEAM_TYPE.myTeam
      ? [
          {
            id: 'actions',
            stickyRight: true,
            visible: true,
            mandatory: false,
          },
        ]
      : []),
  ];

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  let managedTaskColumnsArray =
    utils.generic.isValidArray(columnsArray, true) && taskType === TASK_TEAM_TYPE.myTask
      ? columnsArray?.filter((item) => item.id !== TEAM_TASKS_SPECIFIC_COLUMNS)
      : columnsArray;

  const managedTableFilterFields = !isTaskTeam
    ? tableFilterFields.filter((item) => item.id !== TEAM_TASKS_SPECIFIC_COLUMNS)
    : tableFilterFields;

  const resetFilter = () => {
    setValue('createdOn', null);
    setValue('targetDueDate', null);
    setValue('inceptionDate', null);
    if (isPremiumProcessing) {
      setValue('caseCreatedOn', null);
      dispatch(resetPremiumProcessingTasksFilters);
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          query: searchTerm,
          filterTerm: {},
        })
      );
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: filterTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          query: searchTerm,
          filterTerm: {},
        })
      );
    } else {
      dispatch(resetClaimsProcessingTasksFilters());
      setResetKey(new Date().getTime());
      dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType, query: searchTerm, filterTerm: {} }));
      dispatch(getClaimsTasksProcessing({ requestType: filterTypeCall, taskType, query: searchTerm, filterTerm: {} }));
    }
  };

  const resetSearch = () => {
    if (isPremiumProcessing) {
      dispatch(resetPremiumProcessingTaskSearch());
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          filterTerm: [],
        })
      );
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: filterTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          filterTerm: [],
        })
      );
    } else {
      setValue('createdOn', null);
      setValue('targetDueDate', null);
      dispatch(resetClaimsProcessingTaskSearch());
      setResetKey(new Date().getTime());
      dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType, filterTerm: [] }));
      dispatch(getClaimsTasksProcessing({ requestType: filterTypeCall, taskType, filterTerm: [] }));
    }
  };

  const handleSearch = ({ search, filters }) => {
    setValue('createdOn', null);
    setValue('targetDueDate', null);
    setValue('inceptionDate', null);
    const searchType = watchSearchType?.value || '';

    setSearchTerm(search);

    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          taskType,
          query: search,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          direction: 'desc',
          navigation: false,
        })
      );
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: filterTypeCall,
          taskType,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          query: search,
          direction: 'desc',
          searchType: searchType,
          navigation: false,
        })
      );
    } else {
      setResetKey(new Date().getTime());
      dispatch(
        getClaimsTasksProcessing({
          requestType: searchTypeCall,
          taskType,
          query: search,
          direction: 'asc',
          searchType: searchType,
          navigation: false,
        })
      );
      dispatch(
        getClaimsTasksProcessing({
          requestType: filterTypeCall,
          taskType,
          query: search,
          direction: 'asc',
          searchType: searchType,
          navigation: false,
        })
      );
    }
  };

  const handleSearchFilter = ({ search, filters }) => {
    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          taskType,
          query: search,
          filterTerm: filters,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          navigation: false,
        })
      );
    } else {
      dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType, query: search, filterTerm: filters, navigation: false }));
    }
  };

  const handleChangePage = (newPage) => {
    setNewPage(newPage);
    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          page: newPage,
          query: searchTerm,
          navigation: true,
        })
      );
    } else {
      dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType, page: newPage, query: searchTerm, navigation: true }));
    }
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          taskType,
          size: rowsPerPage,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          query: searchTerm,
          navigation: true,
        })
      );
    } else {
      dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType, size: rowsPerPage, query: searchTerm, navigation: true }));
    }
  };

  const handleSort = (by, dir) => {
    if (isPremiumProcessing) {
      if (by === 'createdOn') {
        // TODO:: This is temparary fix UI and API should have same field name.
        by = 'caseCreatedOn';
      }
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          taskType,
          sortBy: by,
          direction: dir,
          query: searchTerm,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          navigation: false,
        })
      );
    } else {
      dispatch(
        getClaimsTasksProcessing({
          requestType: searchTypeCall,
          taskType,
          sortBy: by,
          direction: dir,
          query: searchTerm,
          navigation: false,
        })
      );
    }
  };

  const refreshTasksGrid = () => {
    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
        })
      );
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: filterTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
        })
      );
    } else {
      dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType }));
      dispatch(getClaimsTasksProcessing({ requestType: filterTypeCall, taskType }));
    }
  };

  const hasTasks = isPremiumProcessing
    ? !isTaskGridLoading && utils.generic.isValidArray(premiumProcessingCaseList?.items, true)
    : utils.generic.isValidArray(claimsTasksProcessing?.items, true);
  const tasksSelected = isPremiumProcessing ? ppMultiSelectedCasesList || [] : claimsTasksProcessing?.selected || [];

  const enableBulkAssign = isPremiumProcessing
    ? utils.generic.isValidArray(ppMultiSelectedCasesList, true) &&
      ppMultiSelectedCasesList.length > 1 &&
      ppMultiSelectedCasesList.length <= 10
    : utils.generic.isValidArray(tasksSelected, true) && tasksSelected.length > 1 && tasksSelected.length <= 10;

  const handleBulkAssign = async () => {
    await dispatch(
      showModal({
        component: 'ADD_ASSIGNEE',
        props: {
          title: utils.string.t('app.assign'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            isPremiumProcessing,
            taskDetails: tasksSelected,
            submitHandler: (data) => {
              refreshTasksGrid();
              if (isPremiumProcessing) {
                premiumProcessingSaveAssigneeResponseHandler(data.premiumProcessingSaveAssigneeResponse);
                //TODO:: premiumProcessingSaveAssigneeDetails();
              }
            },
          },
        },
      })
    );
  };

  const handleUpdateTaskPriority = (task) => {
    dispatch(
      showModal({
        component: 'SET_PRIORITY',
        props: {
          title: utils.string.t('claims.modals.taskFunction.setTaskPriorityTitle'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            task,
            handlers: {
              cancel: () => {
                dispatch(hideModal());
              },
              submit: () => {
                refreshTasksGrid();
                dispatch(hideModal());
              },
            },
          },
        },
      })
    );
  };

  const premiumProcessingSaveAssigneeResponseHandler = (data) => {
    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          filterTerm: [],
        })
      );
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: filterTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          filterTerm: [],
        })
      );
      premiumProcessingSaveAssigneeDetails(data);
    }
  };
  const getPremiumProcessingNotificationDetails = async () => {
    const response = await dispatch(getTaskCaseViewType({ caseId: refId }));
    if (response && response?.status === API_RESPONSE_OK) {
      if (response.data.isCaseIdForLoggedInUser === 0) {
        dispatch(
          enqueueNotification(utils.string.t('premiumProcessing.premiumProcessingNotificationCaseSearch', { id: refId }), 'warning')
        );
        dispatch(resetPremiumProcessingTaskDetails('filter'));
        dispatch(resetPremiumProcessingTaskDetails('search'));
      } else {
        if (response.data.taskType) {
          setValue('taskType', response.data.taskType);
        }
        if (response?.data?.isCheckSigningCaseIndicator === 1) {
          setIsCheckSigningValue(true);
        }
        dispatch(
          getPremiumProcessingTasksDetails({
            requestType: searchTypeCall,
            isCheckSigning: response?.data?.isCheckSigningCaseIndicator === 1 ? true : false,
            taskType: response.data.taskType,
            query: refId,
            direction: 'desc',
            searchType: 'taskRef',
            navigation: false,
            refType: refType,
          })
        );
        dispatch(
          getPremiumProcessingTasksDetails({
            requestType: filterTypeCall,
            isCheckSigning: response?.data?.isCheckSigningCaseIndicator === 1 ? true : false,
            taskType: response.data.taskType,
            query: refId,
            direction: 'desc',
            searchType: 'taskRef',
            navigation: false,
          })
        );
      }
    }
  };
  const resetNotificationFilters = () => {
    setIsCheckSigningValue(false);
    if (isPremiumProcessing) {
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: searchTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          query: '',
          filterTerm: {},
        })
      );
      dispatch(
        getPremiumProcessingTasksDetails({
          requestType: filterTypeCall,
          isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
          taskType,
          query: '',
          filterTerm: {},
        })
      );
      dispatch(resetPremiumProcessingTasksFilters);
      dispatch(resetPremiumProcessingTaskSearch);
      history.push(`${config.routes.premiumProcessing.root}`);
    }
  };
  useEffect(() => {
    const searchType = watchSearchType?.value || '';
    if (refId && !isPremiumProcessing) {
      dispatch(
        getClaimsTasksProcessing({
          requestType: searchTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: refId,
        })
      );
      dispatch(
        getClaimsTasksProcessing({
          requestType: filterTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: refId,
        })
      );
    } else if (refId && isPremiumProcessing) {
      getPremiumProcessingNotificationDetails();
    }
  }, [refId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (taskType && !refId) {
      setValue('taskType', taskType);
      setIsTaskTeam(taskType === TASK_TEAM_TYPE.myTeam);
      setResetKey(tableFilterFields);
      if (isPremiumProcessing) {
        dispatch(
          getPremiumProcessingTasksDetails({
            requestType: searchTypeCall,
            taskType,
            isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
            filterTerm: [],
          })
        );
        dispatch(
          getPremiumProcessingTasksDetails({
            requestType: filterTypeCall,
            taskType,
            isCheckSigning: isCheckSigningValue ? isCheckSigningValue : false,
            filterTerm: [],
          })
        );
      } else {
        setValue('createdOn', null);
        setValue('targetDueDate', null);
        setResetKey(new Date().getTime());
        dispatch(getClaimsTasksProcessing({ requestType: searchTypeCall, taskType, filterTerm: [] }));
        dispatch(getClaimsTasksProcessing({ requestType: filterTypeCall, taskType, filterTerm: [] }));
      }
    }
    return () => {
      dispatch(resetClaimsProcessingTasksItems());
      dispatch(resetClaimsProcessingTasksFilters());
      dispatch(resetClaimsProcessingTaskSearch());
      isPremiumProcessing && dispatch(resetPremiumProcessingTasksFilters);
      isPremiumProcessing && dispatch(resetPremiumProcessingTaskSearch);
    };
  }, [taskType]); // eslint-disable-line react-hooks/exhaustive-deps

  const premiumProcessingManageColumns = () => {
    if (utils.generic.isValidArray(managedTaskColumnsArray, true)) {
      managedTaskColumnsArray?.forEach((data) => {
        if (data.id !== 'id' && data.id !== 'actions') {
          data.visible = false;
        }
        if (
          data.id === 'assuredName' ||
          data.id === 'inceptionDate' ||
          data.id === 'processRef' ||
          data.id === 'departmentName' ||
          data.id === 'processSubType'
        ) {
          data.visible = true;
        }
        if (taskType === TASK_TEAM_TYPE.myTask || taskType === TASK_TEAM_TYPE.myTeam) {
          if (data.id === 'type' || data.id === 'priority' || data.id === 'targetDueDate' || data.id === 'taskName') {
            data.visible = true;
          }
        }

        if (taskType === TASK_TEAM_TYPE.myTeam || taskType === TASK_TEAM_TYPE.taskHistory) {
          if (data.id === 'status' || data.id === 'assignee') {
            data.visible = true;
          }
        }
        if (taskType === TASK_TEAM_TYPE.taskHistory) {
          if (data.id === 'xbInstanceId') {
            data.visible = true;
          }
        }

        if (data.userSelected) {
          data.visible = true;
        }

        if (data.defaultUnselected) {
          data.visible = false;
        }
      });
    }
  };

  const toggleCheckSigning = (event) => {
    setResetKey(tableFilterFields);
    const searchType = watchSearchType?.value || '';
    setIsCheckSigningValue(event?.target?.checked);
    const checkedValue = event?.target?.checked;
    dispatch(udpateIsCheckSigningToggle(checkedValue));
    dispatch(
      getPremiumProcessingTasksDetails({
        requestType: searchTypeCall,
        searchType: searchType,
        query: searchTerm,
        isCheckSigning: checkedValue,
        taskType,
        filterTerm: [],
      })
    );
    dispatch(
      getPremiumProcessingTasksDetails({
        requestType: filterTypeCall,
        searchType: searchType,
        query: searchTerm,
        isCheckSigning: checkedValue,
        taskType,
        filterTerm: [],
      })
    );
  };

  useEffect(() => {
    if (isPremiumProcessing) {
      premiumProcessingManageColumns();
    }
    return isPremiumProcessing
      ? dispatch(selectedPremiumProcessingTaskType(taskType))
      : dispatch(selectedClaimsProcessingTaskType(taskType));
  }, [taskType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const searchType = watchSearchType?.value || '';
    if (editAdhocStatus) {
      dispatch(
        getClaimsTasksProcessing({
          requestType: searchTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: searchTerm,
        })
      );
      dispatch(
        getClaimsTasksProcessing({
          requestType: filterTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: searchTerm,
        })
      );
    }
  }, [editAdhocStatus]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggleFlexiColumns = (columns) => {
    if (uiNavExpanded) {
      dispatch(collapseNav());
    }
    if (isPremiumProcessing) {
      if (!columns.visible) {
        columns.userSelected = true;
        if (utils.generic.isValidObject(columns, 'defaultUnselected')) {
          columns.defaultUnselected = false;
        }
      } else {
        columns.userSelected = false;
        if (!utils.generic.isValidObject(columns, 'defaultUnselected')) {
          columns.defaultUnselected = true;
        }
      }
    }

    toggleColumn(columns);
  };
  return (
    <TasksManagementView
      isTaskTeam={isTaskTeam}
      setValue={setValue}
      hasTasks={hasTasks}
      enableBulkAssign={enableBulkAssign}
      fields={fields}
      notificationRefId={refId}
      control={control}
      taskTypeValue={taskTypeValue}
      tasks={isPremiumProcessing ? premiumProcessingCaseList : claimsTasksProcessing}
      sort={{
        ...(isPremiumProcessing && premiumProcessingCaseList ? premiumProcessingCaseList.sort : claimsTasksProcessing.sort),
        direction:
          isPremiumProcessing && premiumProcessingCaseList
            ? premiumProcessingCaseList.sort.direction.toLowerCase()
            : claimsTasksProcessing.sort.direction.toLowerCase(),
        type: 'numeric',
      }}
      columnsArray={managedTaskColumnsArray}
      columnProps={columnProps}
      tableFilterFields={managedTableFilterFields}
      isFetchingFilters={isFetchingFilters}
      isPremiumProcessing={isPremiumProcessing}
      isCheckSigningValue={isCheckSigningValue}
      resetKey={resetKey}
      handlers={{
        toggleColumn: toggleFlexiColumns,
        resetFilter,
        resetSearch,
        handleSearch,
        handleSearchFilter,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSort,
        setTaskType,
        refreshTasksGrid,
        premiumProcessingSaveAssignee: premiumProcessingSaveAssigneeResponseHandler,
        handleBulkAssign,
        handleUpdateTaskPriority,
        resetNotificationFilters,
        toggleCheckSigning,
      }}
    />
  );
}
