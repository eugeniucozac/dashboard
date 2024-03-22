import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import { TableCell, TableHead, Overflow, Pagination, FilterBar, PopoverMenu } from 'components';
import styles from './AdminMarkets.styles';
import * as utils from 'utils';

// mui
import { Table, TableRow, TableBody, makeStyles, Grid } from '@material-ui/core';

AdminMarketsView.propTypes = {
  popoverActions: PropTypes.array.isRequired,
  parents: PropTypes.array,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number,
  }).isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  sort: PropTypes.object,
  handleClickRow: PropTypes.func,
  selectedId: PropTypes.number,
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
};

export function AdminMarketsView({
  popoverActions,
  pagination,
  handleChangePage,
  handleChangeRowsPerPage,
  parents = [],
  sort,
  selectedId,
  handleClickRow,
  fields,
  actions,
}) {
  const classes = makeStyles(styles, { name: 'AdminMarkets' })();
  const cols = [
    { id: 'market-logo' },
    { id: 'marketParent', label: utils.string.t('admin.marketParent') },
    { id: 'market', label: utils.string.t('admin.market_plural') },
    { id: 'edit' },
  ];

  const tableRowClasses = {
    [classes.parentRow]: true,
    [classes.hover]: handleClickRow && utils.generic.isFunction(handleClickRow),
  };

  const MarketRow = ({ market }) => (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell nestedClasses={{ root: classes.marketCell }} nowrap data-testid={`market-${market.name}`}>
        {market.name}
      </TableCell>
      <TableCell menu data-testid="admin-market-menu" />
    </TableRow>
  );

  const NoMarkets = () => (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell nestedClasses={{ root: classes.marketCell }} nowrap>
        {utils.string.t('admin.noMarkets')}
      </TableCell>
      <TableCell />
    </TableRow>
  );

  const NoMarketParents = () => (
    <TableRow>
      <TableCell />
      <TableCell>{utils.string.t('admin.noMarketParents')}</TableCell>
      <TableCell colSpan={2} />
    </TableRow>
  );

  return (
    <div>
      <FilterBar id="marketParentFilter" fields={fields} actions={actions} />
      <Overflow>
        <Table size="small">
          <TableHead columns={cols} sorting={sort} />
          <TableBody data-testid="marketParent-list">
            {parents.map((parent, index) => {
              const logo = utils.client.parent.getLogoFilePath(parent);

              return (
                <Fragment key={index}>
                  <TableRow
                    onClick={() => handleClickRow(parent.id)}
                    className={classnames(tableRowClasses, { [classes.selectedRow]: selectedId === parent.id })}
                    hover
                    key={index}
                    data-testid={`parent-row-id-${parent.id}`}
                  >
                    <TableCell nowrap nestedClasses={{ root: classes.logoCell }}>
                      {logo && <img src={logo} alt={`logo ${parent.name}`} className={classes.logo} />}
                    </TableCell>
                    <TableCell nowrap data-testid={`parent-row-name-${parent.name}`}>
                      {parent.name}
                    </TableCell>
                    <TableCell className={classes.marketCell} />
                    <TableCell menu>
                      <PopoverMenu id="admin-office-table-popover" data={{ parent }} items={popoverActions} />
                    </TableCell>
                  </TableRow>
                  {selectedId === parent.id &&
                    (!parent.markets || parent.markets.length === 0 ? (
                      <NoMarkets />
                    ) : (
                      parent.markets.map((market, index) => <MarketRow key={index} market={market} />)
                    ))}
                </Fragment>
              );
            })}
            {parents.length === 0 && <NoMarketParents />}
          </TableBody>
        </Table>
      </Overflow>
      <Grid container>
        <Grid item xs={12} sm={4} />
        <Grid item xs={12} sm={8}>
          <Pagination
            page={pagination.page}
            count={pagination.rowsTotal}
            rowsPerPage={pagination.rowsPerPage}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </div>
  );
}
