import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './PremiumProcessingSummary.styles';
import { Button, HorizontalLinearStepper, Summary, Warning, Skeleton } from 'components';
import { PremiumProcessingCaseAccordion, PremiumProcessingCaseRhsAccordions } from 'modules';

import * as utils from 'utils';
import * as constants from 'consts';

// mui
import { Box, Divider, makeStyles } from '@material-ui/core';
import GroupWorkOutlinedIcon from '@material-ui/icons/GroupWorkOutlined';
import BlockOutlinedIcon from '@material-ui/icons/BlockOutlined';

PremiumProcessingSummaryView.propTypes = {
  type: PropTypes.string.isRequired,
  selectedCases: PropTypes.array,
  caseDetails: PropTypes.object.isRequired,
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
  caseRfiDetails: PropTypes.object.isRequired,
  currentUser: PropTypes.array,
  isAllCases: PropTypes.bool.isRequired,
  isCheckSigningCase: PropTypes.bool.isRequired,
  isIssueDocumentStage: PropTypes.bool.isRequired,
  isTransactionCommited: PropTypes.bool.isRequired,
  isUnassignedStage: PropTypes.bool.isRequired,
  isValid: PropTypes.bool.isRequired,
  isValidRFI: PropTypes.bool.isRequired,
  iscaseTeamLoading: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    openUpdatingPopup: PropTypes.func.isRequired,
    clickCaseTeam: PropTypes.func.isRequired,
    clickRfiDetails: PropTypes.func.isRequired,
  }).isRequired,
};

