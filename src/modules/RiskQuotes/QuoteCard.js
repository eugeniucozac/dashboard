import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import get from 'lodash/get';
import isNumber from 'lodash/isNumber';

// app
import styles from './QuoteCard.style';
import { RiskIssues } from 'modules';
import { Avatar, Button, FormGrid, Translate, Restricted, Status } from 'components';
import { putQuoteRates } from 'stores';

import { useTheme } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import { makeStyles, Box, Card, CardHeader, CardActions, CardContent, Drawer, Typography, Popover } from '@material-ui/core';
import CommissionSlider from './CommissionSlider';

import HowToVoteIcon from '@material-ui/icons/HowToVote';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import EditIcon from '@material-ui/icons/Edit';
import CheckIcon from '@material-ui/icons/Check';
import BlockIcon from '@material-ui/icons/Block';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import ForwardIcon from '@material-ui/icons/Forward';

import {
  QUOTE_PREMIUM_PRECISION,
  RISK_QUOTE_STATUS_DRAFT,
  RISK_QUOTE_STATUS_QUOTED,
  RISK_QUOTE_STATUS_REFERRED,
  RISK_QUOTE_STATUS_BLOCKED,
  RISK_QUOTE_STATUS_REJECTED,
  ROLE_BROKER,
  ROLE_UNDERWRITER,
  ROLE_COBROKER,
} from 'consts';
import * as utils from 'utils';

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
  },
}));

const QuoteLine = ({ title, value }) => {
  const classes = useStyles();

  return (
    <>
      <FormGrid item xs={5}>
        <Typography variant="body2" className={classes.title}>
          {title}
        </Typography>
      </FormGrid>
      <FormGrid item xs={7}>
        <Typography variant="body2" className={classes.value}>
          {value}
        </Typography>
      </FormGrid>
    </>
  );
};

