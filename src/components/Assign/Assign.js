import React from 'react';
import PropTypes from 'prop-types';
import * as utils from 'utils';

// app
import { AssignView } from './Assign.view';

Assign.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  button: PropTypes.string,
  selectedUser: PropTypes.shape({
    userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    userName: PropTypes.string.isRequired,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      userName: PropTypes.string.isRequired,
    })
  ),
  onAssign: PropTypes.func.isRequired,
  nestedClasses: PropTypes.shape({
    root: PropTypes.string,
  }),
};

Assign.defaultProps = {
  nestedClasses: {},
  selectedUser: {},
};

export default function Assign({ label, placeholder, button, selectedUser, users, onAssign, nestedClasses }) {
  const searchField = {
    name: 'user',
    type: 'autocompletemui',
    label,
    placeholder: placeholder || utils.string.t('app.chooseTechnician'),
    value: users.find((user) => user.userId === selectedUser.userId),
    options: users || [],
    optionKey: 'userId',
    optionLabel: 'userName',
    muiComponentProps: {
      'data-testid': 'userName-search',
    },
  };

  const actions = [
    {
      name: 'assign',
      label: utils.string.t('premiumProcessing.assign'),
      handler: (formData) => onAssign(formData),
    },
  ];

  // abort
  if (!users.length) return null;

  return (
    <AssignView
      onAssign={onAssign}
      nestedClasses={nestedClasses}
      actions={actions}
      searchField={searchField}
      buttonText={button || utils.string.t('app.assign')}
    />
  );
}
