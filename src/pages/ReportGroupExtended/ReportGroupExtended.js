import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet';

// app
import { ReportGroupExtendedView } from './ReportGroupExtended.view';
import * as utils from 'utils';
import config from 'config';
import * as constants from 'consts';
import { usePagination } from 'hooks';
import {
  getReportGroupListExtended,
  showModal,
  resetReportGroupListExtended,
  selectReportGroupListExtended,
  selectReportGroupListExtendedPagination,
  selectReportGroupListExtendedSort,
  deleteReportGroupExtended,
  selectUserBusinessProcess,
  selectUser,
  selectReportGroupListExtendedLoading,
} from 'stores';

export default function ReportGroupExtended() {
  const history = useHistory();
  const dispatch = useDispatch();

  const brand = useSelector((state) => state.ui.brand);
  const businessProcess = useSelector(selectUserBusinessProcess);
  const reportGroupList = useSelector(selectReportGroupListExtended);
  const reportGroupListPagination = useSelector(selectReportGroupListExtendedPagination);
  const reportGroupListSorting = useSelector(selectReportGroupListExtendedSort);
  const user = useSelector(selectUser);
  const isReportGroupListLoading = useSelector(selectReportGroupListExtendedLoading);

  const hasCreateReportGroupPermission = utils.app.access.feature('reporting.addGroup', ['read', 'create', 'update', 'delete'], user);
  const hasEditReportGroupPermission = utils.app.access.feature('reporting.editGroup', ['update'], user);
  const hasDeleteReportGroupPermission = utils.app.access.feature('reporting.deleteGroup', ['delete'], user);

  const getTabValue = (id) => {
    let tabValue;
    switch (id) {
      case constants.BUSINESS_PROCESS_PREMIUM_PROCESSING_ID:
        tabValue = constants.REPORTING_EXTENDED_GROUP_TAB_PREMIUM_PROCESSING;
        break;
      case constants.BUSINESS_PROCESS_CLAIMS_ID:
        tabValue = constants.REPORTING_EXTENDED_GROUP_TAB_CLAIMS;
        break;
      case constants.BUSINESS_PROCESS_INSURANCE_BROKER_ACCOUNTING_ID:
        tabValue = constants.REPORTING_EXTENDED_GROUP_TAB_INSURANCE_BROKER_ACCOUNTING;
        break;
      case constants.BUSINESS_PROCESS_BUSINESS_ENTITIES_ID:
        tabValue = constants.REPORTING_EXTENDED_GROUP_TAB_BUSINESS_ENTITIES;
        break;
      case constants.BUSINESS_PROCESS_FACILITIES_ID:
        tabValue = constants.REPORTING_EXTENDED_GROUP_TAB_FACILITIES;
        break;
      case constants.BUSINESS_PROCESS_OPEN_MARKET_ID:
        tabValue = constants.REPORTING_EXTENDED_GROUP_TAB_OPEN_MARKET;
        break;
      default:
        return tabValue;
    }
    return tabValue;
  };

  const getTabLabel = (id, name) => {
    let tabLabel = '';
    switch (id) {
      case constants.BUSINESS_PROCESS_PREMIUM_PROCESSING_ID:
        tabLabel = name;
        break;
      case constants.BUSINESS_PROCESS_CLAIMS_ID:
        tabLabel = name;
        break;
      case constants.BUSINESS_PROCESS_INSURANCE_BROKER_ACCOUNTING_ID:
        tabLabel = constants.REPORTING_EXTENDED_GROUP_ABBREVATION_INSURANCE_BROKER_ACCOUNTING;
        break;
      case constants.BUSINESS_PROCESS_BUSINESS_ENTITIES_ID:
        tabLabel = constants.REPORTING_EXTENDED_GROUP_ABBREVATION_BUSINESS_ENTITIES;
        break;
      case constants.BUSINESS_PROCESS_FACILITIES_ID:
        tabLabel = name;
        break;
      case constants.BUSINESS_PROCESS_OPEN_MARKET_ID:
        tabLabel = name;
        break;
      default:
        return tabLabel;
    }
    return tabLabel;
  };

  const getTabs = () => {
    const tabs =
      utils.generic.isValidArray(businessProcess, true) &&
      businessProcess?.map((bp) => {
        return {
          value: getTabValue(bp.id),
          label: getTabLabel(bp.id, bp.name).toUpperCase(),
          disabled:
            // Disabling everything else as EPIC - 12 is only for PP reporting groups
            bp.id === constants.BUSINESS_PROCESS_PREMIUM_PROCESSING_ID ? false : true,
        };
      });
    return tabs;
  };

  const tabValue = getTabs()?.[0]?.value;

  const [selectedTab, setSelectedTab] = useState(tabValue);

  useEffect(
    () => {
      dispatch(getReportGroupListExtended());

      // cleanup
      return () => {
        dispatch(resetReportGroupListExtended());
      };
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const cols = [
    {
      id: 'myReportGroup',
      label: utils.string.t('reportingExtended.reportingGroup.columns.myReportGroup'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'description',
      label: utils.string.t('reportingExtended.reportingGroup.columns.description'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'createdBy',
      label: utils.string.t('reportingExtended.reportingGroup.columns.createdBy'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    {
      id: 'createdDate',
      label: utils.string.t('reportingExtended.reportingGroup.columns.createdDate'),
      sort: { type: 'date', direction: 'asc' },
    },
    {
      id: 'reportCount',
      label: utils.string.t('reportingExtended.reportingGroup.columns.reportCount'),
      sort: { type: 'lexical', direction: 'asc' },
    },
    ...(hasEditReportGroupPermission || hasDeleteReportGroupPermission ? [{ id: 'actions', menu: true, visible: true }] : []),
  ];

  const handleClickRow = (reportGrp) => (event) => {
    const { id, name } = reportGrp;
    history.push(`${config.routes.reportingExtended.root}${id ? `/${id}` : ''}`, { reportGroupTitle: name, reportGroupId: id });
  };

  const handleChangePage = (newPage) => {
    dispatch(getReportGroupListExtended({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getReportGroupListExtended({ size: rowsPerPage }));
  };

  const searchSubmit = ({ search, filters }) => {
    dispatch(getReportGroupListExtended({ searchBy: search, filters }));
  };

  const onSortColumn = (by, dir, type) => {
    dispatch(getReportGroupListExtended({ sortBy: by, direction: dir, sortType: type }));
  };

  const onSuccessfulCreateOrEditOrDeleteReportGroup = () => {
    dispatch(getReportGroupListExtended());
  };

  const handleCreateEditReportGroup = (isEditReportGroup, reportGrp) => {
    dispatch(
      showModal({
        component: 'REPORT_GROUP_EXTENDED_ADD_EDIT',
        props: {
          fullWidth: false,
          maxWidth: 'lg',
          title: isEditReportGroup
            ? utils.string.t('reportingExtended.reportingGroup.editReportGroup')
            : utils.string.t('reportingExtended.reportingGroup.createReportGroup'),
          componentProps: {
            reportGrp,
            isEditReportGroup,
            handlers: {
              onSuccessfulCreateOrEditOrDeleteReportGroup,
            },
          },
        },
      })
    );
  };

  const handleDeleteReportGroup = (reportGrp) => {
    const { id, name } = reportGrp;
    const submitHandler = () => {
      dispatch(deleteReportGroupExtended(id)).then((response) => {
        if (response?.status === constants.API_RESPONSE_NO_CONTENT_STATUS) {
          onSuccessfulCreateOrEditOrDeleteReportGroup();
        }
      });
    };

    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: `${utils.string.t('reportingExtended.reportingGroup.deleteReportGroup')}`,
          subtitle: name,
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
    ...(hasEditReportGroupPermission
      ? [
          {
            id: 'edit',
            label: utils.string.t('reportingExtended.reportingGroup.popOverMenuItems.edit'),
            callback: ({ reportGrp }) => handleCreateEditReportGroup(true, reportGrp),
          },
        ]
      : []),
    ...(hasDeleteReportGroupPermission
      ? [
          {
            id: 'delete',
            label: utils.string.t('reportingExtended.reportingGroup.popOverMenuItems.delete'),
            callback: ({ reportGrp }) => handleDeleteReportGroup(reportGrp),
          },
        ]
      : []),
  ];

  const pagination = usePagination(reportGroupList, reportGroupListPagination, handleChangePage, handleChangeRowsPerPage);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('reportingExtended.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ReportGroupExtendedView
        columns={cols}
        reportGroupList={reportGroupList}
        popoverActions={popoverActions}
        tabs={getTabs()}
        selectedTab={selectedTab}
        pagination={pagination.obj}
        sort={reportGroupListSorting}
        hasCreateReportGroupPermission={hasCreateReportGroupPermission}
        isReportGroupListLoading={isReportGroupListLoading}
        handlers={{
          handleClickRow: handleClickRow,
          handleSelectTab: setSelectedTab,
          handleCreateEditReportGroup: handleCreateEditReportGroup,
          handleChangePage: pagination.handlers.handleChangePage,
          handleChangeRowsPerPage: pagination.handlers.handleChangeRowsPerPage,
          searchSubmit,
          onSortColumn,
        }}
      />
    </>
  );
}
