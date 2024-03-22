import PropTypes from 'prop-types';

// app
import * as utils from 'utils';

useFormActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      handler: PropTypes.func.isRequired,
    })
  ).isRequired,
  dirtyFields: PropTypes.object.isRequired,
  reset: PropTypes.func,
};

export default function useFormActions(actions = [], reset, dirtyFields, setError) {
  // cancel
  const cancel = (actions && actions.find((action) => action.name === 'cancel')) || {};
  const cancelHandler = cancel?.handler;

  if (cancel) {
    cancel.handler = (data) => {
      if (utils.generic.isFunction(cancelHandler)) {
        cancelHandler(data);
      }

      if (utils.generic.isFunction(reset)) {
        reset();
      }
    };
  }

  // secondary
  const secondary = actions && actions.find((action) => action.name === 'secondary');
  const secondaryHandler = secondary?.handler;

  if (secondary) {
    secondary.handler = (data) => {
      if (utils.generic.isFunction(secondaryHandler)) {
        return secondaryHandler(data, dirtyFields);
      }
    };
  }

  // submit
  const submit = actions && actions.find((action) => action.name === 'submit');
  const submitHandler = submit?.handler;

  if (submit) {
    submit.handler = (data) => {
      if (utils.generic.isFunction(submitHandler)) {
        return submitHandler(data, dirtyFields, setError);
      }
    };
  }

  return {
    ...(cancel && { cancel }),
    ...(secondary && { secondary }),
    ...(submit && { submit }),
  };
}
