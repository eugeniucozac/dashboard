import React, { useRef } from 'react';
import PropTypes from 'prop-types';

//app
import styles from './ProcessingInstructionsSteps.styles';
import ProcessingInstructionsAuthorisation from '../../modules/ProcessingInstructionsAuthorisation/ProcessingInstructionsAuthorisation';
import { HorizontalLinearStepper, Layout, SectionHeader, Translate, Status, Warning } from 'components';
import {
  ProcessingInstructionsRiskRefs,
  ProcessingInstructionsChecklist,
  ProcessingInstructionsDetails,
  ProcessingInstructionsEndorseFaBorder,
} from 'modules';
import * as constants from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles } from '@material-ui/core';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';

ProcessingInstructionsStepsView.propTypes = {
  instruction: PropTypes.object.isRequired,
  urlParams: PropTypes.shape({
    id: PropTypes.number.isRequired,
    step: PropTypes.oneOf(['add-risk-reference', 'checklist', 'processing-instruction', 'authorisations']),
    tab: PropTypes.oneOf(['general', 'pre-placing', 'mrc', 'other-details', 'risk-references', 'processing-instruction', 'documents']),
  }).isRequired,
  type: PropTypes.oneOf(['closing', 'endorsement', 'fdo', 'bordereau', 'feeAmendment']).isRequired,
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      slug: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  stepsMap: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  departmentList: PropTypes.array.isRequired,
  checkListMandatoryDataStatus: PropTypes.bool.isRequired,
  processingInstructionMandatoryDataStatus: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    next: PropTypes.func.isRequired,
  }),
};

export function ProcessingInstructionsStepsView({
  instruction = {},
  urlParams,
  type,
  steps,
  stepsMap,
  activeStep,
  departmentList,
  checkListMandatoryDataStatus,
  processingInstructionMandatoryDataStatus,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ProcessingInstructionsSteps' })();
  const childRef = useRef(null);

  const isEndorsement = utils.processingInstructions.isEndorsement(instruction?.processTypeId);
  const isClosing = utils.processingInstructions.isClosing(instruction?.processTypeId);
  const isFdo = utils.processingInstructions.isFdo(instruction?.processTypeId);
  const isBordereau = utils.processingInstructions.isBordereau(instruction?.processTypeId);
  const isFeeAndAmendment = utils.processingInstructions.isFeeAndAmendment(instruction?.processTypeId);
  const isReopened = utils.processingInstructions.status.isReopened(instruction?.statusId);
  const isSubmittedProcessing = utils.processingInstructions.status.isSubmittedProcessing(instruction?.statusId);
  const isAuthorizrdSignatory = utils.processingInstructions.status.isSubmittedAuthorisedSignatory(instruction?.statusId);
  const instructionTypeLabel = instruction?.processTypeId
    ? ' - ' + utils.string.t(`processingInstructions.type.${instruction?.processTypeId}`)
    : '';

  const getStep = (direction, step) => {
    const plusOrMinus = direction === 'back' ? -1 : 1;
    const stepsArray = Object.keys(stepsMap[type]);
    const currentStepIndex = stepsArray.indexOf(step);
    const newStep = Object.entries(stepsMap[type]).find(([key, value]) => value === currentStepIndex + plusOrMinus);

    return newStep && newStep[0];
  };

  const stepContent = (index) => {
    switch (index) {
      case 0: {
        return (
          departmentList.length !== 0 && (
            <ProcessingInstructionsRiskRefs
              instruction={instruction}
              handlers={{
                next: () => handlers.next(getStep('next', 'add-risk-reference')),
              }}
              isStatusSubmittedProcessing={isSubmittedProcessing}
              isStatusReopened={isReopened}
              isAuthorizrdSignatory={isAuthorizrdSignatory}
            />
          )
        );
      }
      case 1: {
        return isClosing || isFdo ? (
          <ProcessingInstructionsChecklist
            instruction={instruction}
            handlers={{
              back: () => handlers.back(getStep('back', 'checklist')),
              next: () => handlers.next(getStep('next', 'checklist')),
            }}
            childRef={childRef}
          />
        ) : isEndorsement || isBordereau || isFeeAndAmendment ? (
          <ProcessingInstructionsEndorseFaBorder
            instruction={instruction}
            handlers={{
              back: () => handlers.back(getStep('back', 'processing-instruction')),
            }}
            childRef={childRef}
          />
        ) : null;
      }
      case 2:
        return (
          <ProcessingInstructionsDetails
            instruction={instruction}
            handlers={{
              back: () => handlers.back(getStep('back', 'processing-instruction')),
              next: () => handlers.next(getStep('next', 'processing-instruction')),
            }}
            childRef={childRef}
            checkListMandatoryDataStatus={checkListMandatoryDataStatus}
          />
        );
      case 3:
        return (
          <ProcessingInstructionsAuthorisation
            instruction={instruction}
            checkListMandatoryDataStatus={checkListMandatoryDataStatus}
            processingInstructionMandatoryDataStatus={processingInstructionMandatoryDataStatus}
            handlers={{
              back: () => handlers.back(getStep('back', (checkListMandatoryDataStatus && 'processing-instruction') || 'authorisations')),
            }}
            childRef={childRef}
          />
        );
      default:
        return <Warning type="error" border icon text={'An error occurred with the step index for the Processing Instruction'} />;
    }
  };

  const getStatus = (statusId) => {
    if (utils.processingInstructions.status.isDraft(statusId)) {
      return { type: 'info', id: constants.PI_STATUS_DRAFT };
    } else if (utils.processingInstructions.status.isRejectedDraft(statusId)) {
      return { type: 'error', id: constants.PI_STATUS_REJECTED_DRAFT };
    } else if (utils.processingInstructions.status.isSubmittedAuthorisedSignatory(statusId)) {
      return { type: 'alert', id: constants.PI_STATUS_SUBMITTED_AUTHORISED_SIGNATORY };
    } else if (utils.processingInstructions.status.isSubmittedProcessing(statusId)) {
      return { type: 'success', id: constants.PI_STATUS_SUBMITTED_PROCESSING };
    } else if (utils.processingInstructions.status.isReopened(statusId)) {
      return { type: 'reopen', id: constants.PI_STATUS_DRAFT_POST_SUBMISSION };
    } else {
      return { type: '', name: 'status.other' };
    }
  };

  const status = getStatus(instruction.statusId);
  const titleKey = instruction ? 'processingInstructions.edit.title' : 'processingInstructions.new.title';

  return (
    <Layout testid="new-processing-instructions" extensiveScreen>
      <Layout main padding>
        <SectionHeader
          title={
            <span>
              {`${utils.string.t(titleKey)} (${constants.PI_PREFIX}${urlParams.id}) ${instructionTypeLabel}`}
              <Status
                size="md"
                text={<Translate label={`processingInstructions.status.${status.id}`} />}
                status={status.type}
                nestedClasses={{ root: classes.status }}
              />
            </span>
          }
          icon={PlaylistAddCheckIcon}
          testid="new-processing-instructions"
        />
        <HorizontalLinearStepper
          steps={steps}
          stepContent={stepContent}
          activeStep={activeStep}
          showStepConnector
          nestedClasses={{ stepper: classes.stepper }}
        />
      </Layout>
    </Layout>
  );
}
