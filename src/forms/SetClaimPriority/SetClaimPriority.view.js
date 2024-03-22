import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

//app
import * as utils from 'utils';
import { Button, FormContainer, FormFields, FormGrid, FormAutocompleteMui, FormLabel, FormActions } from 'components';
import { useFormActions } from 'hooks';

SetClaimPriorityView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
};

export function SetClaimPriorityView({ actions, fields }) {
  const defaultValues = utils.form.getInitialValues(fields);

  const { control, reset, errors, handleSubmit, formState } = useForm({ defaultValues });

  const { cancel, submit } = useFormActions(actions, reset);

  return (
    <div>
      <FormContainer type="dialog" onSubmit={handleSubmit} data-testid="form-set-claim-priority">
        <FormFields type="dialog">
          <FormGrid container spacing={2}>
            <FormGrid container alignItems="center">
              <FormGrid item xs={2}>
                <FormLabel label={utils.string.t('claims.claimDetailsLabel.priority')} align="right" />
              </FormGrid>
              <FormGrid item xs={10}>
                <FormAutocompleteMui
                  {...utils.form.getFieldProps(fields, 'priority', control)}
                  error={errors.priority}
                  data-testid="set-priority-options"
                />
              </FormGrid>
            </FormGrid>
          </FormGrid>
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
