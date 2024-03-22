import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

// app
import { TripsView } from './Trips.view';
import { usePagination } from 'hooks';
import { getTripList, getTripById, deleteTrip, showModal } from 'stores';
import config from 'config';
import * as utils from 'utils';

export default function Trips() {
  const dispatch = useDispatch();
  const history = useHistory();
  const brand = useSelector((state) => state.ui.brand);
  const loader = useSelector((store) => get(store, 'ui.loader.queue', []));
  const tripList = useSelector((store) => store.trip.list);
  const tripSelected = useSelector((store) => store.trip.selected);

  useEffect(
    () => {
      dispatch(getTripList());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const handleSearch = async (query) => {
    await dispatch(getTripList({ query: query }));
  };

  const handleSearchReset = () => {
    if (get(tripList, 'query')) {
      dispatch(getTripList({ query: '' }));
    }
  };

  const handleChangePage = (newPage) => {
    dispatch(getTripList({ page: newPage + 1 }));
  };

  const handleChangeRowsPerPage = (rowsPerPage) => {
    dispatch(getTripList({ size: rowsPerPage }));
  };

  const handleEdit = (popoverData) => {
    history.push(`${config.routes.opportunity.root}/${popoverData.id}`);
  };

  const handleClickRow = (id) => (event) => {
    dispatch(getTripById(id, false));
  };

  const handleDelete = (popoverData) => {
    let submitHandler = () => {
      dispatch(deleteTrip(popoverData.id));
    };

    dispatch(
      showModal({
        component: 'CONFIRM_DELETE',
        props: {
          title: 'trips.deleteTrip',
          subtitle: popoverData.title,
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

  // get the pagination values from the store (populated from API endpoint pagination)
  // and pass them to usePagination to update its state
  const paginationObj = {
    page: tripList.page - 1,
    rowsTotal: tripList.itemsTotal,
    rowsPerPage: tripList.pageSize,
  };

  const pagination = usePagination(tripList.items, paginationObj, handleChangePage, handleChangeRowsPerPage);

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('trips.title')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>

      <TripsView
        list={tripList}
        selected={tripSelected || {}}
        sort={{
          by: tripList.sortBy,
          type: tripList.sortType,
          direction: tripList.sortDirection,
        }}
        pagination={pagination.obj}
        loader={loader}
        handleSearch={handleSearch}
        handleSearchReset={handleSearchReset}
        handleChangePage={pagination.handlers.handleChangePage}
        handleChangeRowsPerPage={pagination.handlers.handleChangeRowsPerPage}
        handleEdit={handleEdit}
        handleClickRow={handleClickRow}
        handleDelete={handleDelete}
      />
    </>
  );
}
