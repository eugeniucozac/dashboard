import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

//app
import styles from './AddEditClaimRefNotes.styles';
import { Button, FormContainer, FormFields, FormGrid, FormText, FormLabel, FormActions, FormHidden } from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

//mui
import { makeStyles, Typography } from '@material-ui/core';

AddEditClaimRefNotesView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  claim: PropTypes.object,
  loss: PropTypes.object,
};

export function AddEditClaimRefNotesView({ actions, fields, claim, loss }) {
  const classes = makeStyles(styles, { name: 'AddEditClaimRefNotes' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const lossReference = claim?.lossRef || loss?.lossRef;

  const { control, errors, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions);

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-add-edit-claim-notes">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormGrid container alignItems="center">
                <FormGrid item xs={9}>
                  <Typography variant="h4" classes={{ root: classes.textOnly }}>
                    {`${utils.string.t('claims.notes.loss')} ${lossReference} ${' /  '} ${utils.string.t('claims.notes.claim')} ${
                      claim?.claimReference
                    }`}
                  </Typography>
                </FormGrid>
              </FormGrid>
              <FormGrid container>
                <FormGrid item xs={3}>
                  <FormLabel label={`${utils.string.t('claims.notes.noteDetails')}*`} align="right" />
                </FormGrid>
                <FormGrid item xs={9}>
                  <FormText {...utils.form.getFieldProps(fields, 'notesDescription', control, errors)} />
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormGrid>
          <FormHidden {...utils.form.getFieldProps(fields, 'caseIncidentID', control)} />
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
        {submit && (
          <Button
            text={submit.label}
            type="submit"
            disabled={formState.isSubmitting || !formState.isDirty}
            onClick={handleSubmit(submit.handler)}
            color="primary"
          />
        )}
      </FormActions>
    </div>
  );
}
