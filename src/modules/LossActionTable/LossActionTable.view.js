import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './LossActionTable.styles';
import { Empty, Overflow, TableHead } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { useSort } from 'hooks';
import * as utils from 'utils';
import { LossActionLevelOne } from './LossActionLevelOne';

//mui
import { makeStyles, Table, Grid, Box } from '@material-ui/core';

LossActionTableView.prototype = {
  sort: PropTypes.object.isRequired,
  rows: PropTypes.array.isRequired,
  columnProps: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  handleSort: PropTypes.func.isRequired,
};

export function LossActionTableView({ rows, sort: sortObj, cols: colsArr, columnProps, handleSort }) {
  const classes = makeStyles(styles, { name: 'SearchTable' })();
  const { cols, sort } = useSort(colsArr, sortObj, handleSort);
  const hasRows = utils.generic.isValidArray(rows, true);

  return (
    <Box data-testid="loss-action-search-table" className={classes.wrapper}>
      <Overflow>
        <Table data-testid="loss-action-table">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          {hasRows &&
            rows?.map((itemLevelOne, index) => {
              return <LossActionLevelOne key={index} data={itemLevelOne} columnProps={columnProps} />;
            })}
        </Table>
      </Overflow>
      {rows ? (
        rows?.length ? (
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
