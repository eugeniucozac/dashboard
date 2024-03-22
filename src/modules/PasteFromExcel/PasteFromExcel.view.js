import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './PasteFromExcel.styles';
import { Accordion, Button, Form, Overflow, TableCell, TableHead, Translate, Warning } from 'components';
import * as utils from 'utils';

// mui
import { Box, TableContainer, Table, TableRow, TableBody, Typography, makeStyles } from '@material-ui/core';

PasteFromExcelView.propTypes = {
  step: PropTypes.number,
  steps: PropTypes.number,
  labels: PropTypes.shape({
    step1: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
      label: PropTypes.string,
      required: PropTypes.string,
      placeholder: PropTypes.string,
    }),
    step2: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
      label: PropTypes.string,
      error: PropTypes.string,
    }),
    step3: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
    }),
    step4: PropTypes.shape({
      title: PropTypes.node,
      hint: PropTypes.string,
    }),
  }),
  fields: PropTypes.shape({
    excelExtract: PropTypes.array,
    columnMatching: PropTypes.array,
  }).isRequired,
  rows: PropTypes.array,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string,
      compact: PropTypes.bool,
    })
  ),
  imported: PropTypes.bool,
  testid: PropTypes.string,
  isHeaderMappingMissing: PropTypes.bool,
  handlers: PropTypes.shape({
    setSteps: PropTypes.func,
    excelExtract: PropTypes.func,
    columnMatching: PropTypes.func,
    submit: PropTypes.func,
  }),
};

export function PasteFromExcelView({
  step,
  steps,
  labels,
  fields,
  rows,
  columns,
  imported,
  testid,
  isHeaderMappingMissing,
  handlers,
  children,
}) {
  const classes = makeStyles(styles, { name: 'PasteFromExcel' })();

  const hasRows = utils.generic.isValidArray(rows, true);
  const has4Steps = steps === 4;

  return (
    <div className={classes.root} data-testid={`paste-from-excel${testid ? `-${testid}` : ''}`}>
      <Accordion
        expanded={step === 1}
        boxed
        density="comfortable"
        title={labels.step1.title}
        onChange={() => handlers.setSteps(1)}
        testid="step1"
      >
        <Box display="flex" flexDirection="column" width={1}>
          <Typography className={classes.hint}>{labels.step1.hint}</Typography>
          <Form
            id="excel-extract"
            fields={fields.excelExtract}
            defaultValues={utils.form.getInitialValues(fields.excelExtract)}
            validationSchema={utils.form.getValidationSchema(fields.excelExtract)}
            actions={[
              {
                name: 'submit',
                label: utils.string.t('app.continue'),
                handler: handlers.excelExtract,
              },
            ]}
          />
        </Box>
      </Accordion>

      <Accordion
        expanded={step === 2}
        boxed
        density="comfortable"
        title={labels.step2.title}
        onChange={() => handlers.setSteps(2)}
        testid="step2"
      >
        <Box display="flex" flexDirection="column" width={1}>
          {!imported && <Warning text={labels.step2.error} type="error" size="medium" align="left" icon />}
          {imported && (
            <>
              <Typography className={classes.hint}>{labels.step2.hint}</Typography>
              <Form
                id="column-matching"
                fields={fields.columnMatching}
                defaultValues={utils.form.getInitialValues(fields.columnMatching)}
                actions={[
                  {
                    name: 'submit',
                    label: utils.string.t('app.continue'),
                    handler: handlers.columnMatching,
                  },
                ]}
              />
            </>
          )}
        </Box>
      </Accordion>

      <Accordion
        expanded={step === 3}
        boxed
        density="comfortable"
        title={labels.step3.title}
        onChange={() => handlers.setSteps(3)}
        testid="step3"
      >
        <Box display="flex" flexDirection="column" width={1}>
          <Typography className={classes.hint}>{labels.step3.hint}</Typography>

          {isHeaderMappingMissing && (
            <Warning text={utils.string.t('products.pasteFromExcel.step3.error')} type="error" size="medium" align="left" icon />
          )}

          {children && hasRows && children(rows)}

          {!children && hasRows && (
            <Box mt={-2}>
              <Overflow>
                <TableContainer className={classes.tableContainer}>
                  <Table size="small" className={classes.table} stickyHeader>
                    <TableHead columns={columns} />
                    <TableBody>
                      {rows.map((row, rowIdx) => {
                        const cells = Object.entries(row) || [];
                        const hasCells = cells.length > 0;

                        return (
                          <TableRow key={`row-${rowIdx}`}>
                            {hasCells &&
                              cells.map(([key, value], cellIdx) => {
                                const cellKey = `cell-${cellIdx}-${key}`;
                                return (
                                  <TableCell className={classes.cell} key={cellKey} data-testid={cellKey}>
                                    {value}
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
            </Box>
          )}

          <Box mt={1} display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              disabled={!imported || isHeaderMappingMissing}
              text={<Translate label={has4Steps ? 'app.confirm' : 'app.submit'} />}
              nestedClasses={{ btn: classes.button }}
              onClick={has4Steps ? () => handlers.setSteps(4) : handlers.submit(rows)}
            />
          </Box>
        </Box>
      </Accordion>

      {has4Steps && (
        <Accordion
          expanded={step === 4}
          boxed
          density="comfortable"
          title={labels.step4.title}
          onChange={() => handlers.setSteps(4)}
          testid="step4"
        >
          <Box display="flex" flexDirection="column" width={1}>
            <Typography className={classes.hint}>{labels.step4.hint}</Typography>

            <Box mt={1} display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                disabled={!imported}
                text={<Translate label="app.submit" />}
                nestedClasses={{ btn: classes.button }}
                onClick={handlers.submit(rows)}
              />
            </Box>
          </Box>
        </Accordion>
      )}
    </div>
  );
}
