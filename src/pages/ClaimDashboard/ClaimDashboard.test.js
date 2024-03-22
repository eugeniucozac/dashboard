import React from 'react';
import { render, screen } from 'tests';
import ClaimDashboard from './ClaimDashboard';

const initialState = {
  claims: {
    claimsTab: {
      tableDetails: {
        selected: [
          {
            claimID: 1004,
            createdBy: 863,
            createdDate: '2021-08-25T09:18:33.017Z',
            updatedBy: 863,
            lossFromDate: '2021-08-01T09:37:00Z',
            lossToDate: '2021-08-11T09:37:00Z',
            catCode: null,
            interest: null,
            lossDateQualifier: null,
            lossDetails: 'Test Loss check',
            lossRef: 1007,
            priority: 'Medium',
            claimReference: 'DAA06984A01',
            assured: 'Sherman Old CIty Hall, LLC',
            coverholder: null,
            reinsured: null,
            client: null,
            company: null,
            division: 'Equinox',
            policyId: 2993,
            sourceId: 1,
            assignedTo: null,
            pasClaimRef: null,
            pasStatus: null,
            closedDate: null,
            policyRef: 'P000011',
            stage: 'Preparation',
            status: 'In-Progress',
            targetDueDate: '2021-08-26T01:05:14',
            team: 'Mphasis',
            ucr: null,
            xbpolicyId: 2993,
          },
        ],
      },
    },
    policyData: {
      xbPolicyID: 'P000011',
      xbInstanceID: 1,
    },
  },
};

describe('PAGES › ClaimDashboard', () => {
  it('renders the Breadcrumb', () => {
    // arrange
    render(<ClaimDashboard />, { initialState });

    // assert
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb').querySelector('li:nth-child(1)')).toHaveTextContent('claims.loss.title');
    expect(screen.getByTestId('breadcrumb').querySelector('li:nth-child(2)')).toHaveTextContent('claims.loss.text');
    expect(screen.getByTestId('breadcrumb').querySelector('li:nth-child(3)')).toHaveTextContent('claims.claimRef.text');
  });

  it('renders the Popover Button', () => {
    // arrange
    render(<ClaimDashboard />, { initialState });

    // assert
    expect(screen.getByTestId('claims-functions-popover-ellipsis')).toBeInTheDocument();
  });

  it('renders the Tabs', () => {
    // arrange
    render(<ClaimDashboard />, { initialState });

    // assert
    expect(screen.getByTestId('tabs-mui')).toBeInTheDocument();
    expect(screen.getAllByTestId('tabs-mui-item')[0]).toHaveTextContent('claims.claimRef.detail');
    expect(screen.getAllByTestId('tabs-mui-item')[1]).toHaveTextContent('claims.claimRef.actions');
    expect(screen.getAllByTestId('tabs-mui-item')[2]).toHaveTextContent('claims.claimRef.docs');
    expect(screen.getAllByTestId('tabs-mui-item')[3]).toHaveTextContent('claims.claimRef.notes');
    expect(screen.getAllByTestId('tabs-mui-item')[4]).toHaveTextContent('claims.claimRef.auditTrail');
  });
});
