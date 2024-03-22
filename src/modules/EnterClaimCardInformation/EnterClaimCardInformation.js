import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

// app
import { EnterClaimCardInformationView } from './EnterClaimCardInformation.view';
import { showModal, selectLossQualifiers } from 'stores';

EnterClaimCardInformation.prototype = {
  claimantNames: PropTypes.array.isRequired,
  claimForm: PropTypes.object,
  interest: PropTypes.object.isRequired,
  fields: PropTypes.object.isRequired,
  complexityValues: PropTypes.array.isRequired,
  referralValues: PropTypes.array.isRequired,
  policyInformation: PropTypes.object.isRequired,
  isBordereauFlag: PropTypes.bool.isRequired,
  isComplexFlag: PropTypes.bool.isRequired,
  existingClaimInfo: PropTypes.object,
  currencies: PropTypes.array.isRequired,
  resetKey: PropTypes.number,
  isBordereauChecked: PropTypes.bool.isRequired,
};
export default function EnterClaimCardInformation({
  claimantNames,
  claimForm,
  interest,
  fields,
  complexityValues,
  referralValues,
  policyInformation,
  isBordereauFlag,
  isComplexFlag,
  existingClaimInfo,
  currencies,
  resetKey,
  isBordereauChecked,
}) {
  const dispatch = useDispatch();
  const lossQualifiers = useSelector(selectLossQualifiers);

  const handleSelectInterestLink = () => {
    dispatch(
      showModal({
        component: 'SELECT_INTEREST',
        props: {
          title: 'Select Interest',
          fullWidth: true,
          maxWidth: 'md',
          disableAutoFocus: true,
        },
      })
    );
  };

  return (
    <EnterClaimCardInformationView
      resetKey={resetKey}
      fields={fields}
      claimForm={claimForm}
      interest={interest}
      policyInformation={policyInformation}
      claimantNames={claimantNames}
      complexityValues={complexityValues}
      referralValues={referralValues}
      isBordereauFlag={isBordereauFlag}
      isComplexFlag={isComplexFlag}
      handleSelectInterestLink={handleSelectInterestLink}
      existingClaimInfo={existingClaimInfo}
      currencies={currencies}
      lossQualifiers={lossQualifiers}
      isBordereauChecked={isBordereauChecked}
    />
  );
}
