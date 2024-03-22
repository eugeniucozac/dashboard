import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// app
import RiskQuotesView from './RiskQuotes.view';
import { CoverageComparison } from 'modules/QuoteBind';
import {
  getRiskQuotes,
  getCoverages,
  selectRiskQuotes,
  selectRiskQuotesLoading,
  showModal,
  acceptRiskQuote,
  declineRiskQuote,
  downloadRiskQuote,
  getRiskDetails,
  selectPartyOptions,
  selectRefDataCountriesIso2,
  requestToBind,
  requestDismissIssues,
  postRiskQuoteResponse,
} from 'stores';
import { RISK_QUOTE_STATUS_BOUND, RISK_QUOTE_STATUS_QUOTING } from 'consts';
import * as utils from 'utils';
import { useInterval } from 'hooks';

const RiskQuotes = ({ risk, riskStatus, coverageDefinition, riskIsLoading }) => {
  const [isCoverageComparisonOpen, setIsCoverageComparisonOpen] = useState(false);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);

  const dispatch = useDispatch();
  const quotes = useSelector(selectRiskQuotes);
  const isLoading = useSelector(selectRiskQuotesLoading);
  const partyOptions = useSelector(selectPartyOptions);
  const refDataCountries = useSelector(selectRefDataCountriesIso2);
  const hasBoundQuote =
    utils.generic.isValidArray(quotes, true) && quotes.some((q) => q.response && q.response.responseStatus === RISK_QUOTE_STATUS_BOUND);

  const hasPendingQuote = utils.generic.isValidArray(quotes, true) && quotes.some((q) => q.status === RISK_QUOTE_STATUS_QUOTING);
  const delay = hasPendingQuote ? 2000 : null;

  const insuredSanctionsCheckResult = risk?.insured?.sanctionsCheckResult || {};
  const reInsuredSanctionsCheckResult = risk?.reinsured?.sanctionsCheckResult || {};
  const issues = risk?.issues || [];
  const hasIssues = issues?.length || false;
  const showCoverageComparison = coverageDefinition?.length > 0;

  const issuesData = {
    insuredSanctionsCheckResult,
    reInsuredSanctionsCheckResult,
    issues,
    hasIssues,
  };

  useEffect(() => {
    dispatch(getRiskQuotes(risk?.id));
  }, [dispatch, risk?.id]);

  useEffect(() => {
    !hasPendingQuote && handleQuoteLoading(false);
  }, [hasPendingQuote]);

  useInterval(() => {
    dispatch(getRiskQuotes(risk?.id, false));
  }, delay);

  useEffect(() => {
    if (!isQuoteLoading && !hasPendingQuote && riskStatus === RISK_QUOTE_STATUS_QUOTING.toLowerCase()) {
      dispatch(getRiskDetails(risk?.id, true, false));
    }
  }, [isQuoteLoading, riskStatus, hasPendingQuote, dispatch, risk?.id]);

  const handlePatchRiskQuote = ({ quote }) => {
    dispatch(
      showModal({
        component: 'EDIT_RISK_QUOTE',
        props: {
          title: 'risks.updateQuote',
          fullWidth: true,
          maxWidth: 'xs',
          componentProps: {
            quote,
          },
        },
      })
    );
  };

  const handleBindRiskQuote = (quote) => {
    const bindInfo = {
      quoteId: quote?.id,
      effectiveFrom: risk?.inceptionDate,
      effectiveTo: risk?.expiryDate,
      riskId: risk?.id,
      responseStatus: RISK_QUOTE_STATUS_BOUND,
    };
    dispatch(postRiskQuoteResponse(bindInfo));
  };

  const executePreBind = (quote, isPreBind, isReqBind) => {
    const product = risk.riskType;
    const modalTitle = isPreBind ? `${utils.string.t('risks.preBind')}` : `${utils.string.t('risks.postBind')}`;

    dispatch(
      showModal({
        component: 'PRE_BIND_QUOTE',
        props: {
          title: modalTitle,
          fullWidth: true,
          disableBackdropClick: true,
          enableFullScreen: true,
          maxWidth: 'lg',
          componentProps: {
            product: product,
            risk,
            quote,
            isPreBind,
            isReqBind,
          },
        },
      })
    );
  };

  const handlePreBind = (quote, isPreBind) => {
    executePreBind(quote, isPreBind, false);
  };
  const handleRequestToBind = (quote, displayPreBind) => {
    if (displayPreBind) {
      executePreBind(quote, true, true);
    } else {
      dispatch(requestToBind(quote));
    }
  };

  const handleAcceptRiskQuote = (id) => {
    dispatch(acceptRiskQuote(id));
  };

  const handleDownloadQuote = (id) => {
    dispatch(downloadRiskQuote(id));
  };

  const handleDeclineRiskQuote = (id) => {
    dispatch(
      showModal({
        component: 'CONFIRM_DECLINE_RISK',
        props: {
          modalProps: { fullWidth: true, maxWidth: 'md' },
          title: 'risks.declineQuote',
          maxWidth: 'xs',
          componentProps: {
            submitHandler: () => {
              dispatch(declineRiskQuote(id));
            },
          },
        },
      })
    );
  };

  const handleQuoteRefresh = async () => {
    handleQuoteLoading(true);
    dispatch(getRiskDetails(risk?.id, true));
    await dispatch(getRiskQuotes(risk?.id));
    handleQuoteLoading(false);
  };

  const handleRequestDismissIssues = (quote) => {
    dispatch(requestDismissIssues(quote));
  };

  const handleReQuoteRisk = () => {
    const riskId = risk.id;
    const riskData = risk.risk;
    const riskType = risk.riskType;
    const modalTitle = `${utils.string.t('app.reQuote')} - ${risk?.insured?.name}`;

    dispatch(
      showModal({
        component: 'ADD_EDIT_QUOTE_BIND',
        props: {
          title: modalTitle,
          fullWidth: true,
          disableBackdropClick: true,
          enableFullScreen: true,
          maxWidth: 'xl',
          componentProps: {
            product: { value: riskType },
            riskData,
            riskId,
          },
        },
      })
    );
  };

  const handleOpenCoverageComparison = async () => {
    setIsCoverageComparisonOpen((prevState) => !prevState);
  };
  const handleQuoteLoading = (isLoading) => {
    setIsQuoteLoading(isLoading);
  };

  const reFetchData = async (id) => {
    handleQuoteLoading(true);
    dispatch(getRiskQuotes(id, false));
    await dispatch(getCoverages(id));
  };

  return (
    <>
      <RiskQuotesView
        isLoading={isLoading}
        riskIsLoading={riskIsLoading}
        quotes={quotes}
        hasBoundQuote={hasBoundQuote}
        riskStatus={risk?.riskStatus}
        riskInsuredId={risk?.insuredId}
        issuesData={issuesData}
        parties={{ ...partyOptions, countries: refDataCountries }}
        handlePatchRiskQuote={handlePatchRiskQuote}
        handleDeclineRiskQuote={handleDeclineRiskQuote}
        handleAcceptRiskQuote={handleAcceptRiskQuote}
        handleBindRiskQuote={handleBindRiskQuote}
        handleDownloadQuote={handleDownloadQuote}
        handleRiskRefresh={handleQuoteRefresh}
        handleRequestToBind={handleRequestToBind}
        handleReQuoteRisk={handleReQuoteRisk}
        handleQuoteRefresh={handleQuoteRefresh}
        handlePreBind={handlePreBind}
        handleRequestDismissIssues={handleRequestDismissIssues}
        handleOpenCoverageComparison={handleOpenCoverageComparison}
        showCoverageComparison={showCoverageComparison}
        isQuoteLoading={isQuoteLoading || hasPendingQuote}
      />
      {risk?.id && risk.riskType ? (
        <CoverageComparison
          open={isCoverageComparisonOpen}
          riskId={risk.id}
          riskType={risk.riskType}
          handleOpenCoverageComparison={handleOpenCoverageComparison}
          handleQuoteLoading={handleQuoteLoading}
          reFetchData={reFetchData}
          coverageDefinitionFields={coverageDefinition}
        />
      ) : null}
    </>
  );
};

export default RiskQuotes;
