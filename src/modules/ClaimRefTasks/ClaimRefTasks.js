import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import ClaimRefTasksView from './ClaimRefTasks.view';

//app
import {
  showModal,
  getClaimRefTasks,
  selectClaimRefTaskData,
  selectClaimRefTaskFilters,
  selectClaimsTasksProcessingSelected,
  selectClaimsProcessingTasksSelected,
} from 'stores';
import { MultiSelect, FormDate } from 'components';
import { useFlexiColumns } from 'hooks';
import * as utils from 'utils';
import { CLAIM_PROCESSING_REQ_TYPES } from 'consts';

ClaimRefTasks.propTypes = {
  claim: PropTypes.shape({
    claimID: PropTypes.number.isRequired,
  }),
};

export default function ClaimRefTasks({ claim }) {
  const dispatch = useDispatch();
  const claimRefTasks = useSelector(selectClaimRefTaskData);
  const claimRefTasksFilters = useSelector(selectClaimRefTaskFilters);
  const [searchValue, setSearchValue] = useState('');
  const [resetKey, setResetKey] = useState(); 

  const searchTypeCall = CLAIM_PROCESSING_REQ_TYPES.search;
  const filterTypeCall = CLAIM_PROCESSING_REQ_TYPES.filter;

  const hasTasks = utils.generic.isValidArray(claimRefTasks, true);
  const tasksProcessingSelected = useSelector(selectClaimsTasksProcessingSelected);
  const enableBulkAssign =
    utils.generic.isValidArray(tasksProcessingSelected, true) && tasksProcessingSelected.length > 1 && tasksProcessingSelected.length <= 10;

  const columns = [
    { id: 'id', empty: true, visible: true },
    {
      id: 'taskRef',
      label: utils.string.t('claims.processing.tasksGridColumns.taskRef'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: false,
      visible: true,
      mandatory: true,
    },
    {
      id: 'createdOn',
      label: utils.string.t('claims.processing.tasksGridColumns.dateAndTimeCreated'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'team',
      label: utils.string.t('app.team'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
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
      visible: true,
    },
    {
      id: 'additionalAssignee',
      label: utils.string.t('claims.processing.tasksGridColumns.additionalAssignee'),
      sort: { type: 'lexical', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'priority',
      label: utils.string.t('claims.processing.tasksGridColumns.priority'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'status',
      label: utils.string.t('claims.processing.tasksGridColumns.status'),
      sort: { type: 'lexical', direction: 'asc' },
      style: { textAlign: 'center' },
      nowrap: true,
      visible: true,
    },
  ];

  const dateFields = [
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
  ];

  const defaultValues = utils.form.getInitialValues(dateFields);
  const { control, reset, setValue } = useForm({ defaultValues });

  const tableFilterFields = [
   
    {
      id: 'createdOn',
      type: 'datepicker',
      label: utils.string.t('claims.processing.tasksGridColumns.dateCreated'),
      value: '',
      content: (
        <FormDate
          control={control}
          {...utils.form.getFieldProps(dateFields, 'createdOn')}
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
          {...utils.form.getFieldProps(dateFields, 'targetDueDate')}
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
      options: claimRefTasksFilters?.taskType,
      content: <MultiSelect id="taskType" search options={claimRefTasksFilters?.taskType} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.priority'),
      value: [],
      options: claimRefTasksFilters?.priority,
      content: <MultiSelect id="priority" search options={claimRefTasksFilters?.priority} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.status'),
      value: [],
      options: claimRefTasksFilters?.status,
      content: <MultiSelect id="status" search options={claimRefTasksFilters?.status} />,
    },
    {
      id: 'createdBy',
      type: 'multiSelect',
      label: utils.string.t('claims.processing.tasksGridColumns.createdBy'),
      value: [],
      options: claimRefTasksFilters?.requestedBy,
      content: <MultiSelect id="createdBy" search options={claimRefTasksFilters?.requestedBy} />,
    },
  ];

  const resetFilterDatePicker = () => {
    setValue('createdOn', null);
    setValue('targetDueDate', null);
  };

  const onResetFilter = () => {
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, search: searchValue, filterTerm: {} }));
    reset();
    resetFilterDatePicker();
  };

  const onResetSearch = () => {
    setSearchValue('');
    setResetKey(new Date().getTime());
    resetFilterDatePicker();
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, search: '', filterTerm: {} }));
    dispatch(getClaimRefTasks({ requestType: filterTypeCall, search: '', filterTerm: {} }));
  };

  const handleSearch = ({ search }) => {
    setSearchValue(search);
    setResetKey(new Date().getTime());
    resetFilterDatePicker();
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, search, direction: 'desc', filterTerm: {} }));
    dispatch(getClaimRefTasks({ requestType: filterTypeCall, search, direction: 'desc', filterTerm: {} }));
  };

  const handleSearchFilter = ({ filters }) => {
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, search: searchValue, filterTerm: filters }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, page: newPage, search: searchValue }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, size: rowsPerPage, search: searchValue }));
  };

  const handleSort = (by, dir) => {
    dispatch(getClaimRefTasks({ requestType: searchTypeCall, sortBy: by, direction: dir.toUpperCase(), search: searchValue }));
  };

  const selectTask = (taskObj) => () => {
    if (taskObj?.taskId) {
      dispatch(selectClaimsProcessingTasksSelected(taskObj, true));
    }
  };

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
            taskDetails: tasksProcessingSelected,
            submitHandler: () => {
              onResetFilter();
            },
          },
        },
      })
    );
  };
  const { columns: columnsArray, columnProps, toggleColumn } = useFlexiColumns(columns);

  useEffect(() => {
    dispatch(getClaimRefTasks({ requestType: searchTypeCall }));
    dispatch(getClaimRefTasks({ requestType: filterTypeCall }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ClaimRefTasksView
      columnsArray={columnsArray}
      columnProps={columnProps}
      sort={{
        ...claimRefTasks?.sort,
        type: 'numeric',
      }}
      hasTasks={hasTasks}
      enableBulkAssign={enableBulkAssign}
      tableFilterFields={tableFilterFields}
      tasks={claimRefTasks?.length > 0 ? claimRefTasks : []}
      toggleColumn={toggleColumn}
      resetKey={resetKey}
      handlers={{
        onResetFilter,
        onResetSearch,
        handleSearch,
        handleSearchFilter,
        handleChangePage,
        handleChangeRowsPerPage,
        handleSort,
        selectTask,
        handleBulkAssign,
      }}
    />
  );
}
