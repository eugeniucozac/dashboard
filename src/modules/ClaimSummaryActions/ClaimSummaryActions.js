import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

// app
import { getClaimsProcessing, returnToTeamQueueClaim, showModal, hideModal } from 'stores';
import { ClaimSummaryActionsView } from './ClaimSummaryActions.view';
import * as constants from 'consts';
import * as utils from 'utils';

ClaimSummaryActions.propTypes = {
  claim: PropTypes.object.isRequired,
};

export default function ClaimSummaryActions({ claim }) {
  const dispatch = useDispatch();

  const isReassignFormDirtyRef = useRef(false);
  const user = useSelector((state) => state.user);
  const isClosedClaim = claim?.processState?.toLowerCase() === constants.CLAIM_STATUS_CLOSED.toLowerCase();
  const isReassignEnabled = constants.REASSIGN_ENABLED_TASK_STATUSES.includes(claim?.processState);
  const userHasAllClaimsPermission = utils.app.access.feature('claimsFNOL.allClaims', ['read', 'create', 'update'], user);

  const isUsersClaim = user?.emailId?.toLowerCase() === claim?.assigneeEmail?.toLowerCase();
  const claimsType = constants.CLAIM_TEAM_TYPE.myClaims;
  const isTeamClaim = user?.organisation?.name?.toLowerCase() === claim?.team?.toLowerCase();
  const searchBy = constants.CLAIMS_SEARCH_OPTION_CLAIM_REF;

  const setIsReassignFormDirty = (isDirty) => {
    isReassignFormDirtyRef.current = isDirty;
  };

  const bulkAssignConfirm = () => {
    if (isReassignFormDirtyRef.current) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('navigation.form.subtitle'),
            hint: utils.string.t('navigation.form.title'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: () => {
                dispatch(hideModal('SINGLE_ASSIGN_CLAIM'));
              },
            },
          },
        })
      );
    } else {
      dispatch(hideModal('SINGLE_ASSIGN_CLAIM'));
    }
  };

  const reAssignClaim = (claim) => {
    dispatch(
      showModal({
        component: 'SINGLE_ASSIGN_CLAIM',
        props: {
          title: 'claims.processing.bulkAssign.title',
          fullWidth: true,
          maxWidth: 'sm',
          hideCompOnBlur: false,
          componentProps: {
            claimsProcessingSelected: [claim],
            claimsType,
            setIsDirty: setIsReassignFormDirty,
            clickXHandler: () => {
              bulkAssignConfirm();
            },
            cancelHandler: () => {
              bulkAssignConfirm();
            },
          },
        },
      })
    );
  };

  const createRFIModal = (claim) => {
    const isClaimArray = utils.generic.isValidArray(claim, true);
    const claimObj = isClaimArray ? (claim.length > 0 ? claim[0] : {}) : claim;
    dispatch(
      showModal({
        component: 'CREATE_RFI',
        props: {
          title: utils.string.t('claims.processing.taskFunction.createRFI'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'md',
          disableAutoFocus: true,
          componentProps: {
            claim: claimObj,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const createAdHocTaskModal = (claim) => {
    dispatch(
      showModal({
        component: 'CREATE_AD_HOC_TASK',
        props: {
          title: utils.string.t('claims.processing.taskFunction.createAdhocTask'),
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'md',
          disableAutoFocus: true,
          componentProps: {
            claim,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const setClaimPriority = (claim) => {
    dispatch(
      showModal({
        component: 'SET_CLAIM_PRIORITY',
        props: {
          title: utils.string.t('claims.modals.claimFunctions.setClaimPriority'),
          fullWidth: true,
          hideCompOnBlur: false,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            claim,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };
  const handleSetClaimTaskSelection = (claim) => {
    dispatch(
      showModal({
        component: 'SET_CLAIM_TASK_SELECTION',
        props: {
          title: utils.string.t('claims.modals.claimFunctions.setClaimTaskSelection'),
          fullWidth: true,
          maxWidth: 'sm',
          disableAutoFocus: true,
          componentProps: {
            claim,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleReOpenClaim = (claim) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('claims.claimRef.popOverItems.reOpen'),
          hint: utils.string.t('claims.claimRef.popOverItems.reOpenClaimMessage'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            submitHandler: () => {
              handleSetClaimTaskSelection(claim);
            },
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const releaseClaimToQ = (claim) => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('status.alert'),
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            cancelLabel: utils.string.t('app.no'),
            confirmLabel: utils.string.t('app.yes'),
            confirmMessage: (
              <span
                dangerouslySetInnerHTML={{
                  __html: `${utils.string.t('claims.complexityRulesManagementDetails.alertModal.note')}`,
                }}
              />
            ),
            submitHandler: async () => {
              await dispatch(returnToTeamQueueClaim(claim));
              await dispatch(
                getClaimsProcessing({
                  requestType: constants.CLAIM_PROCESSING_REQ_TYPES.search,
                  claimsType,
                  filterTerm: [],
                  searchBy,
                  pullClosedRecords: false,
                })
              );
            },
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  // abort
  if (!utils.generic.isValidObject(claim)) return null;

  return (
    <ClaimSummaryActionsView
      claim={claim}
      isClosedClaim={isClosedClaim}
      isReassignEnabled={isReassignEnabled}
      userHasAllClaimsPermission={userHasAllClaimsPermission}
      isUsersClaim={isUsersClaim}
      isTeamClaim={isTeamClaim}
      handlers={{
        createRFIModal,
        createAdHocTaskModal,
        reAssignClaim,
        setClaimPriority,
        releaseClaimToQ,
        handleReOpenClaim,
      }}
    />
  );
}
