import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './OpeningMemoList.styles';
import { Button, Status, TableCell, TableHead, Translate, Pagination, PopoverMenu } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { Table, TableRow, TableBody, makeStyles } from '@material-ui/core';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import FilterListIcon from '@material-ui/icons/FilterList';
import useMediaQuery from '@material-ui/core/useMediaQuery';

OpeningMemoListView.propTypes = {
  openingMemoList: PropTypes.array.isRequired,
  handleDoubleClickRow: PropTypes.func.isRequired,
  handleDownload: PropTypes.func.isRequired,
  filterOpeningMemoList: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    rowsTotal: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  }).isRequired,
  sort: PropTypes.shape({
    by: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  handleChangePage: PropTypes.func.isRequired,
  handleChangeRowsPerPage: PropTypes.func.isRequired,
};

export function OpeningMemoListView({
  openingMemoList = [],
  handleDoubleClickRow,
  handleDownload,
  filterOpeningMemoList,
  pagination,
  handleChangePage,
  handleChangeRowsPerPage,
  sort,
}) {
  const classes = makeStyles(styles, { name: 'OpeningMemoList' })();

  const filterOptions = [
    {
      id: 'all',
      label: utils.string.t('openingMemo.filter.all'),
      callback: () => filterOpeningMemoList(''),
    },
    {
      id: 'inProgress',
      label: utils.string.t('openingMemo.filter.inProgress'),
      callback: () => filterOpeningMemoList(utils.string.t('openingMemo.filter.inProgress')),
    },
    {
      id: 'awaitingApproval',
      label: utils.string.t('openingMemo.filter.awaitingApproval'),
      callback: () => filterOpeningMemoList(utils.string.t('openingMemo.filter.awaitingApproval')),
    },
    {
      id: 'approved',
      label: utils.string.t('openingMemo.filter.approved'),
      callback: () => filterOpeningMemoList(utils.string.t('openingMemo.filter.approved')),
    },
  ];

  const filterIcon = (
    <PopoverMenu
      id={`status-select`}
      size="small"
      offset
      icon={FilterListIcon}
      iconPosition="right"
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      items={filterOptions}
      nestedClasses={{ btn: classes.filterIcon }}
    />
  );

  const riskReferenceTitleWidth = useMediaQuery('(max-width:1400px)');

  const cols = [
    { id: 'riskReference', label: utils.string.t('placement.openingMemo.riskReference'), ...(riskReferenceTitleWidth && { width: 250 }) },
    { id: 'status', label: utils.string.t('app.status'), icon: filterIcon, width: 150 },
    { id: 'accountHandler', label: utils.string.t('placement.openingMemo.columnNames.accountHandler'), width: 200 },
    { id: 'isAuthorised', label: utils.string.t('placement.openingMemo.columnNames.isAuthorised'), width: 200 },
    { id: 'insuredName', label: utils.string.t('openingMemo.reInsured'), width: 200 },
    { id: 'inceptionDate', label: utils.string.t('app.inceptionDate'), width: 110 },
    { id: 'download', label: utils.string.t('app.download'), width: 60 },
  ];

  const Approval = ({ status }) => {
    return <CheckCircleOutlineIcon className={status ? classes.statusApproved : classes.statusInProgress} />;
  };

  return (
    <>
      <Table size="small">
        <TableHead columns={cols} sorting={sort} />
        <TableBody data-testid="opening-memo-list">
          {openingMemoList.map((openingMemo, index) => {
            const umr = openingMemo.uniqueMarketReference || '';
            const inceptionDate = openingMemo?.inceptionDate
              ? utils.string.t('format.date', {
                  value: { date: openingMemo.inceptionDate, format: config.ui.format.date.text },
                })
              : '';
            const reInsured = openingMemo?.reInsured ? openingMemo.reInsured : '';

            return (
              <TableRow
                key={index}
                hover
                data-testid={`opening-memo-${openingMemo.id}`}
                onDoubleClick={() => handleDoubleClickRow(openingMemo.id)}
              >
                <TableCell data-testid={`opening-memo-cell-policy`}>{umr.toString().replace(/,/g, ', ')}</TableCell>

                <TableCell data-testid={`opening-memo-cell-status`}>
                  <div className={classes.statusContainer}>
                    <Status
                      nestedClasses={{ root: classes.statusChip }}
                      size="sm"
                      text={<Translate label={`status.${utils.string.replaceLowerCase(openingMemo.status)}`} />}
                      status={utils.string.replaceLowerCase(openingMemo.status)}
                    />
                  </div>
                </TableCell>
                <TableCell className={classes.approvalCell}>
                  <div className={classes.approvalContainer}>
                    <Approval status={openingMemo.isAccountHandlerApproved} />
                    <div className={classes.approvalChild}>{openingMemo?.accountHandler?.fullName || ''}</div>
                  </div>
                </TableCell>
                <TableCell className={classes.approvalCell}>
                  <div className={classes.approvalContainer}>
                    <Approval status={openingMemo.isAuthorisedSignatoryApproved} />
                    <div className={classes.approvalChild}>{openingMemo?.authorisedSignatory?.fullName || ''}</div>
                  </div>
                </TableCell>

                <TableCell data-testid={`opening-memo-cell-reInsured`}>{reInsured}</TableCell>
                <TableCell data-testid={`opening-memo-cell-inceptionDate`}>{inceptionDate}</TableCell>

                <TableCell align="center" className={classes.downloadColumn} data-testid={`opening-memo-cell-download`}>
                  <Button
                    onClick={() => handleDownload(openingMemo.id)}
                    nestedClasses={{ btn: classes.downloadPdfButton }}
                    size="xsmall"
                    color="primary"
                    icon={PictureAsPdfIcon}
                    data-testid="download-pdf"
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <Pagination
        page={pagination.page}
        count={pagination.rowsTotal}
        rowsPerPage={pagination.rowsPerPage}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </>
  );
}
