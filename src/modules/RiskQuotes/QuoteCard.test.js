import React from 'react';

// app
import QuoteCard from './QuoteCard';
import { render, screen } from 'tests';
import userEvent from '@testing-library/user-event';

const stateBroker = {
  user: {
    role: 'BROKER',
  },
};
const stateUW = {
  user: {
    role: 'UNDERWRITER',
  },
};

const handlePatchRiskQuote = jest.fn();
const handleDeclineRiskQuote = jest.fn();
const handleAcceptRiskQuote = jest.fn();
const handleBindRiskQuote = jest.fn();
const handleDownloadQuote = jest.fn();
const handleRiskRefresh = jest.fn();
const handleRequestToBind = jest.fn();
const handlePreBind = jest.fn();
const handleRequestDismissIssues = jest.fn();

const quote = {
  id: '6155a19796eaa74a9b5af429',
  clientId: '614312af4e840262963a7e8a',
  riskId: '614b4f00259700726f0745f3',
  riskUID: '614b4f00259700726f0745f3:18',
  riskType: 'WIND_HAIL_DBB',
  declarationNumber: 'EWH0092',
  carrierId: '61430f4f4e840262963a7e85',
  carrierName: 'Satinwood Carrier',
  facilityId: '61430fdb4449ad219b92119c',
  worksheetId: '6155a19696eaa74a9b5af428',
  facility: {
    id: '61430fdb4449ad219b92119c',
    name: 'Satinwood W&H',
    carrierId: '61430f4f4e840262963a7e85',
    productCode: 'WIND_HAIL_DBB',
    liveFrom: '2021-09-14T23:00:00',
    liveTo: '2022-09-14T23:00:00',
    quoteValidDays: 28,
    pricerCode: 'WIND_HAIL_DBB',
    clientId: null,
    preBind: true,
    commissionRates: { clientCommissionRate: 20.0, brokerCommissionRate: 5 },
    permissionToBindGroups: ['BROKER', 'UNDERWRITER', 'COVERHOLDER', 'ADMIN'],
    permissionToDismissIssuesGroups: ['UNDERWRITER', 'COVERHOLDER'],
    createdAt: '2021-09-16T09:35:23.717',
  },
  commission: {
    clientCommissionRatio: 20.0,
    clientCommissionRate: 20,
  },
  currency: 'USD ',
  premium: 3150.0,
  grossPremium: 3150.0,
  netPremium: 2283.75,
  quoteLocale: 'en_US',
  status: 'QUOTED',
  createdAt: '2021-09-30T11:37:58.844',
  validUntil: '2023-10-28T11:37:58.348',

  hasTemplate: true,
  canCurrentUserBind: true,
  requestedToBind: false,
  canCurrentUserDismissIssues: true,
  requestedToDismissIssues: false,
};

const initialProps = {
  quote,
  hasBoundQuote: false,
  riskStatus: 'QUOTED',
  parties: {},
  issuesData: {},
  handlePatchRiskQuote,
  handleDeclineRiskQuote,
  handleAcceptRiskQuote,
  handleBindRiskQuote,
  handleDownloadQuote,
  handleRiskRefresh,
  handleRequestToBind,
  handlePreBind,
  handleRequestDismissIssues,
};

