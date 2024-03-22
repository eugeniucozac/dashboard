import PolicyCard, { PolicyCardSkeleton } from './PolicyCard';
import { FormGrid, Button, Restricted } from 'components';

import { Box, Typography } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';

import { ROLE_BROKER, ROLE_COBROKER } from 'consts';
import * as utils from 'utils';

const RiskPolicyView = ({ isLoading, riskIsLoading, policy, hasBoundQuote, riskStatus, parties, handleDownloadQuote, handlePreBind }) => {
  const showPreBind = policy?.facility?.preBind || false;

  return (
    <>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" justifyContent="start">
          <Typography variant="h3" style={{ marginBottom: 0, marginRight: 10 }}>
            {utils.string.t('app.policy')}
          </Typography>
        </Box>
        <Restricted include={[ROLE_BROKER, ROLE_COBROKER]}>
          <>
            {hasBoundQuote ? (
              <>
                <Box>
                  {showPreBind ? (
                    <Button
                      icon={DescriptionIcon}
                      size="xsmall"
                      variant="outlined"
                      color="primary"
                      text={utils.string.t('app.preBindForm')}
                      onClick={handlePreBind(policy, false)}
                    />
                  ) : null}
                </Box>
              </>
            ) : null}
          </>
        </Restricted>
      </Box>
      <FormGrid container spacing={2}>
        {isLoading || riskIsLoading || !policy ? (
          <FormGrid item xs={12} sm={6} md={6} lg={4}>
            <PolicyCardSkeleton />
          </FormGrid>
        ) : (
          <FormGrid item xs={12} sm={6} md={6} lg={4}>
            <PolicyCard
              policy={policy}
              hasBoundQuote={hasBoundQuote}
              parties={parties}
              handleDownloadQuote={handleDownloadQuote}
              handlePreBind={handlePreBind}
            />
          </FormGrid>
        )}
      </FormGrid>
    </>
  );
};

export default RiskPolicyView;
