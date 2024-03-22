import React from 'react';
import PropTypes from 'prop-types';

// app
import { StatusIconView } from './StatusIcon.view';
import * as utils from 'utils';

StatusIcon.propTypes = {
  id: PropTypes.number.isRequired,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      code: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  translationPath: PropTypes.string.isRequired,
};

StatusIcon.defaultProps = {
  list: [],
};

export function StatusIcon({ id, list, translationPath }) {
  if (!id || !list || !Array.isArray(list)) return null;

  const { type, code } = utils.referenceData.status.getById(list, id) || {};

  if (!['error', 'alert', 'success'].includes(type)) return null;

  return <StatusIconView title={utils.string.t(`${translationPath}.${code}`)} type={type} />;
}

export default StatusIcon;
