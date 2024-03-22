import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './Confirm.styles';
import * as utils from 'utils';
import { Button, FormContainer, FormActions, Warning } from 'components';

// mui
import { makeStyles, Typography, Box } from '@material-ui/core';

ConfirmView.propTypes = {
  buttonColors: PropTypes.object,
  note: PropTypes.string,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  confirmMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  confirmMessageText: PropTypes.string,
  warningMessage: PropTypes.string,
  hideCancelButton: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export function ConfirmView({
  handleConfirm,
  handleClose,
  hideCancelButton,
  cancelLabel,
  confirmLabel,
  confirmMessage,
  buttonColors = { confirm: 'primary', cancel: 'default' },
  confirmMessageText,
  warningMessage,
  note,
}) {
  const classes = makeStyles(styles, { name: 'Confirm' })();

  return (
    <div className={classes.root}>
      <div className={classes.scrollableConfirmBody}>
        {confirmMessage && (
          <div style={{ padding: '15px' }}>
            <Typography>{confirmMessage}</Typography>
          </div>
        )}

        {confirmMessageText && (
          <div style={{ padding: '15px' }}>
            <Typography>{confirmMessageText}</Typography>
          </div>
        )}

        {note && (
          <div style={{ padding: '5px 15px 5px 15px' }}>
            <Typography variant="body1">
              <strong>{note}</strong>
            </Typography>
          </div>
        )}

        {warningMessage && (
          <Box p={1}>
            <Warning text={warningMessage} type="alert" align="center" size="large" icon />
          </Box>
        )}
      </div>

      <FormContainer type="dialog">
        <FormActions type="dialog" divider={false}>
          {!hideCancelButton && (
            <Button text={cancelLabel || utils.string.t('app.cancel')} variant="text" color={buttonColors.cancel} onClick={handleClose} />
          )}
          <Button
            text={confirmLabel || utils.string.t('app.confirm')}
            onClick={handleConfirm}
            color={buttonColors.confirm}
            data-testid="app.confirm"
          />
        </FormActions>
      </FormContainer>
    </div>
  );
}
