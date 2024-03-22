import React from 'react';
import PropTypes from 'prop-types';

// app
import styles from './ClaimsAcknowledgement.styles';
import { Overflow, Button } from 'components';
import { ClaimsAcknowledgementInfoCard } from './ClaimsAcknowledgementInfoCard';
import { RegisterNewLossFixedBottomBar } from 'modules';
import { STATUS_CLAIMS_DRAFT } from 'consts';
import * as utils from 'utils';

// mui
import { makeStyles, Box } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

ClaimsAcknowledgementView.propTypes = {
  lossInfo: PropTypes.array.isRequired,
  policyInfo: PropTypes.array.isRequired,
  underWritingInfo: PropTypes.object.isRequired,
  underWritingGroupColumns: PropTypes.array.isRequired,
  claimInfo: PropTypes.array.isRequired,
  claimsInformation: PropTypes.object.isRequired,
  activeStep: PropTypes.number.isRequired,
  isAllStepsCompleted: PropTypes.bool.isRequired,
  handlers: PropTypes.shape({
    back: PropTypes.func.isRequired,
    finish: PropTypes.func.isRequired,
    step: PropTypes.func.isRequired,
    editClaim: PropTypes.func.isRequired,
  }).isRequired,
};
export function ClaimsAcknowledgementView({
  lossInfo,
  policyInfo,
  claimInfo,
  claimsInformation,
  underWritingInfo,
  underWritingGroupColumns,
  activeStep,
  isAllStepsCompleted,
  handlers,
}) {
  const classes = makeStyles(styles, { name: 'ClaimsAcknowledgement' })();

  return (
    <Box overflow="hidden" display="flex" flexDirection="column">
      <Box flex="1 1 auto" className={classes.container}>
        <Box mt={3}>
          <Overflow>
            <ClaimsAcknowledgementInfoCard
              lossInfo={lossInfo}
              policyInfo={policyInfo}
              claimInfo={claimInfo}
              underWritingInfo={underWritingInfo}
              underWritingGroupColumns={underWritingGroupColumns}
              handleStep={handlers.step}
            />
          </Overflow>
        </Box>
        {activeStep === undefined && (
          <div>
            <Button
              icon={Edit}
              color="default"
              size="small"
              variant="outlined"
              tooltip={{ title: utils.string.t('claims.editClaim') }}
              style={{ border: 'none' }}
              onClick={() => handlers.editClaim()}
              disabled={claimsInformation?.claimStatus !== STATUS_CLAIMS_DRAFT}
            />
          </div>
        )}
      </Box>

      {activeStep && (
        <Box flex="0 1 auto">
          <RegisterNewLossFixedBottomBar
            lastStep={true}
            activeStep={activeStep}
            isAllStepsCompleted={isAllStepsCompleted}
            handleBack={() => {
              handlers.back();
            }}
            handleFinish={() => handlers.finish()}
          />
        </Box>
      )}
    </Box>
  );
}
