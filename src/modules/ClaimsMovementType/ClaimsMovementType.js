import React from 'react';
import PropTypes from 'prop-types';

//app
import { ClaimsMovementTypeView } from './ClaimsMovementType.view';
ClaimsMovementType.prototypes = {
  fields: PropTypes.array,
  underWritingGroups: PropTypes.object,
  claimForm: PropTypes.object,
  enforceValueSet: PropTypes.bool,
};
export default function ClaimsMovementType({ fields, underWritingGroups, claimForm, enforceValueSet }) {
  return (
    <ClaimsMovementTypeView
      fields={fields}
      claimForm={claimForm}
      underWritingGroups={underWritingGroups}
      enforceValueSet={enforceValueSet}
    />
  );
}
