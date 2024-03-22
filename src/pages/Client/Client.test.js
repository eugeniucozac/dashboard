import React from 'react';
import { render, screen, waitFor } from 'tests';
import Client from './Client';
import { mockClasses, mockHistory, mockUser, mockParent } from 'setupMocks';

describe('PAGES › Client', () => {
  const props = {
    classes: mockClasses,
    history: mockHistory,
    user: mockUser,
    parentSelected: mockParent.selected,
    match: { params: { id: 1 } },
    deselectPlacement: () => {},
    getParent: () => new Promise((resolve, reject) => []),
    getParentPlacements: () => [],
    resetPlacementLocations: () => {},
    addLoader: () => {},
    removeLoader: () => {},
  };

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Client {...props} />);

      // assert
      await waitFor(() => expect(document.title).toContain('client.title'));
      expect(screen.getByTestId('client')).toBeInTheDocument();
      expect(screen.getByText('client.title')).toBeInTheDocument();
    });
  });
});
