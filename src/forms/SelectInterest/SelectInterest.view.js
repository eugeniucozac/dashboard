import React from 'react';

//app
import * as utils from 'utils';
import { Button, Overflow, TableHead, TableCell, FormActions } from 'components';
import styles from './SelectInterest.styles';

//mui
import { makeStyles, Table, TableRow, TableBody, Box, RadioGroup, Radio, Typography } from '@material-ui/core';

export function SelectInterestView({ interestList, cols, actions, setSelectedInterest, selectedInterest }) {
  const classes = makeStyles(styles, { name: 'SelectInterest' })();

  //this should be reviewed after demo
  const cancel = actions && actions.find((action) => action.name === 'cancel' && action.handler);
  const submit = actions && actions.find((action) => action.name === 'submit' && action.handler);

  return (
    <>
      <Box className={classes.root}>
        <Typography className={classes.tableTitle}>{utils.string.t('claims.claimInformation.selectInterestFromTheList')}</Typography>
        <Overflow>
          <RadioGroup name="interests" value={selectedInterest} onChange={(event) => setSelectedInterest(event.target.value)}>
            <Table data-testid="claims-table">
              <TableHead columns={cols} nestedClasses={{ tableHead: classes.tableHead }} />
              <TableBody data-testid="interest-list">
                {interestList.length
                  ? interestList.map((interest) => {
                      return (
                        <TableRow className={classes.tr} key={interest.code} data-testid={`interest-row-${interest.id}`}>
                          <TableCell center data-testid={`interest-radio-${interest.id}`}>
                            <Radio
                              value={interest.policyInterestID}
                              checked={selectedInterest.toString() === interest.policyInterestID.toString()}
                              name="interest"
                              color="primary"
                              className={classes.radio}
                            />
                          </TableCell>
                          <TableCell data-testid={`interest-${interest.code}`}>{interest.code}</TableCell>
                          <TableCell data-testid={`interest-${interest.rate}`}>{interest.rate}</TableCell>
                          <TableCell data-testid={`interest-${interest.description}`}>{interest.description}</TableCell>
                        </TableRow>
                      );
                    })
                  : utils.string.t('claims.claimInformation.noInterestAvailable')}
              </TableBody>
            </Table>
          </RadioGroup>
        </Overflow>
      </Box>
      <FormActions type="dialog">
        {cancel && <Button text={utils.string.t('app.cancel')} variant="outlined" color="primary" onClick={cancel.handler} />}
        {submit && <Button text={utils.string.t('app.ok')} type="submit" color="primary" onClick={submit.handler} />}
      </FormActions>
    </>
  );
}
