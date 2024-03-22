import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

//app
import * as utils from 'utils';
import { Button, FormContainer, FormFields, FormGrid, FormHidden, FormSelect, FormLabel, FormActions } from 'components';
import { useFormActions } from 'hooks';

SetClaimsTaskSelectionView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
};

export function SetClaimsTaskSelectionView({ actions, fields }) {
  const defaultValues = utils.form.getInitialValues(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({ defaultValues });

  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div>
      <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-set-claim-task-selection">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid container alignItems="center">
              <FormGrid item xs={3}>
                <FormLabel label={utils.string.t('claims.claimDetailsLabel.taskSelection')} align="right" />
              </FormGrid>
              <FormGrid item xs={7}>
                <FormSelect
                  {...utils.form.getFieldProps(fields, 'taskSelection', control)}
                  error={errors.taskSelection}
                  data-testid="set-task-selection-options"
                />
              </FormGrid>
            </FormGrid>
          </FormGrid>
          <FormHidden {...utils.form.getFieldProps(fields, 'processID', control)} />
        </FormFields>
      </FormContainer>
      <FormActions type="dialog">
        {cancel && (
          <Button text={cancel.label} variant="outlined" size="medium" disabled={formState.isSubmitting} onClick={cancel.handler} />
        )}
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
