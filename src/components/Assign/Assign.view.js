import React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

// app
import * as utils from 'utils';
import styles from './Assign.styles';
import { Button, FormAutocompleteMui, FormContainer } from 'components';

// mui
import { makeStyles, Box } from '@material-ui/core';

AssignView.propTypes = {
  searchField: PropTypes.object.isRequired,
  onAssign: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
  action: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      lable: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
    })
  ),
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

export function AssignView({ searchField, buttonText, actions, nestedClasses }) {
  const classes = makeStyles(styles, { name: 'Assign' })();

  const { control, handleSubmit, formState } = useForm({});

  const assign = actions && actions.find((action) => action.name === 'assign');

  const onSubmit = (data) => data.user && assign && utils.generic.isFunction(assign.handler) && assign.handler(data.user);

  return (
    <div className={nestedClasses.root}>
      <FormContainer onSubmit={handleSubmit(onSubmit)}>
        <Box width={1} display="flex" flexWrap="wrap" alignItems="flex-end">
          <div className={classes.autocomplete}>
            <FormAutocompleteMui control={control} {...searchField} />
          </div>
          <Button
            text={buttonText}
            disabled={formState.isSubmitting || !formState.isDirty}
            type="submit"
            color="primary"
            size="medium"
            data-testid="assign-confirmation-button"
            nestedClasses={{ btn: classes.button }}
          />
        </Box>
      </FormContainer>
    </div>
  );
}
