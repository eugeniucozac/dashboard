import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import get from 'lodash/get';

// app
import styles from './QuoteBind.styles';
import {
  Button,
  Layout,
  Overflow,
  Pagination,
  Restricted,
  SearchResult,
  SectionHeader,
  Status,
  Skeleton,
  TableCell,
  TableHead,
  Translate,
  AddQuoteBind,
  Tabs,
  FilterBar,
} from 'components';
import * as utils from 'utils';
import * as constants from 'consts';
import config from 'config';
import QuoteBindDraftRisk from './QuoteBindDraftRisk';

// mui
import { useTheme } from '@material-ui/core/styles';
import { Box, Grid, Table, TableRow, TableBody, makeStyles } from '@material-ui/core';
import BallotIcon from '@material-ui/icons/Ballot';
import SettingsIcon from '@material-ui/icons/Settings';
import GetAppIcon from '@material-ui/icons/GetApp';
import MultilineChartIcon from '@material-ui/icons/MultilineChart';

QuoteBindView.propTypes = {
  list: PropTypes.object.isRequired,
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
  isAdmin: PropTypes.bool.isRequired,
  riskProducts: PropTypes.array.isRequired,
  riskListLoading: PropTypes.bool.isRequired,
  statuses: PropTypes.array,
  tabs: PropTypes.array.isRequired,
  selectedTab: PropTypes.string.isRequired,
  popoverActions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
  handlers: PropTypes.shape({
    search: PropTypes.func.isRequired,
    searchReset: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
    clickLaunchBdx: PropTypes.func.isRequired,
    clickAddRisk: PropTypes.func.isRequired,
    handleSelectTab: PropTypes.func,
  }),
};

