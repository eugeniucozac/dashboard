import React from 'react';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import styles from './ConfirmWithComment.styles';
import * as utils from 'utils';
import { Button, FormContainer, FormActions, FormText, FormFields } from 'components';

// mui
import { makeStyles, Typography } from '@material-ui/core';
import { useForm } from 'react-hook-form';

ConfirmWithCommentView.propTypes = {
  fields: PropTypes.array.isRequired,
  handleConfirm: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  confirmMessage: PropTypes.string,
  warningMessage: PropTypes.string,
  buttonColors: PropTypes.object,
  commentProps: PropTypes.object,
  isCommentsMandatory: PropTypes.bool,
};

export function ConfirmWithCommentView({
  fields,
  handleConfirm,
  handleClose,
  cancelLabel,
  confirmLabel,
  confirmMessage,
  warningMessage,
  buttonColors = { confirm: 'primary', cancel: 'default' },
  isCommentsMandatory,
}) {
  const classes = makeStyles(styles, { name: 'ConfirmWithComment' })();
  const validationSchema = utils.form.getValidationSchema(fields);
  const { control, errors, getValues, watch } = useForm({
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  const comments = watch('comments');

  return (
    <div className={classes.root}>
      {confirmMessage && (
        <div className={classes.message}>
          <Typography data-testid="confirm-message">{confirmMessage}</Typography>
        </div>
      )}

      {warningMessage && (
        <div className={classes.warning}>
          <Typography data-testid="warning-message" className={classes.warningText}>
            {warningMessage}
          </Typography>
        </div>
      )}

      <FormContainer type="dialog">
        <FormFields>
          <div className={classes.comment}>
            <FormText {...utils.form.getFieldProps(fields, 'comments', control, errors)} />
          </div>
        </FormFields>

        <FormActions type="dialog" divider={false}>
          <Button
            text={cancelLabel || utils.string.t('app.cancel')}
            variant="text"
            color={buttonColors.cancel}
            onClick={handleClose}
            data-testid="cancel-button"
          />
          <Button
            text={confirmLabel || utils.string.t('app.confirm')}
            onClick={() => {
              return handleConfirm(getValues('comments'));
            }}
            disabled={isCommentsMandatory && !comments}
            color={buttonColors.confirm}
            data-testid="confirm-button"
          />
        </FormActions>
      </FormContainer>
    </div>
  );
}
