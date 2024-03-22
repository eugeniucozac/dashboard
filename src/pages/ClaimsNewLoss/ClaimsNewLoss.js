import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { Helmet } from 'react-helmet';

// app
import {
  showModal,
  selectClaimsStepper,
  selectCatCodes,
  selectClaimsStatuses,
  selectPriorities,
  selectLossQualifiers,
  selectSettlementCurrency,
  selectReferralResponse,
  getCatCodes,
  getStatuses,
  getPriorityLevels,
  getLossQualifiers,
  getSettlementCurrency,
  getReferralResponse,
  submitClaimDetailsInformation,
  resetClaimsPolicies,
  resetLinkPolicies,
  resetClaimsDMSDocumentDetails,
  resetLossPolicyClaimData,
  resetSelectedLossItem,
  resetWidgetClaimsMetadata,
  resetLossData,
  setClaimData,
  setClaimsStepperControl,
} from 'stores';
import { CustomizedDialog, DrawerComponent } from 'components';
import { ClaimsRegisterNewLoss } from 'forms';
import * as utils from 'utils';
import config from 'config';
import { DmsFnolWidget } from 'modules';

export default function ClaimsNewLoss() {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const rootRef = useRef(null);

  const brand = useSelector((state) => state.ui.brand);
  const catCodes = useSelector(selectCatCodes);
  const priorities = useSelector(selectPriorities);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const claimsStatuses = useSelector(selectClaimsStatuses);
  const settlementCurrency = useSelector(selectSettlementCurrency);
  const referralResponse = useSelector(selectReferralResponse);
  const currentStep = useSelector(selectClaimsStepper);

  const [fnolModalOpen, setFnolModalOpen] = useState(false);
  const [isAnyformDirty, checkDirtyStatus] = useState(false);

  const [forms, editFormStatus] = useState([
    { id: 0, form: utils.string.t('claims.modalStepperLabel.createLoss'), formEditedStatus: false, isSubmitted: false },
    { id: 1, form: utils.string.t('claims.modalStepperLabel.linkPolicies'), formEditedStatus: false, isSubmitted: false },
    { id: 2, form: utils.string.t('claims.modalStepperLabel.createClaim'), formEditedStatus: false, isSubmitted: false },
    { id: 3, form: utils.string.t('claims.modalStepperLabel.manageDocuments'), formEditedStatus: false, isSubmitted: false },
    { id: 4, form: utils.string.t('claims.modalStepperLabel.confirmation'), formEditedStatus: false, isSubmitted: false },
  ]);

  const redirectUrl = location?.state?.redirectUrl || '';
  const isNewLoss = location?.state?.isNewLoss;

  // On click of Finish button
  const launchFinishModal = () => {
    dispatch(
      showModal({
        component: 'CONFIRM',
        props: {
          title: utils.string.t('claims.modals.confirmClaimSubmission.title'),
          fullWidth: true,
          maxWidth: 'sm',
          componentProps: {
            confirmLabel: utils.string.t('app.yes'),
            cancelLabel: utils.string.t('app.no'),
            confirmMessage: utils.string.t('claims.modals.confirmClaimSubmission.content'),
            submitHandler: () => {
              dispatch(
                submitClaimDetailsInformation({
                  successCallback: (data) => {
                    if (typeof data === 'string') {
                      handleCleanUp();
                      history.push(redirectUrl || config.routes.claimsFNOL.root);
                    }
                  },
                })
              );
            },
            handleClose: () => {},
          },
        },
      })
    );
  };

  const getAllReferentialData = () => {
    if (utils.generic.isInvalidOrEmptyArray(catCodes)) {
      dispatch(getCatCodes());
    }
    if (utils.generic.isInvalidOrEmptyArray(priorities)) {
      dispatch(getPriorityLevels());
    }
    if (utils.generic.isInvalidOrEmptyArray(lossQualifiers)) {
      dispatch(getLossQualifiers());
    }
    if (utils.generic.isInvalidOrEmptyArray(claimsStatuses)) {
      dispatch(getStatuses());
    }
    if (utils.generic.isInvalidOrEmptyArray(settlementCurrency)) {
      dispatch(getSettlementCurrency());
    }
    if (utils.generic.isInvalidOrEmptyArray(referralResponse)) {
      dispatch(getReferralResponse());
    }
  };

  useEffect(() => {
    getAllReferentialData();
    setFnolModalOpen(true);
    return () => {
      dispatch(setClaimsStepperControl(0));
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFnolModalClose = () => {
    if (isAnyformDirty) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('status.alert'),
            hint: utils.string.t('navigation.title'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.no'),
              confirmLabel: utils.string.t('app.yes'),
              submitHandler: async () => {
                setFnolModalOpen(false);
                handleCleanUp();
                history.push(redirectUrl || config.routes.claimsFNOL.root);
              },
            },
          },
        })
      );
    }
  };

  const findDirtyForm = (forms) => {
    editFormStatus(forms?.map((form) => ({ ...form })));
    checkDirtyStatus(forms.some((form) => form?.formEditedStatus === true));
  };

  const handleCleanUp = () => {
    // if it's a new loss being registered, cleanup all the data
    // it we're editing a loss or claim, we need to keep the data to redirect to the previous page/tab
    if (isNewLoss) {
      dispatch(resetLinkPolicies());
      dispatch(resetClaimsDMSDocumentDetails());
      dispatch(resetClaimsPolicies());
      dispatch(resetLossPolicyClaimData());
      dispatch(resetWidgetClaimsMetadata());
      dispatch(resetSelectedLossItem());
      dispatch(resetLossData());
      dispatch(setClaimData({}));
    }
  };

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('claims.actions.registerNewLoss')} - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <CustomizedDialog
        parentRef={rootRef}
        dialogOpen={fnolModalOpen}
        modalTitle={utils.string.t('claims.modalStepperLabel.title')}
        redirectUrl={redirectUrl}
        isDirty={isAnyformDirty}
        handlers={{
          handleDialogClose: handleFnolModalClose,
          handleCleanUp: handleCleanUp,
        }}
      >
        <ClaimsRegisterNewLoss
          initialFormStatus={forms}
          steps={forms.map((frm) => frm?.form)}
          stepsForms={forms}
          currentStep={currentStep}
          launchFinishModal={launchFinishModal}
          findDirtyForm={(forms) => {
            findDirtyForm(forms);
          }}
          lossProperties={location?.state?.loss ?? {}}
          claimProperties={location?.state?.linkPolicy ?? {}}
        />
      </CustomizedDialog>
      {fnolModalOpen && (
        <DrawerComponent isDrawerOpen>
          <DmsFnolWidget />
        </DrawerComponent>
      )}
    </>
  );
}
