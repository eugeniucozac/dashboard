import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';

// app
import styles from './QuoteBind.styles';
import { TableCell, TableHead, PopoverMenu, Button, Translate, Overflow, Pagination, Skeleton } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { Table, TableRow, TableBody, makeStyles, Grid } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

QuoteBindDraftRiskView.propTypes = {
  listDraftRisk: PropTypes.object.isRequired,
  draftRiskListLoading: PropTypes.bool.isRequired,
  popoverActions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      callback: PropTypes.func.isRequired,
    })
  ),
  riskProducts: PropTypes.array.isRequired,
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
  handlers: PropTypes.shape({
    handleDoubleClickRow: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    changeRowsPerPage: PropTypes.func.isRequired,
  }),
};

export function QuoteBindDraftRiskView({ listDraftRisk, draftRiskListLoading, popoverActions, riskProducts, sort, pagination, handlers }) {
  const classes = makeStyles(styles, { name: 'Products' })();
  const cols = [
    { id: 'createdAt', label: utils.string.t('risks.draftCreatedAt') },
    { id: 'product', label: utils.string.t('app.product') },
    { id: 'insureds', label: utils.string.t('app.insured_plural') },
    { id: 'clients', label: utils.string.t('app.client_plural') },
    { id: 'inceptionDate', label: utils.string.t('app.inceptionDate'), nowrap: true },
    { id: 'expiryDate', label: utils.string.t('app.expiryDate'), nowrap: true },
    { id: 'userName', label: utils.string.t('admin.user') },
    { id: 'status', label: '' },
  ];
  const drafts = listDraftRisk && utils.generic.isValidArray(listDraftRisk.items, true) ? listDraftRisk.items : [];

  return (
    <>
      <Overflow>
        <Table>
          <TableHead columns={cols} sorting={sort} />
          {draftRiskListLoading ? (
            <TableBody data-testid="risk-skeleton">
              <TableRow>
                <TableCell colSpan={cols.length}>
                  <Skeleton height={40} animation="wave" displayNumber={10} />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody data-testid="risk-list">
              {drafts &&
                drafts.map((draft) => {
                  const createdAt = utils.string.t('format.date', {
                    value: { date: get(draft, 'lastUpdatedDate'), format: 'lll' },
                  });
                  return (
                    <TableRow key={draft.id} data-testid={`draft-row-${draft.id}`}>
                      <TableCell data-testid={`draft-cell-createdAt-${draft.id}`}>{createdAt}</TableCell>
                      <TableCell data-testid={`draft-cell-product-${draft.id}`}>
                        {utils.risk.getRiskName(draft.productCode, riskProducts)}
                      </TableCell>
                      <TableCell data-testid={`draft-cell-insureds-${draft.id}`}>{get(draft, 'insuredName')}</TableCell>
                      <TableCell data-testid={`draft-cell-clients-${draft.id}`}>{get(draft, 'clientName')}</TableCell>
                      <TableCell nowrap data-testid={`draft-cell-inceptionDate-${draft.id}`}>
                        <Translate
                          label="format.date"
                          options={{ value: { date: draft.risk.inceptionDate, format: config.ui.format.date.text, default: '-' } }}
                        />
                      </TableCell>
                      <TableCell nowrap data-testid={`draft-cell-expiryDate-${draft.id}`}>
                        <Translate
                          label="format.date"
                          options={{ value: { date: draft.risk.expiryDate, format: config.ui.format.date.text, default: '-' } }}
                        />
                      </TableCell>
                      <TableCell data-testid={`draft-cell-userName-${draft.id}`}>{get(draft, 'userName')}</TableCell>
                      <TableCell data-testid={`draft-cell-status-${draft.id}`}>
                        <Button size="xsmall" color="primary" icon={EditIcon} onClick={() => handlers.handleDoubleClickRow(draft)} />
                      </TableCell>
                      <TableCell menu nestedClasses={{ root: classes.dataCellLast }}>
                        <PopoverMenu id="draft-risk" data={draft} items={popoverActions} />
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
  );
}
