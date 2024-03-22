import React from 'react';
import PropTypes from 'prop-types';

//app
import * as utils from 'utils';
import { Summary } from 'components';
import { ClaimsLossInformation, ClaimsAttachments, ClaimsInformation } from 'modules';
import styles from './ClaimsSummary.styles';

//mui
import { Box, Typography, makeStyles } from '@material-ui/core';

ClaimsSummaryView.prototype = {
  lossDetails: PropTypes.object.isRequired,
  attachmentsDetails: PropTypes.array.isRequired,
  claimDetails: PropTypes.array.isRequired,
};

export function ClaimsSummaryView({ lossDetails, attachmentsDetails, claimDetails }) {
  const classes = makeStyles(styles, { name: 'ClaimsSummary' })();
  const { id, insured } = claimDetails[0];

  return (
    <Summary>
      <Box className={classes.summaryTitleContainer}>
        <Typography className={classes.summaryTitle}>{`${utils.string.t('claims.claimId')} ${id}`}</Typography>
        <Typography className={classes.summaryTitle}>{`${utils.string.t('claims.insured')}: ${insured}`}</Typography>
      </Box>
      <ClaimsLossInformation details={lossDetails} />
      <ClaimsInformation details={claimDetails} />
      <ClaimsAttachments details={attachmentsDetails} />
    </Summary>
  );
}
