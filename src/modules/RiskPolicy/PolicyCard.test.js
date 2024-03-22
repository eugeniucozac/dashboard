import React from 'react';

// app
import PolicyCard from './PolicyCard';
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

const handleDownloadQuote = jest.fn();

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
    brokerCode: 'B0507',
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
    commissionRates: { clientCommissionRate: 20.0, brokerCommissionRate: 7.5 },
    permissionToBindGroups: ['BROKER', 'UNDERWRITER', 'COVERHOLDER', 'ADMIN'],
    permissionToDismissIssuesGroups: ['UNDERWRITER', 'COVERHOLDER'],
    createdAt: '2021-09-16T09:35:23.717',
  },
  currency: 'USD ',
  premium: 3150.0,
  grossPremium: 3150.0,
  netPremium: 2283.75,
  clientCommissionRate: 20.0,
  brokerCommissionRate: 7.5,
  quoteLocale: 'en_US',
  status: 'QUOTED',
  createdAt: '2021-09-30T11:37:58.844',
  validUntil: '2021-10-28T11:37:58.348',
  hasTemplate: true,
  canCurrentUserBind: true,
  requestedToBind: false,
  canCurrentUserDismissIssues: true,
  requestedToDismissIssues: false,
};

const initialProps = {
  quote,
  riskStatus: 'BOUND',
  parties: {},
  issuesData: {},
  handleDownloadQuote,
};

describe('render PolicyCard when quote(policy) is BOUND', () => {
  it('renders a BOUND quote', async () => {
    const quoteResponse = {
      ...quote,
      response: {
        userId: '60acd261df4065121b2f12a9',
        responseStatus: 'BOUND',
        effectiveFrom: '2021-09-30T13:39:00',
        effectiveTo: '2022-09-30T13:39:00',
      },
    };
    render(<PolicyCard {...initialProps} policy={quoteResponse} />);

    expect(screen.getByRole('heading', { name: /B0507EWH0092/i })).toBeInTheDocument();
    expect(screen.getByText(/Satinwood Carrier/i)).toBeInTheDocument();
    expect(screen.getByText(/app.premium/i)).toBeInTheDocument();
    expect(screen.getByText(/3150/i)).toBeInTheDocument();
    expect(screen.getByText(/risks.effectiveFrom/i)).toBeInTheDocument();
    expect(screen.getByText(/risks.effectiveTo/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /risks.downloadPolicy/i })).toBeInTheDocument();
    userEvent.click(screen.getByRole('button', { name: /risks.downloadPolicy/i }));
    expect(handleDownloadQuote).toHaveBeenCalled();
  });

  it('renders a BOUND quote without template', async () => {
    const quoteNoTemplate = {
      ...quote,
      hasTemplate: false,
      response: {
        userId: '60acd261df4065121b2f12a9',
        responseStatus: 'BOUND',
        effectiveFrom: '2021-09-30T13:39:00',
        effectiveTo: '2022-09-30T13:39:00',
      },
    };

    render(<PolicyCard {...initialProps} policy={quoteNoTemplate} />);

    expect(screen.getByRole('heading', { name: /B0507EWH0092/i })).toBeInTheDocument();
    expect(screen.getByText(/Satinwood Carrier/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /risks.downloadPolicy/i })).not.toBeInTheDocument();
  });
});
