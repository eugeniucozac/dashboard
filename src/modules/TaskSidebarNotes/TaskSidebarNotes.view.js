import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './TaskSidebarNotes.styles';
import { Button, FormActions, FormContainer, FormFields, FormGrid, FormLabel, FormText, FormHidden, Link } from 'components';
import { NOTES_API_SUCCESS_STATUS } from 'consts';
import { addTaskNote } from 'stores';
import * as utils from 'utils';
import config from 'config';

//mui
import { makeStyles, Box } from '@material-ui/core';

TaskSidebarNotesView.propTypes = {
  fields: PropTypes.array.isRequired,
  task: PropTypes.object.isRequired,
  allowNavigation: PropTypes.func.isRequired,
};

export default function TaskSidebarNotesView({ fields, task, allowNavigation }) {
  const classes = makeStyles(styles, { name: 'TaskSidebarNotes' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);
  const dispatch = useDispatch();

  const { control, reset, errors, handleSubmit, formState, watch } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const addNotes = watch('addNotes');

  const handleSaveNote = (values) => {
    const formValues = { details: values?.addNotes };
    const taskObj = { caseIncidentID: values?.caseIncidentID, taskId: values?.taskId };

    dispatch(addTaskNote(formValues, taskObj)).then((response) => {
      if (response?.status === NOTES_API_SUCCESS_STATUS) {
        reset('', 'addNotes');
      }
    });
  };

  useEffect(() => {
    const isNotesDirty = addNotes !== '';

    if (utils.generic.isFunction(allowNavigation)) {
      allowNavigation(!isNotesDirty);
    }
  }, [addNotes]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <FormContainer onSubmit={handleSubmit} nestedClasses={{ root: classes.form }} data-testid="task-sidebar-notes">
      <FormFields>
        <FormGrid container spacing={2} alignItems="flex-end">
          <FormGrid item xs={7}>
            <FormLabel label={utils.string.t('claims.notes.addNotes')} />
          </FormGrid>
          <FormGrid item xs={5}>
            <Box textAlign="right">
              <Link
                to={`${config.routes.claimsProcessing.task}/${task?.taskRef}/notes`}
                color="secondary"
                text={utils.string.t('claims.task.summary.viewNotes')}
              />
            </Box>
          </FormGrid>
        </FormGrid>
        <Box mt={-2}>
          <FormText {...utils.form.getFieldProps(fields, 'addNotes', control, errors)} />
        </Box>
        <FormHidden {...utils.form.getFieldProps(fields, 'caseIncidentID', control)} />
        <FormHidden {...utils.form.getFieldProps(fields, 'taskId', control)} />
      </FormFields>
      <FormActions nestedClasses={{ actions: classes.submit }} align="right">
        <Button
          text={utils.string.t('app.save')}
          type="submit"
          color="primary"
          size="medium"
          disabled={formState.isSubmitting || !formState.isDirty}
          onClick={handleSubmit(handleSaveNote)}
        />
      </FormActions>
    </FormContainer>
  );
}
