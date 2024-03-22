import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import moment from 'moment';

// app
import { TableCell, Link, Translate, Tooltip, Status } from 'components';
import { selectClaimsStatuses, getStatuses, selectLossItem, selectLossSelected } from 'stores';
import * as utils from 'utils';
import config from 'config';
import { STATUS_CLAIMS_DRAFT, TASK_TAB_INPROGRESS_STATUS, TASK_TAB_COMPLETED_STATUS } from 'consts';

// mui
import { Box, TableRow } from '@material-ui/core';

export function LossesTabTableRow({ data, columnProps }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const statuses = useSelector(selectClaimsStatuses);
  const selectedRow = useSelector(selectLossSelected);

  const cellLength = 50;

  useEffect(() => {
    if (utils.generic.isInvalidOrEmptyArray(statuses)) dispatch(getStatuses());
  }, [statuses]); // eslint-disable-line react-hooks/exhaustive-deps

  const lossRefHandler = (rowData) => {
    history.push(`${config.routes.claimsFNOL.loss}/${rowData.lossRef}`);
    dispatch(selectLossItem(rowData));
  };

  const getLossStatus = (lossStatus) => {
    if (lossStatus === STATUS_CLAIMS_DRAFT) {
      return { type: 'error' };
    } else if (lossStatus === TASK_TAB_COMPLETED_STATUS) {
      return { type: 'success' };
    } else if (lossStatus === TASK_TAB_INPROGRESS_STATUS) {
      return { type: 'alert' };
    } else {
      return {};
    }
  };

  return (
    <TableRow
      key={data.lossRef}
      data-testid={`search-row-${data.lossRef}`}
      hover
      selected={selectedRow?.lossRef ? selectedRow?.lossRef === data.lossRef : false}
    >
      <TableCell {...columnProps('lossRef')} data-testid={`row-col-${data.lossRef}`}>
        <Link text={data?.lossRef} color="secondary" onClick={() => lossRefHandler(data)} />
      </TableCell>
      <TableCell {...columnProps('lossName')} data-testid={`row-col-${data.lossName}`}>
        {data?.lossName?.length > cellLength ? (
          <Tooltip inlineFlex title={data?.lossName}>
            {data?.lossName.slice(0, cellLength)}...
          </Tooltip>
        ) : (
          data?.lossName
        )}
        {data?.isInflighLoss === 1 && (
          <Box ml={1} display="inline">
            <Status size="xs" text={utils.string.t('app.migrated')} status="light" />
          </Box>
        )}
      </TableCell>
      <TableCell {...columnProps('lossDetails')} data-testid={`row-col-${data.lossDetails}`}>
        {data?.lossDescription?.length > cellLength ? (
          <Tooltip block title={data?.lossDescription}>
            {data?.lossDescription.slice(0, cellLength)}...
          </Tooltip>
        ) : (
          data?.lossDescription
        )}
      </TableCell>
      <TableCell {...columnProps('dateFrom')} data-testid={`row-col-${data.dateFrom}`}>
        {data?.lossFromDate ? moment(data?.lossFromDate).utcOffset(0).format(config.ui.format.date.text) : ''}
      </TableCell>
      <TableCell {...columnProps('dateTo')} data-testid={`row-col-${data.dateTo}`}>
        {data?.lossToDate ? moment(data?.lossToDate).utcOffset(0).format(config.ui.format.date.text) : ''}
      </TableCell>
      <TableCell {...columnProps('firstContactDateTime')} data-testid={`row-col-${data.firstContactDateTime}`}>
        {data?.firstContactDate ? moment(data?.firstContactDate).utcOffset(0).format(config.ui.format.date.text) : ''}
      </TableCell>
      <TableCell {...columnProps('catCodesID')} data-testid={`row-col-${data.catCodesID}`}>
        {data?.catCodeDescription?.length > cellLength ? (
          <Tooltip block title={data?.catCodeDescription}>
            {data?.catCodeDescription.slice(0, cellLength)}...
          </Tooltip>
        ) : (
          data?.catCodeDescription
        )}
      </TableCell>
      <TableCell {...columnProps('lossStatus')} data-testid={`row-col-${data.lossStatus}`}>
        {getLossStatus(data?.lossStatus)?.type ? (
          <Status size="sm" text={<Translate label={data?.lossStatus} />} status={getLossStatus(data?.lossStatus)?.type} />
        ) : null}
      </TableCell>
    </TableRow>
  );
}
