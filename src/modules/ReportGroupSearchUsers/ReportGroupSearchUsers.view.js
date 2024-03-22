import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMedia } from 'hooks';

// app
import { Overflow, TableCell, TableHead } from 'components';
import * as utils from 'utils';
import styles from './ReportGroupSearchUsers.styles';
import config from 'config';

// mui
import { makeStyles, Table, TableRow, TableBody, Grid } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import TablePagination from '@material-ui/core/TablePagination';

ReportGroupSearchUsersView.propTypes = {
  userList: PropTypes.array,
  sort: PropTypes.object,
  handleAddUser: PropTypes.func.isRequired,
};

export function ReportGroupSearchUsersView({ userList = [], handleAddUser }) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'ReportGroupSearch' })();
  const { pagination } = config?.ui;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(media.mobile ? pagination.defaultMobile : pagination.default);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const cols = [
    { id: 'fullname', label: utils.string.t('admin.fullName') },
    { id: 'emailAddress', label: utils.string.t('admin.emailAddress') },
    { id: 'addUser', label: utils.string.t('app.addUser') },
  ];

  return (
    <>
      <Overflow>
        <Table size="small">
          <TableHead columns={cols} />
          <TableBody data-testid="user-list">
            {userList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
              return (
                <TableRow key={index} hover data-testid={`user-${user.id}`}>
                  <TableCell nowrap data-testid="user-fullname">
                    {user.fullName}
                  </TableCell>
                  <TableCell nowrap data-testid="user-emailId">
                    {user.emailId}
                  </TableCell>
                  <TableCell data-testid="user-hasAccess">
                    {user.hasAccess ? (
                      <CheckIcon className={classes.checkIcon} />
                    ) : (
                      <AddIcon className={classes.hover} onClick={(e) => handleAddUser(user)} />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Overflow>
      <Grid container>
        <TablePagination
          rowsPerPageOptions={pagination.options}
          component="div"
          count={userList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Grid>
    </>
  );
}
