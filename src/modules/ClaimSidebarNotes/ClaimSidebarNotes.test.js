import React from 'react';
import { render, screen } from 'tests';

import ClaimSidebarNotes from './ClaimSidebarNotes';

const renderClaimSidebarNotes = () => {
  return render(<ClaimSidebarNotes />);
};

describe('MODULES › ClaimSidebarNotes', () => {
  describe('@render', () => {
    it('renders without crashing', () => {
      //arrange
      renderClaimSidebarNotes();

      //assert
      expect(screen.getByTestId('claim-sidebar-notes')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'app.save' })).not.toBeEnabled();
    });
  });
});
