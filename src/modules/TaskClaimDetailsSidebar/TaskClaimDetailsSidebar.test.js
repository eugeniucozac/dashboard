import React from 'react';
import { render } from 'tests';

import TaskClaimDetailsSidebar from './TaskClaimDetailsSidebar';

describe('MODULES › TaskClaimDetailsSidebar', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<TaskClaimDetailsSidebar />);
    });
  });
});
