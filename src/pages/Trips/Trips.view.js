import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uniqBy from 'lodash/uniqBy';

// app
import styles from './Trips.styles';
import {
  AvatarGroup,
  Layout,
  Loader,
  Overflow,
  Pagination,
  PopoverMenu,
  Restricted,
  Search,
  SearchResult,
  SectionHeader,
  SeparatedList,
  TableCell,
  TableHead,
  Translate,
} from 'components';
import { TripSummary } from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Table, TableRow, TableBody } from '@material-ui/core';
import FlightTakeoffIcon from '@material-ui/icons/FlightTakeoff';

TripsView.propTypes = {
  list: PropTypes.object.isRequired,
  selected: PropTypes.object.isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  loader: PropTypes.array,
  handleSearch: PropTypes.func.isRequired,
  handleSearchReset: PropTypes.func.isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleClickRow: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export function TripsView({
  list,
  selected,
  sort,
  pagination,
  loader,
  handleChangePage,
  handleChangeRowsPerPage,
  handleSearch,
  handleSearchReset,
  handleEdit,
  handleClickRow,
  handleDelete,
}) {
  const classes = makeStyles(styles, { name: 'Trips' })();

  const cols = [
    { id: 'title', label: utils.string.t('app.title') },
    { id: 'clients', label: utils.string.t('app.client_plural') },
    { id: 'date', label: utils.string.t('app.dateStart') },
    { id: 'brokers', label: utils.string.t('app.broker_plural') },
    { id: 'actions', empty: true },
  ];

  return (
    <Layout testid="trips">
      <Layout main>
        <SectionHeader title={utils.string.t('trips.title')} icon={FlightTakeoffIcon} testid="trips">
          <Search
            text={list.query}
            placeholder={utils.string.t('trips.search')}
            handlers={{
              search: handleSearch,
              reset: handleSearchReset,
            }}
          />
        </SectionHeader>

        <SearchResult count={list.itemsTotal} query={list.query} handleSearchReset={handleSearchReset} />

        <Overflow>
          <Table>
            <TableHead columns={cols} sorting={sort} />

            <TableBody data-testid="trip-list">
              {list.items.map((trip) => {
                const hasVisits = utils.generic.isValidArray(trip.visits, true);

                const dateFrom = utils.trip.getDateFrom(trip && trip.visits);

                const brokers = hasVisits
                  ? trip.visits.reduce((acc, visit) => {
                      return utils.generic.isValidArray(visit.users) ? [...acc, ...visit.users] : acc;
                    }, [])
                  : [];

                const clients = hasVisits
                  ? trip.visits.map((visit) => {
                      return Object.assign({}, visit.client, { id: `${visit.id}-${visit.client.id}` });
                    })
                  : [];

                return (
                  <TableRow
                    key={trip.id}
                    hover
                    className={classnames(classes.row, { [classes.rowSelected]: trip.id === selected.id })}
                    onClick={handleClickRow(trip.id)}
                    data-testid={`trip-row-${trip.id}`}
                  >
                    <TableCell data-testid={`trip-cell-title-${trip.id}`} className={classes.cellName}>
                      {trip.title}
                    </TableCell>

                    <TableCell data-testid={`trip-cell-clients-${trip.id}`}>
                      <SeparatedList list={clients} />
                    </TableCell>

                    <TableCell nowrap data-testid={`trip-cell-date-${trip.id}`}>
                      <Translate
                        label="format.date"
                        options={{ value: { date: dateFrom, format: config.ui.format.date.text, default: '-' } }}
                      />
                    </TableCell>

                    <TableCell nowrap data-testid={`trip-cell-users-${trip.id}`}>
                      {brokers.length > 0 && <AvatarGroup users={uniqBy(brokers, 'id')} max={5} />}
                    </TableCell>

                    <TableCell menu>
                      <Restricted include={[constants.ROLE_BROKER]}>
                        <PopoverMenu
                          id="renewal-list"
                          data={{
                            id: trip.id,
                            title: trip.title || `${utils.string.t('app.trip')} ID: ${trip.id}`,
                          }}
                          items={[
                            {
                              id: 'edit',
                              label: 'app.edit',
                              callback: handleEdit,
                            },
                            {
                              id: 'delete',
                              label: 'app.delete',
                              callback: handleDelete,
                            },
                          ]}
                        />
                      </Restricted>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Overflow>

        <Pagination
          page={pagination.page}
          count={pagination.rowsTotal}
          rowsPerPage={pagination.rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Layout>

      <Layout sidebar padding={false}>
        <TripSummary />
        <Loader visible={!utils.generic.isValidArray(loader, true) && selected.loading} panel />
      </Layout>
    </Layout>
  );
}
