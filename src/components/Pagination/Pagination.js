import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import classnames from 'classnames';

// app
import styles from './Pagination.styles';
import { Translate } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { withStyles, TablePagination } from '@material-ui/core';

export class Pagination extends PureComponent {
  static propTypes = {
    page: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsPerPageOptions: PropTypes.arrayOf(PropTypes.number).isRequired,
    centered: PropTypes.bool,
    onChangePage: PropTypes.func.isRequired,
    onChangeRowsPerPage: PropTypes.func.isRequired,
  };

  static defaultProps = {
    rowsPerPage: config.ui.pagination.default,
    rowsPerPageOptions: config.ui.pagination.options,
  };

  render() {
    const { page, count, rowsPerPage, rowsPerPageOptions, centered, testid, onChangePage, onChangeRowsPerPage, classes } = this.props;

    return (
      <TablePagination
        page={page}
        count={count}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        labelRowsPerPage={<Translate label="pagination.rows" />}
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${utils.string.t('pagination.of')} ${count}`}
        backIconButtonProps={{
          'aria-label': utils.string.t('pagination.previousPage'),
          className: classes.paginationButton,
        }}
        nextIconButtonProps={{
          'aria-label': utils.string.t('pagination.nextPage'),
          className: classes.paginationButton,
        }}
        classes={{
          root: classnames(classes.root, { [classes.rootCentered]: centered }),
          toolbar: classnames(classes.toolbar, { [classes.toolbarCentered]: centered }),
          spacer: classnames(classes.spacer, { [classes.spacerCentered]: centered }),
          selectRoot: classnames(classes.selectRoot, { [classes.selectRootCentered]: centered }),
          actions: classnames(classes.actions, { [classes.actionsCentered]: centered }),
        }}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        data-testid={`pagination${testid ? '-' + testid : ''}`}
      />
    );
  }
}

export default compose(withStyles(styles))(Pagination);
