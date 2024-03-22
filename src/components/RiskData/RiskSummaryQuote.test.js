import { render, screen, waitFor } from 'tests';
import fetchMock from 'fetch-mock';
import RiskSummaryQuote from './RiskSummaryQuote';

const props = {
  allStepsCompleted: true,
  isFormValid: true,
  classes: {},
  productType: 'WIND_AND_HAIL',
  riskValues: {
    coverType: 'REINSURANCE',
  },
  definitions: [
    {
      coverType: {
        group: 'GENERAL',
        header: 'General',
        indicative: false,
        label: 'Direct or Reinsurance',
        name: 'coverType',
        options: [{ label: 'Reinsurance', value: 'REINSURANCE' }],
        type: 'select',
      },
    },
  ],
};

describe('MODULES › RiskData › RiskSummaryQuote', () => {
  afterEach(() => {
    fetchMock.restore();
  });

  it('should render the RiskSummaryQuote loading state', () => {
    render(<RiskSummaryQuote {...props} />);
    expect(screen.queryByTestId('loading')).toBeInTheDocument();
  });

  it('should render the RiskSummaryQuote component, rendering with riskDataProps', async () => {
    fetchMock.post('glob:*/api/v1/risks/summary-quote', {
      body: [
        {
          currency: 'USD ',
          premium: 1980,
          carrierName: 'Satinwood',
          hasReferrals: false,
          quoted: true,
          summaryValues: {
            tiv: 1200000.0,
            notices: 'Colorado Surplus Lines Notice LMA 9031',
            maxPayable: 48000,
          },
        },
      ],
    });

    render(<RiskSummaryQuote {...props} />);
    expect(screen.queryByTestId('loading')).toBeInTheDocument();
  });
});
