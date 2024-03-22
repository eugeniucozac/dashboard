import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

// app
import { ClaimDetailsSidebarView } from './ClaimDetailsSidebar.view';
import * as utils from 'utils';
import { useDispatch, useSelector } from 'react-redux';
import { getClaimsPreviewInformation, selectClaimsInformation } from 'stores';

ClaimDetailsSidebar.propTypes = {
  claim: PropTypes.object,
};

export default function ClaimDetailsSidebar({ claim }) {
  const dispatch = useDispatch();
  const claimPreviewInfo = useSelector(selectClaimsInformation);

  useEffect(() => {
    if (utils.generic.isValidObject(claim))
      dispatch(getClaimsPreviewInformation({ claimId: claim?.claimID, claimRefParams: claim?.claimRef, sourceIdParams: claim?.sourceId, divisionIDParams: claim?.divisionID }));
  }, [claim, dispatch]);

  if (!utils.generic.isValidObject(claim)) return null;

  return <ClaimDetailsSidebarView claim={claim} claimPreviewInfo={claimPreviewInfo} />;
}
