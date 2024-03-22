import QuoteCard, { QuoteCardSkeleton } from './QuoteCard';
import { FormGrid, Button, Restricted } from 'components';

import { Box, CircularProgress, Typography, IconButton, makeStyles } from '@material-ui/core';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import RefreshIcon from '@material-ui/icons/Refresh';
import CompareIcon from '@material-ui/icons/Compare';

import styles from './RiskQuotes.styles';
import { ROLE_BROKER, ROLE_COBROKER } from 'consts';
import * as utils from 'utils';

const RiskQuotesView = ({
  isLoading,
  riskIsLoading,
  quotes,
  riskStatus,
  parties,
  issuesData,
  handlePatchRiskQuote,
  handleDeclineRiskQuote,
  handleAcceptRiskQuote,
  handleBindRiskQuote,
  handleDownloadQuote,
  handleRiskRefresh,
  handleRequestToBind,
  handleReQuoteRisk,
  handleQuoteRefresh,
  handlePreBind,
  handleRequestDismissIssues,
  handleOpenCoverageComparison,
  showCoverageComparison,
  isQuoteLoading,
}) => {
  const classes = makeStyles(styles, { name: 'RiskQuotes' })();

  return (
    <>
      <Box mb={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" justifyContent="start">
          <Typography variant="h3" style={{ marginBottom: 0, marginRight: 10 }}>
            {utils.string.t('app.quote_plural')}
          </Typography>
          {isQuoteLoading ? (
            <Box position="relative" className={classes.progressBox}>
              <CircularProgress size={24} classes={{ root: classes.circularProgress }} />
            </Box>
          ) : (
            <IconButton aria-label="Refresh" size="small" onClick={handleQuoteRefresh}>
              <RefreshIcon />
            </IconButton>
          )}
        </Box>
        <Restricted include={[ROLE_BROKER, ROLE_COBROKER]}>
          <Box>
            {isLoading || riskIsLoading ? null : (
              <Button
                icon={AutorenewIcon}
                size="xsmall"
                variant="outlined"
                color="primary"
                text={utils.string.t('app.reQuote')}
                onClick={handleReQuoteRisk}
              />
            )}
            {showCoverageComparison ? (
              <Button
                icon={CompareIcon}
                size="xsmall"
                variant="outlined"
                color="primary"
                text={utils.string.t('app.coverageComparison')}
                onClick={() => handleOpenCoverageComparison()}
                style={{ marginLeft: 5 }}
              />
            ) : null}
          </Box>
        </Restricted>
      </Box>
      <FormGrid container spacing={2}>
        {isLoading || riskIsLoading ? (
          <FormGrid item xs={12} sm={6} md={4} lg={3}>
            <QuoteCardSkeleton />
          </FormGrid>
        ) : (
          quotes?.map((quote, index) => {
            const cardKey = `${index}${quote?.id}${quote?.facilityId}`;

            const quoteIssues = quote?.issues || [];
            const hasIssues = issuesData.hasIssues || quote?.issues?.length;

            const quoteIssueData = { ...issuesData, quoteIssues, hasIssues };

            return (
              <FormGrid item key={cardKey} xs={12} sm={6} md={4} lg={3}>
                <QuoteCard
                  quote={quote}
                  riskStatus={riskStatus}
                  parties={parties}
                  issuesData={quoteIssueData}
                  handlePatchRiskQuote={handlePatchRiskQuote}
                  handleDeclineRiskQuote={handleDeclineRiskQuote}
                  handleAcceptRiskQuote={handleAcceptRiskQuote}
                  handleBindRiskQuote={handleBindRiskQuote}
                  handleDownloadQuote={handleDownloadQuote}
                  handleRiskRefresh={handleRiskRefresh}
                  handleRequestToBind={handleRequestToBind}
                  handlePreBind={handlePreBind}
                  handleRequestDismissIssues={handleRequestDismissIssues}
                />
              </FormGrid>
            );
          })
        )}
      </FormGrid>
    </>
  );
};

export default RiskQuotesView;
