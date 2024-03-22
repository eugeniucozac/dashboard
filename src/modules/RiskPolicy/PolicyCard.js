import { useState, useEffect, useRef } from 'react';
import get from 'lodash/get';

// app
import styles from './PolicyCard.style';
import { Avatar, Button, FormGrid } from 'components';
import * as utils from 'utils';

// mui
import { makeStyles, withStyles, Box, Card, CardHeader, CardActions, CardContent, Typography, LinearProgress } from '@material-ui/core';
import HowToVoteIcon from '@material-ui/icons/HowToVote';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import Skeleton from '@material-ui/lab/Skeleton';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: 'auto',
    width: '100%',
    minHeight: 262,
  },

  title: {
    color: 'black!important',
  },
  value: {
    color: 'black!important',
    fontWeight: 600,
    margin: 0,
  },
}));

const QuoteLine = ({ title, value, titleVariant = 'body2' }) => {
  const classes = useStyles();

  return (
    <>
      <FormGrid item xs={4}>
        <Typography variant="body2" className={classes.title}>
          {title}
        </Typography>
      </FormGrid>
      <FormGrid item xs={8}>
        <Typography variant={titleVariant} className={classes.value}>
          {value}
        </Typography>
      </FormGrid>
    </>
  );
};

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 20,
  },
  colorPrimary: {
    backgroundColor: theme.palette.success.main,
  },
  bar: {
    backgroundColor: theme.palette.success.dark,
  },
}))(LinearProgress);

const PolicyCard = ({ policy, riskInsuredId, parties, handleDownloadQuote }) => {
  const classes = makeStyles(styles, { name: 'PolicyCard' })();

  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  const [isLoading] = useState(false);

  const carrierName = get(policy, 'carrierName');
  const quotePremium = policy?.premium;
  const hasTemplate = policy?.hasTemplate;
  const policyResponse = policy?.response;
  const policyNumber =
    policy.facility.brokerCode && policy.declarationNumber ? `${policy.facility.brokerCode}${policy.declarationNumber}` : '';

  const premiumValue = `${policy?.currency ? utils.string.t(policy.currency) : ''} ${utils.string.t('format.number', {
    value: { number: quotePremium, default: '-' },
  })}`;

  const today = utils.date.today();
  const effectivePastPercent = utils.date.datePercent(policyResponse.effectiveFrom, policyResponse.effectiveTo, today);

  useEffect(() => {
    setHeight(ref.current.clientHeight);
  }, []);

  const subheader = <Box style={{ display: 'flex', alignItems: 'center' }}>{carrierName}</Box>;
  return isLoading ? (
    <PolicyCardSkeleton height={height} />
  ) : (
    <>
      <Card ref={ref} classes={{ root: classes.card }}>
        <CardHeader
          avatar={<Avatar icon={HowToVoteIcon} size={32} border />}
          title={
            <Typography variant="h3" className={classes.cardFacility} style={{ textAlign: 'left' }}>
              {`${policyNumber}`}
            </Typography>
          }
          subheader={subheader}
        />
        <CardContent classes={{ root: classes.cardContent }}>
          <Box pb={2}>
            <BorderLinearProgress variant="determinate" value={effectivePastPercent} />
          </Box>
          <Box p={2}>
            <FormGrid container spacing={1} alignItems="center">
              <QuoteLine title={utils.string.t('app.premium')} value={premiumValue} titleVariant="h5" />
              <QuoteLine
                title={utils.string.t('risks.effectiveFrom')}
                value={utils.string.t('format.date', {
                  value: { date: policyResponse.effectiveFrom, format: 'll', default: '-' },
                })}
              />

              <QuoteLine
                title={utils.string.t('risks.effectiveTo')}
                value={utils.string.t('format.date', {
                  value: { date: policyResponse.effectiveTo, format: 'll', default: '-' },
                })}
              />
            </FormGrid>
          </Box>
        </CardContent>

        {hasTemplate ? (
          <CardActions disableSpacing classes={{ root: classes.cardActions }}>
            <Box px={1} pb={0.5} ml="auto" display="flex" flexWrap="wrap" justifyContent="flex-end">
              <Box mr={1} mb={1}>
                <Button
                  size="xsmall"
                  icon={PictureAsPdfIcon}
                  color="secondary"
                  text={utils.string.t('risks.downloadPolicy')}
                  nestedClasses={{ icon: classes.icon }}
                  onClick={handleDownloadQuote({
                    quote: policy,
                    insureds: utils.risk.getPartyValues('insureds', parties, riskInsuredId),
                  })}
                />
              </Box>
            </Box>
          </CardActions>
        ) : null}
      </Card>
    </>
  );
};

export const PolicyCardSkeleton = ({ height = 'auto' }) => {
  const classes = useStyles();

  return (
    <Card data-testid="skeleton-policy-card" classes={{ root: classes.root }} style={{ height }}>
      <CardHeader
        avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
        title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
        subheader={<Skeleton animation="wave" height={10} width="40%" />}
      />

      <CardContent>
        <>
          <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={20} />
        </>
      </CardContent>
      <CardContent classes={{ root: classes.cardContentCommission }}>
        <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={20} style={{ marginBottom: 6 }} />
        <Skeleton animation="wave" height={20} />
      </CardContent>
    </Card>
  );
};

export default PolicyCard;
