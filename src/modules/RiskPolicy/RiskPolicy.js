import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// app
import RiskPolicyView from './RiskPolicy.view';
import { getRiskQuotes, selectRiskQuotes, selectRiskQuotesLoading, showModal, downloadRiskQuote, getRiskDetails } from 'stores';
import { RISK_QUOTE_STATUS_BOUND } from 'consts';
import * as utils from 'utils';

const RiskPolicy = ({ risk, riskIsLoading }) => {
  const dispatch = useDispatch();
  const quotes = useSelector(selectRiskQuotes);
  const isLoading = useSelector(selectRiskQuotesLoading);
  const hasBoundQuote =
    utils.generic.isValidArray(quotes, true) && quotes.some((q) => q.response && q.response.responseStatus === RISK_QUOTE_STATUS_BOUND);

  const policy = quotes.find((q) => q.response && q.response.responseStatus === RISK_QUOTE_STATUS_BOUND) || null;

  useEffect(() => {
    dispatch(getRiskQuotes(risk?.id));
  }, [dispatch, risk?.id]);

  const handleRiskRefresh = () => {
    dispatch(getRiskDetails(risk?.id, true));
    dispatch(getRiskQuotes(risk?.id));
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
  const handlePreBind = (quote, isPreBind) => (event) => {
    executePreBind(quote, isPreBind, false);
  };

  const handleDownloadQuote = (id) => (event) => {
    dispatch(downloadRiskQuote(id));
  };

  const handleQuoteRefresh = () => {
    dispatch(getRiskQuotes(risk?.id));
    dispatch(getRiskDetails(risk?.id, true));
  };

  const handleAddEndorsement = () => {
    const riskId = risk.id;
    const riskData = risk.risk;
    const riskType = risk.riskType;
    const modalTitle = `${utils.string.t('app.addEndorsement')} - ${risk?.insured?.name}`;

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
            addEndorsement: true,
          },
        },
      })
    );
  };

  return (
    <RiskPolicyView
      isLoading={isLoading}
      riskIsLoading={riskIsLoading}
      policy={policy}
      hasBoundQuote={hasBoundQuote}
      riskStatus={risk?.riskStatus}
      riskInsuredId={risk?.insuredId}
      handleDownloadQuote={handleDownloadQuote}
      handleRiskRefresh={handleRiskRefresh}
      handleQuoteRefresh={handleQuoteRefresh}
      handlePreBind={handlePreBind}
      handleAddEndorsement={handleAddEndorsement}
    />
  );
};

export default RiskPolicy;
