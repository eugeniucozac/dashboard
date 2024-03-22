import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router';
import { Helmet } from 'react-helmet';
import get from 'lodash/get';

//app
import { ProcessingInstructionsStepsView } from './ProcessingInstructionsSteps.view';
import { AccessControl } from 'components';
import {
  enqueueNotification,
  getUsersInRoles,
  getFacilityTypes,
  getDepartments,
  selectProcessingInstructionById,
  getProcessingInstruction,
  storeResetAllState,
  selectUser,
  selectPiProducingBrokers,
  selectPiAccountExecutives,
  selectPiFacilityTypes,
  selectPiDepartmentList,
  resetProcessingInstruction,
  updateReferenceDocumentCountLoading,
  getRiskReferenceDocumentsCount,
  getRiskReferencesDocumentsCountList,
} from 'stores';
import * as constants from 'consts';
import * as utils from 'utils';
import config from 'config';

const ProcessingInstructionsSteps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id, step, tab } = useParams();

  const [steps, setSteps] = useState([]);
  const [activeStep, setActiveStep] = useState(0);
  const [fetchInstruction, setFetchInstruction] = useState({});
  const [fetchDepartments, setFetchDepartments] = useState({});
  const [fetchUsersInRoles, setFetchUsersInRoles] = useState({});
  const [fetchFacilityTypes, setFetchFacilityTypes] = useState({});
  const [checkListMandatoryDataStatus, setcheckListMandatoryDataStatus] = useState(false);
  const [processingInstructionMandatoryDataStatus, setprocessingInstructionMandatoryDataStatus] = useState(false);

  const user = useSelector(selectUser);
  const producingBrokers = useSelector(selectPiProducingBrokers);
  const accountExecutives = useSelector(selectPiAccountExecutives);
  const facilityTypes = useSelector(selectPiFacilityTypes);
  const departmentList = useSelector(selectPiDepartmentList);
  const instruction = useSelector(selectProcessingInstructionById(id));
  const brand = useSelector((state) => state.ui.brand);
  const documents = useSelector((state) => get(state, 'processingInstructions.documents')) || {};
  const riskReferencesDocumentsCountList = useSelector(getRiskReferencesDocumentsCountList);

  const isClosing = utils.processingInstructions.isClosing(instruction?.processTypeId);
  const isFdo = utils.processingInstructions.isFdo(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);

  const isDraft = utils.processingInstructions.status.isDraft(instruction?.statusId);
  const isRejectedDraft = utils.processingInstructions.status.isRejectedDraft(instruction?.statusId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const isSubmittedAuthorisedSignatory = utils.processingInstructions.status.isSubmittedAuthorisedSignatory(instruction?.statusId);
  const isSubmittedProcessing = utils.processingInstructions.status.isSubmittedProcessing(instruction?.statusId);
  const processTypeName = utils.processingInstructions.getProcessTypeName(instruction?.processTypeId);

  const userHasWritePermission = utils.app.access.feature('processingInstructions.processingInstructions', ['create', 'update'], user);
  const userHasApproverAccess = utils.app.access.feature('processingInstructions.approverChecklist', ['create', 'update'], user);
  const isEditAllowed = userHasWritePermission && (isDraft || isRejectedDraft || isReopened);
  const isReadOnly = !isEditAllowed;
  const isPageReady = fetchInstruction.done && fetchDepartments.done && fetchUsersInRoles.done && fetchFacilityTypes.done;
  const faBorderProcessType = isBordereau || isFeeAndAmendment;

  const stepsMap = {
    closing: {
      'add-risk-reference': 0,
      checklist: 1,
      'processing-instruction': 2,
      authorisations: 3,
    },
    endorsement: {
      'add-risk-reference': 0,
      'processing-instruction': 1,
    },
    fdo: {
      'add-risk-reference': 0,
      checklist: 1,
      'processing-instruction': 2,
      authorisations: 3,
    },
    bordereau: {
      'add-risk-reference': 0,
      'processing-instruction': 1,
    },
    feeAmendment: {
      'add-risk-reference': 0,
      'processing-instruction': 1,
    },
  };

  const getRiskReferenceDocumentCount = () => {
    if (utils.generic.isValidArray(documents?.riskReferences, true)) {
      dispatch(updateReferenceDocumentCountLoading(true));
      const referenceList = documents?.riskReferences?.map((refData) => {
        return {
          endorsementId: refData.endorsementId,
          endorsementNumber: refData.endorsementNumber,
          riskRefId: refData.riskRefId,
          xbInstanceId: refData.xbInstanceId,
          xbPolicyId: refData.xbPolicyId,
        };
      });
      const documentTypeValue = isEndorsement
        ? constants.PI_ENDORSEMENT_TYPE_DOCUMENT.documentTypeDescription
        : faBorderProcessType
        ? constants.PI_FABORDER_TYPE_DOCUMENT.documentTypeDescription
        : constants.PI_CLOSING_FDO_TYPE_DOCUMENT.documentTypeDescription;
      dispatch(getRiskReferenceDocumentsCount(referenceList, documentTypeValue));
    }
  };

  useEffect(() => {
    getRiskReferenceDocumentCount();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (activeStep === 2 || activeStep === 3) {
      let checkListMandatoryData = true;
      if (utils.generic.isValidObject(instruction?.details) && utils.generic.isValidArray(instruction?.checklist, true)) {
        checkListMandatoryData = utils.processingInstructions.checkProcessingInstructionMandatoryData(
          {
            checklist: constants.CHECKLIST_DATA_LIST,
            details: utils.processingInstructions.detailsDataList(instruction?.processType === constants.FDO),
          },
          { checklist: instruction?.checklist, details: instruction?.details }
        );
      } else {
        checkListMandatoryData = false;
      }
      if (
        checkListMandatoryData &&
        utils.generic.isValidArray(riskReferencesDocumentsCountList, true) &&
        utils.generic.isValidArray(documents?.riskReferences, true)
      ) {
        checkListMandatoryData = utils.processingInstructions.checkProcessingInstructionMandatoryData(
          { riskReference: { documentCount: true } },
          { riskReference: riskReferencesDocumentsCountList }
        );
      }
      setcheckListMandatoryDataStatus(!checkListMandatoryData);
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [riskReferencesDocumentsCountList, instruction?.details, instruction?.checklist, activeStep]);

  useEffect(() => {
    if (activeStep === 3) {
      let checkProcessingInstructionData = true;
      if (utils.generic.isValidArray(instruction?.financialChecklist, true)) {
        checkProcessingInstructionData = utils.processingInstructions.checkProcessingInstructionMandatoryData(
          {
            financialChecklist: constants.FINANCIAL_CHECKLIST_DATA_LIST,
          },
          {
            financialChecklist: instruction?.financialChecklist,
            premiumTaxDocument: documents?.premiumTaxDocument,
            signedLinesDocument: documents?.signedLinesDocument,
          }
        );
      }
      setprocessingInstructionMandatoryDataStatus(!checkProcessingInstructionData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [instruction?.financialChecklist, activeStep]);

  useEffect(() => {
    // fetch departments
    if (utils.generic.isInvalidOrEmptyArray(departmentList) && !fetchDepartments.loading) {
      setFetchDepartments({ done: false, loading: true });

      dispatch(getDepartments()).then((res) => {
        if (utils.generic.isValidArray(res)) {
          setFetchDepartments({ done: true, loading: false });
        }
      });
    } else {
      setFetchDepartments({ done: true, loading: false });
    }

    // fetch users in roles
    if (
      (utils.generic.isInvalidOrEmptyArray(producingBrokers) || utils.generic.isInvalidOrEmptyArray(accountExecutives)) &&
      !fetchUsersInRoles.loading
    ) {
      setFetchUsersInRoles({ done: false, loading: true });

      dispatch(getUsersInRoles([constants.PRODUCING_BROKER, constants.ACCOUNT_EXECUTIVE])).then((res) => {
        if (utils.generic.isValidArray(res)) {
          setFetchUsersInRoles({ done: true, loading: false });
        }
      });
    } else {
      setFetchUsersInRoles({ done: true, loading: false });
    }

    // cleanup
    return () => {
      dispatch(resetProcessingInstruction());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    // fetch processing instruction by ID if not loaded
    if (!instruction?.id && !fetchInstruction.loading) {
      setFetchInstruction({ done: false, loading: true });

      dispatch(getProcessingInstruction(id)).then((res) => {
        setFetchInstruction({ done: true, loading: false });

        const notificationParams = {
          data: { id },
          keepAfterUrlChange: true,
        };

        if (!res?.id) {
          // if user is Assigned Signatory and status is not submitted authorised/processing
          if (res?.json?.message === 'pi.status.not.allowed') {
            dispatch(enqueueNotification('processingInstructions.notifications.statusNotAllowed', 'warning', notificationParams));
            // if user doesn't have access to the instances and/or departments
          } else if (res?.json?.message === 'pi.instance.dept.unauthorised') {
            dispatch(enqueueNotification('processingInstructions.notifications.instanceDeptUnauthorised', 'warning', notificationParams));
            // status was meanwhile changed to rejected draft
          } else if (res?.json?.message === 'pi.status.rejected.draft') {
            dispatch(enqueueNotification('processingInstructions.notifications.statusChangedToRejected', 'warning', notificationParams));
            // if PI not found
          } else {
            dispatch(enqueueNotification('processingInstructions.notifications.notFound', 'warning', notificationParams));
          }

          history.replace(config.routes.processingInstructions.root);
        }
      });
    }

    // fetch facility types
    if (isFdo && utils.generic.isInvalidOrEmptyArray(facilityTypes) && !fetchFacilityTypes.loading) {
      setFetchFacilityTypes({ done: false, loading: true });

      dispatch(getFacilityTypes()).then((res) => {
        if (utils.generic.isValidArray(res)) {
          setFetchFacilityTypes({ done: true, loading: false });
        }
      });
    } else {
      setFetchFacilityTypes({ done: true, loading: false });
    }
  }, [instruction?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    dispatch(storeResetAllState(isEditAllowed));
  }, [isReadOnly, isSubmittedAuthorisedSignatory]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isPageReady) {
      // set the available steps for different process types
      let currentSteps = [];
      if (isClosing || isFdo) {
        currentSteps = [
          { slug: 'add-risk-reference', label: utils.string.t('processingInstructions.steps.addRiskRefs') },
          { slug: 'checklist', label: utils.string.t('processingInstructions.steps.checklist') },
          { slug: 'processing-instruction', label: utils.string.t('processingInstructions.steps.details') },
          { slug: 'authorisations', label: utils.string.t('processingInstructions.steps.authorisations') },
        ];
      } else {
        currentSteps = [
          { slug: 'add-risk-reference', label: utils.string.t('processingInstructions.steps.addRiskRefs') },
          { slug: 'processing-instruction', label: utils.string.t('processingInstructions.steps.details') },
        ];
      }
      setSteps(currentSteps);

      // redirection logic
      // if step is defined in URL route params
      if (step) {
        // if URL step param is not a valid step slug
        if (!currentSteps.map((item) => item.slug).includes(step)) {
          history.replace(`${config.routes.processingInstructions.steps}/${id}/${currentSteps[0].slug}`);
        }
      } else {
        // if user is Assigned Signatory
        // AND type is closing OR fdo
        // AND status is submittedToAuthorisedSignatory OR submittedForProcessing
        if (userHasApproverAccess && (isClosing || isFdo) && (isSubmittedAuthorisedSignatory || isSubmittedProcessing)) {
          history.replace(`${config.routes.processingInstructions.steps}/${id}/checklist`);

          // if type is closing OR fdo
          // AND status is reopened
        } else if (isReopened && (isClosing || isFdo)) {
          history.replace(`${config.routes.processingInstructions.steps}/${id}/checklist`);
        } else if (isReopened && (isFeeAndAmendment || isBordereau || isEndorsement)) {
          history.replace(`${config.routes.processingInstructions.steps}/${id}/processing-instruction`);
        } else {
          history.replace(`${config.routes.processingInstructions.steps}/${id}/${currentSteps[0].slug}`);
        }
      }

      // set the active step based on URL params or fallback to override custom logic if any applies
      if (processTypeName) {
        setActiveStep(step ? stepsMap[processTypeName]?.[step] : 0);
      }
    }
  }, [isPageReady, processTypeName, step]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNext = (step) => {
    history.push(`${config.routes.processingInstructions.steps}/${id}${step ? `/${step}` : ''}`);
  };

  const handleBack = (step) => {
    history.push(`${config.routes.processingInstructions.steps}/${id}${step ? `/${step}` : ''}`);
  };

  // abort
  if (!isPageReady || !instruction || !id || !processTypeName) return null;

  return (
    <>
      <Helmet>
        <title>{`${utils.string.t('processingInstructions.edit.title')} (${id}) - ${utils.app.getAppName(brand)}`}</title>
      </Helmet>
      <AccessControl feature="processingInstructions.processingInstructions" permissions="read">
        <ProcessingInstructionsStepsView
          instruction={instruction}
          urlParams={{ id: parseInt(id), step, tab }}
          type={processTypeName}
          steps={steps}
          stepsMap={stepsMap}
          activeStep={activeStep}
          departmentList={departmentList}
          checkListMandatoryDataStatus={checkListMandatoryDataStatus}
          processingInstructionMandatoryDataStatus={processingInstructionMandatoryDataStatus}
          handlers={{
            back: handleBack,
            next: handleNext,
          }}
        />
      </AccessControl>
    </>
  );
};

export default ProcessingInstructionsSteps;
