import React from 'react';
import { render } from 'tests';
import OpportunityLeads from './OpportunityLeads';

describe('MODULES › OpportunityLeads', () => {
  const defaultProps = {
    leads: [],
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<OpportunityLeads {...defaultProps} />);
    });
  });
});
