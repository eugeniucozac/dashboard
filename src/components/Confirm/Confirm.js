import React from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { ConfirmView } from './Confirm.view';

Confirm.propTypes = {
  submitHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func,
  handleClose: PropTypes.func.isRequired,
  hideCancelButton: PropTypes.bool,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  confirmMessage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  warningMessage: PropTypes.string,
};

Confirm.defaultProps = {
  hideCancelButton: false,
};

export default function Confirm({
  submitHandler,
  cancelHandler,
  handleClose,
  cancelLabel,
  hideCancelButton,
  confirmLabel,
  confirmMessage,
  confirmMessageText,
  note,
  warningMessage,
}) {
  const handleConfirm = () => {
    if (utils.generic.isFunction(submitHandler)) {
      submitHandler();
      handleClose();
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(cancelHandler)) {
      cancelHandler();
    }

    handleClose();
  };

  return (
    <ConfirmView
      handleConfirm={handleConfirm}
      handleClose={handleCancel}
      hideCancelButton={hideCancelButton}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      confirmMessage={confirmMessage}
      confirmMessageText={confirmMessageText}
      note={note}
      warningMessage={warningMessage}
    />
  );
}
