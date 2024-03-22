import React from 'react';

// app
import { render, waitFor } from 'tests';
import RoleAssignment from './RoleAssignment';

describe('PAGES › RoleAssignment', () => {
  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<RoleAssignment />);

      // assert
      await waitFor(() => expect(document.title).toContain('roleAssignment.title'));
    });
  });
});
