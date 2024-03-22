import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

// app
import styles from './PremiumProcessingCaseHistory.styles';
import { FormGrid, Warning, Tooltip } from 'components';
import * as utils from 'utils';
import { selectRefDataNewProcessType } from 'stores';

//mui
import { Box, makeStyles, Typography } from '@material-ui/core';

PremiumProcessingCaseHistoryView.propTypes = {
  taskId: PropTypes.string,
  caseDetailsObject: PropTypes.object,
};
export default function PremiumProcessingCaseHistoryView({ caseDetailsObject }) {
  const classes = makeStyles(styles, { name: 'PremiumProcessingCaseHistory' })();
  const caseHistory = caseDetailsObject?.checkSigningCaseHistory?.data;
  const hasNoHistory = caseHistory?.length === 0;
  const processTypeRefData = useSelector(selectRefDataNewProcessType) || [];
  const processTypeIdFromHistory = caseHistory.map((type) => {
    return {
      processTypeId: type?.processTypeId,
    };
  });
  const processName = processTypeIdFromHistory?.[0];
  const processTypeName =
    (utils.generic.isValidArray(processTypeRefData, true) &&
      processName?.processTypeId &&
      utils.referenceData.processTypes.getNameById(processTypeRefData, parseInt(processName?.processTypeId))) ||
    '';

  return (
    <FormGrid>
      <Box data-testid="notes" marginTop={2}>
        {caseHistory?.map((history, index) => {
          return (
            <Box key={index}>
              <Box py={2}>
                <FormGrid container alignItems="center" justifyContent="flex-start" spacing={1}>
                  <FormGrid item>
                    <Typography className={classes.noteStatus}>{history.message}</Typography>
                    <Typography>{history.dateAndTime}</Typography>
                    {history?.oldCaseId && (
                      <Typography>
                        {utils.string.t('premiumProcessing.checkSigningHistory.oldCheckSigning')}: {history.oldCaseId}
                      </Typography>
                    )}
                    <Typography>
                      {processTypeName}
                      {utils.string.t('premiumProcessing.checkSigningHistory.caseID')}: {history.parentCaseId}
                    </Typography>
                    <Typography>
                      <Tooltip title={history?.email} placement="bottom" arrow>
                        {utils.string.t('premiumProcessing.checkSigningHistory.by') + `${history.userName} ( ${history.role} )`}
                      </Tooltip>
                    </Typography>
                  </FormGrid>
                </FormGrid>
              </Box>
            </Box>
          );
        })}
      </Box>
      {hasNoHistory && (
        <Box p={5}>
          <Warning
            text={utils.string.t('premiumProcessing.checkSigningHistory.noHistoryIsAvailable')}
            type="info"
            align="center"
            size="large"
            icon
          />
        </Box>
      )}
    </FormGrid>
  );
}
