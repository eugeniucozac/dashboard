import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import ClaimsPolicySearchView from './ClaimsPolicySearch.view';
import { getPolicyInformation, selectClaimsPolicyInformation, getClaimantNames, selectClaimsPolicyData, getClaimDetails } from 'stores';

ClaimsPolicySearch.propTypes = {
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleNextSubmit: PropTypes.func,
};

export default function ClaimsPolicySearch(props) {
  const dispatch = useDispatch();
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const policyData = useSelector(selectClaimsPolicyData);
  const [confirm, setConfirm] = useState(false);
  const hasPolicyRef = Boolean(policyInformation?.policyRef);

  const handleAddClaim = () => {
    dispatch(getClaimantNames());
  };

  useEffect(() => {
    if (policyData?.xbInstanceID) {
      dispatch(getPolicyInformation());
      setConfirm(true);
    }
  }, [policyData]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearchNext = () => {
    dispatch(getClaimDetails());
    if (confirm) {
      handleAddClaim();
    }
    props.handleNext();
  };

  return (
    <>
      <ClaimsPolicySearchView
        {...props}
        policyInformation={policyInformation}
        handleAddClaim={handleAddClaim}
        policyData={policyData}
        handleSearchNext={handleSearchNext}
        confirm={confirm}
        setConfirm={setConfirm}
        hasPolicyRef={hasPolicyRef}
      />
    </>
  );
}
