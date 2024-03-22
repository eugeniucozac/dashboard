import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { Button, ErrorMessage, FormActions, FormCheckbox, FormContainer, FormFields, FormGrid } from 'components';
import * as utils from 'utils';
import { useFormActions } from 'hooks';
import styles from './DownloadFiles.styles';

// mui
import { makeStyles, Box, Collapse } from '@material-ui/core';

DownloadFilesView.propTypes = {
  fields: PropTypes.array.isRequired,
  actions: PropTypes.array.isRequired,
  isValid: PropTypes.func.isRequired,
  isDownloadAllSelected: PropTypes.func.isRequired,
  isDownloadUmrSelected: PropTypes.func.isRequired,
};

export function DownloadFilesView({ fields, actions, isValid, isDownloadAllSelected, isDownloadUmrSelected }) {
  const classes = makeStyles(styles, { name: 'DownloadFiles' })();
  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, register, watch, reset, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);
  const currentValues = watch({ nest: true });

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-download-files">
        <FormFields type="dialog">
          <FormGrid container>
            <Box display="flex" width={1}>
              <Collapse in={formState.isSubmitted && !isValid(currentValues)} timeout={200}>
                <Box mb={2}>
                  <ErrorMessage size="md" bold error={{ message: utils.string.t('openingMemo.whitespace.downloadNoSelectionError') }} />
                </Box>
              </Collapse>
            </Box>

            <FormGrid item xs={12} sm={6} style={{ paddingBottom: 32 }}>
              <FormCheckbox
                {...utils.form.getFieldProps(fields, 'downloadAll')}
                control={control}
                register={register}
                disabled={isDownloadUmrSelected(currentValues)}
                watch={watch}
                nestedClasses={{ title: classes.title }}
              />
            </FormGrid>

            <FormGrid item xs={12} sm={6}>
              <FormCheckbox
                {...utils.form.getFieldProps(fields, 'downloadUmr')}
                control={control}
                register={register}
                disabled={isDownloadAllSelected(currentValues)}
                watch={watch}
                nestedClasses={{ title: classes.title }}
              />
            </FormGrid>
          </FormGrid>
        </FormFields>

        <FormActions type="dialog">
          {cancel && <Button text={cancel.label} variant="text" disabled={formState.isSubmitting} onClick={cancel.handler} />}
          {submit && (
            <Button text={submit.label} type="submit" disabled={formState.isSubmitting || !isValid(currentValues)} color="primary" />
          )}
        </FormActions>
      </FormContainer>
    </div>
  );
}
