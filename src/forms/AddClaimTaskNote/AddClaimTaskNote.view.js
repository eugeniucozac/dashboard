import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddClaimTaskNote.styles';
import { Button, FormActions, FormContainer, FormFields, FormGrid, FormHidden, FormLabel, FormText } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, Typography } from '@material-ui/core';

AddClaimTaskNoteView.propTypes = {
  fields: PropTypes.array,
  buttons: PropTypes.shape({
    cancel: PropTypes.object.isRequired,
    submit: PropTypes.object.isRequired,
  }),
  formProps: PropTypes.object.isRequired,
  breadcrumbs: PropTypes.array.isRequired,
};

export function AddClaimTaskNoteView({ fields, buttons = {}, formProps, breadcrumbs }) {
  const classes = makeStyles(styles, { name: 'AddClaimTaskNote' })();

  const { control, errors, handleSubmit, formState } = formProps;

  const textOnlyFields = fields.filter((f) => f.textOnly).map((f) => f.name);

  const getNotesBreadCrumb = breadcrumbs?.filter(({name}) => name === 'lossRef' || name === 'claimRef' || name === 'taskRef' );
  
  return (
    <div className={classes.root}>
      {getNotesBreadCrumb?.length > 0
        ? <FormGrid item xs={12}><Typography variant="body2" classes={{ root: classes.breadcrumbSpacing }}>{getNotesBreadCrumb?.map(({name, label}) => (name !== 'taskRef' ?  label+' / ' : label)).join('')}</Typography></FormGrid>
        : null
      }
      <FormContainer type="dialog" onSubmit={handleSubmit(buttons.submit.handler)} data-testid="form-addClaimTaskNote">

        <FormFields type="dialog">
          {textOnlyFields.map((field) => {
            return (
              <FormGrid container alignItems="center" key={field}>
                <FormGrid item xs={3}>
                  <FormLabel label={utils.string.t(`claims.notes.addNoteFields.${field}.label`)} align="right" />
                </FormGrid>
                <FormGrid item xs={9}>
                  <Typography variant="body2" classes={{ root: classes.textOnly }}>
                    {utils.form.getFieldProps(fields, field)?.value}
                  </Typography>
                  <FormHidden {...utils.form.getFieldProps(fields, field, control)} />
                </FormGrid>
              </FormGrid>
            );
          })}

          <FormGrid container>
            <FormGrid item xs={3}>
              <FormLabel label={utils.string.t('claims.notes.addNoteFields.details.label')} align="right" />
            </FormGrid>
            <FormGrid item xs={9}>
              <FormText {...utils.form.getFieldProps(fields, 'details', control, errors)} />
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
