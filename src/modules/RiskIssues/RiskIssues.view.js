// app
import IssueCard from './IssueCard';
import styles from './RiskIssues.styles';
import * as utils from 'utils';
// mui
import { makeStyles, Box, Typography } from '@material-ui/core';

export function RiskIssuesView({
  riskIssues,
  quoteIssues,
  insuredSanctionsCheckResult,
  reInsuredSanctionsCheckResult,
  handleUpdateIssue,
  canCurrentUserDismissIssues,
  isWaiting,
}) {
  const classes = makeStyles(styles, { name: 'RiskIssues' })();
  const totalIssues = riskIssues?.length + quoteIssues?.length;

  return (
    <>
      <Typography variant="h3">{utils.string.t('risks.issues')}</Typography>
      {(riskIssues || quoteIssues) && totalIssues > 0 && (
        <Box mb={2} display="flex" alignItems="center">
          <Typography className={classes.foundIssues}>
            <span className={classes.numIssues}>{totalIssues}</span> {utils.string.t('risks.issuesFound', { count: totalIssues })}
          </Typography>
        </Box>
      )}
      {riskIssues?.map((issue) => {
        return (
          <IssueCard
            key={issue.id}
            issue={issue}
            canCurrentUserDismissIssues={canCurrentUserDismissIssues}
            insuredSanctionsCheckResult={insuredSanctionsCheckResult}
            reInsuredSanctionsCheckResult={reInsuredSanctionsCheckResult}
            handleUpdateIssue={handleUpdateIssue}
          />
        );
      })}

      {quoteIssues?.map((issue) => {
        return (
          <IssueCard
            key={issue.id}
            issue={issue}
            canCurrentUserDismissIssues={canCurrentUserDismissIssues}
            handleUpdateIssue={handleUpdateIssue}
            isWaiting={isWaiting}
          />
        );
      })}
    </>
  );
}
