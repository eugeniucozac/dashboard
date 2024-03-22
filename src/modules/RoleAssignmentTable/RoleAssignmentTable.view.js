import React from 'react';
import classnames from 'classnames';

//app
import { Overflow, TableHead, TableCell, Pagination, Chip, Button, Translate } from 'components';
import CancelIcon from '@material-ui/icons/Cancel';
import styles from './RoleAssignmentTable.styles';

//mui
import { makeStyles, Table, TableRow, TableBody, Grid, Box } from '@material-ui/core';

export function RoleAssignmentTableView({ columns, usersList, handlers, selectedUser }) {
  const classes = makeStyles(styles, { name: 'RoleAssignmentTable' })();

  return (
    <Box data-testid="claims-search-table">
      <Overflow>
        <Table data-testid="claims-table">
          <TableHead columns={columns} />
          <TableBody data-testid="users-list">
            {usersList.map((user) => {
              const activeCase = selectedUser.id === user.id ? 'active' : '';
              return (
                <TableRow
                  key={user.id}
                  data-testid={`user-row-${user.id}`}
                  onClick={() => handlers.handleChoseOneCase(user)}
                  className={classnames(classes.row, activeCase)}
                >
                  <TableCell data-testid={`user-${user.name}`}>{user.name}</TableCell>
                  <TableCell data-testid={`date-${user.role}`}>
                    {user.roles.length
                      ? user.roles.map((role) => (
                          <Chip
                            key={role.id}
                            onDelete={() => {}}
                            label={role.role}
                            clickable={true}
                            size="small"
                            deleteIcon={<CancelIcon />}
                            nestedClasses={{ root: classes.issueTypeChip }}
                          />
                        ))
                      : 'Not Assigned'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Overflow>
      <Grid container>
        <Grid item xs={6} className={classes.addUserButton}>
          <Button color="primary" text={<Translate label="claims.addUser" />} size="medium" onClick={handlers.handleAddUser} />
        </Grid>
        <Grid item xs={6}>
          <Pagination
            page={0}
            count={100}
            rowsPerPage={10}
            onChangePage={handlers.handleChangePage}
            onChangeRowsPerPage={handlers.handleChangeRowsPerPage}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
