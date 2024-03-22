import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import get from 'lodash/get';

// app
import { selectUser } from 'stores';

import { FormGrid, Tooltip } from 'components';
import SummaryLine from './SummaryLine';

import * as utils from 'utils';
// mui
import { Box, Typography, CircularProgress } from '@material-ui/core';
import InfoIcon from '@material-ui/icons/Info';

const RiskSummaryQuote = ({ allStepsCompleted, isFormValid, classes, riskValues, definitions, productType }) => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const user = useSelector(selectUser);
  const endpoint = useSelector((state) => get(state, 'config.vars.endpoint'));
  const { auth } = user;

  useEffect(() => {
    let isSubscribed = true;

    isSubscribed && setIsLoading(true);
    const fetchData = async () => {
      try {
        const riskData = {
          ...utils.risk.parsedValues(utils.risk.filterConditionalValues(riskValues, definitions), definitions),
          riskType: productType,
        };
        const response = await utils.api.post({
          token: auth.accessToken,
          endpoint: endpoint.auth,
          path: `api/v1/risks/summary-quote`,
          data: riskData,
        });
        const data = await utils.api.handleResponse(response);

        if (isSubscribed) {
          setQuotes(data);
          setIsLoading(false);
        }
      } catch (err) {
        setError(true);
        const errorParams = {
          file: 'RiskSummaryQuote.js',
          message: 'API fetch error',
        };

        utils.api.handleError(err, errorParams);
      }
    };

    if (allStepsCompleted && isFormValid && utils.generic.isValidObject(riskValues) && !isEmpty(riskValues)) {
      fetchData();
    }

    return () => (isSubscribed = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allStepsCompleted, JSON.stringify(riskValues), productType, isFormValid]);

  return (
    <>
      {allStepsCompleted && isFormValid && !error ? (
        <FormGrid item xs={12} sm={12} style={{ justifyContent: 'center' }}>
          <FormGrid container spacing={3} justifyContent="center">
            {isLoading ? (
              <FormGrid item xs={6} sm={4} style={{ justifyContent: 'center' }} data-testid="loading">
                <FormGrid container spacing={3} justifyContent="center">
                  <FormGrid item xs={12}>
                    <Box className={classes.card}>
                      <Box p={2} className={classes.cardPolicyTitle} style={{ textAlign: 'center' }}></Box>
                      <Box p={2} className={classes.policyBox} style={{ textAlign: 'center' }}>
                        <CircularProgress />
                      </Box>
                    </Box>
                  </FormGrid>
                </FormGrid>
              </FormGrid>
            ) : (
              quotes.map((quote, index) => (
                <FormGrid
                  key={`quote-${index}`}
                  item
                  xs={6}
                  sm={4}
                  style={{ justifyContent: 'center' }}
                  data-testid={`summary-quote-${index}`}
                >
                  <FormGrid container spacing={3} justifyContent="center">
                    <FormGrid item xs={12}>
                      <Box className={classes.card}>
                        <Box
                          p={2}
                          className={classes.cardPolicyTitle}
                          style={{ textAlign: 'center', backgroundColor: quote?.hasReferrals ? 'rgb(237, 172, 0)' : 'rgb(9, 169, 237)' }}
                        >
                          <Typography variant="h3" className={classes.cardPolicyTitleHeading} style={{ textAlign: 'center' }}>
                            {quote?.carrierName ? quote.carrierName : null}
                          </Typography>
                        </Box>
                        <Box pt={2} className={classes.policyBox}>
                          <FormGrid container spacing={1} justifyContent="center">
                            {quote?.premium && quote?.quoted && !quote?.hasReferrals ? (
                              <FormGrid item xs={12}>
                                <Typography variant="h4" align="center" style={{ marginBottom: 0 }}>
                                  {utils.string.t('risks.grossPremium')}
                                </Typography>
                              </FormGrid>
                            ) : null}
                            <FormGrid item xs={12} align="center">
                              <Typography variant="h1" align="center" className={classes.premium}>
                                {quote?.hasReferrals || quote?.quoted === false ? (
                                  <>
                                    <Tooltip title="Submit the risk to view the referral reason(s)">
                                      <InfoIcon style={{ color: 'rgb(237, 172, 0)', fontSize: 24, marginRight: 10 }} />
                                    </Tooltip>
                                    {utils.string.t('risks.referral')}
                                  </>
                                ) : (
                                  <>
                                    {quote?.currency ? quote.currency : null}
                                    {quote?.premium ? utils.number.formatNumber(quote.premium) : null}
                                  </>
                                )}
                              </Typography>
                            </FormGrid>
                            {quote?.summaryValues?.length > 0 ? (
                              <>
                                <FormGrid item xs={12} align="center">
                                  <Box py={2} className={classes.quoteValuesBox}>
                                    <FormGrid container spacing={1} justifyContent="center">
                                      {quote?.summaryValues.map((summary) => (
                                        <SummaryLine key={summary.title} summary={summary} classes={classes} />
                                      ))}
                                    </FormGrid>
                                  </Box>
                                </FormGrid>
                              </>
                            ) : null}
                          </FormGrid>
                        </Box>
                      </Box>
                    </FormGrid>
                  </FormGrid>
                </FormGrid>
              ))
            )}
          </FormGrid>
        </FormGrid>
      ) : null}
    </>
  );
};

export default RiskSummaryQuote;
