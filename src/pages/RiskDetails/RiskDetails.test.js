import React from 'react';
import { render, renderWithAuth } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import RiskDetails from './RiskDetails';

const stateUserAdmin = {
  user: {
    isAdmin: true,
    departmentIds: [1, 2, 3],
    auth: {
      accessToken: 'abc123',
    },
  },
};

describe('PAGES › RiskDetails', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      renderWithAuth(<RiskDetails />, {
        initialState: stateUserAdmin,
        route: ['/quote-bind/risk/id-123'],
      });
    });
  });
});
