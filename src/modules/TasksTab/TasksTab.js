import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import get from 'lodash/get';

// app
import styles from './TasksTab.style';
import TasksTabView from './TasksTab.view';
import {
  selectTasksTabGridListFilterLoading,
  selectTasksTabGridListFilterValues,
  selectTasksTabGridList,
  selectedClaimsProcessingTaskType,
  selectEditAdhocTaskStatus,
  getClaimsTasksProcessingList,
  resetClaimsProcessingTasksListFilters,
  resetClaimsProcessingTaskListSearch,
  collapseNav,
  udpateIsCheckSigningToggle,
  selectedClaimsProcessingPreviousTaskType,
  selectTasksTabGridListAppliedFilters,
} from 'stores';
import { MultiSelect, FormDate } from 'components';
import * as utils from 'utils';
import { useFlexiColumns } from 'hooks';
import {
  TASK_TEAM_TYPE,
  TASKS_SEARCH_OPTION_PROCESS_REF,
  TASKS_SEARCH_OPTION_DESCRIPTION,
  TASKS_SEARCH_OPTION_TASKI_REF,
  CLAIM_PROCESSING_REQ_TYPES,
  TASKS_SEARCH_OPTION_TASKS_NAME,
  TASKS_SEARCH_OPTION_ASSIGNED,
  TASKS_SEARCH_OPTION_PRIORITY,
} from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

