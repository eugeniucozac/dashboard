import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

// app
import * as utils from 'utils';
import { ConfirmWithCommentView } from './ConfirmWithComment.view';

ConfirmWithComment.propTypes = {
  confirmHandler: PropTypes.func.isRequired,
  cancelHandler: PropTypes.func,
  closeHandler: PropTypes.func.isRequired,
  cancelLabel: PropTypes.string,
  confirmLabel: PropTypes.string,
  commentProps: PropTypes.object,
  commentLabel: PropTypes.string,
  confirmMessage: PropTypes.string,
  warningMessage: PropTypes.string,
  isCommentsMandatory: PropTypes.bool,
};

ConfirmWithComment.defaultProps = {
  isCommentsMandatory: true,
};

export default function ConfirmWithComment({
  confirmHandler,
  cancelHandler,
  closeHandler,
  cancelLabel,
  confirmLabel,
  commentLabel,
  confirmMessage,
  warningMessage,
  commentProps,
  isCommentsMandatory,
}) {
  const handleConfirm = (comment) => {
    if (utils.generic.isFunction(confirmHandler)) {
      confirmHandler(comment);
      closeHandler();
    }
  };

  const handleCancel = () => {
    if (utils.generic.isFunction(cancelHandler)) {
      cancelHandler();
    }
    closeHandler();
  };
  const fields = [
    {
      name: 'comments',
      type: 'textarea',
      value: '',
      ...(isCommentsMandatory && { validation: Yup.string().required(utils.string.t('validation.required')) }),
      label: commentLabel,
      muiComponentProps: {
        multiline: true,
        rows: 3,
        rowsMax: 6,
        ...commentProps,
      },
    },
  ];

  return (
    <ConfirmWithCommentView
      fields={fields}
      handleConfirm={handleConfirm}
      handleClose={handleCancel}
      cancelLabel={cancelLabel}
      confirmLabel={confirmLabel}
      confirmMessage={confirmMessage}
      warningMessage={warningMessage}
      commentProps={commentProps}
      isCommentsMandatory={isCommentsMandatory}
    />
  );
}
