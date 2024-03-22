import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
import merge from 'lodash/merge';
import isEmpty from 'lodash/isEmpty';
import isInteger from 'lodash/isInteger';
import xorBy from 'lodash/xorBy';
import * as Yup from 'yup';

//app
import styles from './PremiumProcessingCases.styles';
import {
  Overflow,
  Status,
  TableCell,
  TableHead,
  Translate,
  SelectPopover,
  SingleSelect,
  TableToolbar,
  TableFilters,
  FormSwitch,
  Pagination,
  Tooltip,
  FormDate,
  Button,
  FormGrid,
  FormSelect,
  FormText,
  Warning,
} from 'components';
import {
  enqueueNotification,
  setMultiSelectFlag,
  getCasesList,
  collapseNav,
  expandSidebar,
  collapseSidebar,
  setIsCaseTableHidden,
  selectUserRole,
  getAssignedToUsersList,
  getDepartments,
  selectPiDepartmentList,
  getUsersForRole,
  selectUsersInRoles,
  selectMultiSelectedCase,
  selectCasesListType,
} from 'stores';
import * as constants from 'consts';
import { useFlexiColumns, usePagination, useSort } from 'hooks';
import * as utils from 'utils';

// mui
import {
  Box,
  Grid,
  makeStyles,
  Table,
  TableBody,
  TableRow,
  Typography,
  TableContainer,
  Switch,
  Popover,
  InputAdornment,
  Avatar,
  Checkbox,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
PremiumProcessingCasesView.propTypes = {
  columnsData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  cases: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  tabSelectionView: PropTypes.string.isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    direction: PropTypes.oneOf(['asc', 'desc']).isRequired,
    type: PropTypes.oneOf(['lexical', 'date', 'number']).isRequired,
  }).isRequired,
  selectedCase: PropTypes.array,
  assingnedToDropdownList: PropTypes.array,
  selectedFilterDetails: PropTypes.object,
  handlers: PropTypes.shape({
    searchSubmit: PropTypes.func.isRequired,
    searchReset: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
    checkboxClick: PropTypes.func.isRequired,
    selectSingleCase: PropTypes.func.isRequired,
    casesFilter: PropTypes.func.isRequired,
    showCheckboxesHandler: PropTypes.func.isRequired,
    clickRfiQueryResponse: PropTypes.func.isRequired,
    assignedUsersToCase: PropTypes.func.isRequired,
    tableFilterReset: PropTypes.func.isRequired,
    tableFilterApply: PropTypes.func.isRequired,
    updateMultiSelectedRows: PropTypes.func.isRequired,
    showCheckboxColumnHandler: PropTypes.func.isRequired,
    handleDoubleClickCaseRow: PropTypes.func.isRequired,
  }).isRequired,
  userRoleDetails: PropTypes.array,
  tableFilterFields: PropTypes.array.isRequired,
  flagsInRow: PropTypes.bool.isRequired,
  defaultFormFields: PropTypes.array.isRequired,
  watch: PropTypes.func,
  setValue: PropTypes.func,
  register: PropTypes.func,
};

