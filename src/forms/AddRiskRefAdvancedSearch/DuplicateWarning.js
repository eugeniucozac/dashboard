import React from 'react';

// app
import styles from '../../components/Modal/Modal.styles';
import { Button, Translate } from 'components';
import * as utils from 'utils';

// mui
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Typography, makeStyles } from '@material-ui/core';

export default function DuplicateWarning({ duplicateRiskRefs, isOpen, handleClose, handleAdd }) {
  const classes = makeStyles(styles, { name: 'DuplicateWarning' })();

  return (
    <Dialog open={isOpen} onClose={handleClose}>
      <DialogTitle disableTypography>
        <Typography variant="h2" className={classes.title}>
          <span>{utils.string.t('processingInstructions.addRiskReference.duplicateWarning.title')}</span>
        </Typography>
      </DialogTitle>
      <Divider />
      <DialogContent className={classes.content}>
        <DialogContentText className={classes.text}>
          {utils.string.t('processingInstructions.addRiskReference.duplicateWarning.advancedText', {
            piRefs: duplicateRiskRefs.map((rr) => 'PI' + rr.instructionIds).join(', '),
            riskRefs: duplicateRiskRefs.map((rr) => rr.riskRefId).join(', '),
          })}
        </DialogContentText>
      </DialogContent>
      <>
        <Divider />
        <DialogActions>
          <Button onClick={handleAdd} text={<Translate label="app.yes" />}></Button>
          <Button onClick={handleClose} variant="contained" color="primary" text={<Translate label="app.no" />}></Button>
        </DialogActions>
      </>
    </Dialog>
  );
}
