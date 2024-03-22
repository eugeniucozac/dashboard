import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet';

import { ReportingView } from './Reporting.view';
import * as utils from 'utils';
import config from 'config';
import { showModal, getReportGroupList, selectReportGroupList, deleteReportGroup, selectIsReportAdmin, deleteReportGroupDoc } from 'stores';
import { usePagination } from 'hooks';

export default function ReportingGroup() {
  const reportingGroupList = useSelector(selectReportGroupList) || {};
  const history = useHistory();
  const dispatch = useDispatch();
  const isReportAdmin = useSelector(selectIsReportAdmin);
  const brand = useSelector((state) => state.ui.brand);

  const paginationObj = {
    page: reportingGroupList.page - 1,
    rowsTotal: reportingGroupList.itemsTotal,
    rowsPerPage: reportingGroupList.pageSize,
  };

  useEffect(
    () => {
      dispatch(getReportGroupList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleChangePage = (newPage) => {
    dispatch(getReportGroupList({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getReportGroupList({ size: rowsPerPage }));
  };

  const pagination = usePagination(reportingGroupList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  const handleClickRow = (group) => (event) => {
    const route = config.routes.reporting.root;
    const id = group.id;
    history.push(`${route}/${id}`);
  };

  const handleEdit = (editReportGroup, popoverData) => {
    dispatch(
      showModal({
        component: 'EDIT_REPORT',
        props: {
          fullWidth: false,
          maxWidth: 'lg',
          title: editReportGroup ? utils.string.t('reporting.editReportGroup') : utils.string.t('reporting.addReportGroup'),
          componentProps: {
            ...popoverData,
            report: popoverData,
            isEditReportGroup: editReportGroup,
          },
        },
      })
    );
  };
  const handleDelete = (popoverData) => {
    let submitHandler = async () => {
      const res = await dispatch(deleteReportGroup(popoverData?.id));
      if (res) {
        dispatch(deleteReportGroupDoc(popoverData?.id));
      }
    };

    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: `${utils.string.t('reporting.deleteReportGroup')} ${popoverData.name}`,
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

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('reporting.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <ReportingView
        isReportAdmin={isReportAdmin}
        pagination={pagination.obj}
        list={reportingGroupList.items ? reportingGroupList.items : []}
        handleClickRow={handleClickRow}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleChangePage={pagination.handlers.handleChangePage}
        handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
        sort={{
          by: reportingGroupList.sortBy,
          direction: reportingGroupList.sortDirection,
        }}
      />
    </>
  );
}
