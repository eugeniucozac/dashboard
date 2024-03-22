import { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as utils from 'utils';

ResetForm.propTypes = {
  resetForm: PropTypes.func.isRequired,
  resetFlag: PropTypes.string,
};

export default function ResetForm({ resetFlag, resetForm }) {
  useEffect(
    () => {
      if (!resetFlag || !utils.generic.isFunction(resetForm)) return;
      resetForm();
    },
    [resetFlag] // eslint-disable-line react-hooks/exhaustive-deps
  );
  return null;
}
