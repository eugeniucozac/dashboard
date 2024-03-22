import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

//app
import { ClaimsEnterPolicyCardInformationView } from './ClaimsEnterPolicyCardInformation.view';
import { getPolicyInformation, selectClaimsPolicyInformation } from 'stores';

export default function ClaimsEnterPolicyCardInformation() {
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
      <ClaimsEnterPolicyCardInformationView data={policyInformation} />
    </>
  );
}
