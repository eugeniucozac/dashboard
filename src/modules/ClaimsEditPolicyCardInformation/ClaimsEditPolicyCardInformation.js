import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import { ClaimsEditPolicyCardInformationView } from './ClaimsEditPolicyCardInformation.view';
import { getPolicyInformation, selectClaimsPolicyInformation } from 'stores';

ClaimsEditPolicyCardInformation.prototype = {
  claimForm: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  resetKey: PropTypes.number,
};
export default function ClaimsEditPolicyCardInformation({ fields, claimForm, resetKey }) {
  const dispatch = useDispatch();
  const policyInformation = useSelector(selectClaimsPolicyInformation);

  useEffect(
    () => {
      dispatch(getPolicyInformation());
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <>
      <ClaimsEditPolicyCardInformationView data={policyInformation} fields={fields} claimForm={claimForm} resetKey={resetKey} />
    </>
  );
}
