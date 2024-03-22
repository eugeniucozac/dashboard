import React from 'react';
import { render } from 'tests';
import AuthenticationWithContext, { Authentication } from './Authentication';
import { mockContext, mockHistory } from 'setupMocks';

describe('PAGES › Authentication', () => {
  const handleCallback = jest.fn();
  const props = {
    context: { ...mockContext, handleCallback: handleCallback },
    ...mockHistory,
  };

  describe('@render', () => {
    it('renders without crashing', () => {
      // arrange
      render(<AuthenticationWithContext {...props} />);
    });

    it('renders with location.hash', () => {
      // arrange
      render(<Authentication {...props} />, { route: ['/authentication#hash'] });

      expect(handleCallback).toBeCalledTimes(1);
      expect(handleCallback.mock.calls[0][0]).toBe('#hash');
    });
  });
});