export function PremiumProcessingSummaryView({
  type,
  selectedCases,
  caseDetails,
  caseRfiDetails,
  steps,
  activeStep,
  currentUser,
  isAllCases,
  isCheckSigningCase,
  isIssueDocumentStage,
  isTransactionCommited,
  isUnassignedStage,
  isValid,
  isValidRFI,
  iscaseTeamLoading,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingSummary' })();

  const hasNoSelectedCases = !selectedCases || selectedCases.length === 0 || !selectedCases[0];
  const processTypeName = caseDetails?.caseTeamData?.processId;
  const processTypeSubText =
    processTypeName === constants.ENDORSEMENT
      ? caseDetails.caseTeamData?.nonPremiumIndicator?.toUpperCase() === constants.SELECTED
        ? `|${utils.string.t('premiumProcessing.caseDetailsSection.nonpremiumLabel')}`
        : `|${utils.string.t('premiumProcessing.caseDetailsSection.premium')}`
      : '';

  if (hasNoSelectedCases) {
    return (
      <Summary title={utils.string.t('premiumProcessing.cases')} testid="case-empty">
        <Box p={5}>
          <Warning type="info" text={utils.string.t('premiumProcessing.noCaseSelected')} size="large" icon />
        </Box>
      </Summary>
    );
  }

  // no valid case
  if (!isValid && !isValidRFI && !iscaseTeamLoading) {
    return (
      <Summary title={utils.string.t('premiumProcessing.cases')} testid="case-empty">
        <Box p={5}>
          <Warning type="alert" text={utils.string.t('premiumProcessing.noValidCaseDetailsFound')} size="large" icon />
        </Box>
      </Summary>
    );
  }

  const { caseId } = caseDetails;
  const isWorkBasket = type === constants.WORKBASKET;
  const isRfiCase = utils.premiumProcessing.isRfi(selectedCases?.[0]);
  const hasSingleSelectedCase = selectedCases?.length === 1;
  const hasMultipleSelectedCase = selectedCases?.length > 1;

  const hasCheckSigning = caseDetails.isCheckSigning;

  const subTitle = hasCheckSigning
    ? `${utils.string.t(processTypeName)} ${utils.string.t('premiumProcessing.columns.caseId')}
${caseDetails?.caseTeamData?.primaryCaseID}`
    : isRfiCase && caseRfiDetails.queryId
    ? `${utils.string.t(`premiumProcessing.rfi.rfiTxt`)}
    ${utils.string.t(`premiumProcessing.rfi.queryId`)} ${caseRfiDetails.queryId}`
    : `${utils.string.t(processTypeName)} ${utils.string.t(processTypeSubText)} `;

  // multiple cases
  if (hasMultipleSelectedCase) {
    return (
      <Summary title={utils.string.t('premiumProcessing.cases')} testid="case-empty">
        <Box p={5}>
          <Warning type="info" text={utils.string.t('premiumProcessing.casesMultiple')} size="large" icon />
        </Box>
      </Summary>
    );
  }

  // single case
  if (hasSingleSelectedCase) {
    return !iscaseTeamLoading ? (
      <Summary
        title={`${utils.string.t('premiumProcessing.columns.caseId')}  ${!isRfiCase ? caseId : caseRfiDetails.caseId || ''}`}
        subtitle={subTitle}
        actionContent={
          !isRfiCase && (
            <Button
              icon={GroupWorkOutlinedIcon}
              text={utils.string.t('premiumProcessing.caseTeam.buttonTitle')}
              onClick={handlers.clickCaseTeam}
              color="default"
              variant="outlined"
              size="xsmall"
            />
          )
        }
        testid="case"
      >
        {!isRfiCase && (
          <Box className={classes.stickyStepper}>
            <HorizontalLinearStepper
              steps={steps}
              stepContent={() => {}}
              activeStep={activeStep}
              showStepConnector
              stepIcon={<BlockOutlinedIcon className={classes.iconStyling} />}
              nestedClasses={{ stepper: classes.stepper }}
            />
            <Box mb={1}>
              <Divider />
            </Box>
          </Box>
        )}
        <PremiumProcessingCaseAccordion
          handlers={{
            caseTeamHandler: handlers.clickCaseTeam,
            caseRfiHandler: handlers.clickRfiDetails,
            openUpdatingPopup: handlers.openUpdatingPopup,
          }}
          caseInstructionId={caseDetails?.instructionId}
          caseTeamDetails={caseDetails?.caseTeamData}
          caseInstructionStatusId={caseDetails?.instructionStatusId}
          caseRfiDetails={caseRfiDetails}
          selectedCases={selectedCases}
        />

        <Box mt={2} mb={2}>
          <Divider />
        </Box>

        <PremiumProcessingCaseRhsAccordions
          currentUser={currentUser}
          selectedCases={selectedCases}
          caseRfiDetails={caseRfiDetails}
          isAllCases={isAllCases}
          isCheckSigningCase={isCheckSigningCase}
          isIssueDocumentStage={isIssueDocumentStage}
          isTransactionCommited={isTransactionCommited}
          isUnassignedStage={isUnassignedStage}
          isWorkBasket={isWorkBasket}
          handlers={{
            caseTeamHandler: handlers.clickCaseTeam,
            caseRfiHandler: handlers.clickRfiDetails,
            openUpdatingPopup: handlers.openUpdatingPopup,
          }}
        />
      </Summary>
    ) : (
      <Box p={2}>
        {!isRfiCase ? (
          <>
            <Skeleton variant="text" height={25} animation="wave" displayNumber={1} width={90} />
            <Skeleton variant="text" height={15} animation="wave" displayNumber={1} width={120} />
            <Skeleton variant="rect" height={80} animation="wave" displayNumber={1} />
            <Skeleton variant="text" height={200} animation="wave" displayNumber={1} />
            <Skeleton variant="text" height={40} animation="wave" displayNumber={2} />
            <Box display="flex" justifyContent={'flex-end'}>
              <Box mr={1}>
                <Skeleton variant="text" height={60} animation="wave" displayNumber={1} width={90} />
              </Box>
              <Box>
                <Skeleton variant="text" height={60} animation="wave" displayNumber={1} width={90} />
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Skeleton variant="text" height={25} animation="wave" displayNumber={1} width={90} />
            <Skeleton variant="text" height={15} animation="wave" displayNumber={1} width={120} />
            <Skeleton variant="text" height={200} animation="wave" displayNumber={1} />
            <Box display="flex" justifyContent={'flex-end'}>
              <Box>
                <Skeleton variant="text" height={60} animation="wave" displayNumber={1} width={90} />
              </Box>
            </Box>
          </>
        )}
      </Box>
    );
  }

  // abort
  return null;
}
