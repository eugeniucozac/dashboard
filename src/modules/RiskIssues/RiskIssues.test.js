import { render, screen } from 'tests';
import RiskIssues from './RiskIssues';

describe('MODULES › RiskIssues', () => {
  const riskIssues = [
    {
      entityId: '6009ad9dd86c05117694dc8b',
      id: '6009ad9d9da95f1331b3ed23',
      issueStatus: 'WAITING',
      issueType: 'SANCTIONS_BLOCKED',
      messages: [
        {
          createdAt: '2021-01-21T16:36:45.911',
          userName: 'Robert Meyer',
          message:
            'Sanctions Error: 2 of the original 2 sanction matches remain unverified. The KYC approver needs to address these for resolution.',
        },
      ],
      createdAt: '2021-01-21T16:36:45.911',
      riskId: '6009ad9b2a5c5a1833d7aacf',
    },
  ];

  const insuredSanctionsCheckResult = {
    alertId: 1922927683,
    checkResultType: 'MATCH_FOUND',
    createdAt: '2021-01-21T16:36:45.303',
    id: '6009ad9dd86c05117694dc8b',
    message: '2 of the original 2 sanction matches remain unverified. The KYC approver needs to address these for resolution.',
    partyId: '6009ad64d86c05117694dc8a',
    refreshDate: '2021-01-25T16:49:02.894',
    url: 'https://staging.bridger.lexisnexis.eu/XgApp/Alerts/Results/Index/1922927683?filterId=451463&isEft=False&ind=1&pageNumber=1&pageSize=1&ascending=False&resultCreatedDate=01%2F21%2F2021+04%3A36%3A45&datesChanged=False&countLoadComplete=True#ib',
  };

  const initialState = {
    user: {
      role: 'BROKER',
    },
  };
  describe('@render', () => {
    const handleUpdateIssue = jest.fn();
    const handleRiskRefresh = jest.fn();

    describe('layout', () => {
      it('renders without crashing', () => {
        // arrange
        const { container } = render(
          <RiskIssues
            riskIssues={riskIssues}
            insuredSanctionsCheckResult={insuredSanctionsCheckResult}
            handleUpdateIssue={handleUpdateIssue}
            canCurrentUserDismissIssues={false}
            handleRiskRefresh={handleRiskRefresh}
          />,
          { initialState }
        );
        const issue = riskIssues[0];
        // assert
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('app.insured');
        expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
      });

      it('renders re(Insured) sectionCheck', () => {
        // arrange
        const { container } = render(
          <RiskIssues
            riskIssues={riskIssues}
            reInsuredSanctionsCheckResult={insuredSanctionsCheckResult}
            handleUpdateIssue={handleUpdateIssue}
            canCurrentUserDismissIssues={false}
            handleRiskRefresh={handleRiskRefresh}
          />,
          { initialState }
        );
        const issue = riskIssues[0];
        // assert
        expect(container).toBeInTheDocument();
        expect(container).toHaveTextContent('app.reInsured');
        expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
      });

      it('renders with REFERRED_BLOCKED issue', () => {
        const quoteIssues = [
          {
            entityId: '6009ad9dd86c05117694dc8b',
            id: '6009ad9d9da95f1331b3ed23',
            issueStatus: 'WAITING',
            issueType: 'REFERRED_BLOCKED',
            messages: [
              {
                createdAt: '2021-01-21T16:36:45.911',
                message: 'The country (Iraq) has been flagged up as an item for referral',
                userName: 'Runner Service',
              },
            ],
            createdAt: '2021-01-21T16:36:45.911',
            riskId: '6009ad9b2a5c5a1833d7aacf',
          },
        ];
        // arrange
        const { container } = render(
          <RiskIssues
            quoteIssues={quoteIssues}
            insuredSanctionsCheckResult={insuredSanctionsCheckResult}
            handleUpdateIssue={handleUpdateIssue}
            canCurrentUserDismissIssues={false}
            handleRiskRefresh={handleRiskRefresh}
          />,
          { initialState }
        );
        const issue = quoteIssues[0];

        // assert
        expect(container).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
      });

      it('renders with REFERRED_BLOCKED issue, dismiss button is not displayed for BROKER', () => {
        const quoteIssues = [
          {
            entityId: '6009ad9dd86c05117694dc8b',
            id: '6009ad9d9da95f1331b3ed23',
            issueStatus: 'WAITING',
            issueType: 'REFERRED_BLOCKED',
            messages: [
              {
                createdAt: '2021-01-21T16:36:45.911',
                message: 'The country (Iraq) has been flagged up as an item for referral',
                userName: 'Runner Service',
              },
            ],
            createdAt: '2021-01-21T16:36:45.911',
            riskId: '6009ad9b2a5c5a1833d7aacf',
          },
        ];

        // arrange
        const { container } = render(
          <RiskIssues
            quoteIssues={quoteIssues}
            insuredSanctionsCheckResult={insuredSanctionsCheckResult}
            handleUpdateIssue={handleUpdateIssue}
            canCurrentUserDismissIssues={false}
            handleRiskRefresh={handleRiskRefresh}
          />,
          { initialState }
        );
        // debug document

        // assert
        expect(container).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument();
      });

      it('renders with REFERRED_BLOCKED issue, dismiss button displayed for UNDERWRITER', () => {
        const quoteIssues = [
          {
            entityId: '6009ad9dd86c05117694dc8b',
            id: '6009ad9d9da95f1331b3ed23',
            issueStatus: 'WAITING',
            issueType: 'REFERRED_BLOCKED',
            messages: [
              {
                createdAt: '2021-01-21T16:36:45.911',
                message: 'The country (Iraq) has been flagged up as an item for referral',
                userName: 'Runner Service',
              },
            ],
            createdAt: '2021-01-21T16:36:45.911',
            riskId: '6009ad9b2a5c5a1833d7aacf',
          },
        ];

        const initialUWState = {
          user: {
            role: 'UNDERWRITER',
          },
        };

        // arrange
        const { container } = render(
          <RiskIssues
            quoteIssues={quoteIssues}
            insuredSanctionsCheckResult={insuredSanctionsCheckResult}
            handleUpdateIssue={handleUpdateIssue}
            canCurrentUserDismissIssues={true}
            handleRiskRefresh={handleRiskRefresh}
          />,
          { initialState: initialUWState }
        );
        // debug document

        const issue = quoteIssues[0];

        // assert
        expect(container).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /dismiss/i })).toBeInTheDocument();
      });
    });
  });
});
