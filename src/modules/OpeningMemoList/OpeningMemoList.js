import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import PropTypes from 'prop-types';

// app
import { OpeningMemoListView } from './OpeningMemoList.view';
import { selectOpeningMemoList, getOpeningMemoPlacementList, updateOpeningMemoFilterByStatus, resetOpeningMemoList } from 'stores';
import { downloadPDF } from '../OpeningMemo/OpeningMemo.pdf';
import { usePagination } from 'hooks';
import * as utils from 'utils';

OpeningMemoList.propTypes = {
  routeWithId: PropTypes.bool.isRequired,
  route: PropTypes.string.isRequired,
  origin: PropTypes.shape({
    path: PropTypes.string.isRequired,
    id: PropTypes.number,
  }),
};

OpeningMemoList.defaultProps = {
  origin: {},
};

export default function OpeningMemoList({ routeWithId, route, origin }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const openingMemoList = useSelector(selectOpeningMemoList) || {};
  const referenceData = useSelector((state) => state.referenceData) || {};
  const departmentId = useSelector((state) => state.user.departmentSelected);

  const paginationObj = {
    page: openingMemoList.page - 1,
    rowsTotal: openingMemoList.itemsTotal,
    rowsPerPage: openingMemoList.pageSize,
  };

  useEffect(
    () => {
      if (!utils.generic.isValidObject(origin) || !departmentId) return;
      if (origin.path === 'department') return;
      dispatch(getOpeningMemoPlacementList({ origin }));
      return () => dispatch(resetOpeningMemoList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  useEffect(
    () => {
      if (!utils.generic.isValidObject(origin) || !departmentId) return;
      const { path } = origin;
      if (path !== 'department') return;
      dispatch(getOpeningMemoPlacementList({ origin: { path, id: departmentId } }));
      return () => dispatch(resetOpeningMemoList());
    },
    [departmentId] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const filterOpeningMemoList = (data) => {
    dispatch(updateOpeningMemoFilterByStatus(data));
    const { path } = origin;
    dispatch(getOpeningMemoPlacementList({ origin: { path, id: departmentId } }));
  };

  const handleChangePage = (newPage) => {
    dispatch(
      getOpeningMemoPlacementList({
        origin: {
          path: origin.path,
          id: origin.path === 'department' ? departmentId : origin.id,
        },
        page: newPage + 1,
      })
    );
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(
      getOpeningMemoPlacementList({
        origin: {
          path: origin.path,
          id: origin.path === 'department' ? departmentId : origin.id,
        },
        size: rowsPerPage,
      })
    );
  };

  const handleDoubleClickRow = (openingMemoId) => {
    const redirectPath = routeWithId ? `${route}/${origin.id}/${openingMemoId}` : `${route}/${openingMemoId}`;
    history.push(redirectPath);
  };

  const handleDownload = (openingMemoId) => {
    const openingMemo = openingMemoList.items.find((openingMemo) => openingMemo.id === openingMemoId);
    downloadPDF({
      openingMemo,
      departmentName: utils.placement.getDepartmentName(openingMemo, referenceData.departments),
      referenceData,
    });
  };

  const pagination = usePagination(openingMemoList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  return (
    <OpeningMemoListView
      openingMemoList={openingMemoList.items}
      pagination={pagination.obj}
      sort={{
        by: openingMemoList.sortBy,
        type: openingMemoList.sortType,
        direction: openingMemoList.sortDirection,
      }}
      handleChangePage={pagination.handlers.handleChangePage}
      handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
      handleDoubleClickRow={handleDoubleClickRow}
      handleDownload={handleDownload}
      filterOpeningMemoList={filterOpeningMemoList}
    />
  );
}
