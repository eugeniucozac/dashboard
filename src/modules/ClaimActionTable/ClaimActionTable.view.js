import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './ClaimActionTable.styles';
import { Empty, Overflow, TableHead } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { useSort } from 'hooks';
import * as utils from 'utils';
import { ClaimActionLevelClaim } from './ClaimActionLevelClaim';

//mui
import { makeStyles, Table, Grid, Box } from '@material-ui/core';

ClaimActionTableView.prototype = {
  sort: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  handleSort: PropTypes.func.isRequired,
};

export function ClaimActionTableView({ rows, sort: sortObj, cols: colsArr, columnProps, handleSort, handlers }) {
  const classes = makeStyles(styles, { name: 'SearchTable' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const hasRows = utils.generic.isValidArray(rows, true);

  return (
    <Box data-testid="claim-action-search-table" className={classes.wrapper}>
      <Overflow>
        <Table data-testid="claim-action-table">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          {hasRows &&
            rows.map((itemLevelOne, index) => {
              return <ClaimActionLevelClaim key={index} data={itemLevelOne} columnProps={columnProps} handlers={handlers} />;
            })}
        </Table>
      </Overflow>
      {rows ? (
        rows.length ? (
          <Grid container>
            <Grid item xs={12}></Grid>
          </Grid>
        ) : (
          <Grid item xs={12}>
            <Empty title={utils.string.t('claims.noMatchFound')} icon={<IconSearchFile />} padding />
          </Grid>
        )
      ) : (
        <Grid item xs={12}>
          <Empty title={utils.string.t('claims.searchLossAndClaims')} icon={<IconSearchFile />} padding />
        </Grid>
      )}
    </Box>
  );
}