const QuoteCard = ({
  quote,
  riskInsuredId,
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
  handlePreBind,
  handleRequestDismissIssues,
}) => {
  const classes = makeStyles(styles, { name: 'QuoteCard' })();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [height, setHeight] = useState(0);
  const ref = useRef(null);

  const [quoteState, setQuoteState] = useState(quote);
  const [isLoading, setIsLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [commissionIsChanged, setCommissionIsChanged] = useState(false);
  const [commission, setCommission] = useState({
    commissionRatioClient: quoteState?.commission?.clientCommissionRatio,
    netDownClientCommission: quoteState?.commission?.clientCommissionRate,
  });
  const [uuid, setUuid] = useState(new Date().getTime());
  const [quotePremium, setQuotePremium] = useState(quoteState?.premium);

  const createdAt = utils.string.t('format.date', {
    value: { date: quoteState.createdAt, format: 'lll' },
  });
  const carrierName = get(quoteState, 'carrierName');
  const quoteStatus = quoteState.response ? quoteState.response.responseStatus : quoteState.status;
  let quoteStatusString = quoteStatus ? utils.string.t(`QBstatus.${quoteStatus.toLowerCase()}`) : '-';
  quoteStatusString = quoteStatusString === 'Quoted' ? utils.string.t('status.quote') : quoteStatusString;
  const isQuoteBlocked = quoteStatus === RISK_QUOTE_STATUS_BLOCKED ? true : false;
  const isBlocked = riskStatus === RISK_QUOTE_STATUS_BLOCKED || quoteStatus === RISK_QUOTE_STATUS_BLOCKED ? true : false;
  const isExpired = quoteState.validUntil && utils.date.isBefore(quoteState.validUntil);
  const isQuoted = quoteStatus === RISK_QUOTE_STATUS_QUOTED;
  const isDraftOrReferred = [RISK_QUOTE_STATUS_DRAFT, RISK_QUOTE_STATUS_REFERRED].includes(quoteStatus);
  const isReferred = quoteStatus === RISK_QUOTE_STATUS_REFERRED;
  const isRejected = quoteStatus === RISK_QUOTE_STATUS_REJECTED;
  const hasTemplate = quoteState.hasTemplate;

  const defaultClientCommissionRate = quoteState?.facility?.commissionRates?.clientCommissionRate;
  const defaultBrokerCommissionRate = quoteState?.facility?.commissionRates?.brokerCommissionRate;

  const clientCommissionRatio = quoteState?.commission?.clientCommissionRatio || defaultClientCommissionRate;
  const clientCommissionRate = quoteState?.commission?.clientCommissionRate || defaultClientCommissionRate;

  const isQuoteCommission = isNumber(clientCommissionRate) && isNumber(clientCommissionRatio);
  const isFacilityCommission = isNumber(defaultClientCommissionRate) && isNumber(defaultBrokerCommissionRate);

  const grossPremium = quoteState?.grossPremium;

  const premiumValue = `${quoteState?.currency ? utils.string.t(quoteState.currency) : ''} ${utils.string.t('format.number', {
    value: { number: quotePremium, default: '-' },
  })}`;
  const canCurrentUserBind = quoteState?.canCurrentUserBind;
  const requestedToBind = quoteState?.requestedToBind;
  const displayPreBind = quoteState?.facility?.preBind;
  const canCurrentUserDismissIssues = quoteState?.canCurrentUserDismissIssues;
  const requestedToDismissIssues = quoteState?.requestedToDismissIssues;

  useEffect(() => {
    setHeight(ref.current.clientHeight);
  }, []);

  useEffect(() => {
    setQuoteState(quote);
  }, [quote]);

  const handleUpdateCommission = async () => {
    setIsLoading(true);
    const rates = {
      clientCommissionRatio: commission.commissionRatioClient,
      clientCommissionRate: commission.netDownClientCommission,
      scale: QUOTE_PREMIUM_PRECISION,
    };
    const result = await dispatch(putQuoteRates(rates, quoteState.id));
    if (result) {
      setQuoteState(result);
    }
    setIsLoading(false);
  };

  const handleCommissionChange = (newCommission, isChanged) => {
    setCommissionIsChanged(isChanged);
    setCommission(newCommission);
    const commissionRatioClient = isNumber(newCommission?.commissionRatioClient)
      ? newCommission?.commissionRatioClient
      : defaultClientCommissionRate;
    const commissionRate =
      commissionRatioClient === newCommission.netDownClientCommission
        ? 1
        : (1 - commissionRatioClient * 0.01) / (1 - newCommission.netDownClientCommission * 0.01);

    const newPremium = parseFloat((grossPremium * commissionRate).toFixed(QUOTE_PREMIUM_PRECISION));
    setQuotePremium(Math.round(newPremium));
  };

  const resetCommission = () => {
    setUuid(new Date().getTime());
    setCommissionIsChanged(false);
    setQuotePremium(quoteState.premium);
  };
  const handleIssuesPopoverClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (value) => {
    setDrawerOpen(value);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const statusBackgroundColor = theme.palette.status[quoteStatus?.toLowerCase()]
    ? theme.palette.status[quoteStatus.toLowerCase()]
    : theme.palette.status.default;
  const statusColor = utils.color.contrast(statusBackgroundColor, 0.6);

  const subheader = (
    <>
      {requestedToBind && isQuoted ? (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Status
            size="xs"
            text={<Translate label={utils.string.t('risks.requestToBindStatus')} />}
            status="quoted"
            data-testid="quote-status"
            style={{
              backgroundColor: statusBackgroundColor,
              color: statusColor,
            }}
          />
        </Box>
      ) : (
        <Box style={{ display: 'flex', alignItems: 'center' }}>
          <Status
            size="xs"
            text={<Translate label={`${quoteStatusString}`} />}
            status={quoteStatus.toLowerCase()}
            data-testid="quote-status"
            style={{
              backgroundColor: statusBackgroundColor,
              color: statusColor,
            }}
          />
        </Box>
      )}
    </>
  );
  return isLoading ? (
    <QuoteCardSkeleton height={height} />
  ) : (
    <>
      {isBlocked || isRejected ? (
        <>
          <Drawer anchor="right" open={drawerOpen} style={{ zIndex: 10000 }} onClose={() => toggleDrawer(false)}>
            <Box p={2}>
              <Box value="issues" data-testid="tab-content-issues">
                {issuesData?.hasIssues && (
                  <RiskIssues
                    riskIssues={issuesData?.issues || []}
                    quoteIssues={issuesData?.quoteIssues || []}
                    insuredSanctionsCheckResult={issuesData?.insuredSanctionsCheckResult}
                    reInsuredSanctionsCheckResult={issuesData?.reInsuredSanctionsCheckResult}
                    canCurrentUserDismissIssues={canCurrentUserDismissIssues}
                    handleRiskRefresh={handleRiskRefresh}
                    quoteId={quote?.id}
                  />
                )}
              </Box>
            </Box>
          </Drawer>
        </>
      ) : null}
      <Card ref={ref} classes={{ root: classes.card }}>
        {carrierName || createdAt ? (
          <CardHeader
            avatar={<Avatar icon={HowToVoteIcon} size={32} border />}
            title={
              <Typography variant="h3" className={classes.cardFacility} style={{ textAlign: 'left' }}>
                {carrierName}
              </Typography>
            }
            subheader={subheader}
          />
        ) : null}
        <CardContent classes={{ root: classes.cardContent }}>
          <FormGrid container spacing={1}>
            <QuoteLine
              title={isReferred ? `` : utils.string.t('risks.grossPremium')}
              value={isReferred ? utils.string.t('risks.referral') : premiumValue}
            />
            <QuoteLine
              title={utils.string.t('app.createdAt')}
              value={utils.string.t('format.date', {
                value: { date: quoteState.createdAt, format: 'lll', default: '-' },
              })}
            />

            <QuoteLine
              title={utils.string.t('app.validUntil')}
              value={utils.string.t('format.date', {
                value: { date: quoteState.validUntil, format: 'lll', default: '-' },
              })}
            />
          </FormGrid>
        </CardContent>
        {isQuoted && isQuoteCommission && isFacilityCommission ? (
          <Restricted include={[ROLE_BROKER, ROLE_COBROKER]}>
            <CardContent classes={{ root: classes.cardContentCommission }}>
              <CommissionSlider
                key={uuid}
                defaultClientCommission={defaultClientCommissionRate}
                defaultBrokerCommission={defaultBrokerCommissionRate}
                netDownClientCommission={clientCommissionRate}
                commissionRatioClient={clientCommissionRatio}
                handleChangedValues={handleCommissionChange}
                isSliderDisabled={requestedToBind}
              />
            </CardContent>
          </Restricted>
        ) : null}
        {commissionIsChanged ? (
          <CardActions disableSpacing classes={{ root: classes.cardActions }}>
            <Box px={1} pb={0.5} mb={1} display="flex" flexDirection="row" justifyContent="space-between" width="100%">
              <Box display="flex" width="100%" flexDirection="row" justifyContent="flex-end">
                <Button
                  size="xsmall"
                  icon={DoneIcon}
                  color="primary"
                  nestedClasses={{ icon: classes.icon }}
                  onClick={handleUpdateCommission}
                />
                <Button
                  size="xsmall"
                  icon={ClearIcon}
                  color="default"
                  nestedClasses={{ btn: classes.btnMarginLeft, icon: classes.icon }}
                  onClick={resetCommission}
                />
              </Box>
            </Box>
          </CardActions>
        ) : (
          <>
            {isQuoted ? (
              <CardActions disableSpacing classes={{ root: classes.cardActions }}>
                <Box px={1} pb={0.5} display="flex" flexDirection="row" justifyContent="space-between" width="100%">
                  <Box display="flex" width="100%" flexDirection="row" justifyContent="space-between">
                    {hasTemplate ? (
                      <Box mr={1} mb={1}>
                        <Button
                          size="xsmall"
                          icon={PictureAsPdfIcon}
                          color="secondary"
                          text={utils.string.t('risks.download')}
                          nestedClasses={{ icon: classes.icon }}
                          onClick={() =>
                            handleDownloadQuote({
                              quote: quoteState,
                              insureds: utils.risk.getPartyValues('insureds', parties, riskInsuredId),
                            })
                          }
                        />
                      </Box>
                    ) : null}
                  </Box>
                  <Box
                    display="flex"
                    flexDirection="row"
                    ml="auto"
                    flexWrap={canCurrentUserBind ? 'no-wrap' : 'wrap'}
                    justifyContent="flex-end"
                  >
                    {canCurrentUserBind ? (
                      <>
                        <Restricted include={[ROLE_BROKER]}>
                          <Box mr={1} mb={1}>
                            <Button
                              size="xsmall"
                              style={{ backgroundColor: 'rgb(44, 198, 171)' }}
                              icon={CheckIcon}
                              color="primary"
                              text={utils.string.t('risks.bind')}
                              nestedClasses={{ icon: classes.icon }}
                              onClick={() => (displayPreBind ? handlePreBind(quoteState, true) : handleBindRiskQuote(quoteState))}
                              disabled={isBlocked}
                            />
                          </Box>
                        </Restricted>
                        <Restricted include={[ROLE_UNDERWRITER]}>
                          <Box mr={1} mb={1}>
                            <Button
                              size="xsmall"
                              style={{ backgroundColor: 'rgb(44, 198, 171)' }}
                              icon={CheckIcon}
                              color="primary"
                              text={utils.string.t('risks.bind')}
                              nestedClasses={{ icon: classes.icon }}
                              onClick={() => handleBindRiskQuote(quoteState)}
                              disabled={isBlocked}
                            />
                          </Box>
                        </Restricted>
                      </>
                    ) : (
                      <>
                        {!requestedToBind ? (
                          <Box whiteSpace="nowrap" mr={1} mb={1}>
                            <Button
                              size="xsmall"
                              style={{ backgroundColor: 'rgb(44, 198, 171)' }}
                              icon={CheckIcon}
                              color="primary"
                              text={utils.string.t('risks.requestToBind')}
                              nestedClasses={{ icon: classes.icon }}
                              onClick={() => handleRequestToBind(quoteState, displayPreBind)}
                              disabled={isBlocked}
                            />
                          </Box>
                        ) : null}
                      </>
                    )}
                    {isExpired && <Button size="xsmall" color="default" text={utils.string.t('app.expired')} disabled />}
                    <Restricted include={[ROLE_BROKER, ROLE_UNDERWRITER]}>
                      {!isExpired && !isBlocked ? (
                        <>
                          <Box mr={1} mb={1}>
                            <Button
                              size="xsmall"
                              icon={BlockIcon}
                              color="primary"
                              danger
                              text={utils.string.t('risks.decline')}
                              nestedClasses={{ icon: classes.icon }}
                              onClick={() => handleDeclineRiskQuote(quoteState.id)}
                              disabled={isBlocked}
                            />
                          </Box>
                        </>
                      ) : null}
                    </Restricted>
                  </Box>
                </Box>
              </CardActions>
            ) : null}
            {isDraftOrReferred && !isBlocked ? (
              <Restricted include={[ROLE_BROKER, ROLE_UNDERWRITER]}>
                <CardActions disableSpacing classes={{ root: classes.cardActions }}>
                  <Box px={1} pb={0.5} ml="auto" display="flex" flexWrap="wrap" justifyContent="flex-end">
                    <Box mr={1} mb={1}>
                      <Button
                        size="xsmall"
                        icon={BlockIcon}
                        color="primary"
                        danger
                        text={utils.string.t('risks.decline')}
                        nestedClasses={{ icon: classes.icon }}
                        onClick={() => handleDeclineRiskQuote(quoteState.id)}
                        disabled={isBlocked}
                      />
                    </Box>
                    <Box mr={1} mb={1}>
                      <Button
                        size="xsmall"
                        icon={EditIcon}
                        color="secondary"
                        text={utils.string.t('risks.update')}
                        nestedClasses={{ icon: classes.icon }}
                        onClick={() =>
                          handlePatchRiskQuote({
                            quote: quoteState,
                          })
                        }
                        disabled={isBlocked}
                      />
                    </Box>
                    <Box mr={1} mb={1}>
                      <Button
                        size="xsmall"
                        icon={CheckIcon}
                        color="primary"
                        text={utils.string.t('risks.accept')}
                        nestedClasses={{ icon: classes.icon }}
                        onClick={() => handleAcceptRiskQuote(quoteState.id)}
                        disabled={isBlocked}
                      />
                    </Box>
                  </Box>
                </CardActions>
              </Restricted>
            ) : null}

            {isBlocked || isRejected ? (
              <CardActions disableSpacing classes={{ root: classes.cardActions }}>
                <Box px={1} pb={0.5} ml="auto" display="flex" flexWrap="wrap" justifyContent="flex-end">
                  {!canCurrentUserDismissIssues && !requestedToDismissIssues && isQuoteBlocked && quoteState?.id ? (
                    <Box mr={1} mb={1}>
                      <Button
                        size="xsmall"
                        style={{ backgroundColor: 'rgb(237, 172, 0)', color: 'white' }}
                        icon={ForwardIcon}
                        color="primary"
                        text={utils.string.t('risks.refer')}
                        nestedClasses={{ icon: classes.icon }}
                        onClick={() => handleRequestDismissIssues(quoteState)}
                      />
                    </Box>
                  ) : null}
                  {issuesData?.issues?.length + issuesData?.quoteIssues?.length > 0 ? (
                    <Box mr={1} mb={1}>
                      <Button
                        size="xsmall"
                        icon={InfoOutlinedIcon}
                        color="primary"
                        danger
                        text={utils.string.t('risks.issues')}
                        nestedClasses={{ icon: classes.icon }}
                        onClick={(e) =>
                          issuesData?.issues?.length + issuesData?.quoteIssues?.length > 1
                            ? toggleDrawer(true)
                            : handleIssuesPopoverClick(e)
                        }
                      />
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClosePopover}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                      >
                        <Box p={2} maxWidth={340}>
                          <Box value="issues" data-testid="tab-content-issues">
                            {issuesData?.hasIssues && (
                              <RiskIssues
                                riskIssues={issuesData?.issues}
                                quoteIssues={issuesData?.quoteIssues}
                                insuredSanctionsCheckResult={issuesData?.insuredSanctionsCheckResult}
                                reInsuredSanctionsCheckResult={issuesData?.reInsuredSanctionsCheckResult}
                                canCurrentUserDismissIssues={canCurrentUserDismissIssues}
                                handleRiskRefresh={handleRiskRefresh}
                                quoteId={quote?.id}
                              />
                            )}
                          </Box>
                        </Box>
                      </Popover>
                    </Box>
                  ) : null}
                </Box>
              </CardActions>
            ) : null}
          </>
        )}
      </Card>
    </>
  );
};

export const QuoteCardSkeleton = ({ height = 'auto' }) => {
  const classes = useStyles();

  return (
    <Card data-testid="skeleton-quote-card" classes={{ root: classes.root }} style={{ height }}>
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

export default QuoteCard;
