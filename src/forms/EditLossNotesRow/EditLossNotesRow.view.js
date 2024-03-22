import React from 'react';
import PropTypes from 'prop-types';

//app
import styles from './EditLossNotesRow.styles';
import { Button, FormContainer, FormFields, FormGrid, FormText, FormLabel, FormActions, FormHidden } from 'components';
import config from 'config';
import * as utils from 'utils';

//mui
import { makeStyles, Typography } from '@material-ui/core';

EditLossNotesRowView.propTypes = {
  fields: PropTypes.array,
  buttons: PropTypes.shape({
    cancel: PropTypes.object.isRequired,
    submit: PropTypes.object.isRequired,
  }),
  formProps: PropTypes.object.isRequired,
  note: PropTypes.object,
};

export function EditLossNotesRowView({ fields, buttons = {}, formProps, note }) {
  const classes = makeStyles(styles, { name: 'EditLossNotesRow' })();
  const { control, errors, handleSubmit, formState } = formProps;

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(buttons.submit.handler)} data-testid="edit-loss-notes">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.processing.tasksGridColumns.dateAndTimeCreated')}`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <Typography variant="body2" classes={{ root: classes.textOnly }}>
                    {utils.string.t('format.date', {
                      value: { date: note?.createdDate, format: config.ui.format.date.textTime },
                    })}
                  </Typography>
                </FormGrid>
              </FormGrid>

              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.audits.columns.createdBy')}`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <Typography variant="body2" classes={{ root: classes.textOnly }}>
                    {note?.createdByName}
                  </Typography>
                </FormGrid>
              </FormGrid>

              <FormGrid container>
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.notes.noteDetails')}*`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <FormText {...utils.form.getFieldProps(fields, 'notesDescription', control, errors)} />
                </FormGrid>
              </FormGrid>

              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.notes.columns.dateUpdated')}`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <Typography variant="body2" classes={{ root: classes.textOnly }}>
                    {note?.createdDate !== note?.updatedDate &&
                      note?.updatedDate &&
                      utils.string.t('format.date', {
                        value: { date: note?.updatedDate, format: config.ui.format.date.textTime },
                      })}
                  </Typography>
                </FormGrid>
              </FormGrid>

              <FormGrid container alignItems="center">
                <FormGrid item xs={4}>
                  <FormLabel label={`${utils.string.t('claims.notes.columns.updatedBy')}`} align="right" />
                </FormGrid>
                <FormGrid item xs={8}>
                  <Typography variant="body2" classes={{ root: classes.textOnly }}>
                    {note?.createdDate !== note?.updatedDate && note?.updatedByName}
                  </Typography>
                </FormGrid>
              </FormGrid>
            </FormGrid>
          </FormGrid>
          <FormHidden {...utils.form.getFieldProps(fields, 'caseIncidentNotesID', control)} />
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        {buttons.cancel && (
          <Button text={buttons.cancel.label} variant="text" disabled={formState.isSubmitting} onClick={buttons.cancel.handler} />
        )}
        {buttons.submit && (
          <Button
            text={buttons.submit.label}
            type="submit"
            disabled={formState.isSubmitting || !formState.isDirty}
            onClick={handleSubmit(buttons.submit.handler)}
            color="primary"
          />
        )}
      </FormActions>
    </div>
  );
}
