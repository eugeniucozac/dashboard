import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';

// app
import styles from './DepartmentAccountsTable.styles';
import {
  AvatarGroup,
  SeparatedList,
  Overflow,
  Pagination,
  PopoverMenu,
  Restricted,
  Status,
  TableCell,
  TableHead,
  Translate,
} from 'components';
import * as constants from 'consts';
import * as utils from 'utils';
import { useMedia } from 'hooks';
import config from 'config';

// mui
import { makeStyles, Table, TableRow, TableBody } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

DepartmentAccountsTableView.propTypes = {
  items: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  sort: PropTypes.object.isRequired,
  pagination: PropTypes.shape({
    obj: PropTypes.object.isRequired,
    handlers: PropTypes.shape({
      handleChangePage: PropTypes.func.isRequired,
      handleChangeRowsPerPage: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
  placementId: PropTypes.number,
  placementStatuses: PropTypes.array,
  handleClickRow: PropTypes.func.isRequired,
  handleDoubleClickRow: PropTypes.func.isRequired,
  handleNtuClick: PropTypes.func.isRequired,
  handleRemovePlacementClick: PropTypes.func.isRequired,
  handleEditPlacementClick: PropTypes.func.isRequired,
};

DepartmentAccountsTableView.defaultProps = {
  pagination: {
    obj: {},
    handlers: {},
  },
};

export function DepartmentAccountsTableView({
  items,
  cols,
  sort,
  pagination,
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

  return (
    <div data-testid="department-accounts-table">
      <Overflow>
        <Table>
          <TableHead columns={cols} sorting={sort} />

          <TableBody data-testid="renewal-list">
            {items.map((item) => {
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

      <Pagination
        page={get(pagination, 'obj.page')}
        count={get(pagination, 'obj.rowsTotal')}
        rowsPerPage={get(pagination, 'obj.rowsPerPage')}
        onChangePage={get(pagination, 'handlers.handleChangePage')}
        onChangeRowsPerPage={get(pagination, 'handlers.handleChangeRowsPerPage')}
      />
    </div>
  );
}
