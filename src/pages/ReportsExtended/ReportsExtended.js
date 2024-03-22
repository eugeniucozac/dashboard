import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';

// app
import { ReportsExtendedView } from './ReportsExtended.view';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';
import { usePagination } from 'hooks';
import {
  showModal,
  getReportListExtended,
  selectReportListExtended,
  selectSelectedReportGroupExtended,
  deleteReportsExtended,
  selectReportListExtendedPagination,
  selectReportListExtendedSort,
  selectUser,
  selectReportListExtendedLoading,
} from 'stores';

export default function ReportsExtended() {
  const history = useHistory();
  const { groupId } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const brand = useSelector((state) => state.ui.brand);
  const reportList = useSelector(selectReportListExtended);
  const selectedReportGroup = useSelector(selectSelectedReportGroupExtended);
  const reportListPagination = useSelector(selectReportListExtendedPagination);
  const reportListSorting = useSelector(selectReportListExtendedSort);
  const user = useSelector(selectUser);
  const isReportListLoading = useSelector(selectReportListExtendedLoading);

  const hasCreateReportPermission = utils.app.access.feature('reporting.addReport', ['read', 'create', 'update', 'delete'], user);
  const hasEditReportPermission = utils.app.access.feature('reporting.editReport', ['update'], user);
  const hasDeleteReportPermission = utils.app.access.feature('reporting.deleteReport', ['delete'], user);

  const reportGroupTitle = selectedReportGroup?.name || location?.state?.reportGroupTitle;
  const reportListParam = {};

  useEffect(() => {
    dispatch(getReportListExtended(reportListParam, groupId));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(
    () => {
      setBreadcrumbs([
        {
          name: 'report-group',
          label: utils.string.t('reportingExtended.title'),
          link: `${config.routes.reportingExtended.root}`,
        },
        {
          name: 'report',
          label: reportGroupTitle || '',
          link: `${config.routes.reportingExtended.root}/${groupId}`,
          active: false,
        },
      ]);
    },
    [reportGroupTitle] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const setActiveBreadCrumbStep = (breadcrumbs) => {
    // abort
    if (!utils.generic.isValidArray(breadcrumbs, true)) return [];

    return breadcrumbs?.map((item) => {
      if (
        item.name === constants.REPORTING_EXTENDED_BREADCRUMB_REPORT &&
        history.location.pathname.includes(`reporting-extended/${groupId}`)
      ) {
        item.active = true;
      } else {
        item.active = history.location.pathname === item.link;
      }
      return item;
    });
  };

  const cols = [
    {
      id: 'reportName',
      label: utils.string.t('reportingExtended.reporting.columns.reportName'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'description',
      label: utils.string.t('reportingExtended.reporting.columns.description'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'createdBy',
      label: utils.string.t('reportingExtended.reporting.columns.createdBy'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'createdDate',
      label: utils.string.t('reportingExtended.reporting.columns.createdDate'),
      sort: { type: 'date', direction: 'asc' },
    },
    ...(hasEditReportPermission || hasDeleteReportPermission ? [{ id: 'actions', menu: true, visible: true }] : []),
  ];

  const handleClickRow = (report) => (event) => {
    const { src } = report;
    if (src) {
      // This is also a temp solution, not sure which will be the finalized and working solution.
      window.open(src, '_blank');
    } else {
      window.open(
        'https://app.powerbi.com/reportEmbed?reportId=7a6d4c46-63ad-4809-8ad8-781b42b43039&autoAuth=true&ctid=281280b5-acfc-430d-896a-9b49855a3f17&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVrLXNvdXRoLWItcHJpbWFyeS1yZWRpcmVjdC5hbmFseXNpcy53aW5kb3dzLm5ldC8ifQ%3D%3D',
        '_blank'
      );
    }
    // Keeping the below conditon commented as we don't know the finalized functionality yet. If we are removing the below, then have to remove whole detaila page as well.
    // if (groupId && id) {
    //   history.push(`${config.routes.reportingExtended.root}/${groupId}/${id}`, {
    //     reportGroupTitle,
    //     reportId: id,
    //     reportTitle: title,
    //   });
    // }
  };

  const handleChangePage = (newPage) => {
    dispatch(getReportListExtended({ page: newPage + 1 }, groupId));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getReportListExtended({ size: rowsPerPage }, groupId));
  };

  const searchSubmit = ({ search, filters }) => {
    dispatch(getReportListExtended({ searchBy: search, filters }, groupId));
  };

  const onSortColumn = (by, dir, type) => {
    dispatch(getReportListExtended({ sortBy: by, direction: dir, sortType: type }, groupId));
  };

  const onSuccessfulCreateOrEditOrDeleteReport = () => {
    dispatch(getReportListExtended(reportListParam, groupId));
  };

  const handleCreateEditReport = (isEditAddReport, report) => {
    dispatch(
      showModal({
        component: 'REPORTS_EXTENDED_ADD_EDIT',
        props: {
          fullWidth: false,
          maxWidth: 'sm',
          title: isEditAddReport
            ? utils.string.t('reportingExtended.reporting.editReport')
            : utils.string.t('reportingExtended.reporting.createReport'),
          componentProps: {
            report,
            groupId,
            isEditAddReport,
            handlers: {
              onSuccessfulCreateOrEditOrDeleteReport,
            },
          },
        },
      })
    );
  };

  const handleDeleteReport = (report) => {
    const { id, title } = report;
    const submitHandler = () => {
      dispatch(deleteReportsExtended(id)).then((response) => {
        if (response?.status === constants.API_RESPONSE_NO_CONTENT_STATUS) {
          onSuccessfulCreateOrEditOrDeleteReport();
        }
      });
    };

    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: `${utils.string.t('reportingExtended.reporting.deleteReport')}`,
          subtitle: title,
          fullWidth: true,
          maxWidth: 'xs',
          disableAutoFocus: true,
          componentProps: {
            submitHandler,
          },
        },
      })
    );
  };

  const popoverActions = [
    ...(hasEditReportPermission
      ? [
          {
            id: 'edit',
            label: utils.string.t('reportingExtended.reporting.popOverMenuItems.edit'),
            callback: ({ report }) => handleCreateEditReport(true, report),
          },
        ]
      : []),
    ...(hasDeleteReportPermission
      ? [
          {
            id: 'delete',
            label: utils.string.t('reportingExtended.reporting.popOverMenuItems.delete'),
            callback: ({ report }) => handleDeleteReport(report),
          },
        ]
      : []),
  ];

  const pagination = usePagination(reportList, reportListPagination, handleChangePage, handleChangeRowsPerPage);

  return (
    <>
      <Helmet>
        <title>{`${reportGroupTitle} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ReportsExtendedView
        breadcrumbs={setActiveBreadCrumbStep(breadcrumbs)}
        columns={cols}
        reports={reportList}
        popoverActions={popoverActions}
        pagination={pagination.obj}
        sort={reportListSorting}
        hasCreateReportPermission={hasCreateReportPermission}
        reportGroupTitle={reportGroupTitle}
        isReportListLoading={isReportListLoading}
        handlers={{
          handleClickRow,
          handleCreateEditReport,
          handleChangePage: pagination.handlers.handleChangePage,
          handleChangeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
          searchSubmit,
          onSortColumn,
        }}
      />
    </>
  );
}
