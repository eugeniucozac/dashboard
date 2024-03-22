import React, { useState } from 'react';

// app
import { Button, Link, Chip } from 'components';
import styles from './RiskIssues.styles';
import * as utils from 'utils';
import * as constants from 'consts';
// mui
import { makeStyles, Box, Typography, Card, CardHeader, CardContent, CardActions } from '@material-ui/core';
import LaunchIcon from '@material-ui/icons/Launch';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

const IssueCard = ({
  issue,
  canCurrentUserDismissIssues,
  insuredSanctionsCheckResult,
  reInsuredSanctionsCheckResult,
  handleUpdateIssue,
  isWaiting,
}) => {
  const [clicked, setClicked] = useState(false);
  const classes = makeStyles(styles, { name: 'RiskIssues' })();
  const issueStatus = issue?.issueStatus;

  const hasInsuredSanctionsCheckResult = insuredSanctionsCheckResult?.id === issue?.entityId;
  const hasReInsuredSanctionsCheckResult = reInsuredSanctionsCheckResult?.id === issue?.entityId;
  const chipNestedClasses = { root: classes.issueTypeChip };

  const handleClickDismiss = () => {
    setClicked(true);
    handleUpdateIssue(issue.id, constants.RISK_ISSUE_STATUS_PASSED);
  };

  return (
    <Box data-testid={`risk-data-issue`}>
      {hasInsuredSanctionsCheckResult && (
        <Box mb={2}>
          <Chip label={utils.string.t('app.insured')} nestedClasses={chipNestedClasses} />
          <Typography className={classes.sectionMessage}>{insuredSanctionsCheckResult.message}</Typography>
          {insuredSanctionsCheckResult.url && (
            <Link
              target="_blank"
              rel="noopener"
              nestedClasses={{
                link: classes.linkRoot,
                icon: classes.linkIcon,
              }}
              icon={LaunchIcon}
              iconPosition="right"
              href={insuredSanctionsCheckResult.url}
              color="primary"
              text={utils.string.t('risks.issueResolveLink')}
            />
          )}
        </Box>
      )}
      {hasReInsuredSanctionsCheckResult && (
        <Box mb={2}>
          <Chip label={utils.string.t('app.reInsured')} nestedClasses={chipNestedClasses} />
          <Typography className={classes.sectionMessage}>{reInsuredSanctionsCheckResult.message}</Typography>
          {reInsuredSanctionsCheckResult.url && (
            <Link
              target="_blank"
              rel="noopener"
              nestedClasses={{
                link: classes.linkRoot,
                icon: classes.linkIcon,
              }}
              icon={LaunchIcon}
              iconPosition="right"
              href={reInsuredSanctionsCheckResult.url}
              color="primary"
              text={utils.string.t('risks.issueResolveLink')}
            />
          )}
        </Box>
      )}

      {issue.messages.map((message) => {
        const createdAt = utils.string.t('format.date', {
          value: { date: message.createdAt, format: 'lll' },
        });

        return (
          <Box mb={2} key={message.createdAt}>
            <Card classes={{ root: classes.card }}>
              {(message?.userName || message?.createdAt) && (
                <CardHeader title={message.userName} subheader={<span title={` ${createdAt}`}>{createdAt}</span>} />
              )}
              <CardContent classes={{ root: classes.cardContent }}>
                <Typography variant="body2" className={classes.message}>
                  {message.message}
                </Typography>
              </CardContent>

              {issue.issueType === constants.RISK_ISSUE_SANCTIONS_BLOCKED ? null : (
                <>
                  {canCurrentUserDismissIssues && issueStatus === constants.RISK_ISSUE_WAITING ? (
                    <CardActions disableSpacing>
                      <Box mb={0.5} mt={2} display="flex" flex={1} justifyContent="right">
                        <Button
                          icon={HighlightOffIcon}
                          size="xsmall"
                          color="primary"
                          text={utils.string.t('risks.dismissIssue')}
                          onClick={handleClickDismiss}
                          disabled={clicked || isWaiting}
                        />
                      </Box>
                    </CardActions>
                  ) : null}
                </>
              )}
            </Card>
          </Box>
        );
      })}
    </Box>
  );
};

export default IssueCard;
