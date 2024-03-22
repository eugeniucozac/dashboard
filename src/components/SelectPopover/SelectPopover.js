import React from 'react';
import PropTypes from 'prop-types';

// app
import * as utils from 'utils';
import { SelectPopoverView } from './SelectPopover.view';

SelectPopover.propTypes = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string,
  buttonText: PropTypes.string,
  buttonDisabled: PropTypes.bool,
  showButtonTextOnly: PropTypes.bool,
  buttonVariant: PropTypes.string,
  showSubmitButton: PropTypes.bool,
  toolTip: PropTypes.string,
  displaySelectedText: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
  }),
  handlers: PropTypes.shape({
    onToggleOption: PropTypes.func.isRequired,
    onTogglePopOver: PropTypes.func,
  }),
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};
SelectPopover.defaultProps = {
  showSubmitButton: true,
};
export default function SelectPopover({
  id,
  text,
  buttonText,
  displaySelectedText,
  buttonVariant,
  showButtonTextOnly,
  buttonDisabled,
  openPopover: initialOpenPopover = false,
  toolTip,
  setOpenPopover: initialSetOpenPopover,
  handlers,
  error,
  ...props
}) {
  /** Triggering the handler function  to pass selected value from the list to parent component */
  const onToggleOption = (item) => {
    if (utils.generic.isFunction(handlers.onToggleOption)) {
      handlers.onToggleOption(item);
    }
  };
  /**   */
  const onTogglePopOver = (item) => {
    if (utils.generic.isFunction(handlers.onTogglePopOver)) {
      handlers.onTogglePopOver(item);
    }
  };

  // abort
  if (!buttonText) return null;
  return (
    <SelectPopoverView
      id={`popover-${id}`}
      displaySelectedText={displaySelectedText}
      buttonText={buttonText}
      buttonDisabled={buttonDisabled}
      buttonVariant={buttonVariant}
      toolTip={toolTip}
      showButtonTextOnly={showButtonTextOnly}
      text={text || ''}
      handlers={{
        onToggleOption,
        onTogglePopOver,
      }}
      error={error}
      {...props}
    />
  );
}
