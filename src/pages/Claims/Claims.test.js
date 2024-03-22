import React from 'react';
import { render, screen } from 'tests';
import fetchMock from 'fetch-mock';
import Claims from './Claims';

const renderClaims = () => {
  return render(<Claims />);
};

describe('PAGES › Claims', () => {
  const userWithFullAccess = {
    id: 1,
    privilege: {
      claimsFNOL: {
        complexityRulesManagement: ['read', 'create', 'update', 'delete'],
      },
    },
  };

  const userWithNoAccess = {
    id: 1,
    privilege: {
      claimsFNOL: {
        complexityRulesManagement: [],
      },
    },
  };

  afterEach(() => {
    fetchMock.restore();
  });

  it('renders without crashing', () => {
    // arrange
    renderClaims();

    // assert
    expect(screen.getByText('claims.loss.title')).toBeInTheDocument();
  });

  it('renders header buttons with full access', () => {
    // arrange
    renderClaims();

    // assert
    expect(screen.getByRole('button', { name: 'claims.actions.registerNewLoss' })).toBeInTheDocument();
  });

  it('renders header buttons with no access', () => {
    // arrange
    renderClaims();

    // assert
    expect(screen.getByRole('button', { name: 'claims.actions.registerNewLoss' })).toBeInTheDocument();
  });
});
