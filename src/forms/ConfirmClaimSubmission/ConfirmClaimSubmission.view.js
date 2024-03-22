import React from 'react';

// app
import styles from './ConfirmClaimSubmission.styles';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';
import { Button, FormActions } from 'components';

export function ConfirmClaimSubmissionView(props) {
  const { handleCancel, handleSubmit } = props;

  const classes = makeStyles(styles, { name: 'ConfirmClaimSubmission' })();

  return (
    <div className={classes.root}>
      <Typography color="primary" className={classes.promptText}>
        {utils.string.t('claims.modals.confirmClaimSubmission.content')}
      </Typography>
      <FormActions type="dialog">
        <Button text={utils.string.t('app.no')} variant="outlined" size="medium" onClick={handleCancel} />
        <Button text={utils.string.t('app.yes')} size="medium" color="primary" onClick={handleSubmit} />
      </FormActions>
    </div>
  );
}
