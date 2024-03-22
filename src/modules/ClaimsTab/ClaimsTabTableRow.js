import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import PropTypes from 'prop-types';

// app
import { ClaimsTabTableRowView } from './ClaimsTabTableRow.view';
import { showModal, hideModal, setClaimsStepperControl, selectClaimsProcessingItem } from 'stores';
import { Breadcrumb } from 'components';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { Typography } from '@material-ui/core';

ClaimsTabTableRow.prototype = {
  claim: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
  isMultiSelect: PropTypes.bool,
  columnProps: PropTypes.object.isRequired,
  handlers: PropTypes.shape({
    clickClaim: PropTypes.func.isRequired,
    selectClaim: PropTypes.func.isRequired,
  }).isRequired,
};

export function ClaimsTabTableRow({ claim, handlers, ...rest }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const isFormDirtyRef = useRef(false);

  const { pathname } = history.location;

  const isDraft = claim?.status === constants.STATUS_CLAIMS_DRAFT;

  const breadcrumbs = [
    {
      name: 'lossRef',
      label: utils.string.t('claims.loss.text', { lossRef: claim?.lossRef }),
      link: pathname,
      active: true,
    },
    {
      name: 'claimRef',
      label: `${utils.string.t('claims.rfiDashboard.breadCrumbs.claimRef', { claimRef: claim?.claimReference })}`,
      link: pathname,
      active: true,
      largeFont: true,
    },
  ];

  const setFormDirty = (isDirty) => {
    isFormDirtyRef.current = isDirty;
  };

  const confirmHideModal = (modalName) => {
    if (isFormDirtyRef.current) {
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
                dispatch(hideModal(modalName));
              },
            },
          },
        })
      );
    } else {
      dispatch(hideModal(modalName));
    }
  };

  const handleChangeComplexityPriorityAssignmentClaim = (claim) => {
    dispatch(
      showModal({
        component: 'CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT',
        props: {
          title: 'claims.processing.summary.buttons.changeComplexityPriorityAssignment',
          fullWidth: true,
          maxWidth: 'sm',
          hideCompOnBlur: false,
          componentProps: {
            claims: [claim],
            setIsDirty: setFormDirty,
            clickXHandler: () => {
              confirmHideModal('CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT');
            },
            cancelHandler: () => {
              confirmHideModal('CHANGE_COMPLEXITY_PRIORITY_ASSIGNMENT');
            },
          },
        },
      })
    );
  };

  const handleEditClaim = (claim) => {
    dispatch(setClaimsStepperControl(1));
    history.push({
      pathname: `${config.routes.claimsFNOL.newLoss}`,
      state: {
        linkPolicy: {
          isSearchTerm: true,
          claimObj: claim,
        },
        redirectUrl: location?.pathname,
      },
    });
  };

  const handleCreateAdhoctask = (claim) => {
    dispatch(
      showModal({
        component: 'CREATE_AD_HOC_TASK_WIZARD',
        props: {
          title: 'claims.processing.taskFunction.createAdhocTask',
          fullWidth: true,
          maxWidth: 'xl',
          hideCompOnBlur: false,
          componentProps: { claim },
        },
      })
    );
  };

  const TitleWBreadCrumb = () => {
    return (
      <>
        <Breadcrumb links={breadcrumbs} />
        <Typography variant="h2" style={{ paddingLeft: '1.2rem' }}>
          {utils.string.t('claims.processing.taskFunction.createRFI')}
        </Typography>
      </>
    );
  };

  const handleCreateRFIClaimLevel = () => {
    dispatch(selectClaimsProcessingItem(claim, true));
    dispatch(
      showModal({
        component: 'CLAIMS_CREATE_RFI_STEPPER',
        props: {
          titleChildren: <TitleWBreadCrumb />,
          hideCompOnBlur: false,
          fullWidth: true,
          maxWidth: 'lg',
          disableAutoFocus: true,
          componentProps: {
            claim,
            type: constants.RFI_ON_CLAIMS,
            cancelHandler: () => {
              dispatch(hideModal());
            },
          },
        },
      })
    );
  };

  const rowActions = [
    ...(isDraft
      ? [
          {
            id: 'editClaim',
            label: utils.string.t('claims.claimsTab.popOverButtonItems.editClaim'),
            callback: () => handleEditClaim(claim),
          },
        ]
      : []),
    ...(!isDraft
      ? [
          {
            id: 'changeItems',
            label: utils.string.t('claims.claimsTab.popOverButtonItems.changeItems'),
            callback: () => handleChangeComplexityPriorityAssignmentClaim(claim),
          },
        ]
      : []),
    {
      id: 'createRFI',
      label: utils.string.t('claims.claimsTab.popOverButtonItems.createRFI'),
      callback: () => handleCreateRFIClaimLevel(claim),
    },
    ...(!isDraft
      ? [
          {
            id: 'createAdhocTask',
            label: utils.string.t('claims.claimsTab.popOverButtonItems.createAdhocTask'),
            callback: () => handleCreateAdhoctask(claim),
          },
        ]
      : []),
  ];

  return <ClaimsTabTableRowView claim={claim} rowActions={rowActions} handlers={handlers} {...rest} />;
}
