import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import { ClaimsProcessingTableRowView } from './ClaimsProcessingTableRow.view';
import * as utils from 'utils';
import * as constants from 'consts';

ClaimsProcessingTableRow.prototype = {
  claim: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  columnProps: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    clickClaim: PropTypes.func.isRequired,
    createRFI: PropTypes.func.isRequired,
    createTask: PropTypes.func.isRequired,
    reAssign: PropTypes.func.isRequired,
    returnClaimToTeamQueue: PropTypes.func.isRequired,
    selectClaim: PropTypes.func.isRequired,
    reOpenClaim: PropTypes.func.isRequired,
    setClaimPriority: PropTypes.func.isRequired,
  }).isRequired,
};

export default function ClaimsProcessingTableRow({ claim, handlers, ...rest }) {
  const user = useSelector((state) => state.user);

  const isClosedClaim = claim?.processState?.toLowerCase() === constants.CLAIM_STATUS_CLOSED.toLowerCase();
  const isReassignEnabled = constants.REASSIGN_ENABLED_TASK_STATUSES.includes(claim?.processState);
  const userHasAllClaimsPermission = utils.app.access.feature('claimsFNOL.allClaims', ['read', 'create', 'update'], user);
  const isUsersClaim = user?.emailId?.toLowerCase() === claim?.assigneeEmail?.toLowerCase();
  const isTeamClaim = user?.organisation?.name?.toLowerCase() === claim?.team?.toLowerCase();

  const rowActions = [
    {
      id: 'reAssign',
      label: utils.string.t('app.reAssign'),
      disabled: isClosedClaim || !(userHasAllClaimsPermission && isTeamClaim),
      callback: () => handlers.reAssign(claim),
    },
    {
      id: 'createTask',
      label: utils.string.t('claims.processing.summary.buttons.createTask'),
      disabled: isClosedClaim || !isUsersClaim,
      callback: () => handlers.createTask(claim),
    },
    {
      id: 'createRFI',
      label: utils.string.t('claims.processing.summary.buttons.createNewRFI'),
      disabled: isClosedClaim,
      callback: () => handlers.createRFI(claim),
    },
    {
      id: 'setClaimPriority',
      label: utils.string.t('claims.claimRef.popOverItems.setClaimPriority'),
      disabled: isClosedClaim || !isUsersClaim,
      callback: () => handlers.setClaimPriority(claim),
    },
    {
      id: 'returnClaimToTeamQueue',
      label: utils.string.t('claims.processing.summary.buttons.releaseQueue'),
      disabled: isClosedClaim || !isUsersClaim,
      callback: () => handlers.returnClaimToTeamQueue(claim),
    },
    {
      id: 'reopenClaim',
      label: utils.string.t('claims.claimRef.popOverItems.reopenClaim'),
      disabled: !isClosedClaim,
      callback: () => handlers.reOpenClaim(claim),
    },
  ];

  return (
    <ClaimsProcessingTableRowView
      claim={claim}
      isReassignEnabled={isReassignEnabled}
      handlers={{
        selectClaim: handlers.selectClaim,
        clickClaim: handlers.clickClaim,
      }}
      {...rest}
      rowActions={rowActions}
    />
  );
}