export function PremiumProcessingCasesView({
  columnsData,
  cases,
  pagination,
  sort: sortObj,
  selectedCases,
  handlers,
  tabSelectionView,
  userRoleDetails,
  register,
  tableFilterFields,
  selectedFilterDetails,
  control,
  watch,
  setValue,
  formState,
  assingnedToDropdownList,
  flagsInRow,
  defaultFormFields,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCases' })();
  const dispatch = useDispatch();
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));
  const currentUser = useSelector(selectUserRole);
  const isAssignedToUserList = utils.generic.isValidArray(assingnedToDropdownList, true);
  const casesListType = useSelector(selectCasesListType);
  const departmentsList = useSelector(selectPiDepartmentList);
  const isDeparmentsLoaded = utils.generic.isValidArray(departmentsList, true);
  const fecUsers = useSelector(selectUsersInRoles);
  const isFecUsersLoaded = utils.generic.isValidArray(fecUsers, true);
  const [selectedValueBulkAssign, setSelectedValueBulkAssign] = useState(null);
  const [isBulkSelectClear, setIsBulkSelectClear] = useState(false);
  const [columns] = useState(columnsData);
  const { columns: columnsArray, isTableHidden, columnProps, toggleColumn } = useFlexiColumns(columns);
  const [disableMultiSelect, setDisableMultiSelect] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const paginationObj = usePagination(cases, pagination, handlers.changePage, handlers.changeRowsPerPage);
  const { cols, sort } = useSort(columnsArray, sortObj, handlers.sortColumn);
  const uiNavExpanded = useSelector((state) => get(state, 'ui.nav.expanded'));
  const multiSelectedCasesList = useSelector(selectMultiSelectedCase);
  const [assignedToSelected, setAssignedToSelected] = useState(null);
  const [searchValue, setIsSearch] = useState('caseId');
  const value = watch();
  const [flagColumn, setFlagColumn] = useState('ENABLE');
  const isDisable =
    value?.textValue === '' || value?.caseId === '' || value?.searchInceptionDate === null || value?.caseId === null ? true : false;
  const multipleCasesLength = multiSelectedCasesList?.length || 0;
  const isValidFlagSection =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) =>
      [
        constants.FRONT_END_CONTACT.toLowerCase(),
        constants.ROLE_SENIOR_TECHNICIAN.toLowerCase(),
        constants.ROLE_TECHNICIAN_MANAGER.toLowerCase(),
        constants.SENIOR_MANAGER.toLowerCase(),
        constants.OPERATIONS_LEAD.toLowerCase(),
        constants.ROLE_JUNIOR_TECHNICIAN.toLowerCase(),
      ].includes(item.name.toLowerCase())
    );
  const isValidCheckSigining =
    utils.generic.isValidArray(currentUser, true) &&
    currentUser.some((item) =>
      [
        constants.ROLE_SENIOR_TECHNICIAN.toLowerCase(),
        constants.ROLE_TECHNICIAN_MANAGER.toLowerCase(),
        constants.ROLE_JUNIOR_TECHNICIAN.toLowerCase(),
        constants.SENIOR_MANAGER.toLowerCase(),
      ].includes(item.name.toLowerCase())
    );

  useEffect(() => {
    setValue('workInprogress', false);
  }, [setValue, casesListType]);

  useEffect(() => {
    if (multipleCasesLength > 0) {
      dispatch(collapseSidebar());
    }
    if (selectedCases.length === 1) {
      if (!uiSidebarExpanded) {
        dispatch(expandSidebar());
      }
    } else {
      dispatch(collapseSidebar());
    }
    const columnsVisible = columnsArray?.filter((columnData) => columnData.visible !== false);
    if (columnsVisible?.length === 1 && columnsVisible[0]?.id === 'flag' && columnsVisible[0]?.visible) {
      dispatch(collapseSidebar());
      dispatch(setIsCaseTableHidden(true)); // setting true when all columns are hidden and only when flag column enabled.
    } else {
      if (isTableHidden) {
        dispatch(collapseSidebar());
      }
      dispatch(setIsCaseTableHidden(isTableHidden));
    }
    dispatch(collapseNav());
  }, [multipleCasesLength, selectedCases, isTableHidden, columnsArray]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isBulkSelectClear) {
      setSelectedValueBulkAssign(null);
    }
    if (tabSelectionView !== constants.WORKBASKET) {
      setIsMultiSelect(false);
      setDisableMultiSelect(true);
      dispatch(setMultiSelectFlag({ flag: false }));
      columnsArray.forEach((col) => {
        if (col.id === 'select') {
          col.visible = false;
          if (utils.generic.isValidArray(selectedCases, true)) {
            handlers.selectSingleCase(selectedCases);
          }
        }
      });
    } else {
      setDisableMultiSelect(false);
    }
  }, [dispatch, isBulkSelectClear, tabSelectionView]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isMultiSelect) {
      setIsMultiSelect(false);
      toggleColumn(columnsArray?.find((e) => e.id === 'select') || null);
    }
  }, [sort, pagination.page, pagination.rowsPerPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetCaseFilters = () => {
    handlers.tableFilterReset();
    if (isMultiSelect) {
      setIsMultiSelect(false);
      toggleColumn(columnsArray?.find((e) => e.id === 'select') || null);
    }
  };

  /**Toggle checkbox column to enable Multi Select option */
  const showCheckboxesClick = (event) => {
    setIsMultiSelect(event?.target?.checked || !isMultiSelect);
    handlers.showCheckboxColumnHandler(event?.target?.checked);
    const selectColumn = columnsArray?.find((e) => e.id === 'select');
    toggleColumn(selectColumn || null);
    selectColumn?.label?.props?.children?.props?.control?.setValue('singlevalue', false);
  };
  const handleDoubleClickRow = (id) => {
    if (!isMultiSelect) {
      handlers.handleDoubleClickCaseRow(id);
    } else {
      dispatch(enqueueNotification(utils.string.t('premiumProcessing.multiSelectEanbleWarningMessage'), 'warning'));
    }
  };
  const tableRowClick = (caseRow) => {
    if (!isMultiSelect) {
      const selectedCaseDetails = isMultiSelect ? xorBy(selectedCases || [], [caseRow], 'id') : [caseRow];
      handlers.selectSingleCase(selectedCaseDetails);
      if (utils.generic.isValidArray(selectedCases, true)) {
        const selectColumn = columnsArray?.find((e) => e.id === 'select');
        selectColumn?.label?.props?.children?.props?.control?.setValue('singlevalue', false);
        if (isMultiSelect && utils.generic.isValidArray(selectedCaseDetails, true) && selectedCaseDetails.length > 10) {
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseSelectionWarningMessage'), 'warning'));
        }
      }
    } else {
      dispatch(enqueueNotification(utils.string.t('premiumProcessing.multiSelectEanbleWarningMessage'), 'warning'));
    }
  };

  const rowCheckboxClick = (rowDetails, event) => {
    if (isMultiSelect) {
      if (event?.target?.checked) {
        const casesList = [...multiSelectedCasesList, rowDetails];
        if (multiSelectedCasesList.length > 9) {
          event.target.checked = false;
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseSelectionWarningMessage'), 'warning'));
        } else {
          handlers.updateMultiSelectedRows(casesList);
        }
      } else {
        handlers.updateMultiSelectedRows(multiSelectedCasesList.filter((item) => item.bpmProcessId !== rowDetails.bpmProcessId));
      }

      if (multiSelectedCasesList.length === 1 && !event?.target?.checked) {
        const selectColumn = columnsArray?.find((e) => e.id === 'select');
        selectColumn?.label?.props?.children?.props?.control?.setValue('singlevalue', false);
      }
      const rowPerPage = get(paginationObj, 'obj.rowsPerPage');
      if (multiSelectedCasesList.length === rowPerPage && event?.target?.checked) {
        const selectColumn = columnsArray?.find((e) => e.id === 'select');
        selectColumn?.label?.props?.children?.props?.control?.setValue('singlevalue', true);
      }
    }
  };

  useEffect(() => {
    columnsArray?.forEach((col) => {
      if (col.id === 'flag') {
        col.visible = userRoleDetails[0] && flagsInRow && isValidFlagSection;
      }
    });
    if (utils.generic.isValidArray(columnsArray, true)) {
      const nonFlagData = columnsArray.filter((a) => a.id !== 'flag');
      if (utils.generic.isValidArray(nonFlagData, true)) {
        if (nonFlagData.every((columnData) => columnData.visible === false)) {
          setFlagColumn('DISABLE');
        } else {
          setFlagColumn('ENABLE');
        }
      }
    }
  }, [flagColumn, toggleColumn, isBulkSelectClear, tabSelectionView]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggelFlexiColumns = (column) => {
    if (uiNavExpanded) {
      dispatch(collapseNav());
    }
    toggleColumn(column);
    setDisableMultiSelect(false);
    /**Checking here for all columns are visible false and then disableing the multi select switch control  */
    if (columnsArray.every((columnData) => columnData.visible === false)) {
      setDisableMultiSelect(column.visible);
    }
    /**Checking the columns visible true and should not consider checkbox(select) column and disabling the multi select switch control  */
    if (columnsArray.filter((item) => item.visible === true && item.id !== 'select')?.length === 1) {
      setDisableMultiSelect(false);
      setIsMultiSelect(false);
      /** updating MultiSelectCheckbox flag  */
      handlers.showCheckboxesHandler();
      columnsArray.forEach((col) => {
        if (col.id === 'select') {
          col.visible = false;
        }
      });
    }
  };
  const removeSearchFilters = (filterList) => {
    if (filterList.riskReference) delete filterList.riskReference;
    if (filterList.caseId) delete filterList.caseId;
    if (filterList.workPackageReferance) delete filterList.workPackageReferance;
    return filterList;
  };
  const searchData = () => {
    const params = watch();
    let searchFieldValues = selectedFilterDetails;
    searchFieldValues = removeSearchFilters(searchFieldValues);
    if (params) {
      if (params.searchDropdown === 'searchInceptionDate') {
        if (!isEmpty(searchFieldValues?.inceptionDate)) {
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.filterAppliedValidation'), 'warning'));
          return;
        }
        searchFieldValues.inceptionDate = params[params.searchDropdown];
      }
      if (params.searchDropdown === 'insured') {
        if (utils.generic.isValidArray(searchFieldValues?.insured, true)) {
          dispatch(enqueueNotification(utils.string.t('premiumProcessing.filterAppliedValidation'), 'warning'));
          return;
        }
        searchFieldValues[params.searchDropdown] = [params.textValue];
      }
      if (params.searchDropdown === 'caseId') {
        searchFieldValues[params.searchDropdown] =
          params.searchDropdown === 'caseId' ? parseInt(params[params.searchDropdown]) : params[params.searchDropdown];
      }
      if (params.searchDropdown === 'riskReference') searchFieldValues[params.searchDropdown] = params.textValue;
      if (params.searchDropdown === 'workPackageReferance') searchFieldValues[params.searchDropdown] = params.textValue;
      dispatch(getCasesList({ filters: searchFieldValues }));
      setOpenPopover(false);
    }
  };
  const loadFiltersData = (value) => {
    if (value) {
      if (!isAssignedToUserList) {
        dispatch(getAssignedToUsersList());
      }
      if (!isDeparmentsLoaded) {
        dispatch(getDepartments());
      }
      if (!isFecUsersLoaded) {
        dispatch(getUsersForRole([constants.FRONT_END_CONTACT, constants.OPERATIONS_LEAD]));
      }
    }
  };
  const filterData = (params) => {
    if (params && params.filters) {
      const dataFiltersObj = {};
      Object.entries(params.filters).forEach(([key, val]) => {
        if (utils.generic.isValidArray(val, true)) {
          if (params.filters.hasOwnProperty(key)) {
            let keyValue = {};
            if (
              key === 'bordereauType' ||
              key === 'facilityType' ||
              key === 'assignedTo' ||
              key === 'process' ||
              key === 'priority' ||
              key === 'departmentId' ||
              key === 'fecName' ||
              key === 'flag' ||
              key === 'caseStage' ||
              key === 'slaOverdue'
            ) {
              keyValue = {
                [key]: params.filters?.[key]
                  ? params.filters[key].map((a) => (isInteger(a.id) ? (isNaN(parseInt(a.id)) ? a.id : parseInt(a.id)) : a.id))
                  : [],
              };
            } else {
              keyValue = {
                [key]: params.filters?.[key] ? params.filters[key].map((a) => a.name) : [],
              };
            }
            merge(dataFiltersObj, keyValue, (a, b) => {
              return utils.generic.isValidArray(a, true) ? a.concat(b) : undefined;
            });
          }
        }
        if (typeof val === 'string') {
          if (val) {
            if (params.filters.hasOwnProperty(key)) {
              const keyValueString = { [key]: params.filters?.[key] ? params.filters[key] : '' };
              merge(dataFiltersObj, keyValueString, (a, b) => {
                return a ? a.concat(b) : undefined;
              });
            }
          }
        }
      });
      if (utils.generic.isValidObject(dataFiltersObj)) {
        handlers.tableFilterApply(dataFiltersObj);
        if (isMultiSelect) {
          setIsMultiSelect(false);
          toggleColumn(columnsArray?.find((e) => e.id === 'select') || null);
        }
      }
    }
  };

  const [openPopover, setOpenPopover] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const toggleOpenPopover = (event) => {
    setOpenPopover(!openPopover);
    setAnchorEl(event?.currentTarget);
    setIsSearch('caseId');
  };
  const searchOptions = [
    { id: 'riskReference', name: utils.string.t('premiumProcessing.search.policyNo') },
    { id: 'insured', name: utils.string.t('premiumProcessing.search.insuredCoverholder') },
    { id: 'caseId', name: utils.string.t('premiumProcessing.search.caseId') },
    { id: 'searchInceptionDate', name: utils.string.t('premiumProcessing.search.inceptionDate') },
    { id: 'workPackageReferance', name: utils.string.t('premiumProcessing.search.workPackageReference') },
  ];
  const searchField = [
    {
      id: 'searchDropdown',
      name: 'searchDropdown',
      type: 'select',
      defaultValue: searchValue || '',
      options: searchOptions,
      optionKey: 'id',
      optionLabel: 'name',
    },
    {
      id: 'searchText',
      name: 'textValue',
      defaultValue: '',
      type: 'text',
      placeholder: 'Search',
      icon: SearchIcon,
      value: '',
    },
    {
      name: 'caseId',
      type: 'number',
      value: '',
      placeholder: 'Search',
      defaultValue: null,
      validation: Yup.number()
        .nullable()
        .min(0)
        .transform(function (value, originalvalue) {
          return this.isType(value) ? (Number.isNaN(value) ? null : value) : null;
        }),
    },
    {
      name: 'searchInceptionDate',
      type: 'datepicker',
      value: '',
      outputFormat: '',
      placeholder: utils.string.t('app.selectDate'),
      icon: 'TodayIcon',
      muiComponentProps: {
        fullWidth: true,
        classes: {
          root: classes.datepicker,
        },
      },
    },
  ];

  const handleChangeDropDown = (event, name) => {
    if (name) {
      setIsSearch(name);
    } else {
      setIsSearch('caseId');
    }
  };

  const getAssignedToUsersDetails = () => {
    dispatch(getAssignedToUsersList());
  };

  return (
    <Box data-testid="premium-processing-search-table">
      <Box my={2}>
        <Box className={classes.searchBox}>
          <Button
            icon={SearchIcon}
            iconPosition="right"
            size="xsmall"
            light
            aria-owns={openPopover ? `search-popover` : null}
            aria-haspopup="true"
            onClick={toggleOpenPopover}
          />
          <Popover
            id={`search-popover-modal`}
            open={Boolean(openPopover)}
            anchorEl={anchorEl}
            onClose={toggleOpenPopover}
            classes={{ paper: classes.searchPopoverFrame }}
            anchorOrigin={{
              vertical: 'center',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'right',
            }}
          >
            <FormGrid container nestedClasses={{ root: classes.searchContainer }}>
              <Box pr={1} width={'40%'} flex={0.4}>
                <FormSelect {...utils.form.getFieldProps(searchField, 'searchDropdown', control)} handleUpdate={handleChangeDropDown} />
              </Box>
              <Box pr={1} flex={0.4}>
                {searchValue === 'caseId' && (
                  <FormText
                    {...utils.form.getFieldProps(searchField, 'caseId', control)}
                    omitThousandSeparator
                    placeholder={utils.string.t('app.search')}
                    muiComponentProps={{
                      InputProps: {
                        startAdornment: (
                          <InputAdornment position="start" classes={{ root: classes.adornmentStart }}>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
                {searchValue === 'searchInceptionDate' && (
                  <FormDate {...utils.form.getFieldProps(searchField, 'searchInceptionDate', control)} />
                )}
                {(searchValue === 'riskReference' || searchValue === 'insured' || searchValue === 'workPackageReferance') && (
                  <FormText
                    {...utils.form.getFieldProps(searchField, 'textValue', control)}
                    placeholder={utils.string.t('app.search')}
                    muiComponentProps={{
                      InputProps: {
                        maxLength: 50,
                        startAdornment: (
                          <InputAdornment position="start" classes={{ root: classes.adornmentStart }}>
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Box>
              <Box flex={0.1} justifyContent="flex-end" direction="row" alignItems="center" display="flex">
                <Button
                  text={utils.string.t('app.go')}
                  type="submit"
                  color="primary"
                  size="small"
                  disabled={formState.isSubmitting || !formState.isDirty || isDisable}
                  data-testid={`popover-submit-button`}
                  onClick={(e) => searchData(e)}
                />
              </Box>
            </FormGrid>
          </Popover>
        </Box>
        <TableToolbar nestedClasses={{ root: classes.tableToolbar }}>
          {isValidCheckSigining && (
            <Box>
              <Typography variant="body2">{utils.string.t('premiumProcessing.checkSigning')}</Typography>
            </Box>
          )}
          {isValidCheckSigining && (
            <Box className={classes.switchControl}>
              <FormSwitch
                {...utils.form.getFieldProps(defaultFormFields, 'workInprogress')}
                name={'workInprogress'}
                control={control}
                register={register}
              />
            </Box>
          )}
          <TableFilters
            search={false}
            filtersArray={tableFilterFields}
            columns
            columnsArray={columnsArray.filter((item) => item.id !== 'select' && item.id !== 'flag')}
            handlers={{
              onSearch: (values) => {},
              onFilter: (values) => {
                filterData(values, 'filters');
              },
              onResetFilter: resetCaseFilters,
              onToggleColumn: toggelFlexiColumns,
              onFilterExpand: (value) => {
                loadFiltersData(value);
              },
            }}
          />
        </TableToolbar>
        <Overflow>
          {cases && (
            <TableContainer>
              {isTableHidden || flagColumn === 'DISABLE' ? (
                <Box p={5}>
                  <Warning type="info" align="center" text={utils.string.t('premiumProcessing.flexiColumnMessage')} size="large" icon />
                </Box>
              ) : (
                <Table className={classes.table} size="small">
                  {columnsArray && <TableHead columns={cols} sorting={sort} />}
                  <TableBody data-testid="cases-list">
                    {cases.map((caseRowValues) => {
                      const checked =
                        utils.generic.isValidArray(multiSelectedCasesList, true) &&
                        Boolean(multiSelectedCasesList.find((item) => item?.id == caseRowValues?.id)); // eslint-disable-line eqeqeq

                      return (
                        <TableRow
                          key={`${caseRowValues.caseId}-${caseRowValues.taskId}`}
                          data-testid={`case-row-${caseRowValues.id}`}
                          className={classnames({
                            [classes.row]: true,
                            [classes.rowSelected]:
                              utils.generic.isValidArray(selectedCases, true) && selectedCases[0]?.caseId == caseRowValues.caseId, // eslint-disable-line eqeqeq
                          })}
                        >
                          <TableCell
                            {...columnProps(utils.string.t('premiumProcessing.columns.select'))}
                            data-testid={`select-case-checkbox-${caseRowValues.id}`}
                            className={classes.cellCheckbox}
                          >
                            <Checkbox
                              name={`case-checkbox-row-${caseRowValues.id}`}
                              type="checkbox"
                              value={checked}
                              checked={checked}
                              color="primary"
                              onChange={(event) => rowCheckboxClick(caseRowValues, event)}
                            />
                          </TableCell>

                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('flag')}
                            data-testid={`flag-${caseRowValues.id}`}
                            className={classes.flagDirection}
                          >
                            <>
                              {utils.generic.isValidArray(caseRowValues.flag, true) &&
                                caseRowValues.flag.map((flagType) => {
                                  return (
                                    <span className={classes.flags} key={flagType}>
                                      {flagType === constants.RFI && (
                                        <Tooltip title={utils.string.t('premiumProcessing.flagTooltip.rfiFlag')} placement="bottom">
                                          <Avatar variant="rounded" className={classes.rfiFlag} size={10}>
                                            <Translate label={utils.string.t('premiumProcessing.columns.rfiFlag')} />
                                          </Avatar>
                                        </Tooltip>
                                      )}
                                      {flagType === constants.QC_FLAG && (
                                        <Tooltip title={utils.string.t('premiumProcessing.flagTooltip.qcFlag')} placement="bottom">
                                          <Avatar variant="rounded" className={classes.qcFlag} size={10}>
                                            <Translate label={utils.string.t('premiumProcessing.columns.qcFlag')} />
                                          </Avatar>
                                        </Tooltip>
                                      )}
                                      {flagType === constants.RP_FLAG && (
                                        <Tooltip title={utils.string.t('premiumProcessing.flagTooltip.rpFlag')} placement="bottom">
                                          <Avatar variant="rounded" className={classes.rpFlag} size={10}>
                                            <Translate label={utils.string.t('premiumProcessing.columns.rpFlag')} />
                                          </Avatar>
                                        </Tooltip>
                                      )}

                                      {flagType === constants.RESUBMITTED_FLAG && (
                                        <Tooltip title={utils.string.t('premiumProcessing.flagTooltip.rsFlag')} placement="bottom">
                                          <Avatar variant="rounded" className={classes.rsFlag} size={10}>
                                            <Translate label={utils.string.t('premiumProcessing.columns.rsFlag')} />
                                          </Avatar>
                                        </Tooltip>
                                      )}

                                      {flagType === constants.REJECTCLOSE_FLAG && (
                                        <Tooltip title={utils.string.t('premiumProcessing.flagTooltip.rcFlag')} placement="bottom">
                                          <Avatar variant="rounded" className={classes.rsFlag} size={10}>
                                            <Translate label={utils.string.t('premiumProcessing.columns.rcFlag')} />
                                          </Avatar>
                                        </Tooltip>
                                      )}
                                    </span>
                                  );
                                })}
                            </>
                          </TableCell>

                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            data-testid={`case-${caseRowValues.id}`}
                            {...columnProps('department')}
                          >
                            <span className={classes.relativeBox}>{caseRowValues.department}</span>
                          </TableCell>

                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            data-testid={`date-${caseRowValues.id}`}
                            {...columnProps('caseCreatedOn')}
                          >
                            <Box>{caseRowValues.caseCreatedOn}</Box>
                            <Box>
                              <Typography
                                variant="body2"
                                noWrap
                                className={!caseRowValues.slaFlag ? classes.subText : classes.subTextError}
                              >
                                {caseRowValues.slaDaysPending}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            data-testid={`policy-number-${caseRowValues.id}`}
                            {...columnProps('policyRef')}
                          >
                            <Box>{caseRowValues.policyRef}</Box>
                            <Box>
                              <Typography variant="body2" noWrap className={classes.subText}>
                                {caseRowValues.insuredOrCoverHolder}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            data-testid={`insured-${caseRowValues.id}`}
                            {...columnProps('processName')}
                          >
                            {caseRowValues.processName}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('priority')}
                          >
                            {caseRowValues.priority && (
                              <Status
                                size="sm"
                                text={
                                  <Translate
                                    label={
                                      utils.string.replaceLowerCase(caseRowValues.priority) === 'yes'
                                        ? utils.string.t('app.high')
                                        : utils.string.t('app.medium')
                                    }
                                  />
                                }
                                status={
                                  utils.string.replaceLowerCase(caseRowValues.priority) === 'yes'
                                    ? 'error'
                                    : utils.string.replaceLowerCase(caseRowValues.priority) === 'no'
                                    ? 'alert'
                                    : 'success'
                                }
                              />
                            )}
                          </TableCell>
                          <TableCell {...columnProps('assignedToUser')} data-testid={`assigned-to-${caseRowValues.id}`}>
                            {tabSelectionView === constants.WORKBASKET &&
                            !utils.user.isAdminUser(utils.generic.isValidArray(userRoleDetails, true) && userRoleDetails[0]) ? (
                              <Box className={classes.assignedToAlignment} title={caseRowValues.assignedToUser?.id}>
                                <SelectPopover
                                  id={`select-popover-${caseRowValues.id}`}
                                  buttonText={
                                    caseRowValues.assignedToUser?.name ? utils.string.t('app.reAssign') : utils.string.t('app.assign')
                                  }
                                  showButtonTextOnly={false}
                                  text={caseRowValues.assignedToUser?.name || utils.string.t('premiumProcessing.unAssigned')}
                                  toolTip={caseRowValues.assignedToUser?.id}
                                  displaySelectedText={caseRowValues.assignedToUser}
                                  buttonVariant={'text'}
                                  buttonDisabled={multiSelectedCasesList.length > 0 ? true : false}
                                  value={caseRowValues.assignedToUser}
                                  handlers={{
                                    onTogglePopOver: (data) => {
                                      if (data) {
                                        if (!isAssignedToUserList) {
                                          getAssignedToUsersDetails();
                                        }
                                      }
                                    },
                                    onToggleOption: (values) => {
                                      if (
                                        assignedToSelected &&
                                        assignedToSelected.name &&
                                        assignedToSelected.id &&
                                        assignedToSelected.emailId
                                      ) {
                                        if (caseRowValues.id === assignedToSelected.caseRowId) {
                                          handlers.assignedUsersToCase(
                                            {
                                              name: assignedToSelected.name,
                                              emailId: assignedToSelected.emailId,
                                              id: assignedToSelected.id,
                                            },
                                            [caseRowValues],
                                            false
                                          );
                                          setAssignedToSelected(null);
                                        } else {
                                          dispatch(enqueueNotification(utils.string.t('premiumProcessing.validUserSelection'), 'warning'));
                                        }
                                      } else {
                                        dispatch(enqueueNotification(utils.string.t('premiumProcessing.validUserSelection'), 'warning'));
                                      }
                                    },
                                  }}
                                >
                                  <SingleSelect
                                    search
                                    value={caseRowValues.assignedToUser}
                                    placeholder={'search users'}
                                    options={assingnedToDropdownList}
                                    handlers={{
                                      onToggleOption: (item) => {
                                        setAssignedToSelected(null);
                                        if (item) {
                                          setAssignedToSelected({
                                            name: item.name,
                                            emailId: item.id,
                                            id: item.id,
                                            caseRowId: caseRowValues.id,
                                          });
                                        }
                                      },
                                    }}
                                  />
                                </SelectPopover>
                              </Box>
                            ) : (
                              <Tooltip title={caseRowValues.assignedToUser?.id} placement={'top'} arrow={true}>
                                <Box
                                  onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                                  onClick={() => tableRowClick(caseRowValues)}
                                >
                                  {caseRowValues.assignedToUser?.name || utils.string.t('premiumProcessing.unAssigned')}
                                </Box>
                              </Tooltip>
                            )}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('caseId')}
                          >
                            {caseRowValues.caseId}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('inceptionDate')}
                          >
                            {caseRowValues.inceptionDate}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('fecName')}
                          >
                            {caseRowValues.fecName}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('bordereauType')}
                          >
                            {caseRowValues.bordereauType}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('facilityType')}
                          >
                            {caseRowValues.facilityType}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('caseStage')}
                          >
                            {caseRowValues.caseStage}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('nonPremium')}
                          >
                            {caseRowValues.nonPremium}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('feeAmendments')}
                          >
                            {caseRowValues.feeAmendments}
                          </TableCell>
                          <TableCell
                            onDoubleClick={() => handleDoubleClickRow(caseRowValues.taskId || caseRowValues.bpmProcessId)}
                            onClick={() => tableRowClick(caseRowValues)}
                            {...columnProps('workPackageReference')}
                          >
                            {caseRowValues.workPackageReference}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
              {!isTableHidden && cases.length === 0 && (
                <Box p={5}>
                  <Warning type="info" align="center" text={utils.string.t('premiumProcessing.noResultsMessage')} size="large" icon />
                </Box>
              )}
            </TableContainer>
          )}
        </Overflow>
      </Box>
      <Grid container>
        <Box marginTop="5px">
          <Typography variant="body2">{utils.string.t('premiumProcessing.multiSelect')}</Typography>
        </Box>
        <Box className={classnames(classes.switchControl, classes.noLeftMargin)}>
          <Switch
            checked={isMultiSelect}
            disabled={isTableHidden || cases.length === 0 || tabSelectionView !== constants.WORKBASKET || disableMultiSelect}
            onChange={(event) => showCheckboxesClick(event)}
          />
        </Box>
        <Box>
          {assingnedToDropdownList && (
            <SelectPopover
              id="multi-select-popover"
              buttonDisabled={
                isMultiSelect
                  ? !isTableHidden && cases.length > 0 && multiSelectedCasesList.length >= 1 && tabSelectionView === constants.WORKBASKET
                    ? false
                    : true
                  : true
              }
              className={classes.bulkAssignPopover}
              buttonText={utils.string.t('app.assign')}
              text={utils.string.t('premiumProcessing.bulkAssignment')}
              value={selectedValueBulkAssign}
              buttonVariant={'outlined'}
              displaySelectedText={selectedValueBulkAssign}
              showButtonTextOnly={true}
              handlers={{
                onTogglePopOver: (data) => {
                  if (data) {
                    if (!isAssignedToUserList) {
                      getAssignedToUsersDetails();
                    }
                  }
                },
                onToggleOption: (values) => {
                  setSelectedValueBulkAssign(values);
                  if (multiSelectedCasesList.length === 0) {
                    dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseNotSelected'), 'warning'));
                  } else {
                    if (multiSelectedCasesList.length > 10) {
                      dispatch(enqueueNotification(utils.string.t('premiumProcessing.caseSelectionWarningMessage'), 'warning'));
                      return;
                    } else {
                      handlers.assignedUsersToCase(values, multiSelectedCasesList, true);
                      setIsBulkSelectClear(true);
                      setSelectedValueBulkAssign(null);
                      if (isMultiSelect && multiSelectedCasesList.length > 0) {
                        const selectColumn = columnsArray?.find((e) => e.id === 'select');
                        selectColumn?.label?.props?.children?.props?.control?.setValue('singlevalue', false);
                      }
                    }
                  }
                },
              }}
            >
              <SingleSelect
                search
                placeholder={'search users'}
                options={assingnedToDropdownList}
                value={selectedValueBulkAssign}
                handlers={{
                  onToggleOption: (item) => {
                    setSelectedValueBulkAssign(item);
                  },
                }}
              />
            </SelectPopover>
          )}
        </Box>
        <Box className={classes.pageRow}>
          <Pagination
            page={get(paginationObj, 'obj.page')}
            count={get(paginationObj, 'obj.rowsTotal')}
            rowsPerPage={get(paginationObj, 'obj.rowsPerPage')}
            onChangePage={get(paginationObj, 'handlers.handleChangePage')}
            onChangeRowsPerPage={get(paginationObj, 'handlers.handleChangeRowsPerPage')}
          />
        </Box>
      </Grid>
    </Box>
  );
}
