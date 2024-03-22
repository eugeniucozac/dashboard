import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

//app
import styles from './AdministrationUserGrid.styles';
import { Overflow, Pagination, PopoverMenu, TableCell, TableHead, Warning, Translate, Button } from 'components';
import * as utils from 'utils';
import { useMedia, useSort } from 'hooks';

// mui
import { makeStyles, Table, TableBody, TableRow, Box } from '@material-ui/core';

AdministrationUserGridView.propTypes = {
  users: PropTypes.array.isRequired,
  pagination: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleSortColumn: PropTypes.func.isRequired,
  popoverActions: PropTypes.array.isRequired,
  refDataXbInstances: PropTypes.arrayOf(
    PropTypes.shape({
      sourceID: PropTypes.number.isRequired,
      sourceName: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function AdministrationUserGridView({
  users,
  pagination,
  sort: sortObj,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSortColumn,
  popoverActions,
  refDataXbInstances,
}) {
  const { mobile, tablet, desktop, wide, wideUp, extraWide } = useMedia();
  const classes = makeStyles(styles, { name: 'AdministrationUserGrid' })({ wide: wideUp });
  const i18nPath = 'administration.users.table.cols';
  const columns = [
    { id: 'fullName', label: utils.string.t(i18nPath + '.fullName'), sort: { type: 'lexical', direction: 'asc' } },
    { id: 'email', label: utils.string.t(i18nPath + '.email'), sort: { type: 'lexical', direction: 'asc' } },
    { id: 'team', label: utils.string.t(i18nPath + '.businessProcess') },
    { id: 'entity', label: utils.string.t(i18nPath + '.xbInstance') },
    { id: 'departments', label: utils.string.t(i18nPath + '.departments') },
    { id: 'groups', label: utils.string.t(i18nPath + '.groups') },
    { id: 'role', label: utils.string.t(i18nPath + '.role'), sort: { type: 'lexical', direction: 'asc' } },
  ];

  const { cols, sort } = useSort(columns, sortObj, handleSortColumn);
  const { rowsPerPage, page } = pagination;

  const departmentStrLength = mobile ? 40 : tablet ? 60 : desktop ? 90 : wide ? 120 : extraWide ? 180 : 150;

  const [expanded, setExpanded] = useState([]);
  const handleClickExpandCollapse = (id, labelText) => () => {
    if (labelText === 'app.seeMore') {
      setExpanded([...expanded, id]);
    } else {
      setExpanded([...expanded?.filter((item) => item !== id)]);
    }
  };

  const fetchXbInstance = (xbInstanceId) => {
    const xbInstancesIds = xbInstanceId?.split(',')?.map((id) => id.trim());
    return xbInstancesIds
      ?.map((id) => refDataXbInstances?.find((xbInstance) => xbInstance?.sourceID?.toString() === id?.toString())?.sourceName)
      .join(', ');
  };

  const toggle_button = (userDtls, labelText) => (
    <Button
      size="xsmall"
      variant="text"
      text={<Translate label={labelText} />}
      onClick={handleClickExpandCollapse(userDtls.id, labelText)}
      nestedClasses={{ btn: classes.toggle, label: classes.label }}
      data-testid={`department-msg-${userDtls.id}`}
    />
  );
  const departmenMsgTruncated = (userDtls) => {
    let isCollapsed = !expanded.includes(userDtls.id);
    let isTruncated = userDtls?.departments?.length > departmentStrLength;
    if (isTruncated && isCollapsed) {
      return (
        <>
          {userDtls.departments.slice(0, departmentStrLength - 20).trim()}
          ...
          {toggle_button(userDtls, 'app.seeMore')}
        </>
      );
    } else {
      return (
        <>
          {userDtls.departments}
          {isTruncated && <>{toggle_button(userDtls, 'app.seeLess')}</>}
        </>
      );
    }
  };

  return (
    <>
      <Overflow>
        <Table size="small" data-testid="users-grid">
          <TableHead columns={cols} sorting={sort}></TableHead>
          <TableBody data-testid="user-grid-body">
            {users &&
              (users.length > rowsPerPage ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : users).map((user) => {
                return (
                  <TableRow
                    key={user.id}
                    hover
                    data-testid={`user-${user.id}`}
                    className={classnames(classes.row, {
                      [classes.rowNew]: Boolean(user.__new__),
                    })}
                  >
                    <TableCell compact nowrap>
                      {user.fullName}
                    </TableCell>
                    <TableCell compact nowrap>
                      {user.email}
                    </TableCell>
                    <TableCell compact>{user.businessProcesses}</TableCell>
                    <TableCell compact>{fetchXbInstance(user.xbInstanceIds)}</TableCell>
                    <TableCell compact> {departmenMsgTruncated(user)} </TableCell>
                    <TableCell compact>{user.groups}</TableCell>
                    <TableCell compact nowrap>
                      {user.role}
                    </TableCell>
                    <TableCell menu>
                      <PopoverMenu id="user-grid-popover" data={{ user }} items={popoverActions} />
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {users?.length === 0 && (
          <Box p={5}>
            <Warning text={utils.string.t('administration.users.gridDataEmptyWarning')} type="info" align="center" size="large" icon />
          </Box>
        )}
      </Overflow>

      {pagination && (
        <Pagination
          page={pagination.page}
          count={pagination.rowsTotal}
          rowsPerPage={pagination.rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </>
  );
}