export default function TasksTab() {
  const classes = makeStyles(styles, { name: 'TasksTab' })();

  const dispatch = useDispatch();
  const params = useParams();

  const claimsTasksProcessing = useSelector(selectTasksTabGridList);
  const claimsTasksProcessingFilters = useSelector(selectTasksTabGridListFilterValues);
  const editAdhocStatus = useSelector(selectEditAdhocTaskStatus);
  const uiNavExpanded = useSelector((state) => get(state, 'ui.nav.expanded'));
  const appliedFilters = useSelector(selectTasksTabGridListAppliedFilters);
  const isFetchingFilters = useSelector(selectTasksTabGridListFilterLoading);

  const [isCheckSigningValue, setIsCheckSigningValue] = useState(false);

  const [newPage, setNewPage] = useState(0);
  const [searchByText, setSearchByText] = useState(utils.string.t('claims.searchByTasks.options.TaskRef'));
  const [resetKey, setResetKey] = useState();
  const [taskType, setTaskType] = useState(claimsTasksProcessing.taskType || TASK_TEAM_TYPE.myTask);
  const [isTaskTeam, setIsTaskTeam] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const searchTypeCall = CLAIM_PROCESSING_REQ_TYPES.search;
  const filterTypeCall = CLAIM_PROCESSING_REQ_TYPES.filter;

  const { refId } = params;

  const selectOptions = [
    { label: utils.string.t('claims.searchByTasks.options.TaskName'), value: TASKS_SEARCH_OPTION_TASKS_NAME },
    { label: utils.string.t('claims.searchByTasks.options.TaskRef'), value: TASKS_SEARCH_OPTION_TASKI_REF },
    { label: utils.string.t('claims.searchByTasks.options.Description'), value: TASKS_SEARCH_OPTION_DESCRIPTION },
    { label: utils.string.t('claims.searchByTasks.options.AssignedTo'), value: TASKS_SEARCH_OPTION_ASSIGNED },
    { label: utils.string.t('claims.searchByTasks.options.ClaimRef'), value: TASKS_SEARCH_OPTION_PROCESS_REF },
    { label: utils.string.t('claims.searchByTasks.options.Priority'), value: TASKS_SEARCH_OPTION_PRIORITY },
  ];

  let taskTypeOptions = [
    { value: 'myTask', label: utils.string.t('claims.processing.myTasks') },
    { value: 'myTeam', label: utils.string.t('claims.processing.myTeamTasks') },
  ];

  const multiSelectField = [
    {
      name: 'multiselect',
      type: 'switch',
      value: false,
      disable: true,
      muiComponentProps: {
        onChange: () => {
          setIsMultiSelect(!isMultiSelect);
        },
        size: 'small',
      },
    },
  ];

  const fields = [
    {
      name: 'taskType',
      type: 'radio',
      value: taskType,
      defaultValue: taskType,
      muiFormGroupProps: {
        row: true,
        nestedClasses: {
          root: classes.radioGroup,
        },
      },
      options: taskTypeOptions,
    },
    {
      name: 'createdOn',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'targetDueDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'inceptionDate',
      type: 'datepicker',
      value: null,
    },
    {
      name: 'searchBy',
      type: 'select',
      options: selectOptions,
      value: selectOptions?.find((item) => item?.value === TASKS_SEARCH_OPTION_TASKS_NAME)?.value || null,
      muiComponentProps: {
        inputProps: {
          title: searchByText || '',
        },
      },
      validation: Yup.string().required(utils.string.t('validation.required')),
      handleUpdate: (name, value) => {
        setSearchByText(selectOptions?.find((item) => item?.value === value)?.label);
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
  const searchByWatcher = watch('searchBy');

  const tableFilterFields = [
    {
      id: 'createdOn',
      type: 'datepicker',
      label: utils.string.t('claims.processing.tasksGridColumns.created'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(defaultValues, 'createdOn')}
          id="creationdatepicker"
          name="createdOn"
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
      label: utils.string.t('claims.processing.tasksGridColumns.taskName'),
      value: [],
      options: claimsTasksProcessingFilters?.taskType,
      content: <MultiSelect id="taskType" search options={claimsTasksProcessingFilters?.taskType} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.priority'),
      value: [],
      options: claimsTasksProcessingFilters?.priority,
      content: <MultiSelect id="priority" search options={claimsTasksProcessingFilters?.priority} />,
    },
    {
      id: 'description',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.description'),
      value: [],
      options: claimsTasksProcessingFilters?.description,
      content: <MultiSelect id="description" search options={claimsTasksProcessingFilters?.description} />,
    },
    {
      id: 'assignee',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.assignedTo'),
      value: [],
      options: claimsTasksProcessingFilters?.assignee,
      content: <MultiSelect id="assignee" search options={claimsTasksProcessingFilters?.assignee} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.status'),
      placeholder: utils.string.t('claims.filterPlaceHolderText'),
      value: [],
      options: claimsTasksProcessingFilters?.status || [],
      content: <MultiSelect id="status" search options={claimsTasksProcessingFilters?.status || []} />,
    },
  ];

  const columns = [
    {
      id: 'taskRef',
      label: utils.string.t('claims.processing.tasksGridColumns.taskRef'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'createdOn',
      label: utils.string.t('claims.processing.tasksGridColumns.created'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'taskType',
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
      label: utils.string.t('claims.processing.tasksGridColumns.dueDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'assignee',
      label: utils.string.t('claims.processing.tasksGridColumns.assignedTo'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'processRef',
      label: utils.string.t('claims.processing.tasksGridColumns.claimRef'),
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
    {
      id: 'priority',
      label: utils.string.t('claims.processing.tasksGridColumns.priority'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
  ];

  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  const resetFilter = () => {
    setValue('createdOn', null);
    setValue('targetDueDate', null);
    dispatch(resetClaimsProcessingTasksListFilters());
    setResetKey(new Date().getTime());
    dispatch(getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType, query: searchTerm, filterTerm: {} }));
    dispatch(getClaimsTasksProcessingList({ requestType: filterTypeCall, taskType, query: searchTerm, filterTerm: {} }));
  };

  const resetSearch = () => {
    setValue('createdOn', null);
    setValue('targetDueDate', null);
    dispatch(resetClaimsProcessingTaskListSearch());
    setResetKey(new Date().getTime());
    dispatch(getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType, filterTerm: [] }));
    dispatch(getClaimsTasksProcessingList({ requestType: filterTypeCall, taskType, filterTerm: [] }));
  };

  const handleSearch = ({ search, filters }) => {
    setValue('createdOn', null);
    setValue('targetDueDate', null);
    const searchType = searchByWatcher || '';
    setSearchTerm(search);
    setResetKey(new Date().getTime());
    if (search !== claimsTasksProcessing?.query) {
      dispatch(
        getClaimsTasksProcessingList({
          requestType: searchTypeCall,
          taskType,
          query: search,
          direction: 'asc',
          searchType: searchType,
          navigation: false,
        })
      );
      dispatch(
        getClaimsTasksProcessingList({
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
    dispatch(
      getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType, query: search, filterTerm: filters, navigation: false })
    );
  };

  const handleChangePage = (newPage) => {
    setNewPage(newPage);
    dispatch(
      getClaimsTasksProcessingList({
        requestType: searchTypeCall,
        taskType,
        page: newPage,
        query: searchTerm,
        filterTerm: appliedFilters || null,
        navigation: true,
      })
    );
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(
      getClaimsTasksProcessingList({
        requestType: searchTypeCall,
        taskType,
        size: rowsPerPage,
        query: searchTerm,
        filterTerm: appliedFilters || null,
        navigation: true,
      })
    );
  };

  const handleSort = (by, dir) => {
    dispatch(
      getClaimsTasksProcessingList({
        requestType: searchTypeCall,
        taskType,
        sortBy: by,
        direction: dir,
        query: searchTerm,
        navigation: false,
      })
    );
  };

  const refreshTasksGrid = () => {
    dispatch(getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType }));
    dispatch(getClaimsTasksProcessingList({ requestType: filterTypeCall, taskType }));
  };

  const hasTasks = utils.generic.isValidArray(claimsTasksProcessing?.items, true);

  const resetNotificationFilters = () => {
    setIsCheckSigningValue(false);
  };

  useEffect(() => {
    const searchType = searchByWatcher || '';
    if (refId) {
      dispatch(
        getClaimsTasksProcessingList({
          requestType: searchTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: refId,
        })
      );
      dispatch(
        getClaimsTasksProcessingList({
          requestType: filterTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: refId,
        })
      );
    }
  }, [refId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (taskType && !refId) {
      setValue('taskType', taskType);
      setIsTaskTeam(taskType === TASK_TEAM_TYPE.myTeam);
      setResetKey(tableFilterFields);
      setValue('createdOn', null);
      setValue('targetDueDate', null);
      setResetKey(new Date().getTime());
      if (claimsTasksProcessing?.previousTaskType !== taskType) {
        dispatch(selectedClaimsProcessingPreviousTaskType(taskType));
        dispatch(resetClaimsProcessingTasksListFilters());
        dispatch(resetClaimsProcessingTaskListSearch());
        dispatch(getClaimsTasksProcessingList({ requestType: searchTypeCall, taskType, filterTerm: [] }));
        dispatch(getClaimsTasksProcessingList({ requestType: filterTypeCall, taskType }));
      }
    }
  }, [taskType]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleCheckSigning = (event) => {
    setResetKey(tableFilterFields);
    setIsCheckSigningValue(event?.target?.checked);
    const checkedValue = event?.target?.checked;
    dispatch(udpateIsCheckSigningToggle(checkedValue));
  };

  useEffect(() => {
    dispatch(selectedClaimsProcessingTaskType(taskType));
  }, [taskType]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const searchType = searchByWatcher || '';
    if (editAdhocStatus) {
      dispatch(
        getClaimsTasksProcessingList({
          requestType: searchTypeCall,
          taskType,
          searchType: searchType,
          page: newPage,
          query: searchTerm,
        })
      );
      dispatch(
        getClaimsTasksProcessingList({
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
    toggleColumn(columns);
  };

  return (
    <TasksTabView
      isTaskTeam={isTaskTeam}
      setValue={setValue}
      hasTasks={hasTasks}
      fields={fields}
      notificationRefId={refId}
      control={control}
      taskTypeValue={taskTypeValue}
      tasks={claimsTasksProcessing}
      sort={{
        ...claimsTasksProcessing.sort,
        direction: claimsTasksProcessing.sort.direction.toLowerCase(),
        type: 'numeric',
      }}
      columnsArray={columnsArray}
      columnProps={columnProps}
      tableFilterFields={tableFilterFields}
      isFetchingFilters={isFetchingFilters}
      searchByTerm={searchByWatcher?.value}
      isCheckSigningValue={isCheckSigningValue}
      resetKey={resetKey}
      multiSelectField={multiSelectField}
      isMultiSelect={isMultiSelect}
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
        resetNotificationFilters,
        toggleCheckSigning,
      }}
    />
  );
}
