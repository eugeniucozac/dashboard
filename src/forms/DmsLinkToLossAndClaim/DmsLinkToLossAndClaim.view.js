import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { useFormActions } from 'hooks';
import styles from './DmsLinkToLossAndClaim.style';
import { Button, FormContainer, FormActions, FormFields, FormLabel, FormCheckbox, TableActions, TableToolbar } from 'components';

//mui
import { Box, Grid, makeStyles } from '@material-ui/core';

DmsLinkToLossAndClaimView.propTypes = {
  fields: PropTypes.array.isRequired,
  control: PropTypes.object.isRequired,
  actions: PropTypes.array.isRequired,
  reset: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  formState: PropTypes.object.isRequired,
  canLinkToTask: PropTypes.bool
};

export default function DmsLinkToLossAndClaimView({ fields, control, actions, reset, handleSubmit, formState, canLinkToTask }) {
  const classes = makeStyles(styles, { name: 'DmsLinkToLossAndClaim' })();
  const { secondary, submit } = useFormActions(actions, reset);

  return (
    <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-link-to-loss-and-claim">
      <FormFields type="dialog">
        <Box width="100%">
          <TableToolbar>
            <TableActions>
              <Grid container>
                <Grid item>
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'linkToLoss')} control={control} />
                </Grid>
                <Grid item>
                  <FormLabel
                    label={`${utils.string.t('dms.view.linkToLossAndClaim.loss')} `}
                    align="left"
                    nestedClasses={{ root: classes.viewLabel }}
                  />
                </Grid>
              </Grid>
              <Grid container>
                <Grid item>
                  <FormCheckbox {...utils.form.getFieldProps(fields, 'linkToClaim')} control={control} />
                </Grid>
                <Grid item>
                  <FormLabel
                    label={`${utils.string.t('dms.view.linkToLossAndClaim.claim')} `}
                    align="left"
                    nestedClasses={{ root: classes.viewLabel }}
                  />
                </Grid>
              </Grid>
              {canLinkToTask && (
                <Grid container>
                  <Grid item>
                    <FormCheckbox {...utils.form.getFieldProps(fields, 'linkToTask')} control={control} />
                  </Grid>
                  <Grid item>
                    <FormLabel
                      label={`${utils.string.t('dms.view.linkToLossAndClaim.task')} `}
                      align="left"
                      nestedClasses={{ root: classes.viewLabel }}
                    />
                  </Grid>
                </Grid>
              )}
            </TableActions>
          </TableToolbar>
        </Box>
      </FormFields>
      <FormActions type="dialog">
        {secondary && (
          <Button text={secondary.label} variant="outlined" size="medium" disabled={formState.isSubmitting} onClick={secondary.handler} />
        )}
        {submit && (
          <Button
            text={submit.label}
            type="submit"
            disabled={formState.isSubmitting}
            onClick={handleSubmit(submit.handler)}
            color="primary"
          />
        )}
      </FormActions>
    </FormContainer>
  );
}
