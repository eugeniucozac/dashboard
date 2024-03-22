import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams, useLocation } from 'react-router';

// app
import { ClaimDashboardView } from './ClaimDashboard.view';
import { Breadcrumb } from 'components';
import {
  selectClaimsTabRowSelected,
  showModal,
  hideModal,
  setClaimsStepperControl,
  selectDmsWidgetExpanded,
  getSelectedClaimDetails,
  selectFnolSelectedTab,
  selectLossSelected,
  resetDmsWidgetDocuments,
  getCaseIncidentDetails,
  selectRefDataNewProcessType,
  resetCaseIncidentDetails,
  selectCaseIncidentDetails,
  resetLossPolicyClaimData,
  selectBpmClaimInformation,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

// mui
import { Typography } from '@material-ui/core';

export default function ClaimDashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();
  const { pathname } = history.location;

  const isInflightClaim = location?.state?.isInflightClaim;
  const isFormDirtyRef = useRef(false);

  const claimsRowSelected = useSelector(selectClaimsTabRowSelected);
  const isDmsWidgetExpanded = useSelector(selectDmsWidgetExpanded);
  const fnolSelectedTab = useSelector(selectFnolSelectedTab);
  const lossSelected = useSelector(selectLossSelected);
  const processTypes = useSelector(selectRefDataNewProcessType);
  const caseIncidentDetails = useSelector(selectCaseIncidentDetails);

  const [selectedTab, setSelectedTab] = useState(params?.tab || 'claimRefDetail');
  const [checkRedirectLocation, setCheckRedirectLocation] = useState(false);
  const [claimRefFromLossObj, setClaimRefFromLossObj] = useState({});

  const claimSelected = claimsRowSelected?.[0];

  const processTypeId = processTypes?.find((item) => item.processTypeDetails === constants.CLAIM_MAIN_PROCESS)?.processTypeID;

  const { data: bpmClaimInfo = {} } = useSelector(selectBpmClaimInformation);

  const setCheckPage = (val, associateClaimData, lossRef) => {
    setCheckRedirectLocation(val);
    setClaimRefFromLossObj({
      claimID: associateClaimData?.claimID,
      claimRef: associateClaimData?.claimReference,
      lossRef: lossRef,
      sourceId: associateClaimData?.sourceID,
      policyId: associateClaimData?.xbPolicyID,
    });
    if (associateClaimData?.claimReference) {
      history.push(`${config.routes.claimsProcessing.claim}/${associateClaimData?.claimReference}`);
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetDmsWidgetDocuments());
      dispatch(resetCaseIncidentDetails());
      dispatch(resetLossPolicyClaimData());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (claimsRowSelected?.length !== 1 || !claimSelected?.claimReference) {
      history.replace(config.routes.claimsFNOL.root);
      return;
    }
    dispatch(
      getSelectedClaimDetails({
        claimId: claimSelected?.claimId || claimSelected?.claimID,
        claimRefParams: claimSelected?.claimReference,
        sourceIdParams: claimSelected?.sourceId || claimSelected?.sourceID,
        divisionIDParams: claimSelected?.divisionId || claimSelected?.departmentID,
        viewLoader: false,
      })
    );
  }, [history, claimsRowSelected]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectTab = (tabName) => {
    setSelectedTab(tabName);
    if (!utils.generic.isValidObject(caseIncidentDetails, 'caseIncidentID') && tabName === 'claimRefNotes') {
      dispatch(getCaseIncidentDetails({ processTypeId: processTypeId, referenceId: claimSelected?.claimId, viewLoader: false }));
    }
  };

  const setIsFormDirty = (isDirty) => {
    isFormDirtyRef.current = isDirty;
  };

  const handleTabDisabled = (claimStatus) => {
    return claimStatus === constants.STATUS_CLAIMS_GXBSYNCED || isInflightClaim;
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
            setIsDirty: setIsFormDirty,
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

  const handleCreateRFIModal = (claim) => {
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

  const handleCreateAdhocTask = (claim) => {
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

  const handleEditClaim = (claim) => {
    dispatch(setClaimsStepperControl(1));
    history.push({
      pathname: `${config.routes.claimsFNOL.newLoss}`,
      state: {
        linkPolicy: {
          isSearchTerm: '',
          claimObj: claim,
        },
        redirectUrl: location?.pathname,
      },
    });
  };

  const isDraft = utils.string.isEqual(bpmClaimInfo?.status, constants.STATUS_CLAIMS_DRAFT, { caseSensitive: false });

  const popoverItems = [
    ...(isDraft
      ? [
          {
            id: 'editClaim',
            label: utils.string.t('claims.processing.summary.buttons.editClaim'),
            callback: () => handleEditClaim(claimSelected),
          },
        ]
      : []),
    ...(!isDraft
      ? [
          {
            id: 'changeComplexityPriorityAssignment',
            label: utils.string.t('claims.processing.summary.buttons.changeComplexityPriorityAssignment'),
            callback: () => handleChangeComplexityPriorityAssignmentClaim(claimSelected),
          },
        ]
      : []),
    {
      id: 'createRFI',
      label: utils.string.t('claims.processing.taskFunction.createRFI'),
      callback: () => handleCreateRFIModal(claimSelected),
    },
    ...(!isDraft
      ? [
          {
            id: 'createAdhocTask',
            label: utils.string.t('claims.claimsTab.popOverButtonItems.createAdhocTask'),
            callback: () => handleCreateAdhocTask(claimSelected),
          },
        ]
      : []),
  ];

  const breadcrumbs = [
    {
      name: 'claimsFnol',
      label: utils.string.t('claims.loss.title'),
      link: `${config.routes.claimsFNOL.root}${fnolSelectedTab ? `/tab/${fnolSelectedTab}` : ''}`,
    },
    {
      name: 'lossRef',
      label: `${utils.string.t('claims.loss.text', {
        lossRef: !claimSelected?.lossRef ? lossSelected?.lossRef : claimSelected?.lossRef,
      })}`,
      link: `${config.routes.claimsFNOL.loss}/${!claimSelected?.lossRef ? lossSelected?.lossRef : claimSelected?.lossRef}`,
      active: true,
    },
    {
      name: 'claimRef',
      label: `${utils.string.t('claims.claimRef.text', {
        claimRef: claimSelected?.claimReference,
      })}`,
      link: `${config.routes.claimsFNOL.claim}/${claimSelected?.claimReference}`,
      active: true,
      largeFont: true,
    },
  ];

  const tabs = [
    { value: 'claimRefDetail', disabled: false, label: utils.string.t('claims.claimRef.detail') },
    { value: 'claimRefActions', disabled: handleTabDisabled(claimSelected?.claimStatus), label: utils.string.t('claims.claimRef.actions') },
    { value: 'claimRefDocs', disabled: false, label: utils.string.t('claims.claimRef.docs') },
    { value: 'claimRefNotes', disabled: handleTabDisabled(claimSelected?.claimStatus), label: utils.string.t('claims.claimRef.notes') },
    {
      value: 'claimRefAuditTrail',
      disabled: handleTabDisabled(claimSelected?.claimStatus),
      label: utils.string.t('claims.claimRef.auditTrail'),
    },
  ];

  // abort
  if (!utils.generic.isValidObject(claimSelected, 'claimReference')) return null;

  return (
    <ClaimDashboardView
      tabs={tabs}
      selectedTab={selectedTab}
      handleSelectTab={handleSelectTab}
      popoverItems={popoverItems}
      claimObj={claimSelected}
      claimRefFromLossObj={claimRefFromLossObj}
      breadcrumbs={breadcrumbs}
      setCheckPage={setCheckPage}
      checkRedirectLocation={checkRedirectLocation}
      isDmsWidgetExpanded={isDmsWidgetExpanded}
      isInflightClaim={isInflightClaim}
    />
  );
}
