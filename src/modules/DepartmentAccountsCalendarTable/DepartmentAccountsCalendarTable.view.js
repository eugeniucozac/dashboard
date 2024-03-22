import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uniqBy from 'lodash/uniqBy';

// app
import styles from './DepartmentAccountsCalendarTable.styles';
import { AvatarGroup, SeparatedList, Overflow, PopoverMenu, Restricted, Status, TableCell, TableHead, Translate } from 'components';
import * as constants from 'consts';
import * as utils from 'utils';
import { useMedia } from 'hooks';
import config from 'config';

// mui
import { makeStyles, Table, TableRow, TableBody } from '@material-ui/core';
import TablePagination from '@material-ui/core/TablePagination';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

DepartmentAccountsCalendarTableView.propTypes = {
  items: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  firstItem: PropTypes.number,
  placementId: PropTypes.number,
  placementStatuses: PropTypes.array,
  handleClickRow: PropTypes.func.isRequired,
  handleDoubleClickRow: PropTypes.func.isRequired,
  handleNtuClick: PropTypes.func.isRequired,
  handleRemovePlacementClick: PropTypes.func.isRequired,
  handleEditPlacementClick: PropTypes.func.isRequired,
};

DepartmentAccountsCalendarTableView.defaultProps = {
  pagination: {
    obj: {},
    handlers: {},
  },
};

export function DepartmentAccountsCalendarTableView({
  items,
  firstItem,
  cols,
  sort,
  placementId,
  placementStatuses,
  handleClickRow,
  handleDoubleClickRow,
  handleNtuClick,
  handleEditPlacementClick,
  handleRemovePlacementClick,
}) {
  const media = useMedia();
  const classes = makeStyles(styles, { name: 'DepartmentAccountsTable' })({ wide: media.wideUp });
  const { pagination } = config?.ui;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.default);

  useEffect(() => {
    if (firstItem > 0) {
      const currentPage = Math.ceil(firstItem / rowsPerPage) - 1;
      setPage(currentPage);
    }
  }, [firstItem, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <div className={classes.monthBox} data-testid="department-accounts-table">
      <Overflow>
        <Table className={classes.table}>
          <TableHead columns={cols} sorting={sort} />

          <TableBody data-testid="renewal-list">
            {/* .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) */}
            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => {
              const statusPlacementNtuId = utils.referenceData.status.getIdByCode(placementStatuses, constants.STATUS_PLACEMENT_NTU);
              const statusLabel = utils.referenceData.status.getLabelById(placementStatuses, item.statusId);
              const brokers = utils.users.getBrokers(item.users, { gxbUsersIncluded: true });
              const cobrokersPlacement = utils.users.getCobrokers(item.users);
              const cobrokersOffice = utils.placement.getOfficeCobrokers(item);
              const cobrokers = uniqBy([...cobrokersPlacement, ...cobrokersOffice]);

              return (
                <TableRow
                  key={item.id}
                  onClick={handleClickRow(item.id)}
                  onDoubleClick={handleDoubleClickRow(item.id)}
                  hover
                  className={classnames(classes.row, {
                    [classes.rowNew]: Boolean(item.__new__),
                    [classes.rowSelected]: item.id === placementId,
                  })}
                  data-testid={`placement.${item.id}`}
                >
                  <TableCell data-testid={`insured-${item.id}`}>
                    <SeparatedList
                      list={item.insureds}
                      flag="isProvisional"
                      flagType="alert"
                      flagIcon={InfoOutlinedIcon}
                      flagTooltip={<Translate label="renewals.provisionalInsuredTooltip" />}
                      hover
                    />
                  </TableCell>

                  <TableCell
                    colSpan={2}
                    compact
                    nestedClasses={{ root: classes.clientWrapperCell }}
                    data-testid={`client-office-${item.id}`}
                  >
                    <Table>
                      <TableBody>
                        {item.clients &&
                          item.clients.map((client) => {
                            const logo = utils.client.parent.getLogoFilePath(client);
                            const altText = [client.parent, client.name].filter((i) => i).join(' ');

                            const classesClientCell = {
                              [classes.clientCell]: true,
                              [classes.clientNoOfficeCell]: !logo,
                            };

                            const colspan = logo ? 1 : 2;

                            return (
                              <TableRow key={client.id}>
                                <TableCell
                                  colSpan={colspan}
                                  borderless
                                  compact
                                  title={altText}
                                  nestedClasses={{ root: classnames(classesClientCell) }}
                                >
                                  {logo && <img src={logo} alt={`logo ${altText}`} className={classes.logo} />}
                                  {!logo && <span className={classes.clientName}>{client.name}</span>}
                                </TableCell>

                                {logo && (
                                  <TableCell borderless compact title={client.name} nestedClasses={{ root: classes.officeCell }}>
                                    <span className={classes.officeName}>{client.name}</span>
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                      </TableBody>
                    </Table>
                  </TableCell>

                  <TableCell nowrap data-testid={`inceptiondate-${item.id}`}>
                    {utils.string.t('format.date', {
                      value: { date: item.inceptionDate, format: config.ui.format.date.text },
                    })}
                  </TableCell>

                  <TableCell nowrap compact>
                    {statusLabel && (
                      <Status
                        size={media.wideUp ? 'sm' : 'xs'}
                        text={<Translate label={`status.${statusLabel}`} />}
                        status={statusLabel}
                        data-testid={`status-${item.id}`}
                      />
                    )}
                  </TableCell>

                  <TableCell nowrap data-testid={`users-${item.id}`}>
                    {brokers && (
                      <AvatarGroup
                        users={brokers}
                        max={3}
                        size={media.wideUp ? 22 : 20}
                        nestedClasses={{ name: classes.avatarName }}
                        testid="brokers"
                      />
                    )}
                  </TableCell>

                  <TableCell nowrap data-testid={`users-${item.id}`}>
                    {cobrokers && (
                      <AvatarGroup
                        users={cobrokers}
                        max={3}
                        size={media.wideUp ? 22 : 20}
                        nestedClasses={{ name: classes.avatarName }}
                        testid="cobrokers"
                      />
                    )}
                  </TableCell>

                  <TableCell menu>
                    <Restricted include={[constants.ROLE_BROKER]}>
                      {utils.generic.isFunction(handleNtuClick) && (
                        <PopoverMenu
                          id="renewal-list"
                          data={{
                            placement: item,
                            title: utils.placement.getInsureds(item),
                            calendarView: true,
                          }}
                          items={[
                            {
                              id: 'ntu',
                              label: 'renewals.ntuPlacement',
                              disabled: item.statusId === statusPlacementNtuId,
                              callback: handleNtuClick,
                            },
                            {
                              id: 'editPlacement',
                              label: 'renewals.editPlacement',
                              callback: handleEditPlacementClick,
                            },
                            {
                              id: 'removePlacement',
                              label: 'renewals.removePlacement',
                              callback: handleRemovePlacementClick,
                            },
                          ]}
                        />
                      )}
                    </Restricted>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Overflow>
      <TablePagination
        rowsPerPageOptions={pagination.options}
        component="div"
        count={items.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
