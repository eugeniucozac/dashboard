import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddComplexity.styles';
import * as utils from 'utils';
import { Button, FormActions, FormContainer, FormFields, FormGrid, FormLabel, FormRequired, FormText } from 'components';

// mui
import { makeStyles } from '@material-ui/core';
AddComplexityView.prototype = {
  fields: PropTypes.array.isRequired,
  submit: PropTypes.object.isRequired,
  cancel: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isPageEdited: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    handleSubmit: PropTypes.func.isRequired,
    cancelModal: PropTypes.func.isRequired,
  }),
};

export function AddComplexityView({ fields, submit, cancel, control, errors, isPageEdited, handlers }) {
  const classes = makeStyles(styles, { name: 'AddComplexity' })();

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handlers.handleSubmit(submit.handler)}>
        <FormRequired type="dialog" />
        <FormFields type="dialog">
          <FormGrid container spacing={2} className={classes.formgridcontainer}>
            <FormGrid item xs={6}>
              <FormLabel
                nestedClasses={{ root: classes.formLabel }}
                label={`${utils.string.t('claims.modals.addComplexity.label')} *`}
                align="right"
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormText {...utils.form.getFieldProps(fields, 'complexityRulesValue', control)} error={errors.complexityRulesValue} />
            </FormGrid>
          </FormGrid>
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        <Button text={cancel.label} variant="outlined" size="medium" onClick={() => handlers.cancelModal()} />
        <Button
          text={submit.label}
          size="medium"
          color="primary"
          type="submit"
          disabled={!isPageEdited}
          onClick={handlers.handleSubmit(submit.handler)}
        />
      </FormActions>
    </div>
  );
}
