import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';

//app
import styles from './ProcessingInstructionsList.styles';
import { ProcessingInstructionsListView } from './ProcessingInstructionsList.view';
import { MultiSelect, MultiSelectAsync } from 'components';
import {
  getProcessingInstructionsGridData,
  getNewInstructionsId,
  getPiRefData,
  showModal,
  getProcessingInstructionStatusUpdate,
  selectUser,
  selectRefDataXbInstances,
  selectPiDepartmentList,
  selectPiGridDataLoading,
  selectPiHasNoGridData,
} from 'stores';
import { useFlexiColumns } from 'hooks';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';

// mui
import { makeStyles } from '@material-ui/core';

ProcessingInstructionsList.propTypes = {
  gridData: PropTypes.shape({
    items: PropTypes.array.isRequired,
    page: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    itemsTotal: PropTypes.number.isRequired,
  }).isRequired,
  processTypes: PropTypes.arrayOf(
    PropTypes.shape({
      processTypeID: PropTypes.number.isRequired,
      processTypeDetails: PropTypes.string.isRequired,
    })
  ).isRequired,
  departments: PropTypes.array.isRequired,
  statuses: PropTypes.array.isRequired,
};

export default function ProcessingInstructionsList({ gridData, processTypes = [], departments = [], statuses = [] }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = makeStyles(styles, { name: 'ProcessingInstructionsList' })();
  const processingInstructionsSort = useSelector((state) => get(state, 'processingInstructions.gridData.sort'));
  const [totalRowsPerPage, setTotalRowsPerPage] = useState(0);
  const user = useSelector(selectUser);
  const refDataXbInstances = useSelector(selectRefDataXbInstances);
  const piGridDataLoading = useSelector(selectPiGridDataLoading);
  const piHasNoGridData = useSelector(selectPiHasNoGridData);
  const departmentList = useSelector(selectPiDepartmentList);

  const userHasApproverAccess = utils.app.access.feature('processingInstructions.approverChecklist', ['create', 'update'], user);
  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);

  const [isPiGridDataLoading, setIsPiGridDataLoading] = useState(piGridDataLoading);
  const [isPiHasNoGridData, setIsPiHasNoGridData] = useState(piHasNoGridData);
  const fetchAsyncAssureds = useCallback(
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
  useEffect(() => {
    setIsPiGridDataLoading(piGridDataLoading);
    setIsPiHasNoGridData(piHasNoGridData);
  }, [piGridDataLoading, gridData, piHasNoGridData]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAsyncIds = useCallback(
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

  const searchSubmit = ({ search, filters }) => {
    dispatch(getProcessingInstructionsGridData({ query: search, filters }));
  };

  const resetSubmit = () => {
    dispatch(getProcessingInstructionsGridData({ filters: {} }));
  };

  const handleSort = (by, dir) => {
    dispatch(getProcessingInstructionsGridData({ sortBy: by, direction: dir }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getProcessingInstructionsGridData({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    setTotalRowsPerPage(rowsPerPage);
    dispatch(getProcessingInstructionsGridData({ size: rowsPerPage }));
  };

  const handleProcessSelection = (process) => {
    if (process) {
      dispatch(getNewInstructionsId(process)).then((response) => {
        if (response?.id) {
          const id = response?.id;
          history.push(`${config.routes.processingInstructions.steps}/${id}`);
        }
      });
    }
  };

  const editPopup = (instructionId) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          fullWidth: true,
          title: utils.string.t('processingInstructions.details.updateProcessingInstructionLabel'),
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('processingInstructions.authorisations.form.cancel'),
            confirmLabel: utils.string.t('processingInstructions.authorisations.form.proceed'),
            confirmMessage: utils.string.t('processingInstructions.details.updateInstruction'),

            submitHandler: () => {
              dispatch(getProcessingInstructionStatusUpdate(instructionId)).then((res) => {
                window.open(`${config.routes.processingInstructions.steps}/${instructionId}`, '_blank');
                dispatch(getProcessingInstructionsGridData({ size: totalRowsPerPage }));
              });
            },
            handleClose: () => { },
          },
        },
      })
    );
  };

  const [columns] = useState([
    {
      id: 'instructionId',
      label: utils.string.t('processingInstructions.gridColumns.instructionId'),
      sort: { type: 'number', direction: 'asc' },
      nowrap: true,
      visible: true,
      mandatory: true,
    },
    {
      id: 'status',
      label: utils.string.t('processingInstructions.gridColumns.status'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'insuredName',
      label: utils.string.t('processingInstructions.gridColumns.insuredCoverHolder'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'inceptionDate',
      label: utils.string.t('processingInstructions.gridColumns.inceptionDate'),
      sort: { type: 'date', direction: 'asc' },
      nowrap: true,
      visible: true,
    },
    {
      id: 'createdByDept',
      label: utils.string.t('processingInstructions.gridColumns.department'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'gxbInstance',
      label: utils.string.t('processingInstructions.gridColumns.gxbInstance'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'processType',
      label: utils.string.t('processingInstructions.gridColumns.process'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'frontEndContact',
      label: utils.string.t('processingInstructions.gridColumns.frontEndContact'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    {
      id: 'createdDate',
      label: utils.string.t('processingInstructions.gridColumns.createdDate'),
      sort: { type: 'lexical', direction: 'asc' },
      visible: true,
    },
    ...(userHasWritePermission
      ? [
        {
          id: 'update',
          label: utils.string.t('processingInstructions.gridColumns.update'),
          visible: true,
        },
      ]
      : []),
  ]);

  const { columns: columnsArray, isTableHidden, columnProps, toggleColumn } = useFlexiColumns(columns);

  const optionsProcessTypes = processTypes
    .filter((type) => type?.primary && type?.businessProcessID === constants.BUSINESS_PROCESS_PREMIUM_PROCESSING_ID)
    .map((type) => ({
      id: type.processTypeDetails,
      name: utils.string.t(`processingInstructions.type.${type.processTypeID}`),
    }));

  const optionsDepartments = utils.generic.isValidArray(departments, true) ? uniqBy(departments, 'deptName')?.map((d) => ({ id: d.id, name: d.deptName }))?.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)) : [];

  const optionsStatuses = (
    userHasApproverAccess
      ? statuses.filter(
        (s) =>
          utils.processingInstructions.status.isSubmittedAuthorisedSignatory(s?.instructionStatusID) ||
          utils.processingInstructions.status.isSubmittedProcessing(s.instructionStatusID)
      )
      : statuses
  ).map((s) => ({
    id: s.instructionStatusName,
    name: utils.string.t(`processingInstructions.status.${s.instructionStatusID}`),
  }));

  const filtersArray = [
    {
      id: 'assuredNames',
      type: 'multiSelectAsync',
      label: utils.string.t('processingInstructions.filters.types.insured'),
      value: [],
      maxHeight: 500,
      nestedClasses: { popover: classes.popoverAssureds },
      content: (
        <MultiSelectAsync
          id="assuredNames"
          max={5}
          searchMinChars={3}
          placeholder={utils.string.t('app.search')}
          labels={{ hint: utils.string.t('processingInstructions.filters.hintInsured') }}
          handlers={{
            fetch: fetchAsyncAssureds,
          }}
        />
      ),
    },
    {
      id: 'instructionIds',
      type: 'multiSelectAsync',
      label: utils.string.t('processingInstructions.filters.types.instructionId'),
      value: [],
      maxHeight: 500,
      content: (
        <MultiSelectAsync
          id="instructionIds"
          max={5}
          searchMinChars={4}
          placeholder={utils.string.t('app.search')}
          labels={{ hint: utils.string.t('processingInstructions.filters.hintInsured') }}
          handlers={{
            fetch: fetchAsyncIds,
          }}
        />
      ),
    },
    {
      id: 'processTypes',
      type: 'multiSelect',
      label: utils.string.t('processingInstructions.filters.types.process'),
      value: [],
      options: optionsProcessTypes,
      content: <MultiSelect id="processTypes" search options={optionsProcessTypes} />,
    },
    {
      id: 'createdByDepts',
      type: 'multiSelect',
      label: utils.string.t('processingInstructions.filters.types.department'),
      value: [],
      options: optionsDepartments,
      nestedClasses: { popover: classes.popoverDept },
      content: <MultiSelect id="createdByDepts" search options={optionsDepartments} max={5} />,
    },
    {
      id: 'status',
      type: 'multiSelect',
      label: utils.string.t('processingInstructions.filters.types.status'),
      value: [],
      options: optionsStatuses,
      nestedClasses: { popover: classes.popoverStatus },
      content: <MultiSelect id="status" search options={optionsStatuses} />,
    },
  ];

  return (
    <ProcessingInstructionsListView
      rows={gridData?.items}
      processTypes={processTypes}
      refDataXbInstances={refDataXbInstances}
      departmentList={departmentList}
      sort={processingInstructionsSort}
      pagination={{
        page: gridData?.page - 1,
        rowsTotal: gridData?.itemsTotal,
        rowsPerPage: gridData?.pageSize,
      }}
      columnsArray={columnsArray}
      columnProps={columnProps}
      isTableHidden={isTableHidden}
      filtersArray={filtersArray}
      isPiGridDataLoading={isPiGridDataLoading}
      isPiHasNoGridData={isPiHasNoGridData}
      handlers={{
        searchSubmit,
        resetSubmit,
        handleSort,
        handleChangePage,
        handleChangeRowsPerPage,
        handleProcessSelection,
        toggleColumn,
        editPopup,
      }}
    />
  );
}