describe('render QuoteCard when quote is QUOTED', () => {
  it('renders a QUOTED quote with canCurrentUserBind=true, preBind true', async () => {
    const quoteQuoted = {
      ...quote,
      hasTemplate: true,
      canCurrentUserBind: true,
      requestedToBind: false,
      canCurrentUserDismissIssues: true,
      requestedToDismissIssues: false,
    };

    render(<QuoteCard {...initialProps} quote={quoteQuoted} />, {
      initialState: { ...stateBroker },
    });

    expect(screen.getByText(/QBstatus.quoted/i)).toBeInTheDocument();
    expect(screen.queryByTestId('commission')).toBeInTheDocument();
    expect(screen.getByTestId('commission-title')).toBeInTheDocument();
    expect(screen.getByText(/products.commissionRatio/i)).toBeInTheDocument();
    expect(screen.getByText(/products.netdown/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /risks.download/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /risks.download/i }));
    expect(handleDownloadQuote).toHaveBeenCalled();

    userEvent.click(screen.getByRole('button', { name: /risks.bind/i }));
    expect(handlePreBind).toHaveBeenCalled();

    // userEvent.click(screen.getByRole('button', { name: /risks.decline/i }));
    // expect(handleDeclineRiskQuote).toHaveBeenCalled();
  });

  //
  it('renders a QUOTED quote without commission with facility default values', async () => {
    const { commission, ...rest } = quote;

    render(<QuoteCard {...initialProps} quote={rest} />, {
      initialState: { ...stateBroker },
    });

    expect(screen.getByText(/QBstatus.quoted/i)).toBeInTheDocument();
    expect(screen.queryByTestId('commission')).toBeInTheDocument();
    expect(screen.getByTestId('commission-title')).toBeInTheDocument();
    expect(screen.getByText(/products.commissionRatio/i)).toBeInTheDocument();
    expect(screen.getByText(/products.netdown/i)).toBeInTheDocument();
  });

  it('renders a QUOTED quote with canCurrentUserBind=true, preBind false', async () => {
    const quoteQuoted = {
      ...quote,
      hasTemplate: true,
      canCurrentUserBind: true,
      requestedToBind: false,
      canCurrentUserDismissIssues: true,
      requestedToDismissIssues: false,
      facility: {
        preBind: false,
      },
    };

    render(<QuoteCard {...initialProps} quote={quoteQuoted} />, {
      initialState: { ...stateBroker },
    });

    userEvent.click(screen.getByRole('button', { name: /risks.bind/i }));
    expect(handleBindRiskQuote).toHaveBeenCalled();
  });

  it('renders a QUOTED quote with "Request to Bind" button ', async () => {
    const quoteQuoted = {
      ...quote,
      hasTemplate: true,
      canCurrentUserBind: false,
      requestedToBind: false,
      canCurrentUserDismissIssues: true,
      requestedToDismissIssues: false,
    };

    render(<QuoteCard {...initialProps} quote={quoteQuoted} />, {
      initialState: { ...stateBroker },
    });

    userEvent.click(screen.getByRole('button', { name: /risks.requestToBind/i }));
    expect(handleRequestToBind).toHaveBeenCalled();
  });

  it('renders a QUOTED quote without "Bind" button ', async () => {
    const quoteQuoted = {
      ...quote,
      hasTemplate: true,
      canCurrentUserBind: false,
      requestedToBind: true,
      canCurrentUserDismissIssues: true,
      requestedToDismissIssues: false,
    };

    render(<QuoteCard {...initialProps} quote={quoteQuoted} />, {
      initialState: { ...stateBroker },
    });

    expect(screen.queryByRole('button', { name: /risks.bind/i })).not.toBeInTheDocument();
  });

  it('renders a QUOTED quote for UW', async () => {
    const quoteQuoted = {
      ...quote,
      hasTemplate: true,
      canCurrentUserBind: true,
      requestedToBind: false,
      canCurrentUserDismissIssues: true,
      requestedToDismissIssues: false,
    };

    render(<QuoteCard {...initialProps} quote={quoteQuoted} />, {
      initialState: { ...stateUW },
    });

    expect(screen.queryByTestId('commission')).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: /risks.download/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /risks.download/i }));
    expect(handleDownloadQuote).toHaveBeenCalled();

    userEvent.click(screen.getByRole('button', { name: /risks.bind/i }));
    expect(handleBindRiskQuote).toHaveBeenCalled();

    // userEvent.click(screen.getByRole('button', { name: /risks.decline/i }));
    // expect(handleDeclineRiskQuote).toHaveBeenCalled();
  });
});

describe('render QuoteCard when quote is BLOCKED', () => {
  it('renders a BLOCKED quote', async () => {
    const quoteResponse = {
      ...quote,
      status: 'BLOCKED',
      canCurrentUserDismissIssues: false,
      requestedToDismissIssues: false,
      issues: [
        {
          id: '614dd644ca0532073275638d',
          riskId: '614326814449ad219b9211a4',
          riskUID: '614326814449ad219b9211a4:5',
          linkedObjectId: '614dd644ca0532073275638c',
          issueStatus: 'WAITING',
          issueType: 'REFERRED_BLOCKED',
          entityId: null,
          messages: [
            {
              createdAt: '2021-09-24T13:44:36.442',
              userName: 'Runner Service',
              message: 'The excess amount (USD 2) has been flagged up as an item for referral',
            },
          ],
        },
        {
          id: '614dd644ca0532073275638e',
          riskId: '614326814449ad219b9211a4',
          riskUID: '614326814449ad219b9211a4:5',
          linkedObjectId: '614dd644ca0532073275638c',
          issueStatus: 'WAITING',
          issueType: 'REFERRED_BLOCKED',
          entityId: null,
          messages: [
            {
              createdAt: '2021-09-24T13:44:36.482',
              userName: 'Runner Service',
              message:
                'The excess amount (USD 2) of occurrence (Occurrence #1 - Santa Clara County, California) has been flagged up as an item for referral',
            },
          ],
        },
      ],
    };

    const issuesData = { issues: [], quoteIssues: quoteResponse?.issues, hasIssues: true };

    render(<QuoteCard {...initialProps} quote={quoteResponse} issuesData={issuesData} />);

    expect(screen.getByRole('heading', { name: /Satinwood Carrier/i })).toBeInTheDocument();
    expect(screen.getByText(/QBstatus.blocked/i)).toBeInTheDocument();
    expect(screen.getByText(/risks.grossPremium/i)).toBeInTheDocument();
    expect(screen.getByText(/3150/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.downloadPolicy/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.refer/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.issues/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.bind/i })).not.toBeInTheDocument();
  });
});

// Referred
describe('render QuoteCard when quote is REFERRED', () => {
  it('renders a REFERRED quote for BROKER', async () => {
    const quoteResponse = {
      ...quote,
      status: 'REFERRED',
      requestedToDismissIssues: false,
      canCurrentUserBind: true,
      canCurrentUserDismissIssues: true,
    };
    render(<QuoteCard {...initialProps} quote={quoteResponse} />, {
      initialState: { ...stateBroker },
    });

    expect(screen.getByRole('heading', { name: /Satinwood Carrier/i })).toBeInTheDocument();
    expect(screen.getByText(/QBstatus.referred/i)).toBeInTheDocument();
    expect(screen.getByText(/risks.referral/i)).toBeInTheDocument();
    expect(screen.queryByText(/risks.grossPremium/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/3150/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.downloadPolicy/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.refer/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.bind/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.decline/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.update/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.accept/i })).toBeInTheDocument();
  });
});
