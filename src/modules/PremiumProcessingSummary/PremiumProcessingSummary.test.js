import React from 'react';
import { render, screen } from 'tests';
import PremiumProcessingSummary from './PremiumProcessingSummary';

const renderProcessingSummary = (props, renderOptions) => {
  const componentProps = {
    users: [],
    ...props,
  };

  render(<PremiumProcessingSummary {...componentProps} />, renderOptions);

  return {
    componentProps,
  };
};

describe('MODULES › PremiumProcessingSummary', () => {
  it('renders without crashing', () => {
    expect(renderProcessingSummary({})).toMatchInlineSnapshot(`
      Object {
        "componentProps": Object {
          "users": Array [],
        },
      }
    `);
  });

  it('renders case details with chevron if we choose only one case', () => {
    // arrange
    renderProcessingSummary({});

    // assert
    //expect(screen.getByText('10 days left to close case')).toBeInTheDocument();
    //expect(screen.getByText('RFI History')).toBeInTheDocument();
    //expect(screen.getByText('Case Details')).toBeInTheDocument();
    //expect(screen.getByText('Issue documents')).toBeInTheDocument();
    //expect(screen.getByRole('button', { name: 'premiumProcessing.caseSummary.reject' })).toBeInTheDocument();
    //expect(screen.getByRole('button', { name: 'premiumProcessing.caseSummary.submit' })).toBeInTheDocument();
  });

  it('renders assign to if role is operation manager', () => {
    // arrange
    const users = [
      {
        userId: 1,
        userName: 'John Walker',
        userRole: 'PP Technician',
        emailId: 'anitha.m@mphasis.com',
      },
      {
        userId: 2,
        userName: 'James Tylor',
        userRole: 'Front End Contact',
        emailId: 'anitha.m@mphasis.com',
      },
    ];

    renderProcessingSummary({ users });
  });
});
