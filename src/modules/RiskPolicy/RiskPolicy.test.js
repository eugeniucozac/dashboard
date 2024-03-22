import React from 'react';
import { render } from 'tests';
import '@testing-library/jest-dom/extend-expect';

// app
import RiskPolicy from './RiskPolicy';

const stateUserAdmin = {
  user: {
    isAdmin: true,
    departmentIds: [1, 2, 3],
    auth: {
      accessToken: 'abc123',
    },
  },
};

describe('MODULES › RiskQuotes', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      render(<RiskPolicy />, {
        initialState: stateUserAdmin,
      });
    });
  });
});
