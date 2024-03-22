import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AdminUser.styles';
import { Button, TableCell, TableHead, Pagination, FilterBar, Overflow, Translate, PopoverMenu } from 'components';
import * as utils from 'utils';

// mui
import { Table, TableRow, TableBody, makeStyles, Box, Grid } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import CheckIcon from '@material-ui/icons/Check';

AdminUserView.propTypes = {
  userList: PropTypes.array,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number,
  }).isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleCreateUser: PropTypes.func.isRequired,
  sort: PropTypes.object.isRequired,
  refDataDepartments: PropTypes.array.isRequired,
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
};

export function AdminUserView({
  userList = [],
  pagination,
  handleChangePage,
  handleChangeRowsPerPage,
  handleCreateUser,
  sort,
  refDataDepartments,
  fields,
  actions,
  popoverActions,
}) {
  const classes = makeStyles(styles, { name: 'AdminUser' })();

  const cols = [
    { id: 'fullname', label: utils.string.t('admin.fullName') },
    { id: 'emailAddress', label: utils.string.t('admin.emailAddress') },
    { id: 'departments', label: utils.string.t('admin.department_plural') },
    { id: 'offices', label: utils.string.t('admin.office_plural') },
    { id: 'role', label: utils.string.t('admin.role') },
    { id: 'admin', label: utils.string.t('admin.title') },
    { id: 'menu' },
  ];

  return (
    <div>
      <FilterBar id="userFilter" fields={fields} actions={actions} />
      <Overflow>
        <Table size="small">
          <TableHead columns={cols} sorting={sort} />
          <TableBody data-testid="user-list">
            {userList.map((user, index) => {
              return (
                <TableRow key={index} hover data-testid={`user-${user.id}`}>
                  <TableCell nowrap data-testid="user-fullname">
                    {user.fullName}
                  </TableCell>
                  <TableCell nowrap data-testid="user-emailId">
                    {user.emailId}
                  </TableCell>
                  <TableCell data-testid="user-departments" className={classes.departmentCell}>
                    {utils.departments.getDepartmentList(refDataDepartments, user.departmentIds)}
                  </TableCell>
                  <TableCell data-testid="user-offices" className={classes.officeCell}>
                    {utils.client.offices.getNameList(user.offices)}
                  </TableCell>
                  <TableCell nowrap data-testid="user-role">
                    {utils.user.getRoleString(user.role)}
                  </TableCell>
                  <TableCell className={classes.isAdminCell} data-testid="user-isAdmin">
                    {user.isAdmin && <CheckIcon className={classes.adminIcon} />}
                  </TableCell>
                  <TableCell menu data-testid={`user-menu`}>
                    <PopoverMenu id="admin-user-table-popover" data={{ user }} items={popoverActions} />
                  </TableCell>
                </TableRow>
              );
            })}
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
              text={<Translate label="admin.createUser" />}
              data-testid="admin-create-button"
              onClick={() => handleCreateUser()}
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
