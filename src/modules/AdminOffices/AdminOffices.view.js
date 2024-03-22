import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// app
import { Button, Translate, TableCell, TableHead, Overflow, Pagination, FilterBar, PopoverMenu } from 'components';
import styles from './AdminOffices.styles';
import * as utils from 'utils';

// mui
import { Table, TableRow, TableBody, makeStyles, Box, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

AdminOfficesView.propTypes = {
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
  handleCreateClientOffice: PropTypes.func,
  selectedId: PropTypes.number,
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
};

export function AdminOfficesView({
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
  handleCreateClientOffice,
}) {
  const classes = makeStyles(styles, { name: 'AdminOffices' })();
  const cols = [
    { id: 'client-logo' },
    { id: 'client', label: utils.string.t('admin.client') },
    { id: 'office', label: utils.string.t('admin.office_plural') },
    { id: 'edit' },
  ];

  const tableRowClasses = {
    [classes.parentRow]: true,
    [classes.hover]: handleClickRow && utils.generic.isFunction(handleClickRow),
  };

  const OfficeRow = ({ office }) => (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell nestedClasses={{ root: classes.officeCell }} nowrap data-testid={`office-${office.name}`}>
        {office.name}
      </TableCell>
      <TableCell menu data-testid="admin-office-menu">
        <PopoverMenu id="admin-office-table-popover" data={{ office }} items={popoverActions} />
      </TableCell>
    </TableRow>
  );

  const NoOffices = () => (
    <TableRow>
      <TableCell colSpan={2} />
      <TableCell nestedClasses={{ root: classes.officeCell }} nowrap>
        {utils.string.t('admin.noOffices')}
      </TableCell>
      <TableCell />
    </TableRow>
  );

  const NoClients = () => (
    <TableRow>
      <TableCell />
      <TableCell>{utils.string.t('admin.noClients')}</TableCell>
      <TableCell colSpan={2} />
    </TableRow>
  );

  return (
    <div>
      <FilterBar id="officeFilter" fields={fields} actions={actions} />
      <Overflow>
        <Table size="small">
          <TableHead columns={cols} sorting={sort} />
          <TableBody data-testid="office-list">
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
                    <TableCell className={classes.officeCell} />
                    <TableCell />
                  </TableRow>
                  {selectedId === parent.id &&
                    (!parent.offices || parent.offices.length === 0 ? (
                      <NoOffices />
                    ) : (
                      parent.offices.map((office, index) => <OfficeRow key={index} office={office} />)
                    ))}
                </Fragment>
              );
            })}
            {parents.length === 0 && <NoClients />}
          </TableBody>
        </Table>
      </Overflow>
      <Grid container>
        <Grid item xs={12} sm={4}>
          <Box mt={2}>
            <Button
              icon={AddIcon}
              color="primary"
              size="small"
              text={<Translate label="admin.createOffice" />}
              data-testid="admin-create-office-button"
              onClick={() => handleCreateClientOffice()}
            />
          </Box>
        </Grid>
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
