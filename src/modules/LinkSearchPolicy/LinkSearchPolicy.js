import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';

//app
import LinkSearchPolicyView from './LinkSearchPolicy.view';
import {
  showModal,
  hideModal,
  selectLossInformation,
  selectLossQualifiers,
  selectCatCodes,
  selectClaimsPolicyData,
  selectClaimsPolicyInformation,
  getClaimantNames,
  getPolicyInformation,
  selectorDmsViewFiles,
  selectDmsDocDetails,
  selectLinkPoliciesData,
  resetClaimDocDetails,
} from 'stores';
import * as utils from 'utils';

export default function LinkSearchPolicy(props) {
  const dispatch = useDispatch();
  const location = useLocation();
  const claimData = location?.state?.linkPolicy;
  const lossInformation = useSelector(selectLossInformation);
  const catCodes = useSelector(selectCatCodes);
  const lossQualifiers = useSelector(selectLossQualifiers);
  const policyInformation = useSelector(selectClaimsPolicyInformation);
  const policyData = useSelector(selectClaimsPolicyData);
  const [validation, setValidation] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [sectionEnabledValidationFlag, setSectionEnabledValidationFlag] = useState(true);

  const viewDocumentList = useSelector(selectorDmsViewFiles);
  const savedDmsDocList = useSelector(selectDmsDocDetails);
  const linkPoliciesData = useSelector(selectLinkPoliciesData);
  const [oldPolicyData, setOldPolicyData] = useState('');

  const handleAddClaim = () => {
    dispatch(getClaimantNames());
  };

  const onSaveHandle = () => {
    setSectionEnabledValidationFlag(false);
    props.handleSave(props.index);
  };

  const backStepperHandler = () => {
    props.setActiveStep(props.activeStep - 1);
  };

  const nextStepActions = () => {
    setSectionEnabledValidationFlag(true);
    props.setSaveStatus(new Date().getTime());
    props.handleNext();
  };

  const nextStepperhandler = () => {
    if (oldPolicyData && oldPolicyData !== policyData?.policyNumber) {
      dispatch(
        showModal({
          component: 'CONFIRM',
          props: {
            title: utils.string.t('app.confirm'),
            hint: utils.string.t('claims.searchPolicy.alertTitle'),
            fullWidth: true,
            maxWidth: 'xs',
            componentProps: {
              cancelLabel: utils.string.t('app.cancel'),
              confirmLabel: utils.string.t('app.okProceed'),
              submitHandler: async () => {
                await nextStepActions();
                !utils.generic.isInvalidOrEmptyArray(savedDmsDocList?.resetClaimDocDetails) && resetClaimDocDetails();
                dispatch(hideModal('CONFIRM'));
              },
            },
          },
        })
      );
    } else {
      nextStepActions();
    }
  };

  useEffect(() => {
    if (policyData?.xbInstanceID && !linkPoliciesData?.loader) {
      dispatch(getPolicyInformation({ viewLoader: false }));
      setConfirm(true);
    }
  }, [policyData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // func need to call apis for edit claims
  }, [claimData]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setOldPolicyData(policyData?.policyNumber);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <LinkSearchPolicyView
      {...props}
      policyInformation={policyInformation}
      handleAddClaim={handleAddClaim}
      lossInformation={lossInformation}
      policyData={policyData}
      catCodes={catCodes}
      lossQualifiers={lossQualifiers}
      confirm={confirm}
      setConfirm={setConfirm}
      sectionEnabledValidationFlag={sectionEnabledValidationFlag}
      validation={validation}
      setValidation={setValidation}
      onSaveHandle={onSaveHandle}
      backStepperHandler={backStepperHandler}
      nextStepperhandler={nextStepperhandler}
      linkPolicyDocList={viewDocumentList?.length > 0 ? viewDocumentList : savedDmsDocList?.linkPolicyDocDetails}
    />
  );
}
