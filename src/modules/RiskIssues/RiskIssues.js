import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// app
import { RiskIssuesView } from './RiskIssues.view';
import { updateIssue } from 'stores';

export default function RiskIssues({
  riskIssues,
  quoteIssues,
  insuredSanctionsCheckResult,
  reInsuredSanctionsCheckResult,
  canCurrentUserDismissIssues,
  handleRiskRefresh,
  quoteId,
}) {
  const [quoteIssuesState, setQuoteIssuesState] = useState(quoteIssues);
  const [isWaiting, setIsWaiting] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const allIssuedPassed = quoteIssuesState?.filter((issue) => issue.issueStatus === 'PASSED').length;

    allIssuedPassed === quoteIssuesState?.length && quoteIssuesState?.length > 0 && handleRiskRefresh();
  }, [quoteIssuesState, handleRiskRefresh]);

  const handleUpdateIssue = async (id, status) => {
    if (quoteId) {
      setIsWaiting(true);
      const result = await dispatch(updateIssue(id, status, quoteId));
      const updatedIssues = quoteIssuesState.map((issue) => (issue.id === result?.id ? result : issue));
      setQuoteIssuesState(updatedIssues);
      setIsWaiting(false);
    }
  };

  return (
    <RiskIssuesView
      riskIssues={riskIssues}
      quoteIssues={quoteIssuesState}
      insuredSanctionsCheckResult={insuredSanctionsCheckResult}
      reInsuredSanctionsCheckResult={reInsuredSanctionsCheckResult}
      handleUpdateIssue={handleUpdateIssue}
      canCurrentUserDismissIssues={canCurrentUserDismissIssues}
      isWaiting={isWaiting}
    />
  );
}
