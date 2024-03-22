import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ChangeComplexityPriorityAssignment.styles';
import {
  Button,
  FormContainer,
  FormGrid,
  FormFields,
  FormActions,
  FormAutocompleteMui,
  FormText,
  FormSelect,
  FormHidden,
  FormRequired,
  Loader,
} from 'components';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';

ChangeComplexityPriorityAssignmentView.propTypes = {
  fields: PropTypes.array,
  buttons: PropTypes.object.isRequired,
  formProps: PropTypes.object.isRequired,
  isComplexityBasisAvailable: PropTypes.bool,
  isLoading: PropTypes.bool,
};

export function ChangeComplexityPriorityAssignmentView({ fields, buttons, formProps, isComplexityBasisAvailable, isLoading }) {
  const classes = makeStyles(styles, { name: 'ChangeComplexityPriorityAssignment' })();

  const { cancel, submit } = buttons;
  const { control, errors, handleSubmit, formState } = formProps;

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-bulk-assign-claim">
        <FormRequired type="dialog" />
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <FormSelect {...utils.form.getFieldProps(fields, 'complexity', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12} style={{ display: isComplexityBasisAvailable ? 'block' : 'none' }}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'complexityBasis', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormSelect {...utils.form.getFieldProps(fields, 'priority', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormSelect {...utils.form.getFieldProps(fields, 'team', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormAutocompleteMui {...utils.form.getFieldProps(fields, 'assignTo', control, errors)} />
            </FormGrid>
            <FormGrid item xs={12}>
              <FormText {...utils.form.getFieldProps(fields, 'notes', control, errors)} />
            </FormGrid>
          </FormGrid>
          <div style={{ display: 'none' }}>
            <FormHidden {...utils.form.getFieldProps(fields, 'priorityId', control)} />
            <FormHidden {...utils.form.getFieldProps(fields, 'teamId', control)} />
          </div>
        </FormFields>
        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
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
      <Loader visible={isLoading} absolute />
    </div>
  );
}
