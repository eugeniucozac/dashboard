import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './AddReferral.styles';
import * as utils from 'utils';
import { Button, FormActions, FormContainer, FormFields, FormGrid, FormLabel, FormRequired, FormText } from 'components';

// mui
import { makeStyles } from '@material-ui/core';
AddReferralView.prototype = {
  fields: PropTypes.array.isRequired,
  submit: PropTypes.object.isRequired,
  cancel: PropTypes.object.isRequired,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  cancelModal: PropTypes.func.isRequired,
};

export function AddReferralView({ fields, submit, cancel, control, errors, handleSubmit, cancelModal }) {
  const classes = makeStyles(styles, { name: 'AddReferral' })();

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit}>
        <FormRequired type="dialog" />
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={6}>
              <FormLabel
                nestedClasses={{ root: classes.formLabel }}
                label={`${utils.string.t('claims.modals.addReferralValues.label')} *`}
                align="right"
              />
            </FormGrid>
            <FormGrid item xs={6}>
              <FormText {...utils.form.getFieldProps(fields, 'addReferralValue', control)} error={errors.addReferralValue} />
            </FormGrid>
          </FormGrid>
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        <Button text={cancel.label} variant="outlined" size="medium" onClick={() => cancelModal()} />
        <Button text={submit.label} size="medium" color="primary" type="submit" onClick={handleSubmit(submit.handler)} />
      </FormActions>
    </div>
  );
}