export function QuoteBindView({ list, sort, pagination, riskListLoading, riskProducts, isAdmin, loading, handlers, tabs, selectedTab }) {
  const classes = makeStyles(styles, { name: 'Products' })();
  const theme = useTheme();

  const cols = [
    { id: 'insureds', label: utils.string.t('app.insured_plural') },
    { id: 'type', label: utils.string.t('app.type'), nowrap: true },
    { id: 'product', label: utils.string.t('app.product') },
    { id: 'clients', label: utils.string.t('app.client_plural') },
    { id: 'inceptionDate', label: utils.string.t('app.inceptionDate'), nowrap: true },
    { id: 'expiryDate', label: utils.string.t('app.expiryDate'), nowrap: true },
    { id: 'status', label: utils.string.t('app.status') },
  ];

  const searchActions = [
    {
      name: 'filter',
      label: utils.string.t('app.searchLabel'),
      handler: (values) => {
        const { query } = values;
        handlers.search(query);
      },
    },
    {
      name: 'reset',
      label: utils.string.t('app.reset'),
      handler: handlers.searchReset,
    },
  ];

  const searchFields = [
    {
      name: 'query',
      type: 'text',
      placeholder: utils.string.t('risks.search') || '',
      defaultValue: '',
      gridSize: { xs: 12 },
      muiComponentProps: {
        autoComplete: 'off',
        'data-testid': 'search-field',
      },
    },
  ];

  const risks = list && utils.generic.isValidArray(list.items, true) ? list.items : [];

  return (
    <Box className={classes.pageContainer}>
      <Layout isCentered testid="products">
        <Layout main>
          <SectionHeader
            title={utils.string.t('products.title')}
            icon={BallotIcon}
            nestedClasses={{ root: classes.sectionHeader }}
            testid="products"
          >
            <div className={classes.headerContent}>
              <Button
                to={config.routes.quoteBind.aggregate}
                nestedClasses={{ btn: classes.button }}
                color="primary"
                variant="outlined"
                icon={MultilineChartIcon}
                text={<Translate label="products.aggregate" />}
              />
              <Button
                onClick={handlers.clickLaunchBdx}
                nestedClasses={{ btn: classes.button }}
                color="primary"
                variant="outlined"
                icon={GetAppIcon}
                text={<Translate label="products.reports" />}
              />
              {isAdmin ? (
                <Restricted include={[constants.ROLE_BROKER]}>
                  <Button
                    to={config.routes.quoteBind.admin}
                    nestedClasses={{ btn: classes.button }}
                    color="primary"
                    variant="outlined"
                    icon={SettingsIcon}
                    text={<Translate label="products.admin.btn" />}
                  />
                </Restricted>
              ) : null}
            </div>
          </SectionHeader>

          <Grid container className={classnames(classes.searchBox, selectedTab === 'risks' && classes.searchBoxContainer)}>
            <Restricted include={[constants.ROLE_BROKER]}>
              <Grid item xs={12} sm={6} md={5} lg={6} xl={7}>
                <AddQuoteBind products={riskProducts} />
              </Grid>
            </Restricted>
            {selectedTab === 'risks' ? (
              <Grid item xs={12} sm={6} md={7} lg={6} xl={5}>
                <FilterBar id="userFilter" fields={searchFields} actions={searchActions} />
              </Grid>
            ) : null}
          </Grid>

          <SearchResult count={list.itemsTotal} query={list.query} handleSearchReset={handlers.searchReset} />
          <Restricted include={[constants.ROLE_BROKER]}>
            <Tabs tabs={tabs} value={selectedTab} onChange={(tabName) => handlers.handleSelectTab(tabName)} />
          </Restricted>
          {selectedTab === 'risks' ? (
            <>
              <Overflow>
                <Table>
                  <TableHead columns={cols} sorting={sort} />
                  {riskListLoading ? (
                    <TableBody data-testid="risk-skeleton">
                      <TableRow>
                        <TableCell colSpan={cols.length}>
                          <Skeleton height={40} animation="wave" displayNumber={10} />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody data-testid="risk-list">
                      {risks.map((risk) => {
                        const isNew = risk.__new__;
                        const status = risk.riskStatus && risk.riskStatus.toLowerCase();

                        const classesRow = {
                          [classes.row]: true,
                          [classes.rowNew]: isNew,
                        };
                        const statusBackgroundColor = theme.palette.status[status?.toLowerCase()]
                          ? theme.palette.status[status.toLowerCase()]
                          : theme.palette.status.default;

                        return (
                          <TableRow
                            key={risk.id}
                            hover
                            className={classnames(classesRow)}
                            onDoubleClick={handlers.clickRow(risk)}
                            data-testid={`risk-row-${risk.id}`}
                          >
                            <TableCell data-testid={`risk-cell-insureds-${risk.id}`}>{get(risk, 'insured.name')}</TableCell>

                            <TableCell data-testid={`risk-cell-renewal-${risk.id}`}>
                              {risk.type === 'NEW' ? utils.string.t('app.new') : utils.string.t('app.renewal')}
                            </TableCell>

                            <TableCell data-testid={`risk-cell-product-${risk.id}`}>
                              {utils.risk.getRiskName(risk.riskType, riskProducts)}
                            </TableCell>

                            <TableCell data-testid={`risk-cell-clients-${risk.id}`}>{get(risk, 'client.name')}</TableCell>

                            <TableCell nowrap data-testid={`risk-cell-inceptionDate-${risk.id}`}>
                              <Translate
                                label="format.date"
                                options={{ value: { date: risk.inceptionDate, format: config.ui.format.date.text, default: '-' } }}
                              />
                            </TableCell>

                            <TableCell nowrap data-testid={`risk-cell-expiryDate-${risk.id}`}>
                              <Translate
                                label="format.date"
                                options={{ value: { date: risk.expiryDate, format: config.ui.format.date.text, default: '-' } }}
                              />
                            </TableCell>

                            <TableCell data-testid={`risk-cell-status-${risk.id}`}>
                              {status && (
                                <Status
                                  size="xs"
                                  text={<Translate label={`QBstatus.${status}`} />}
                                  status={status}
                                  style={{
                                    backgroundColor: statusBackgroundColor,
                                    color: utils.color.contrast(statusBackgroundColor, 0.6),
                                    fontSize: '11px',
                                    paddingTop: '2px',
                                    paddingBottom: '2px',
                                    width: '100%',
                                    height: 'auto',
                                  }}
                                  statusOverrides={{
                                    quoted: 'info',
                                  }}
                                />
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  )}
                </Table>
              </Overflow>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <Pagination
                    page={pagination.page}
                    count={pagination.rowsTotal}
                    rowsPerPage={pagination.rowsPerPage}
                    onChangePage={handlers.changePage}
                    onChangeRowsPerPage={handlers.changeRowsPerPage}
                  />
                </Grid>
              </Grid>
            </>
          ) : null}

          {selectedTab === 'draftRisks' ? (
            <Restricted include={[constants.ROLE_BROKER]}>
              <QuoteBindDraftRisk />
            </Restricted>
          ) : null}
        </Layout>
      </Layout>
    </Box>
  );
}
