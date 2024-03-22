import React from 'react';
import PropTypes from 'prop-types';

// app
import { Button } from 'components';
import * as utils from 'utils';

// mui
import { Grid } from '@material-ui/core';

ClaimSummaryActionsView.prototypes = {
  claim: PropTypes.array.isRequired,
  isClosedClaim: PropTypes.bool,
  isTeamClaim: PropTypes.bool,
  isUsersClaim: PropTypes.bool,
  userHasAllClaimsPermission: PropTypes.bool,
  handlers: PropTypes.shape({
    createRFIModal: PropTypes.func.isRequired,
    createAdHocTaskModal: PropTypes.func.isRequired,
    reAssignClaim: PropTypes.func.isRequired,
    setClaimPriority: PropTypes.func.isRequired,
    handleReOpenClaim: PropTypes.func.isRequired,
    releaseClaimToQ: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimSummaryActionsView({ claim, isClosedClaim, userHasAllClaimsPermission, isUsersClaim, handlers, isTeamClaim }) {
  return (
    <Grid container spacing={1}>
      <Grid item>
        <Button
          text={utils.string.t('app.reAssign')}
          color="primary"
          variant="outlined"
          size="small"
          disabled={isClosedClaim || !(userHasAllClaimsPermission && isTeamClaim)}
          onClick={() => handlers.reAssignClaim(claim)}
        />
      </Grid>
      <Grid item>
        <Button
          text={utils.string.t('claims.processing.summary.buttons.createTask')}
          size="small"
          color="primary"
          variant="outlined"
          disabled={isClosedClaim || !isUsersClaim}
          onClick={() => handlers.createAdHocTaskModal(claim)}
        />
      </Grid>
      <Grid item>
        <Button
          text={utils.string.t('claims.processing.summary.buttons.createNewRFI')}
          size="small"
          color="primary"
          variant="outlined"
          disabled={isClosedClaim}
          onClick={() => handlers.createRFIModal(claim)}
        />
      </Grid>
      <Grid item>
        <Button
          text={utils.string.t('claims.modals.claimFunctions.setClaimPriority')}
          size="small"
          color="primary"
          variant="outlined"
          disabled={isClosedClaim || !isUsersClaim}
          onClick={() => handlers.setClaimPriority(claim)}
        />
      </Grid>
      <Grid item>
        <Button
          color="primary"
          variant="outlined"
          size="small"
          disabled={isClosedClaim || !isUsersClaim}
          text={utils.string.t('claims.processing.summary.buttons.releaseQueue')}
          onClick={() => handlers.releaseClaimToQ(claim)}
        />
      </Grid>
      <Grid item>
        <Button
          color="primary"
          variant="outlined"
          size="small"
          disabled={!isClosedClaim}
          text={utils.string.t('claims.claimRef.popOverItems.reopenClaim')}
          onClick={() => handlers.handleReOpenClaim(claim)}
        />
      </Grid>
    </Grid>
  );
}
