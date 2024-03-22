import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// app
import styles from './ComplexityManagementDivisionReset.styles';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';
import { Button, FormActions } from 'components';

ComplexityManagementDivisionResetView.propTypes = {
  actions: PropTypes.array,
};
export function ComplexityManagementDivisionResetView({ actions }) {
  const classes = makeStyles(styles, { name: 'ConfirmClaimSubmission' })();
  const { reset } = useForm();
  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div className={classes.root}>
      <Typography color="primary" className={classes.promptText}>
        {utils.string.t('claims.modals.resetDivisionComplexity.content')}
      </Typography>
      <FormActions type="dialog">
        <Button text={utils.string.t('app.no')} variant="outlined" size="medium" onClick={cancel.handler} />
        <Button text={utils.string.t('app.yes')} size="medium" color="primary" onClick={submit.handler} />
      </FormActions>
    </div>
  );
}
