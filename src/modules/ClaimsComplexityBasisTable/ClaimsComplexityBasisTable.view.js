import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import classnames from 'classnames';

//app
import styles from './ClaimsComplexityBasisTable.styles';
import * as utils from 'utils';
import { TableCell, TableHead, Pagination, Empty } from 'components';
import { ReactComponent as IconSearchFile } from '../../assets/svg/line-icon-search-file.svg';
import { usePagination, useSort } from 'hooks';

//mui
import { makeStyles, Grid, TableContainer, Table, TableRow, TableBody, Box } from '@material-ui/core';

ClaimsComplexityBasisTableView.prototypes = {
  activeItem: PropTypes.object.isRequired,
  colsArr: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  sortObj: PropTypes.object.isRequired,
  pagination: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    handleSort: PropTypes.func.isRequired,
    handleChangePage: PropTypes.func.isRequired,
    handleChangeRowsPerPage: PropTypes.func.isRequired,
    handleValueSelect: PropTypes.func.isRequired,
  }).isRequired,
};
export function ClaimsComplexityBasisTableView({ activeItem, cols: colsArr, rows = [], sort: sortObj, pagination, handlers }) {
  const classes = makeStyles(styles, { name: 'ClaimsComplexityBasisTable' })();
  const { cols, sort } = useSort(colsArr, sortObj, handlers.handleSort);
  const paginationObj = usePagination(rows, pagination, handlers.handleChangePage, handlers.handleChangeRowsPerPage);

  return (
    <Box>
      <TableContainer>
        <Table data-testid="complexity-basis-table">
          <TableHead columns={cols} sorting={sort} nestedClasses={{ tableHead: classes.tableHead }} />
          <TableBody>
            {utils.generic.isValidArray(rows, true) &&
              rows.map((complexityValue) => {
                const classesRow = {
                  [classes.row]: true,
                  [classes.rowSelected]: activeItem?.complexityRulesID === complexityValue?.complexityRulesID,
                };
                return (
                  <TableRow
                    key={complexityValue.complexityRulesID}
                    onClick={complexityValue?.isComplex ? () => handlers.handleValueSelect(complexityValue) : () => {}}
                    className={complexityValue?.isComplex ? classnames(classesRow) : classes.tableRowDisable}
                    hover
                  >
                    <TableCell data-testid={`row-col-${complexityValue.complexityRulesValue}`} className={classes.tableCell}>
                      {complexityValue.complexityRulesValue}
                    </TableCell>
                    <TableCell data-testid={`row-col-${complexityValue?.forCompany}`}> {complexityValue?.forCompany}</TableCell>
                    <TableCell data-testid={`row-col-${complexityValue?.forDivision}`}> {complexityValue?.forDivision} </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
        {!utils.generic.isValidArray(rows, true) && (
          <Box>
            <Empty
              title={utils.string.t('claims.noMatchFound')}
              text={utils.string.t('claims.noMatchDetails')}
              icon={<IconSearchFile />}
              padding
            />
          </Box>
        )}
        <Grid container>
          <Grid item xs={12}>
            <Pagination
              page={get(paginationObj, 'obj.page')}
              count={get(paginationObj, 'obj.rowsTotal')}
              rowsPerPage={get(paginationObj, 'obj.rowsPerPage')}
              onChangePage={get(paginationObj, 'handlers.handleChangePage')}
              onChangeRowsPerPage={get(paginationObj, 'handlers.handleChangeRowsPerPage')}
            />
          </Grid>
        </Grid>
      </TableContainer>
    </Box>
  );
}
