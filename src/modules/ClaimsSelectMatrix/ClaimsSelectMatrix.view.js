import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';

//app
import styles from './ClaimsSelectMatrix.styles';
import { Button, Overflow, TableHead, TableCell, FormCheckbox, FormContainer } from 'components';
import * as utils from 'utils';

//mui
import { makeStyles, Box, Grid, Table, TableContainer, TableBody, TableRow } from '@material-ui/core';

ClaimsSelectMatrixView.prototypes = {
  cols: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  matrixRowKeys: PropTypes.array.isRequired,
  matrixPrimaryKey: PropTypes.string.isRequired,
  fields: PropTypes.array.isRequired,
  resetMatrix: PropTypes.func.isRequired,
  saveMatrix: PropTypes.func.isRequired,
  matrixDataDiff: PropTypes.object.isRequired,
};

export function ClaimsSelectMatrixView({ cols, rows, matrixRowKeys, matrixPrimaryKey, fields, resetMatrix, saveMatrix, matrixDataDiff }) {
  const classes = makeStyles(styles, { name: 'SelectMatrix' })();

  const { control, register, watch, handleSubmit, reset } = useForm();

  useEffect(() => {
    if (!Object.keys(matrixDataDiff).length) {
      reset({ fields });
    }
  }, [matrixDataDiff]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box data-testid="claims-complexity-table" className={classes.wrapper}>
      <Grid container>
        <Grid item xs={12}>
          <FormContainer nestedClasses={{ root: classes.formContainer }}>
            <Overflow>
              <TableContainer className={classes.tableContainer}>
                <Table stickyHeader aria-label="select matrix table" data-testid="select-matrix-table">
                  <TableHead
                    columns={cols}
                    nestedClasses={{ tableHead: classes.tableHead }}
                    data-testid="select-matrix-thead"
                    compact
                    nowrap
                  />
                  <TableBody data-testid="select-matrix-tbody">
                    {rows.map((eachRow, ind) => {
                      return (
                        <TableRow key={matrixRowKeys[ind]} hover data-testid="select-matrix-trow">
                          <TableCell compact className={classes.tableFirstCell} data-testid="select-matrix-tcell-division">
                            {eachRow[matrixPrimaryKey]}
                          </TableCell>
                          {Object.entries(eachRow)
                            .slice(1)
                            .map((eachData, idx) => {
                              return (
                                <TableCell
                                  key={eachData[0]}
                                  compact
                                  className={classes.tableCell}
                                  data-testid={`select-matrix-tcell-${ind + 1}-${idx + 1}`}
                                >
                                  <FormCheckbox
                                    {...utils.form.getFieldProps(fields[ind], fields[ind][idx].name)}
                                    control={control}
                                    register={register}
                                    watch={watch}
                                  />
                                </TableCell>
                              );
                            })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Overflow>
          </FormContainer>
        </Grid>
        <Grid item xs={12}>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button text={utils.string.t('app.reset')} onClick={resetMatrix} size="medium" nestedClasses={{ btn: classes.actionButton }} />
            <Button
              text={utils.string.t('app.save')}
              onClick={handleSubmit(saveMatrix)}
              size="medium"
              nestedClasses={{ btn: classes.actionButton }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
