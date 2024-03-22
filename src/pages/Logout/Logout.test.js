import React from 'react';
import { render, renderWithAuth, waitFor } from 'tests';
import Logout from './Logout';

describe('PAGES › Logout', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      render(<Logout />, {
        initialState: {
          user: {
            auth: {
              accessToken: null,
            },
          },
        },
      });

      // assert
      await waitFor(() => expect(document.title).toContain('app.logout'));
    });

    it('redirects to /home if user is authenticated in redux state', () => {
      // arrange
      const { container } = renderWithAuth(<Logout />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('redirects to /home if there is a token saved in localStorage', () => {
      // arrange
      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 1 }));
      const { container } = render(<Logout />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the logout loader if not authenticated', () => {
      // arrange
      const { getByText } = render(<Logout />, {
        initialState: {
          user: {
            auth: {
              accessToken: null,
            },
          },
        },
      });

      // assert
      expect(getByText('app.loggingOut')).toBeInTheDocument();
    });
  });
});
