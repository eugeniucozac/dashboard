import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import toNumber from 'lodash/toNumber';
import get from 'lodash/get';
import * as Yup from 'yup';

// app
import { DepartmentAccountsView } from './DepartmentAccounts.view';
import { Translate } from 'components';
import {
  getPlacementList,
  getPlacementDetails,
  ntuPlacement,
  deselectPlacement,
  removePlacement,
  showModal,
  getLocationGroupsForPlacement,
  selectPlacementList,
  selectPlacementSort,
} from 'stores';
import { useMedia } from 'hooks';
import * as utils from 'utils';
import config from 'config';

export default function DepartmentAccounts() {
  const dispatch = useDispatch();
  const history = useHistory();
  const params = useParams();
  const media = useMedia();

  const today = utils.date.today();
  const initialMonths = media.mobile ? [today] : [today, utils.date.nextMonth(today).date];

  const urlDepartmentId = toNumber(get(params, 'id'));
  const placementList = useSelector(selectPlacementList);
  const placementSort = useSelector(selectPlacementSort);
  const isPhysicalLoss = useSelector((state) => utils.departments.isPhysicalLoss(get(state, 'user.departmentSelected')));
  const [filters, setFilters] = useState({ insured: null, department: null });
  const [calendarView, setCalendarView] = useState(true);
  const [displayMonthList, setDisplayMonthList] = useState(initialMonths);

  useEffect(
    () => {
      dispatch(deselectPlacement());
      setDisplayMonthList(initialMonths);
    },
    [urlDepartmentId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const clickNewEnquiry = (event) => {
    dispatch(
      showModal({
        component: 'NEW_ENQUIRY',
        props: {
          title: 'submission.createNew',
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
        },
      })
    );
  };

  const handleMonthChange = (date) => {
    setDisplayMonthList([date]);
  };

  const handleSearch = (query, dept) => {
    setCalendarView(false);
    return dispatch(getPlacementList({ query, dept }));
  };

  const handleChangePage = (newPage) => {
    dispatch(getPlacementList({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getPlacementList({ size: rowsPerPage }));
  };

  const handleSort = (by, dir) => {
    dispatch(getPlacementList({ orderBy: by, direction: dir }));
  };

  const handleClickRow = (id) => (event) => {
    dispatch(getPlacementDetails(id));
  };

  const handleClickRowMobile = (id) => (event) => {
    dispatch(getLocationGroupsForPlacement(id));
  };

  const handleDoubleClickRow = (id) => (event) => {
    const route = isPhysicalLoss ? config.routes.placement.overview : config.routes.placement.marketing.markets;
    history.push(`${route}/${id}`);
  };

  const handleNtuClick = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: 'renewals.ntuPlacement',
          subtitle: utils.string.t('renewals.ntuPlacementHint', { placement: popoverData.title }),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            submitHandler: () => {
              dispatch(ntuPlacement(popoverData.placement, popoverData?.calendarView));
            },
          },
        },
      })
    );
  };

  const handleEditPlacementClick = (popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_PLACEMENT',
        props: {
          title: 'renewals.editPlacement',
          subtitle: utils.string.t('renewals.editPlacementHint', { placement: popoverData.title }),
          fullWidth: true,
          maxWidth: 'md',
          componentProps: {
            placement: popoverData.placement,
            calendarView: popoverData.calendarView,
          },
        },
      })
    );
  };

  const handleRemovePlacementClick = (popoverData) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: 'renewals.removePlacement',
          subtitle: utils.string.t('renewals.removePlacementHint', { placement: popoverData.title }),
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            submitHandler: () => {
              dispatch(removePlacement(popoverData.placement, popoverData?.calendarView));
            },
          },
        },
      })
    );
  };

  const handleAddButtonClick = (date, next) => {
    const monthList = [...displayMonthList];
    next ? monthList.push(date) : monthList.unshift(date);
    setDisplayMonthList(monthList);
  };

  const fields = [
    {
      gridSize: { xs: 12 },
      name: 'insured',
      type: 'text',
      placeholder: utils.string.t('renewals.searchInsureds'),
      value: '',
      validation: Yup.string().test({
        name: 'insuredLength',
        test: (value) => (value ? value.length >= 2 : true),
        message: utils.string.t('validation.string.min'),
        params: { min: 2 },
      }),
    },
  ];

  const actions = [
    {
      name: 'filter',
      label: utils.string.t('app.searchLabel'),
      handler: (values) => {
        const insured = get(values, 'insured');

        setFilters({ insured });
        handleSearch(insured, urlDepartmentId);
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: () => {
        if (filters.insured || filters.department) {
          setFilters({ insured: null, department: null });
          handleSearch('', null);
          setCalendarView(true);
        }
      },
    },
  ];

  const cols = [
    { id: 'insureds', label: <Translate label="app.insured_plural" />, style: { width: '18vw' } },
    { id: 'clients', label: <Translate label="app.client_plural" />, style: { minWidth: '8vw', maxWidth: '8vw' } },
    { id: 'office', label: <Translate label="app.office_plural" />, style: { minWidth: '9vw', maxWidth: '9vw' } },
    {
      id: 'inceptionDate',
      label: <Translate label={media.wideUp ? 'app.inceptionDate' : 'app.inception'} />,
      nowrap: true,
      sort: { type: 'date', direction: 'asc' },
    },
    { id: 'statusLabel', label: <Translate label="app.status" /> },
    { id: 'brokers', label: <Translate label="app.broker_plural" /> },
    { id: 'cobrokers', label: <Translate label="app.cobroker_plural" />, nowrap: true },
    { id: 'actions', empty: true },
  ];

  return (
    <DepartmentAccountsView
      props={{
        rows: placementList.items,
        cols: cols,
        sort: {
          ...placementSort,
          type: 'date',
        },
        pagination: {
          page: placementList.page - 1,
          rowsTotal: placementList.itemsTotal,
          rowsPerPage: placementList.pageSize,
        },
        handlers: {
          handleChangePage,
          handleChangeRowsPerPage,
          handleSort,
          handleClickRow: media.mobile ? handleClickRowMobile : handleClickRow,
          handleDoubleClickRow,
          handleNtuClick,
          handleEditPlacementClick,
          handleRemovePlacementClick,
        },
      }}
      fields={fields}
      actions={actions}
      deptId={urlDepartmentId}
      media={media}
      calendarView={calendarView}
      displayMonthList={displayMonthList}
      handleAddButtonClick={handleAddButtonClick}
      handleMonthChange={handleMonthChange}
      clickNewEnquiry={clickNewEnquiry}
    />
  );
}
