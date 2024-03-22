import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import get from 'lodash/get';
import xorBy from 'lodash/xorBy';

// app
import { ClaimsProcessingTableView } from './ClaimsProcessingTable.view';
import * as utils from 'utils';
import {
  collapseSidebar,
  expandSidebar,
  getReOpenTaskLists,
  selectClaimsProcessingItem,
  selectClaimsProcessingPagination,
  selectClaimsProcessingSelected,
  showModal,
  hideModal,
  getClaimsProcessing,
  returnToTeamQueueClaim,
  checkIsUserClaim,
  checkIsClosedClaim,
  checkIsTeamClaim
} from 'stores';
import { useSort, usePagination } from 'hooks';
import config from 'config';
import * as constants from 'consts';

ClaimsProcessingTable.prototypes = {
  claims: PropTypes.array.isRequired,
  cols: PropTypes.array.isRequired,
  columnProps: PropTypes.object.isRequired,
  sort: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    bulkAssignClaims: PropTypes.object.isRequired,
    changePage: PropTypes.object.isRequired,
    changeRowsPerPage: PropTypes.object.isRequired,
    sort: PropTypes.object.isRequired,
  }).isRequired,
};

export default function ClaimsProcessingTable({ claims, cols: colsArr, columnProps, sort: sortObj, handlers = {} }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const isReassignFormDirtyRef = useRef(false);
  const claimsProcessingPagination = useSelector(selectClaimsProcessingPagination);
  const claimsProcessingSelected = useSelector(selectClaimsProcessingSelected);
  const uiSidebarExpanded = useSelector((state) => get(state, 'ui.sidebar.expanded'));
  const claimsType = constants.CLAIM_TEAM_TYPE.myClaims;
  const searchBy = constants.CLAIMS_SEARCH_OPTION_CLAIM_REF;

  const { cols, sort } = useSort(colsArr, sortObj, handlers?.sort);
  const pagination = usePagination(claims || [], claimsProcessingPagination, handlers.changePage, handlers.changeRowsPerPage);
  const claimsProcessingSelectedLength = claimsProcessingSelected?.length || 0;
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (claimsProcessingSelectedLength !== 1) {
      dispatch(collapseSidebar());
    }
  }, [claimsProcessingSelectedLength]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(getReOpenTaskLists());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const selectClaim = (claimObj) => () => {
    const selectedClaimsArray = xorBy(claimsProcessingSelected, [claimObj], 'processID');

    if (claimObj?.processID) {
      dispatch(selectClaimsProcessingItem(claimObj));

      if (!uiSidebarExpanded && selectedClaimsArray?.length === 1) {
        dispatch(expandSidebar());
      }
    }
  };

  const clickClaim = (claimObj) => (event) => {
    event.stopPropagation();

    if (claimObj?.claimRef) {
      const isUserClaim = user.emailId?.toLowerCase() === claimObj?.assigneeEmail?.toLowerCase();
      const isClosedClaim = claimObj?.processState?.toLowerCase() === constants.CLAIM_STATUS_CLOSED.toLowerCase();
      const isTeamClaim = user?.organisation?.name?.toLowerCase() === claimObj?.team?.toLowerCase();
      dispatch(checkIsUserClaim(isUserClaim)); 
      dispatch(checkIsClosedClaim(isClosedClaim));
      dispatch(checkIsTeamClaim(isTeamClaim));
      dispatch(selectClaimsProcessingItem(claimObj, true));
      history.push(`${config.routes.claimsProcessing.claim}/${claimObj.claimRef}`);
    }
  };

  const handleCreateAdHocTaskModal = (claim) => {
    dispatch(!claimsProcessingSelectedLength ? selectClaimsProcessingItem(claim) : selectClaimsProcessingItem(claim, true));
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
            submitHandler: () => {
              dispatch(hideModal());
            },
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleCreateRFIModal = (claim) => {
    dispatch(!claimsProcessingSelectedLength ? selectClaimsProcessingItem(claim) : selectClaimsProcessingItem(claim, true));
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
            claim,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const handleSetClaimPriority = (claim) => {
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

  const handleReassignClaim = (claim) => {
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

  const handleReturnClaimToTeamQueue = (claim) => {
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

  return (
    <ClaimsProcessingTableView
      claims={claims || []}
      claimsSelected={claimsProcessingSelected}
      cols={cols}
      columnProps={columnProps}
      sort={sort}
      pagination={pagination}
      handlers={{
        bulkAssignClaims: handlers.bulkAssignClaims,
        clickClaim,
        handleCreateAdHocTaskModal,
        handleCreateRFIModal,
        handleReassignClaim,
        handleSetClaimPriority,
        handleReturnClaimToTeamQueue,
        handleReOpenClaim,
        selectClaim,
        sort: handlers.sort,
      }}
    />
  );
}
