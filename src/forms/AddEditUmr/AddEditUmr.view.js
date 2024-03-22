import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './AddEditUmr.styles';
import { ErrorMessage, Button, FilterChips, FormContainer, FormFields, FormActions, FormGrid, FormText, Translate } from 'components';
import { useFormActions } from 'hooks';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';

AddEditUmrView.propTypes = {
  fields: PropTypes.array,
  actions: PropTypes.array,
  list: PropTypes.array,
  query: PropTypes.string,
  valid: PropTypes.bool,
  error: PropTypes.string,
  refs: PropTypes.object,
  handlers: PropTypes.object,
};

export function AddEditUmrView({ fields, actions, list, query, valid, error, refs, handlers }) {
  const classes = makeStyles(styles, { name: 'AddEditUmr' })();

  const defaultValues = utils.form.getInitialValues(fields);
  const validationSchema = utils.form.getValidationSchema(fields);

  const { control, reset, handleSubmit, formState } = useForm({
    defaultValues,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });

  const { cancel, submit } = useFormActions(actions, reset);

  const getErrorObj = () => {
    if (query && !valid) {
      return {
        message: utils.string.t('openingMemo.addEditUmr.errorAlreadyTaken'),
        type: 'required',
      };
    }
  };

  const isFormValid = query && query.length > 3 && valid;

  return (
    <div className={classes.root}>
      <FormContainer type="dialog" onSubmit={handleSubmit(submit.handler)} data-testid="form-addEditUmr">
        <FormFields type="dialog">
          <FormGrid container>
            <FormGrid item xs={12}>
              <Box display="flex" alignItems="flex-start">
                <FormText
                  {...utils.form.getFieldProps(fields, 'umr')}
                  error={getErrorObj()}
                  hint={utils.string.t('openingMemo.addEditUmr.hintNotLongEnough')}
                  control={control}
                />
                <Button
                  refProp={refs.btn}
                  text={utils.string.t('app.add')}
                  disabled={!isFormValid || formState.isSubmitting}
                  color="secondary"
                  onClick={() => {
                    if (!list.includes(query)) {
                      handlers.add(query);
                      handlers.reset();
                      reset();
                    }
                  }}
                  nestedClasses={{
                    btn: classes.button,
                  }}
                />
              </Box>
            </FormGrid>
          </FormGrid>

          <Box ml={0.25} mb={0.75}>
            <Translate variant="body1" label="openingMemo.addEditUmr.listCurrentUmr" className={classes.listTitle} />
          </Box>

          {error && <ErrorMessage error={{ message: error }} nestedClasses={{ root: classes.listError }} />}

          <FilterChips items={list.map((l) => ({ value: l, label: l }))} handleRemoveItems={handlers.remove} />
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
    </div>
  );
}
