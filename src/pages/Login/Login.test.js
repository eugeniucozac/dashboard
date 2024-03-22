import React from 'react';
import { render, renderWithAuth, waitFor } from 'tests';
import Login from './Login';

describe('PAGES › Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('@render', () => {
    it('renders the page title', async () => {
      // arrange
      renderWithAuth(<Login />, {
        initialState: {
          user: {
            auth: {
              accessToken: null,
            },
          },
        },
      });

      // assert
      await waitFor(() => expect(document.title).toContain('app.login'));
    });

    it('redirects to /home if user is authenticated in redux state', () => {
      // arrange
      const { container } = renderWithAuth(<Login />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('redirects to /home if there is a token saved in localStorage', () => {
      // arrange
      localStorage.setItem('edge-auth', JSON.stringify({ accessToken: 1 }));
      const { container } = render(<Login />);

      // assert
      expect(container).toBeEmptyDOMElement();
    });

    it('renders the logout form if not authenticated', () => {
      // arrange
      const { getByText, queryByText } = render(<Login />, {
        initialState: {
          user: {
            auth: {
              accessToken: null,
            },
          },
        },
      });

      // assert
      expect(getByText('app.signInToApp')).toBeInTheDocument();
      expect(getByText('app.signIn')).toBeInTheDocument();
      expect(queryByText('app.redirectAnalytics')).not.toBeInTheDocument();
    });

    it('renders the logout form if not authenticated, display Analytics link for Price Forbes', () => {
      // arrange
      const { getByText } = render(<Login />, {
        initialState: {
          user: {
            auth: {
              accessToken: null,
            },
          },
          ui: {
            brand: 'priceforbes',
          },
        },
      });

      // assert
      expect(getByText('app.signInToApp')).toBeInTheDocument();
      expect(getByText('app.signIn')).toBeInTheDocument();
      expect(getByText('app.redirectAnalytics')).toBeInTheDocument();
    });
  });
});
