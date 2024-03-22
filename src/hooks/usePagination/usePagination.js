import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import config from 'config';
import * as utils from 'utils';

usePagination.propTypes = {
  rows: PropTypes.array.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    rowsTotal: PropTypes.number,
  }).isRequired,
  handleChangePage: PropTypes.func,
  handleChangeRowsPerPage: PropTypes.func,
};

export default function usePagination(rows = [], pagination = {}, changePage, changeRowsPerPage) {
  const [page, setPage] = useState(pagination.page || 0);
  const [rowsTotal, setRowsTotal] = useState(pagination.rowsTotal || rows.length || 0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.rowsPerPage || config.ui.pagination.default);

  useEffect(() => {
    // Update the internal state with the props from the parent component.
    // This insures the usePagination is in sync with the endpoint response pagination values.
    // If the parent component doesn't pass props (ex: basic table without API endpoint),
    // then usePagination  component will manage the properties itself
    setPage(pagination.page || 0);
    setRowsTotal(pagination.rowsTotal || rows.length || 0);
    setRowsPerPage(pagination.rowsPerPage || config.ui.pagination.default);
  }, [pagination.page, pagination.rowsTotal, pagination.rowsPerPage, rows.length]);

  const handleChangePage = (event, newPage) => {
    if (utils.generic.isFunction(changePage)) {
      changePage(newPage);
    }

    setPage(pagination.page || newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    if (utils.generic.isFunction(changeRowsPerPage)) {
      changeRowsPerPage(event.target.value);
    }

    setPage(0);
    setRowsPerPage(event.target.value);
  };

  return {
    obj: {
      page,
      rowsTotal,
      rowsPerPage,
    },
    handlers: {
      handleChangePage,
      handleChangeRowsPerPage,
    },
  };
}
