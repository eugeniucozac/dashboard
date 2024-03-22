import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import compact from 'lodash/compact';
import uniq from 'lodash/uniq';

// app
import { ClaimActionView } from './ClaimAction.view';
import { getPriorityLevels, selectClaimsInformation, getLossActions, selectLossActions } from 'stores';
import { MultiSelect, FormDate } from 'components';
import { useFlexiColumns } from 'hooks';
import * as utils from 'utils';

export default function ClaimsAction({ handleSelectTab }) {
  const dispatch = useDispatch();
  const lossInformation = useSelector(selectClaimsInformation);
  const claimActions = useSelector(selectLossActions);

  const getItemsFlat = (items, propName) => {
    return items.reduce((acc, cur) => {
      const item = { ...cur };
      const itemChildren = utils.generic.isValidArray(item?.[propName], true) ? [...item[propName]] : null;

      return [...acc, item, ...(itemChildren ? getItemsFlat(itemChildren, propName) : [])];
    }, []);
  };

  const [itemsFiltered, setItemsFiltered] = useState(claimActions.items);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState(null);

  const searchableColumns = [
    'actionID',
    'actionName',
    'team',
    'assignedTo',
    'priority',
    'status',
    'description',
    'divisionName',
    'insured',
  ];

  const filterableColumns = [
    { name: 'assignedTo', type: 'array' },
    { name: 'priority', type: 'array' },
    { name: 'status', type: 'array' },
    { name: 'description', type: 'array' },
    { name: 'divisionName', type: 'array' },
    { name: 'insured', type: 'array' },
    { name: 'dateCreated', type: 'date' },
    { name: 'targetDueDate', type: 'date' },
  ];

  useEffect(() => {
    const unfilteredItems = claimActions?.items || [];
    const nestedArrayKey = 'actionChildItemList';
    const hasSearchFilters = filterableColumns.some(utils.filters.hasFilters(filters));

    if (searchQuery || hasSearchFilters) {
      setItemsFiltered(utils.filters.items(unfilteredItems, searchQuery, searchableColumns, filterableColumns, nestedArrayKey, filters));
    } else {
      setItemsFiltered(unfilteredItems);
    }
  }, [searchQuery, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getPriorityLevels());
    dispatch(getLossActions(lossInformation));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setItemsFiltered(claimActions.items);
  }, [claimActions.items]); // eslint-disable-line react-hooks/exhaustive-deps

  const allItems = getItemsFlat(claimActions?.items || [], 'actionChildItemList');

  const optionsAssignedTo = uniq(compact(allItems.map((i) => i.assignedTo))).map((i) => ({ id: i, name: i }));
  const optionsStatus = uniq(compact(allItems.map((i) => i.status))).map((i) => ({ id: i, name: i }));
  const optionsPriorities = uniq(compact(allItems.map((i) => i.priority))).map((i, iter) => ({ id: iter + 1, name: i }));

  const viewFields = [
    { name: 'dateCreated', type: 'datepicker', value: null },
    { name: 'targetDueDate', type: 'datepicker', value: null },
  ];

  const defaultValues = utils.form.getInitialValues(viewFields);
  const validationSchema = utils.form.getValidationSchema(viewFields);

  const { control, reset } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const datePickerProps = {
    type: 'datepicker',
    value: '',
    label: '',
    plainText: true,
    plainTextIcon: true,
    placeholder: utils.string.t('app.selectDate'),
    muiComponentProps: {
      fullWidth: false,
      margin: 'dense',
    },
    muiPickerProps: {
      variant: 'inline',
      format: 'DD-MM-YYYY',
    },
  };

  const tableFilterFields = [
    {
      id: 'assignedTo',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsList.assignedTo'),
      value: [],
      options: optionsAssignedTo,
      content: <MultiSelect id="assignedTo" search options={optionsAssignedTo} />,
    },
    {
      id: 'dateCreated',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.dateAndTimeCreated'),
      value: '',
      content: <FormDate control={control} id="creationdatepicker" name="dateCreated" {...datePickerProps} />,
    },
    {
      id: 'targetDueDate',
      type: 'datepicker',
      label: utils.string.t('claims.columns.claimsList.targetDueDate'),
      value: '',
      content: <FormDate control={control} id="targetduedatepicker" name="targetDueDate" {...datePickerProps} />,
    },
    {
      id: 'priority',
      type: 'multiSelect',
      label: utils.string.t('claims.claimInformation.priority'),
      value: [],
      options: optionsPriorities,
      content: <MultiSelect id="priority" options={optionsPriorities} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('claims.columns.claimsManagement.status'),
      value: [],
      options: optionsStatus,
      content: <MultiSelect id="status" options={optionsStatus} />,
    },
  ];

  const handleSearch = (searchObj) => {
    setSearchQuery(searchObj?.search || '');
  };

  const handleResetSearch = () => {
    setSearchQuery('');
  };

  const handleFilter = (filters) => {
    setFilters(filters?.filters);
  };

  const handleResetFilter = () => {
    setFilters(null);
    reset();
  };

  const columns = [
    {
      id: 'actionId',
      label: utils.string.t('app.actionId'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'name',
      label: utils.string.t('app.name'),
      nowrap: false,
      visible: true,
    },
    {
      id: 'description',
      label: utils.string.t('claims.processing.tasksGridColumns.description'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'team',
      label: utils.string.t('claims.columns.claimsManagement.team'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'assignedTo',
      label: utils.string.t('claims.columns.claimsManagement.assignedTo'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'dateCreated',
      label: utils.string.t('claims.columns.claimsManagement.createdDate'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'targetDate',
      label: utils.string.t('claims.columns.claimsList.targetDueDate'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'priority',
      label: utils.string.t('claims.columns.claimsManagement.priority'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'status',
      label: utils.string.t('claims.columns.claimsManagement.status'),
      nowrap: true,
      visible: true,
    },
    {
      id: 'taskCompleted',
      label: utils.string.t('claims.columns.claimsManagement.taskCompleted'),
      nowrap: true,
      visible: true,
    },
  ];

  const { columns: columnsArray, columnProps } = useFlexiColumns(columns);

  return (
    <ClaimActionView
      items={{ ...claimActions, items: itemsFiltered }}
      columnsArray={columnsArray}
      columnProps={columnProps}
      tableFilterFields={tableFilterFields}
      handlers={{
        selectTab: handleSelectTab,
        search: handleSearch,
        filter: handleFilter,
        resetFilter: handleResetFilter,
        resetSearch: handleResetSearch,
      }}
    />
  );
}
