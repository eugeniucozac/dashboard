import React from 'react';
import PropTypes from 'prop-types';

// app
import { Overflow, SectionHeader, TableCell, TableHead, FilterBar, PopoverMenu, Summary } from 'components';
import * as utils from 'utils';
import { ReportGroupSearchUsers } from 'modules';
import styles from './ReportingGroupUser.styles';

// mui
import { makeStyles, Table, TableRow, TableBody, Grid } from '@material-ui/core';

ReportingGroupUserView.propTypes = {
  groupTitle: PropTypes.string.isRequired,
  groupId: PropTypes.string.isRequired,
  list: PropTypes.array.isRequired,
  handleDelete: PropTypes.func.isRequired,
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  popoverActions: PropTypes.array.isRequired,
  searchVal: PropTypes.string,
  isBack: PropTypes.bool,
};

export function ReportingGroupUserView({ groupTitle, groupId, list, fields, actions, popoverActions, searchVal, isBack }) {
  const classes = makeStyles(styles, { name: 'ReportingGroupUser' })();

  const cols = [
    { id: 'fullname', label: utils.string.t('admin.fullName') },
    { id: 'emailAddress', label: utils.string.t('admin.emailAddress') },
  ];

  return (
    <Summary>
      <SectionHeader title={`${groupTitle} ${utils.string.t('reporting.access')}`} testid="reporting_header"></SectionHeader>
      <Grid container>
        <Grid item xs={12}>
          <FilterBar id="userFilter" fields={fields} actions={actions} data-testid="filter-bar" />
        </Grid>
      </Grid>
      {!searchVal || isBack ? (
        <Overflow>
          <Table size="small">
            <TableHead columns={cols} />
            <TableBody data-testid="user-list">
              {list &&
                list.length > 0 &&
                list.map((user) => {
                  return (
                    <TableRow key={user.id} hover data-testid={`user-${user.id}`}>
                      <TableCell nowrap data-testid="user-fullname">
                        {user.fullName}
                      </TableCell>
                      <TableCell nowrap data-testid="user-emailId">
                        {user.emailId}
                      </TableCell>
                      <TableCell nestedClasses={{ root: classes.dataCellLast }} menu data-testid="user-menu">
                        <PopoverMenu id="admin-user-table-popover" data={{ user }} items={popoverActions} />
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Overflow>
      ) : (
        <ReportGroupSearchUsers searchVal={searchVal} groupId={groupId} />
      )}
    </Summary>
  );
}
