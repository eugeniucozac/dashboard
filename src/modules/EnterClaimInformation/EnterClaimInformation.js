import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

//app
import EnterClaimInformationForm from './EnterClaimInformationForm';
import {
  selectLossInformation,
  selectLossQualifiers,
  getLossQualifiers,
  getCatCodes,
  selectCatCodes,
  getPolicyInformation,
  selectClaimsPolicyInformation,
  selectClaimantNames,
  selectClaimsInterest,
  getInterest,
  selectClaimsUnderwritingGroups,
  selectAllClaimDetails,
  getBEAdjuster,
  selectBEAdjusterList,
  selectPriorities,
  selectClaimData,
  getComplexityValues,
  selectComplexityValues,
  getReferralValues,
  getPolicyInsures,
  getPolicyClients,
  selectClaimPolicyInsures,
  selectClaimPolicyClients,
  getPolicySections,
  selectClaimsPolicySections,
  selectorDmsViewFiles,
  selectDmsDocDetails,
} from 'stores';
import * as utils from 'utils';
import { Loader } from 'components';

// mui
import { Box } from '@material-ui/core';

EnterClaimInformation.propTypes = {
  policyRef: PropTypes.object.isRequired,
  setPolicyRef: PropTypes.func.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  activeStep: PropTypes.number.isRequired,
  lastStep: PropTypes.bool.isRequired,
  handleCancel: PropTypes.func.isRequired,
  handleFinish: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  handleBack: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  context: PropTypes.string.isRequired,
  validation: PropTypes.bool.isRequired,
  setValidation: PropTypes.func.isRequired,
};
export default function EnterClaimInformation(props) {
  const dispatch = useDispatch();
  const lossInformation = useSelector(selectLossInformation);
  const catCodes = useSelector(selectCatCodes);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const claimantNames = useSelector(selectClaimantNames);
  const interest = useSelector(selectClaimsInterest);
  const underWritingGroups = useSelector(selectClaimsUnderwritingGroups);
  const allClaimDetails = useSelector(selectAllClaimDetails);
  const beAdjusterList = useSelector(selectBEAdjusterList);
  const priorities = useSelector(selectPriorities);
  const existingClaimData = useSelector(selectClaimData);
  const complexityValues = useSelector(selectComplexityValues);
  const claimPolicyInsures = useSelector(selectClaimPolicyInsures);
  const claimPolicyClients = useSelector(selectClaimPolicyClients);
  const policySections = useSelector(selectClaimsPolicySections);

  const [isDataReady, setIsDataReady] = useState(false);

  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);

  useEffect(
    () => {
      dispatch(getPolicyInsures()).then((response) => {
        if (utils.generic.isValidArray(response)) {
          dispatch(getPolicyClients()).then((response) => {
            if (utils.generic.isValidArray(response)) {
              dispatch(getPolicySections()).then((response) => {
                if (utils.generic.isValidArray(response)) {
                  setIsDataReady(true);
                }
              });
            }
          });
        }
      });

      if (!existingClaimData?.claimId) {
        if (utils.generic.isInvalidOrEmptyArray(lossQualifiers)) {
          dispatch(getLossQualifiers());
        }
        if (utils.generic.isInvalidOrEmptyArray(catCodes)) {
          dispatch(getCatCodes());
        }
        dispatch(getPolicyInformation());
        dispatch(getBEAdjuster());
        dispatch(getInterest());
        dispatch(getComplexityValues());
        dispatch(getReferralValues());
      }
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const backHandler = () => {
    props.handleBack();
  };

  if (utils.generic.isInvalidOrEmptyArray(complexityValues)) {
    return false;
  }

  if (!isDataReady) {
    return (
      <Box height="300px">
        <Loader visible absolute />
      </Box>
    );
  }

  return (
    <EnterClaimInformationForm
      {...props}
      policyInformation={policyInformation}
      lossInformation={lossInformation}
      lossQualifiers={lossQualifiers}
      claimantNames={claimantNames}
      beAdjusterList={beAdjusterList.items}
      underWritingGroups={underWritingGroups}
      handleNext={props.handleNext}
      handleSave={props.handleSave}
      handleCancel={props.handleCancel}
      interest={interest}
      allClaimDetails={allClaimDetails}
      priorities={priorities}
      complexityValues={complexityValues}
      handleBack={backHandler}
      claimPolicyInsures={claimPolicyInsures}
      claimPolicyClients={claimPolicyClients}
      policySections={policySections}
      claimsDocsList={viewDocumentList?.length > 0 ? viewDocumentList : savedDmsDocList?.claimsDocDetails}
    />
  );
}
