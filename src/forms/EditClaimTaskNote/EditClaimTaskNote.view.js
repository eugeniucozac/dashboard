import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './EditClaimTaskNote.styles';
import { Button, FormActions, FormContainer, FormFields, FormGrid, FormLabel, FormText } from 'components';
import * as utils from 'utils';
import config from 'config';

// mui
import { makeStyles, Typography } from '@material-ui/core';

EditClaimTaskNoteView.propTypes = {
  fields: PropTypes.array.isRequired,
  buttons: PropTypes.shape({
    cancel: PropTypes.object.isRequired,
    submit: PropTypes.object.isRequired,
  }),
  formProps: PropTypes.object.isRequired,
  note: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
};

export function EditClaimTaskNoteView({ fields, buttons = {}, formProps, note, breadcrumbs }) {
  const classes = makeStyles(styles, { name: 'EditClaimTaskNote' })();

  const { control, errors, handleSubmit, formState } = formProps;

  const getNotesBreadCrumb = breadcrumbs?.filter(({name}) => name === 'lossRef' || name === 'claimRef' || name === 'taskRef' );

  return (
    <div className={classes.root}>
      {!utils.generic.isInvalidOrEmptyArray(getNotesBreadCrumb)
        ? <FormGrid item xs={12}><Typography variant="body2" classes={{ root: classes.breadcrumbSpacing }}>{getNotesBreadCrumb?.map(({name, label}) => (name !== 'taskRef' ?  label+' / ' : label)).join('')}</Typography></FormGrid>
        : null
      }
      <FormContainer type="dialog" onSubmit={handleSubmit(buttons.submit.handler)} data-testid="form-editClaimTaskNote">
        <FormFields type="dialog">
          <FormGrid container alignItems="center">
            <FormGrid item xs={12} sm={3}>
              <FormLabel label={utils.string.t('claims.notes.editNoteFields.createdDate.label')} align="right" />
            </FormGrid>
            <FormGrid item xs={12} sm={9}>
              <Typography variant="body2" classes={{ root: classes.textOnly }}>
                {utils.string.t('format.date', { value: { date: note?.createdDate || '', format: config.ui.format.date.textTime } })}
              </Typography>
            </FormGrid>
          </FormGrid>

          <FormGrid container alignItems="center">
            <FormGrid item xs={12} sm={3}>
              <FormLabel label={utils.string.t('claims.notes.editNoteFields.createdByName.label')} align="right" />
            </FormGrid>
            <FormGrid item xs={12} sm={9}>
              <Typography variant="body2" classes={{ root: classes.textOnly }}>
                {note?.createdByName || ''}
              </Typography>
            </FormGrid>
          </FormGrid>

          <FormGrid container>
            <FormGrid item xs={12} sm={3}>
              <FormLabel label={utils.string.t('claims.notes.editNoteFields.details.label')} align="right" />
            </FormGrid>
            <FormGrid item xs={12} sm={9}>
              <FormText {...utils.form.getFieldProps(fields, 'details', control, errors)} />
            </FormGrid>
          </FormGrid>

          <FormGrid container alignItems="center">
            <FormGrid item xs={12} sm={3}>
              <FormLabel label={utils.string.t('claims.notes.editNoteFields.updatedDate.label')} align="right" />
            </FormGrid>
            <FormGrid item xs={12} sm={9}>
              <Typography variant="body2" classes={{ root: classes.textOnly }}>
                {utils.string.t('format.date', { value: { date: note?.updatedDate || '', format: config.ui.format.date.textTime } })}
              </Typography>
            </FormGrid>
          </FormGrid>

          <FormGrid container alignItems="center">
            <FormGrid item xs={12} sm={3}>
              <FormLabel label={utils.string.t('claims.notes.editNoteFields.updatedByName.label')} align="right" />
            </FormGrid>
            <FormGrid item xs={12} sm={9}>
              <Typography variant="body2" classes={{ root: classes.textOnly }}>
                {note?.updatedByName || ''}
              </Typography>
            </FormGrid>
          </FormGrid>
        </FormFields>

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
      </FormContainer>
    </div>
  );
}
